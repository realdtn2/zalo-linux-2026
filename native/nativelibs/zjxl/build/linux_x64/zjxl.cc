// Linux (x86_64) port of the Zalo macOS `jxl.node` N-API addon.
//
// Contract (exact, from native/nativelibs/zjxl/index.js):
//   jxlToJpeg({buffer, quality, outputWidth, outputHeight}, cb(err, data, status_code))
//   bitmapToJxl({buffer, width, height},                cb(err, data, status_code))
//   getJxlInfo({buffer},                               cb(err, obj,   status_code))
//   resizeJxl({buffer, width, height},                 cb(err, data,  status_code))
//   resizeJxlLimit({buffer, width, height, limit},     cb(err, data,  status_code))
//   jxlDecompressMulti(options,                        cb(err, data,  status_code))
//   moduleReady() -> bool
//
// SUCCESS_STATUS (1) is what the app-side wrapper compares against.
// Failure paths return the same DEC_/ENC_ enum codes the wrapper maps to errors.
//
// Libraries (libjxl, libjpeg-turbo, brotli, highway, lcms2) are vendored next
// to the produced .node; linked with rpath=$ORIGIN for AppImage portability.
#include <napi.h>

#include <jxl/decode.h>
#include <jxl/encode.h>
#include <jxl/color_encoding.h>
#include <jxl/thread_parallel_runner.h>
#include <jxl/thread_parallel_runner_cxx.h>
#include <jxl/decode_cxx.h>
#include <jxl/encode_cxx.h>
#include <jpeglib.h>

#include <csetjmp>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

std::vector<uint8_t> ReadFileBytes(const std::string& path);

namespace {

constexpr uint32_t FAILURE_STATUS = 0;
constexpr uint32_t SUCCESS_STATUS = 1;
constexpr uint32_t ENC_JXL_SET_PARALELL_RUNNER_ERROR = 1002;
constexpr uint32_t ENC_JXL_ADD_IMAGE_FRAME_ERROR = 1005;
constexpr uint32_t ENC_JXL_PROCESS_OUTPUT_ERROR = 1006;
constexpr uint32_t DEC_JXL_DECODER_SUBSCRIBE_EVENTS_ERROR = 2002;
constexpr uint32_t DEC_JXL_PROCESS_ERROR = 2003;
constexpr uint32_t DEC_JXL_BASIC_INFO_ERROR = 2005;
constexpr uint32_t DEC_JXL_SET_IMAGE_OUT_BUFFER_ERROR = 2011;
constexpr uint32_t DEC_JXL_DECODER_SET_PARALLEL_RUNNER_ERROR = 2013;
constexpr uint32_t ENC_JPEG_FAILURE = 3001;
constexpr uint32_t RESIZE_JXL_SUCCESS = 4001;
constexpr uint32_t RESIZE_JXL_INVALID_INPUT = 4002;
constexpr uint32_t RESIZE_JXL_INVALID_TARGET_SIZE = 4003;
constexpr uint32_t EXTRACT_BASIC_INFO_SUCCESS = 5001;

struct RunnerHolder {
  JxlThreadParallelRunnerPtr ptr;
  RunnerHolder() : ptr(JxlThreadParallelRunnerMake(nullptr, 4)) {}
  void* state() const { return ptr.get(); }
  explicit operator bool() const { return static_cast<bool>(ptr); }
};

// Separable box downscale for RGBA8 (tightly packed in/out).
void BoxResizeRgba(const uint8_t* src, uint32_t sw, uint32_t sh, uint32_t sstride,
                   uint8_t* dst, uint32_t dw, uint32_t dh) {
  std::vector<float> tmp(static_cast<size_t>(dw) * sh * 4);
  for (uint32_t y = 0; y < sh; ++y) {
    const uint8_t* srow = src + static_cast<size_t>(y) * sstride;
    for (uint32_t x = 0; x < dw; ++x) {
      uint32_t x0 = static_cast<uint32_t>((static_cast<uint64_t>(x) * sw) / dw);
      uint32_t x1 = static_cast<uint32_t>((static_cast<uint64_t>(x + 1) * sw) / dw);
      if (x1 <= x0) x1 = x0 + 1;
      if (x1 > sw) x1 = sw;
      uint32_t n = x1 - x0;
      uint32_t acc[4] = {0, 0, 0, 0};
      for (uint32_t xx = x0; xx < x1; ++xx) {
        const uint8_t* p = srow + static_cast<size_t>(xx) * 4;
        acc[0] += p[0]; acc[1] += p[1]; acc[2] += p[2]; acc[3] += p[3];
      }
      float* d = tmp.data() + (static_cast<size_t>(y) * dw + x) * 4;
      for (int c = 0; c < 4; ++c) d[c] = static_cast<float>(acc[c]) / n;
    }
  }
  for (uint32_t y = 0; y < dh; ++y) {
    uint32_t y0 = static_cast<uint32_t>((static_cast<uint64_t>(y) * sh) / dh);
    uint32_t y1 = static_cast<uint32_t>((static_cast<uint64_t>(y + 1) * sh) / dh);
    if (y1 <= y0) y1 = y0 + 1;
    if (y1 > sh) y1 = sh;
    uint32_t n = y1 - y0;
    uint8_t* drow = dst + static_cast<size_t>(y) * dw * 4;
    for (uint32_t x = 0; x < dw; ++x) {
      float acc[4] = {0, 0, 0, 0};
      for (uint32_t yy = y0; yy < y1; ++yy) {
        const float* p = tmp.data() + (static_cast<size_t>(yy) * dw + x) * 4;
        acc[0] += p[0]; acc[1] += p[1]; acc[2] += p[2]; acc[3] += p[3];
      }
      for (int c = 0; c < 4; ++c) {
        int v = static_cast<int>(std::lround(acc[c] / n));
        drow[x * 4 + c] = static_cast<uint8_t>(v < 0 ? 0 : (v > 255 ? 255 : v));
      }
    }
  }
}

// Decode to RGBA8. If want_w/want_h > 0, aspect-fit downscale inside the box.
uint32_t DecodeToRgba(const uint8_t* data, size_t size, int want_w, int want_h,
                      std::vector<uint8_t>& rgba, uint32_t& w, uint32_t& h,
                      uint32_t& stride) {
  JxlDecoderPtr dec = JxlDecoderMake(nullptr);
  if (!dec) return DEC_JXL_PROCESS_ERROR;
  RunnerHolder runner;
  if (!runner) return DEC_JXL_DECODER_SET_PARALLEL_RUNNER_ERROR;
  if (JxlDecoderSetParallelRunner(dec.get(), JxlThreadParallelRunner, runner.state()) !=
      JXL_DEC_SUCCESS)
    return DEC_JXL_DECODER_SET_PARALLEL_RUNNER_ERROR;

  JxlDecoderStatus st = JxlDecoderSubscribeEvents(
      dec.get(), JXL_DEC_BASIC_INFO | JXL_DEC_FULL_IMAGE);
  if (st != JXL_DEC_SUCCESS) return DEC_JXL_DECODER_SUBSCRIBE_EVENTS_ERROR;
  if (JxlDecoderSetInput(dec.get(), data, size) != JXL_DEC_SUCCESS)
    return DEC_JXL_BASIC_INFO_ERROR;
  JxlDecoderCloseInput(dec.get());

  const JxlPixelFormat fmt{4, JXL_TYPE_UINT8, JXL_NATIVE_ENDIAN, 0};
  JxlBasicInfo info;
  bool have_basic = false;
  w = h = 0;
  stride = 0;
  rgba.clear();

  for (;;) {
    st = JxlDecoderProcessInput(dec.get());
    if (st == JXL_DEC_ERROR) return DEC_JXL_PROCESS_ERROR;
    if (st == JXL_DEC_BASIC_INFO) {
      if (JxlDecoderGetBasicInfo(dec.get(), &info) != JXL_DEC_SUCCESS)
        return DEC_JXL_BASIC_INFO_ERROR;
      have_basic = true;
      w = info.xsize;
      h = info.ysize;
      continue;
    }
    if (st == JXL_DEC_NEED_IMAGE_OUT_BUFFER) {
      stride = w * 4;  // libjxl 0.11: tightly packed rows
      rgba.resize(static_cast<size_t>(stride) * h);
      if (JxlDecoderSetImageOutBuffer(dec.get(), &fmt, rgba.data(), rgba.size()) !=
          JXL_DEC_SUCCESS)
        return DEC_JXL_SET_IMAGE_OUT_BUFFER_ERROR;
      continue;
    }
    if (st == JXL_DEC_FULL_IMAGE || st == JXL_DEC_FRAME)
      continue;
    if (st == JXL_DEC_SUCCESS) break;
    return DEC_JXL_PROCESS_ERROR;
  }
  if (!have_basic || rgba.empty()) return DEC_JXL_BASIC_INFO_ERROR;

  if (want_w > 0 && want_h > 0 &&
      (static_cast<uint32_t>(want_w) < w || static_cast<uint32_t>(want_h) < h)) {
    double s = std::min(static_cast<double>(want_w) / w, static_cast<double>(want_h) / h);
    if (s > 0 && s < 1.0) {
      uint32_t nw = std::max<uint32_t>(1, static_cast<uint32_t>(std::lround(w * s)));
      uint32_t nh = std::max<uint32_t>(1, static_cast<uint32_t>(std::lround(h * s)));
      std::vector<uint8_t> out(static_cast<size_t>(nw) * nh * 4);
      BoxResizeRgba(rgba.data(), w, h, stride, out.data(), nw, nh);
      rgba.swap(out);
      w = nw;
      h = nh;
      stride = nw * 4;
    }
  }
  return SUCCESS_STATUS;
}

// Basic info only (width/height/animation).
uint32_t ExtractInfo(const uint8_t* data, size_t size, JxlBasicInfo& info) {
  JxlDecoderPtr dec = JxlDecoderMake(nullptr);
  if (!dec) return DEC_JXL_PROCESS_ERROR;
  if (JxlDecoderSubscribeEvents(dec.get(), JXL_DEC_BASIC_INFO) != JXL_DEC_SUCCESS)
    return DEC_JXL_DECODER_SUBSCRIBE_EVENTS_ERROR;
  if (JxlDecoderSetInput(dec.get(), data, size) != JXL_DEC_SUCCESS)
    return DEC_JXL_BASIC_INFO_ERROR;
  JxlDecoderCloseInput(dec.get());
  bool got = false;
  for (;;) {
    JxlDecoderStatus st = JxlDecoderProcessInput(dec.get());
    if (st == JXL_DEC_BASIC_INFO) {
      if (JxlDecoderGetBasicInfo(dec.get(), &info) != JXL_DEC_SUCCESS)
        return DEC_JXL_BASIC_INFO_ERROR;
      got = true;
      continue;
    }
    if (st == JXL_DEC_SUCCESS) break;
    if (st == JXL_DEC_ERROR) return DEC_JXL_PROCESS_ERROR;
  }
  return got ? SUCCESS_STATUS : DEC_JXL_BASIC_INFO_ERROR;
}

// ---- JPEG encode (libjpeg(-turbo), RGBA in, in-memory) -----------------------
struct JpegErr : jpeg_error_mgr { std::jmp_buf jb; };
void JpegErrorExit(j_common_ptr c) {
  JpegErr* e = static_cast<JpegErr*>(c->err);
  char buf[256] = {};
  (*c->err->format_message)(c, buf);
  (void)buf;
  longjmp(e->jb, 1);
}

struct MemDest : jpeg_destination_mgr {
  std::vector<uint8_t>* out = nullptr;
};

void MemInit(j_compress_ptr c) {
  MemDest* d = static_cast<MemDest*>(c->dest);
  d->out = new std::vector<uint8_t>();
  d->out->resize(32768);
  d->next_output_byte = d->out->data();
  d->free_in_buffer = d->out->size();
}
boolean MemEmpty(j_compress_ptr c) {
  MemDest* d = static_cast<MemDest*>(c->dest);
  size_t used = d->out->size() - d->free_in_buffer;
  d->out->resize(d->out->size() * 2);
  d->next_output_byte = d->out->data() + used;
  d->free_in_buffer = d->out->size() - used;
  return TRUE;
}
void MemTerm(j_compress_ptr c) {
  MemDest* d = static_cast<MemDest*>(c->dest);
  size_t used = d->out->size() - d->free_in_buffer;
  d->out->resize(used);
}

uint32_t EncodeJpeg(const uint8_t* rgba, uint32_t w, uint32_t h, uint32_t stride,
                    int quality, std::vector<uint8_t>& jpeg) {
  jpeg_compress_struct cinfo{};
  JpegErr jerr{};
  jerr.error_exit = JpegErrorExit;
  if (setjmp(jerr.jb)) {
    jpeg_destroy_compress(&cinfo);
    return ENC_JPEG_FAILURE;
  }
  cinfo.err = jpeg_std_error(&jerr);
  jpeg_create_compress(&cinfo);
  MemDest dest{};
  dest.init_destination = MemInit;
  dest.empty_output_buffer = MemEmpty;
  dest.term_destination = MemTerm;
  cinfo.dest = reinterpret_cast<jpeg_destination_mgr*>(&dest);

  cinfo.image_width = w;
  cinfo.image_height = h;
  cinfo.input_components = 4;
  cinfo.in_color_space = JCS_EXT_RGBA;  // libjpeg-turbo extension
  jpeg_set_defaults(&cinfo);
  if (quality < 1) quality = 1;
  if (quality > 100) quality = 100;
  jpeg_set_quality(&cinfo, quality, TRUE);
  jpeg_start_compress(&cinfo, TRUE);
  std::vector<uint8_t> packed(static_cast<size_t>(w) * 4);
  while (cinfo.next_scanline < cinfo.image_height) {
    if (stride != w * 4) {
      std::memcpy(packed.data(), rgba + static_cast<size_t>(cinfo.next_scanline) * stride,
                  packed.size());
    }
    JSAMPLE* row = (stride != w * 4) ? packed.data()
                                     : const_cast<JSAMPLE*>(rgba +
                                            static_cast<size_t>(cinfo.next_scanline) * stride);
    jpeg_write_scanlines(&cinfo, &row, 1);
  }
  jpeg_finish_compress(&cinfo);
  if (dest.out) jpeg.swap(*dest.out);
  jpeg_destroy_compress(&cinfo);
  return SUCCESS_STATUS;
}

// ---- JXL encode (lossy, butteraugli distance from quality) -------------------
uint32_t EncodeJxl(const uint8_t* rgba, uint32_t w, uint32_t h, int quality,
                   std::vector<uint8_t>& out) {
  JxlEncoderPtr enc = JxlEncoderMake(nullptr);
  if (!enc) return ENC_JXL_PROCESS_OUTPUT_ERROR;
  RunnerHolder runner;
  if (!runner) return ENC_JXL_SET_PARALELL_RUNNER_ERROR;
  if (JxlEncoderSetParallelRunner(enc.get(), JxlThreadParallelRunner, runner.state()) !=
      JXL_ENC_SUCCESS)
    return ENC_JXL_SET_PARALELL_RUNNER_ERROR;

  JxlBasicInfo info;
  JxlEncoderInitBasicInfo(&info);
  info.xsize = w;
  info.ysize = h;
  info.num_color_channels = 3;
  info.num_extra_channels = 1;
  info.alpha_bits = 8;
  info.alpha_premultiplied = FALSE;
  if (JxlEncoderSetBasicInfo(enc.get(), &info) != JXL_ENC_SUCCESS)
    return ENC_JXL_PROCESS_OUTPUT_ERROR;

  JxlColorEncoding col;
  JxlColorEncodingSetToSRGB(&col, /*is_gray=*/FALSE);
  if (JxlEncoderSetColorEncoding(enc.get(), &col) != JXL_ENC_SUCCESS)
    return ENC_JXL_PROCESS_OUTPUT_ERROR;

  JxlEncoderFrameSettings* fs = JxlEncoderFrameSettingsCreate(enc.get(), nullptr);
  if (!fs) return ENC_JXL_PROCESS_OUTPUT_ERROR;
  if (quality >= 100) {
    JxlEncoderSetFrameLossless(fs, TRUE);
  } else {
    double q = quality < 1 ? 80.0 : quality;
    double dist = 0.1 + ((100.0 - q) / 100.0) * 9.9;  // 100->0.1, 1->9.91
    JxlEncoderSetFrameDistance(fs, dist);
    JxlEncoderFrameSettingsSetOption(fs, JXL_ENC_FRAME_SETTING_EFFORT, 5);
  }

  const JxlPixelFormat fmt{4, JXL_TYPE_UINT8, JXL_NATIVE_ENDIAN, 0};
  std::vector<uint8_t> packed(static_cast<size_t>(w) * h * 4);
  for (uint32_t y = 0; y < h; ++y)
    std::memcpy(packed.data() + static_cast<size_t>(y) * w * 4,
                rgba + static_cast<size_t>(y) * (w * 4), static_cast<size_t>(w) * 4);
  if (JxlEncoderAddImageFrame(fs, &fmt, packed.data(), packed.size()) != JXL_ENC_SUCCESS)
    return ENC_JXL_ADD_IMAGE_FRAME_ERROR;
  JxlEncoderCloseInput(enc.get());

  out.clear();
  std::vector<uint8_t> buf(16384);
  for (;;) {
    uint8_t* next = buf.data();
    size_t avail = buf.size();
    JxlEncoderStatus st = JxlEncoderProcessOutput(enc.get(), &next, &avail);
    out.insert(out.end(), buf.data(), buf.data() + (buf.size() - avail));
    if (st == JXL_ENC_SUCCESS) break;
    if (st != JXL_ENC_NEED_MORE_OUTPUT) return ENC_JXL_PROCESS_OUTPUT_ERROR;
  }
  return SUCCESS_STATUS;
}

// ---- N-API glue ----------------------------------------------------------------
const uint8_t* ToBytes(Napi::Env env, Napi::Value v, std::vector<uint8_t>& keep, size_t& len) {
  len = 0;
  if (v.IsUndefined() || v.IsNull()) return nullptr;
  if (v.IsString()) {
    std::string path = v.As<Napi::String>();
    keep = ReadFileBytes(path);
    len = keep.size();
    return keep.data();
  }
  if (v.IsBuffer()) {
    Napi::Buffer<uint8_t> b = v.As<Napi::Buffer<uint8_t>>();
    len = b.Length();
    return b.Data();
  }
  if (v.IsTypedArray()) {
    Napi::TypedArray t = v.As<Napi::TypedArray>();
    Napi::ArrayBuffer ab = t.ArrayBuffer();
    len = t.ByteLength();
    return static_cast<const uint8_t*>(ab.Data()) + t.ByteOffset();
  }
  if (v.IsArrayBuffer()) {
    Napi::ArrayBuffer ab = v.As<Napi::ArrayBuffer>();
    len = ab.ByteLength();
    return static_cast<const uint8_t*>(ab.Data());
  }
  return nullptr;
}

std::vector<uint8_t> ReadFileBytes(const std::string& path) {
  std::vector<uint8_t> v;
  FILE* f = std::fopen(path.c_str(), "rb");
  if (!f) return v;
  std::fseek(f, 0, SEEK_END);
  long sz = std::ftell(f);
  std::fseek(f, 0, SEEK_SET);
  if (sz > 0) {
    v.resize(static_cast<size_t>(sz));
    if (std::fread(v.data(), 1, v.size(), f) != v.size()) v.clear();
  }
  std::fclose(f);
  return v;
}

int IntField(const Napi::Object& o, const char* k, int def) {
  if (!o.Has(k)) return def;
  Napi::Value v = o.Get(k);
  if (v.IsNumber()) {
    double d = v.As<Napi::Number>().DoubleValue();
    if (d > 0 && d < 2147483647.0) return static_cast<int>(d);
  }
  return def;
}

// quality arrives as 0..1 fraction from the JS wrapper (0.8 default).
int QualityField(const Napi::Object& o) {
  int qi = 80;
  if (o.Has("quality")) {
    Napi::Value v = o.Get("quality");
    if (v.IsNumber()) {
      double q = v.As<Napi::Number>().DoubleValue();
      qi = static_cast<int>(q <= 1.0 ? q * 100.0 : q);
    }
  }
  if (qi < 1) qi = 1;
  if (qi > 100) qi = 100;
  return qi;
}

struct ImgTask {
  std::vector<uint8_t> input;  // owned copy for worker thread
  int quality = 80;
  int ow = -1, oh = -1;
  uint32_t bw = 0, bh = 0;  // bitmapToJxl dims
  bool limit = false;        // resizeJxlLimit semantics
  uint32_t status = FAILURE_STATUS;
  std::vector<uint8_t> out;
  uint32_t iw = 0, ih = 0, isize = 0;  // getJxlInfo
  bool animated = false;
  std::string err;
};

// ---- async workers ---------------------------------------------------------------
class ImgWorker : public Napi::AsyncWorker {
 public:
  enum Mode { kToJpeg, kToJxl, kInfo, kResize };
  ImgWorker(Napi::Function cb, ImgTask* t, Mode m) : Napi::AsyncWorker(cb), t_(t), m_(m) {}

 protected:
  void Execute() override {
    switch (m_) {
      case kToJpeg: {
        std::vector<uint8_t> rgba;
        uint32_t w = 0, h = 0, stride = 0;
        uint32_t st = DecodeToRgba(t_->input.data(), t_->input.size(), t_->ow, t_->oh,
                                   rgba, w, h, stride);
        if (st != SUCCESS_STATUS) { t_->status = st; return; }
        st = EncodeJpeg(rgba.data(), w, h, stride, t_->quality, t_->out);
        t_->status = st;  // SUCCESS_STATUS or ENC_JPEG_FAILURE
        break;
      }
      case kToJxl: {
        // input is raw RGBA (packed) of t_->bw x t_->bh
        if (!t_->bw || !t_->bh ||
            t_->input.size() < static_cast<size_t>(t_->bw) * t_->bh * 4) {
          t_->status = RESIZE_JXL_INVALID_INPUT;
          return;
        }
        t_->status = EncodeJxl(t_->input.data(), t_->bw, t_->bh, t_->quality, t_->out);
        break;
      }
      case kInfo: {
        JxlBasicInfo info{};
        t_->status = ExtractInfo(t_->input.data(), t_->input.size(), info);
        if (t_->status == SUCCESS_STATUS) {
          t_->iw = info.xsize;
          t_->ih = info.ysize;
          t_->animated = info.have_animation != 0;
        }
        break;
      }
      case kResize: {
        std::vector<uint8_t> rgba;
        uint32_t w = 0, h = 0, stride = 0;
        uint32_t st = DecodeToRgba(t_->input.data(), t_->input.size(), 0, 0, rgba, w, h, stride);
        if (st != SUCCESS_STATUS) { t_->status = st; return; }
        if (t_->ow <= 0 || t_->oh <= 0) { t_->status = RESIZE_JXL_INVALID_TARGET_SIZE; return; }
        uint32_t nw = static_cast<uint32_t>(t_->ow), nh = static_cast<uint32_t>(t_->oh);
        if (t_->limit) {
          // "limit": max dimension — shrink longest side to limit, keep aspect.
          uint32_t lim = std::max(nw, nh);
          if (w > lim || h > lim) {
            double s = static_cast<double>(lim) / std::max(w, h);
            nw = std::max<uint32_t>(1, static_cast<uint32_t>(std::lround(w * s)));
            nh = std::max<uint32_t>(1, static_cast<uint32_t>(std::lround(h * s)));
          } else {
            nw = w; nh = h;  // already within limit: pass through
          }
        }
        std::vector<uint8_t> out(static_cast<size_t>(nw) * nh * 4);
        BoxResizeRgba(rgba.data(), w, h, stride, out.data(), nw, nh);
        t_->status = EncodeJxl(out.data(), nw, nh, 92, t_->out);
        break;
      }
    }
  }

  void OnOK() override {
    Napi::Env env = Env();
    Napi::HandleScope scope(env);
    Napi::Function cb = Callback().Value();
    Napi::Value err = env.Null();
    Napi::Value data = env.Null();
    if (t_->status != SUCCESS_STATUS && t_->err.empty())
      t_->err = "libjxl operation failed (code " + std::to_string(t_->status) + ")";
    if (!t_->err.empty()) err = Napi::Error::New(env, t_->err).Value();
    if (m_ == kInfo) {
      Napi::Object o = Napi::Object::New(env);
      o.Set("width", Napi::Number::New(env, t_->iw));
      o.Set("height", Napi::Number::New(env, t_->ih));
      o.Set("animated", Napi::Boolean::New(env, t_->animated));
      o.Set("jxl_size", Napi::Number::New(env, static_cast<double>(t_->input.size())));
      data = o;
    } else if (t_->status == SUCCESS_STATUS) {
      data = Napi::Buffer<uint8_t>::Copy(env, t_->out.data(), t_->out.size());
    }
    cb.Call({err, data, Napi::Number::New(env, t_->status)});
    delete t_;
  }

  void OnError(const Napi::Error& e) override {
    Napi::Env env = Env();
    Napi::HandleScope scope(env);
    Callback().Call({e.Value(), env.Null(), Napi::Number::New(env, FAILURE_STATUS)});
    delete t_;
  }

 private:
  ImgTask* t_;
  Mode m_;
};

// ---- exported entry points --------------------------------------------------------
Napi::Value moduleReady(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), JxlDecoderVersion() != 0);
}

ImgTask* TaskFromOptions(const Napi::CallbackInfo& info, bool* ok) {
  Napi::Env env = info.Env();
  *ok = false;
  if (info.Length() < 2 || !info[0].IsObject() || !info[1].IsFunction()) {
    throw Napi::Error::New(env, "options object and callback required");
    return nullptr;
  }
  Napi::Object o = info[0].As<Napi::Object>();
  ImgTask* t = new ImgTask();
  std::vector<uint8_t> tmp;
  size_t len = 0;
  const uint8_t* p = nullptr;
  Napi::Value bv = o.Has("buffer") ? o.Get("buffer") : o.Get("localPath");
  if (!bv.IsUndefined() && !bv.IsNull()) {
    p = ToBytes(env, bv, tmp, len);
    if (p && len) t->input.assign(p, p + len);
  }
  if (t->input.empty()) {
    delete t;
    throw Napi::Error::New(env, "buffer is empty");
    return nullptr;
  }
  *ok = true;
  return t;
}

Napi::Value jxlToJpeg(const Napi::CallbackInfo& info) {
  bool ok = false;
  ImgTask* t = TaskFromOptions(info, &ok);
  if (!ok) return info.Env().Undefined();
  Napi::Object o = info[0].As<Napi::Object>();
  t->quality = QualityField(o);
  t->ow = IntField(o, "outputWidth", -1);
  t->oh = IntField(o, "outputHeight", -1);
  ImgWorker* w = new ImgWorker(info[1].As<Napi::Function>(), t, ImgWorker::kToJpeg);
  w->Queue();
  return info.Env().Undefined();
}

Napi::Value jxlDecompressMulti(const Napi::CallbackInfo& info) {
  // Single-task decode wrapper (the app-side queue batches per image).
  return jxlToJpeg(info);
}

Napi::Value bitmapToJxl(const Napi::CallbackInfo& info) {
  bool ok = false;
  ImgTask* t = TaskFromOptions(info, &ok);
  if (!ok) return info.Env().Undefined();
  Napi::Object o = info[0].As<Napi::Object>();
  t->bw = static_cast<uint32_t>(IntField(o, "width", 0));
  t->bh = static_cast<uint32_t>(IntField(o, "height", 0));
  int q = 100;
  if (o.Has("quality")) {
    Napi::Value v = o.Get("quality");
    if (v.IsNumber()) {
      double d = v.As<Napi::Number>().DoubleValue();
      q = static_cast<int>(d <= 1.0 ? d * 100.0 : d);
    }
  }
  if (q < 1) q = 1;
  if (q > 100) q = 100;
  t->quality = q;
  ImgWorker* w = new ImgWorker(info[1].As<Napi::Function>(), t, ImgWorker::kToJxl);
  w->Queue();
  return info.Env().Undefined();
}

Napi::Value getJxlInfo(const Napi::CallbackInfo& info) {
  bool ok = false;
  ImgTask* t = TaskFromOptions(info, &ok);
  if (!ok) return info.Env().Undefined();
  ImgWorker* w = new ImgWorker(info[1].As<Napi::Function>(), t, ImgWorker::kInfo);
  w->Queue();
  return info.Env().Undefined();
}

Napi::Value resizeJxl(const Napi::CallbackInfo& info) {
  bool ok = false;
  ImgTask* t = TaskFromOptions(info, &ok);
  if (!ok) return info.Env().Undefined();
  Napi::Object o = info[0].As<Napi::Object>();
  t->ow = IntField(o, "width", -1);
  t->oh = IntField(o, "height", -1);
  ImgWorker* w = new ImgWorker(info[1].As<Napi::Function>(), t, ImgWorker::kResize);
  w->Queue();
  return info.Env().Undefined();
}

Napi::Value resizeJxlLimit(const Napi::CallbackInfo& info) {
  bool ok = false;
  ImgTask* t = TaskFromOptions(info, &ok);
  if (!ok) return info.Env().Undefined();
  Napi::Object o = info[0].As<Napi::Object>();
  t->ow = IntField(o, "limit", IntField(o, "width", -1));
  t->oh = IntField(o, "limit", IntField(o, "height", -1));
  t->limit = true;
  ImgWorker* w = new ImgWorker(info[1].As<Napi::Function>(), t, ImgWorker::kResize);
  w->Queue();
  return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("moduleReady", Napi::Function::New(env, moduleReady));
  exports.Set("jxlToJpeg", Napi::Function::New(env, jxlToJpeg));
  exports.Set("jxlDecompressMulti", Napi::Function::New(env, jxlDecompressMulti));
  exports.Set("bitmapToJxl", Napi::Function::New(env, bitmapToJxl));
  exports.Set("getJxlInfo", Napi::Function::New(env, getJxlInfo));
  exports.Set("resizeJxl", Napi::Function::New(env, resizeJxl));
  exports.Set("resizeJxlLimit", Napi::Function::New(env, resizeJxlLimit));
  return exports;
}

}  // namespace

NODE_API_MODULE(zjxl, Init)
