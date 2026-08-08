(this.webpackJsonp = this.webpackJsonp || []).push([
    [29], {
        "0goA": function(e, r, i) {
            "use strict";
            r.a = "assets/logo-new.146dfa01c78183631d33b77999a18288.svg"
        },
        "36dD": function(e, r, i) {},
        "47Cz": function(e, r, i) {},
        "4I9T": function(e, r) {},
        A8Bs: function(e, r, i) {
            "use strict";
            var t;
            self, t = () => (() => {
                var e, r = {
                        d: (e, i) => {
                            for (var t in i) r.o(i, t) && !r.o(e, t) && Object.defineProperty(e, t, {
                                enumerable: !0,
                                get: i[t]
                            })
                        },
                        o: (e, r) => Object.prototype.hasOwnProperty.call(e, r),
                        r: e => {
                            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                                value: "Module"
                            }), Object.defineProperty(e, "__esModule", {
                                value: !0
                            })
                        }
                    },
                    i = {};

                function t(e, r, i) {
                    if (r < 0 || r > 31 || e >>> r != 0) throw new RangeError("Value out of range");
                    for (let t = r - 1; t >= 0; t--) i.push(e >>> t & 1)
                }

                function s(e, r) {
                    return !!(e >>> r & 1)
                }

                function n(e) {
                    if (!e) throw new Error("Assertion error")
                }
                r.r(i), r.d(i, {
                    QrCodeMask: () => e,
                    QrEcc: () => g,
                    ZQR: () => l
                });
                class g {
                    constructor(e, r) {
                        this.ordinal = e, this.formatBits = r
                    }
                }
                g.LOW = new g(0, 1), g.MEDIUM = new g(1, 0), g.QUARTILE = new g(2, 3), g.HIGH = new g(3, 2);
                class D {
                    constructor(e, r) {
                        this.modeBits = e, this.numBitsCharCount = r
                    }
                    numCharCountBits(e) {
                        return this.numBitsCharCount[Math.floor((e + 7) / 17)]
                    }
                }
                D.NUMERIC = new D(1, [10, 12, 14]), D.ALPHANUMERIC = new D(2, [9, 11, 13]), D.BYTE = new D(4, [8, 16, 16]), D.KANJI = new D(8, [8, 10, 12]), D.ECI = new D(7, [0, 0, 0]);
                class a {
                    static makeBytes(e) {
                        let r = [];
                        for (const i of e) t(i, 8, r);
                        return new a(D.BYTE, e.length, r)
                    }
                    static makeNumeric(e) {
                        if (!a.isNumeric(e)) throw new RangeError("String contains non-numeric characters");
                        let r = [];
                        for (let i = 0; i < e.length;) {
                            const s = Math.min(e.length - i, 3);
                            t(parseInt(e.substring(i, i + s), 10), 3 * s + 1, r), i += s
                        }
                        return new a(D.NUMERIC, e.length, r)
                    }
                    static makeAlphanumeric(e) {
                        if (!a.isAlphanumeric(e)) throw new RangeError("String contains unencodable characters in alphanumeric mode");
                        let r, i = [];
                        for (r = 0; r + 2 <= e.length; r += 2) {
                            let s = 45 * a.ALPHANUMERIC_CHARSET.indexOf(e.charAt(r));
                            s += a.ALPHANUMERIC_CHARSET.indexOf(e.charAt(r + 1)), t(s, 11, i)
                        }
                        return r < e.length && t(a.ALPHANUMERIC_CHARSET.indexOf(e.charAt(r)), 6, i), new a(D.ALPHANUMERIC, e.length, i)
                    }
                    static makeSegments(e) {
                        return "" == e ? [] : a.isNumeric(e) ? [a.makeNumeric(e)] : a.isAlphanumeric(e) ? [a.makeAlphanumeric(e)] : [a.makeBytes(a.toUtf8ByteArray(e))]
                    }
                    static makeEci(e) {
                        let r = [];
                        if (e < 0) throw new RangeError("ECI assignment value out of range");
                        if (e < 128) t(e, 8, r);
                        else if (e < 16384) t(2, 2, r), t(e, 14, r);
                        else {
                            if (!(e < 1e6)) throw new RangeError("ECI assignment value out of range");
                            t(6, 3, r), t(e, 21, r)
                        }
                        return new a(D.ECI, 0, r)
                    }
                    static isNumeric(e) {
                        return a.NUMERIC_REGEX.test(e)
                    }
                    static isAlphanumeric(e) {
                        return a.ALPHANUMERIC_REGEX.test(e)
                    }
                    constructor(e, r, i) {
                        if (r < 0) throw new RangeError("Invalid argument");
                        this.mode = e, this.numChars = r, this.bitData = i.slice()
                    }
                    getData() {
                        return this.bitData.slice()
                    }
                    static getTotalBits(e, r) {
                        let i = 0;
                        for (const t of e) {
                            const e = t.mode.numCharCountBits(r);
                            if (t.numChars >= 1 << e) return 1 / 0;
                            i += 4 + e + t.bitData.length
                        }
                        return i
                    }
                    static toUtf8ByteArray(e) {
                        e = encodeURI(e);
                        let r = [];
                        for (let i = 0; i < e.length; i++) "%" != e.charAt(i) ? r.push(e.charCodeAt(i)) : (r.push(parseInt(e.substring(i + 1, i + 3), 16)), i += 2);
                        return r
                    }
                }
                a.NUMERIC_REGEX = /^[0-9]*$/, a.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/, a.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
                class c {
                    static getNumRawDataModules(e) {
                        if (e < c.MIN_VERSION || e > c.MAX_VERSION) throw new RangeError("Version number out of range");
                        let r = (16 * e + 128) * e + 64;
                        if (e >= 2) {
                            const i = Math.floor(e / 7) + 2;
                            r -= (25 * i - 10) * i - 55, e >= 7 && (r -= 36)
                        }
                        return r
                    }
                    static getNumDataCodewords(e, r) {
                        return Math.floor(c.getNumRawDataModules(e) / 8) - c.ECC_CODEWORDS_PER_BLOCK[r.ordinal][e] * c.NUM_ERROR_CORRECTION_BLOCKS[r.ordinal][e]
                    }
                    static reedSolomonComputeDivisor(e) {
                        if (e < 1 || e > 255) throw new RangeError("Degree out of range");
                        let r = [];
                        for (let t = 0; t < e - 1; t++) r.push(0);
                        r.push(1);
                        let i = 1;
                        for (let t = 0; t < e; t++) {
                            for (let e = 0; e < r.length; e++) r[e] = c.reedSolomonMultiply(r[e], i), e + 1 < r.length && (r[e] ^= r[e + 1]);
                            i = c.reedSolomonMultiply(i, 2)
                        }
                        return r
                    }
                    static reedSolomonComputeRemainder(e, r) {
                        let i = r.map((e => 0));
                        for (const t of e) {
                            const e = t ^ i.shift();
                            i.push(0), r.forEach(((r, t) => i[t] ^= c.reedSolomonMultiply(r, e)))
                        }
                        return i
                    }
                    static reedSolomonMultiply(e, r) {
                        if (e >>> 8 != 0 || r >>> 8 != 0) throw new RangeError("Byte out of range");
                        let i = 0;
                        for (let t = 7; t >= 0; t--) i = i << 1 ^ 285 * (i >>> 7), i ^= (r >>> t & 1) * e;
                        return i
                    }
                }
                c.MIN_VERSION = 1, c.MAX_VERSION = 40, c.ECC_CODEWORDS_PER_BLOCK = [
                    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
                    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
                ], c.NUM_ERROR_CORRECTION_BLOCKS = [
                    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
                    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
                    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
                    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
                ], c.PENALTY_N1 = 3, c.PENALTY_N2 = 3, c.PENALTY_N3 = 40, c.PENALTY_N4 = 10;
                class d {
                    static encodeText(e, r) {
                        const i = a.makeSegments(e);
                        return d.encodeSegments(i, r)
                    }
                    static encodeBinary(e, r) {
                        const i = a.makeBytes(e);
                        return d.encodeSegments([i], r)
                    }
                    static encodeSegments(e, r, i = 1, s = 40, D = -1, l = !0) {
                        if (!(c.MIN_VERSION <= i && i <= s && s <= c.MAX_VERSION) || D < -1 || D > 7) throw new RangeError("Invalid value");
                        let h, o;
                        for (h = i;; h++) {
                            const i = 8 * c.getNumDataCodewords(h, r),
                                t = a.getTotalBits(e, h);
                            if (t <= i) {
                                o = t;
                                break
                            }
                            if (h >= s) throw new RangeError("Data too long")
                        }
                        for (const t of [g.MEDIUM, g.QUARTILE, g.HIGH]) l && o <= 8 * c.getNumDataCodewords(h, t) && (r = t);
                        let y = [];
                        for (const n of e) {
                            t(n.mode.modeBits, 4, y), t(n.numChars, n.mode.numCharCountBits(h), y);
                            for (const e of n.getData()) y.push(e)
                        }
                        n(y.length == o);
                        const p = 8 * c.getNumDataCodewords(h, r);
                        n(y.length <= p), t(0, Math.min(4, p - y.length), y), t(0, (8 - y.length % 8) % 8, y), n(y.length % 8 == 0);
                        for (let n = 236; y.length < p; n ^= 253) t(n, 8, y);
                        let A = [];
                        for (; 8 * A.length < y.length;) A.push(0);
                        return y.forEach(((e, r) => A[r >>> 3] |= e << 7 - (7 & r))), new d(h, r, A, D)
                    }
                    constructor(e, r, i, t) {
                        if (this.modules = [], this.isFunction = [], this.version = e, this.errorCorrectionLevel = r, e < c.MIN_VERSION || e > c.MAX_VERSION) throw new RangeError("Version value out of range");
                        if (t < -1 || t > 7) throw new RangeError("Mask value out of range");
                        this.size = 4 * e + 17;
                        let s = [];
                        for (let n = 0; n < this.size; n++) s.push(!1);
                        for (let n = 0; n < this.size; n++) this.modules.push(s.slice()), this.isFunction.push(s.slice());
                        this.drawFunctionPatterns();
                        const g = this.addEccAndInterleave(i);
                        if (this.drawCodewords(g), -1 == t) {
                            let e = 1e9;
                            for (let r = 0; r < 8; r++) {
                                this.applyMask(r), this.drawFormatBits(r);
                                const i = this.getPenaltyScore();
                                i < e && (t = r, e = i), this.applyMask(r)
                            }
                        }
                        n(0 <= t && t <= 7), this.mask = t, this.applyMask(t), this.drawFormatBits(t), this.isFunction = []
                    }
                    getModule(e, r) {
                        return 0 <= e && e < this.size && 0 <= r && r < this.size && this.modules[r][e]
                    }
                    drawFunctionPatterns() {
                        for (let i = 0; i < this.size; i++) this.setFunctionModule(6, i, i % 2 == 0), this.setFunctionModule(i, 6, i % 2 == 0);
                        this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
                        const e = this.getAlignmentPatternPositions(),
                            r = e.length;
                        for (let i = 0; i < r; i++)
                            for (let t = 0; t < r; t++) 0 == i && 0 == t || 0 == i && t == r - 1 || i == r - 1 && 0 == t || this.drawAlignmentPattern(e[i], e[t]);
                        this.drawFormatBits(0), this.drawVersion()
                    }
                    drawFormatBits(e) {
                        const r = this.errorCorrectionLevel.formatBits << 3 | e;
                        let i = r;
                        for (let s = 0; s < 10; s++) i = i << 1 ^ 1335 * (i >>> 9);
                        const t = 21522 ^ (r << 10 | i);
                        n(t >>> 15 == 0);
                        for (let n = 0; n <= 5; n++) this.setFunctionModule(8, n, s(t, n));
                        this.setFunctionModule(8, 7, s(t, 6)), this.setFunctionModule(8, 8, s(t, 7)), this.setFunctionModule(7, 8, s(t, 8));
                        for (let n = 9; n < 15; n++) this.setFunctionModule(14 - n, 8, s(t, n));
                        for (let n = 0; n < 8; n++) this.setFunctionModule(this.size - 1 - n, 8, s(t, n));
                        for (let n = 8; n < 15; n++) this.setFunctionModule(8, this.size - 15 + n, s(t, n));
                        this.setFunctionModule(8, this.size - 8, !0)
                    }
                    drawVersion() {
                        if (this.version < 7) return;
                        let e = this.version;
                        for (let i = 0; i < 12; i++) e = e << 1 ^ 7973 * (e >>> 11);
                        const r = this.version << 12 | e;
                        n(r >>> 18 == 0);
                        for (let i = 0; i < 18; i++) {
                            const e = s(r, i),
                                t = this.size - 11 + i % 3,
                                n = Math.floor(i / 3);
                            this.setFunctionModule(t, n, e), this.setFunctionModule(n, t, e)
                        }
                    }
                    drawFinderPattern(e, r) {
                        for (let i = -4; i <= 4; i++)
                            for (let t = -4; t <= 4; t++) {
                                const s = Math.max(Math.abs(t), Math.abs(i)),
                                    n = e + t,
                                    g = r + i;
                                0 <= n && n < this.size && 0 <= g && g < this.size && this.setFunctionModule(n, g, 2 != s && 4 != s)
                            }
                    }
                    drawAlignmentPattern(e, r) {
                        for (let i = -2; i <= 2; i++)
                            for (let t = -2; t <= 2; t++) this.setFunctionModule(e + t, r + i, 1 != Math.max(Math.abs(t), Math.abs(i)))
                    }
                    setFunctionModule(e, r, i) {
                        this.modules[r][e] = i, this.isFunction[r][e] = !0
                    }
                    addEccAndInterleave(e) {
                        const r = this.version,
                            i = this.errorCorrectionLevel;
                        if (e.length != c.getNumDataCodewords(r, i)) throw new RangeError("Invalid argument");
                        const t = c.NUM_ERROR_CORRECTION_BLOCKS[i.ordinal][r],
                            s = c.ECC_CODEWORDS_PER_BLOCK[i.ordinal][r],
                            g = Math.floor(c.getNumRawDataModules(r) / 8),
                            D = t - g % t,
                            a = Math.floor(g / t);
                        let d = [];
                        const l = c.reedSolomonComputeDivisor(s);
                        for (let n = 0, o = 0; n < t; n++) {
                            let r = e.slice(o, o + a - s + (n < D ? 0 : 1));
                            o += r.length;
                            const i = c.reedSolomonComputeRemainder(r, l);
                            n < D && r.push(0), d.push(r.concat(i))
                        }
                        let h = [];
                        for (let n = 0; n < d[0].length; n++) d.forEach(((e, r) => {
                            (n != a - s || r >= D) && h.push(e[n])
                        }));
                        return n(h.length == g), h
                    }
                    drawCodewords(e) {
                        if (e.length != Math.floor(c.getNumRawDataModules(this.version) / 8)) throw new RangeError("Invalid argument");
                        let r = 0;
                        for (let i = this.size - 1; i >= 1; i -= 2) {
                            6 == i && (i = 5);
                            for (let t = 0; t < this.size; t++)
                                for (let n = 0; n < 2; n++) {
                                    const g = i - n,
                                        D = i + 1 & 2 ? t : this.size - 1 - t;
                                    !this.isFunction[D][g] && r < 8 * e.length && (this.modules[D][g] = s(e[r >>> 3], 7 - (7 & r)), r++)
                                }
                        }
                        n(r == 8 * e.length)
                    }
                    applyMask(e) {
                        if (e < 0 || e > 7) throw new RangeError("Mask value out of range");
                        for (let r = 0; r < this.size; r++)
                            for (let i = 0; i < this.size; i++) {
                                let t;
                                switch (e) {
                                    case 0:
                                        t = (i + r) % 2 == 0;
                                        break;
                                    case 1:
                                        t = r % 2 == 0;
                                        break;
                                    case 2:
                                        t = i % 3 == 0;
                                        break;
                                    case 3:
                                        t = (i + r) % 3 == 0;
                                        break;
                                    case 4:
                                        t = (Math.floor(i / 3) + Math.floor(r / 2)) % 2 == 0;
                                        break;
                                    case 5:
                                        t = i * r % 2 + i * r % 3 == 0;
                                        break;
                                    case 6:
                                        t = (i * r % 2 + i * r % 3) % 2 == 0;
                                        break;
                                    case 7:
                                        t = ((i + r) % 2 + i * r % 3) % 2 == 0;
                                        break;
                                    default:
                                        throw new Error("Unreachable")
                                }!this.isFunction[r][i] && t && (this.modules[r][i] = !this.modules[r][i])
                            }
                    }
                    getPenaltyScore() {
                        let e = 0;
                        for (let s = 0; s < this.size; s++) {
                            let r = !1,
                                i = 0,
                                t = [0, 0, 0, 0, 0, 0, 0];
                            for (let n = 0; n < this.size; n++) this.modules[s][n] == r ? (i++, 5 == i ? e += c.PENALTY_N1 : i > 5 && e++) : (this.finderPenaltyAddHistory(i, t), r || (e += this.finderPenaltyCountPatterns(t) * c.PENALTY_N3), r = this.modules[s][n], i = 1);
                            e += this.finderPenaltyTerminateAndCount(r, i, t) * c.PENALTY_N3
                        }
                        for (let s = 0; s < this.size; s++) {
                            let r = !1,
                                i = 0,
                                t = [0, 0, 0, 0, 0, 0, 0];
                            for (let n = 0; n < this.size; n++) this.modules[n][s] == r ? (i++, 5 == i ? e += c.PENALTY_N1 : i > 5 && e++) : (this.finderPenaltyAddHistory(i, t), r || (e += this.finderPenaltyCountPatterns(t) * c.PENALTY_N3), r = this.modules[n][s], i = 1);
                            e += this.finderPenaltyTerminateAndCount(r, i, t) * c.PENALTY_N3
                        }
                        for (let s = 0; s < this.size - 1; s++)
                            for (let r = 0; r < this.size - 1; r++) {
                                const i = this.modules[s][r];
                                i == this.modules[s][r + 1] && i == this.modules[s + 1][r] && i == this.modules[s + 1][r + 1] && (e += c.PENALTY_N2)
                            }
                        let r = 0;
                        for (const s of this.modules) r = s.reduce(((e, r) => e + (r ? 1 : 0)), r);
                        const i = this.size * this.size,
                            t = Math.ceil(Math.abs(20 * r - 10 * i) / i) - 1;
                        return n(0 <= t && t <= 9), e += t * c.PENALTY_N4, n(0 <= e && e <= 2568888), e
                    }
                    getAlignmentPatternPositions() {
                        if (1 == this.version) return [];
                        {
                            const e = Math.floor(this.version / 7) + 2,
                                r = 2 * Math.floor((8 * this.version + 3 * e + 5) / (4 * e - 4));
                            let i = [6];
                            for (let t = this.size - 7; i.length < e; t -= r) i.splice(1, 0, t);
                            return i
                        }
                    }
                    finderPenaltyCountPatterns(e) {
                        const r = e[1];
                        n(r <= 3 * this.size);
                        const i = r > 0 && e[2] == r && e[3] == 3 * r && e[4] == r && e[5] == r;
                        return (i && e[0] >= 4 * r && e[6] >= r ? 1 : 0) + (i && e[6] >= 4 * r && e[0] >= r ? 1 : 0)
                    }
                    finderPenaltyTerminateAndCount(e, r, i) {
                        return e && (this.finderPenaltyAddHistory(r, i), r = 0), r += this.size, this.finderPenaltyAddHistory(r, i), this.finderPenaltyCountPatterns(i)
                    }
                    finderPenaltyAddHistory(e, r) {
                        0 == r[0] && (e += this.size), r.pop(), r.unshift(e)
                    }
                }! function(e) {
                    e[e.auto = -1] = "auto", e[e.mask_0 = 0] = "mask_0", e[e.mask_1 = 1] = "mask_1", e[e.mask_2 = 2] = "mask_2", e[e.mask_3 = 3] = "mask_3", e[e.mask_4 = 4] = "mask_4", e[e.mask_5 = 5] = "mask_5", e[e.mask_6 = 6] = "mask_6", e[e.mask_7 = 7] = "mask_7"
                }(e || (e = {}));
                class l {
                    constructor({
                        qrEcc: r = g.HIGH,
                        minVersion: i = 1,
                        maxVersion: t = 40,
                        mask: s = e.mask_7,
                        boostEcl: n = !0
                    }) {
                        this.qrEcc = r, this.minVersion = i, this.maxVersion = t, this.mask = s, this.boostEcl = n, this.size = 0, this.version = i, this.dataText = "", this.dataBinary = [], this.marix = []
                    }
                    updateParam({
                        qrEcc: e = g.HIGH,
                        minVersion: r = 1,
                        maxVersion: i = 40,
                        mask: t = -1,
                        boostEcl: s = !0
                    }) {
                        this.qrEcc = null != e ? e : this.qrEcc, this.minVersion = null != r ? r : this.minVersion, this.maxVersion = null != i ? i : this.maxVersion, this.mask = null != t ? t : this.mask, this.boostEcl = null != s ? s : this.boostEcl
                    }
                    getVersion() {
                        return this.version
                    }
                    getSize() {
                        return this.size
                    }
                    getDataText() {
                        return this.dataText
                    }
                    getDataBinay() {
                        return this.dataBinary
                    }
                    encodeText(e) {
                        this.dataText = e;
                        const r = a.makeSegments(e),
                            i = d.encodeSegments(r, this.qrEcc, this.minVersion, this.maxVersion, this.mask, this.boostEcl);
                        this.size = i.size, this.mask = i.mask, this.version = i.version, this.qrEcc = i.errorCorrectionLevel;
                        for (let t = 0; t < this.size; t++) {
                            this.marix[t] = [];
                            for (let e = 0; e < this.size; e++) this.marix[t][e] = i.getModule(e, t)
                        }
                    }
                    encodeBinary(e) {
                        this.dataBinary = e;
                        const r = d.encodeSegments([a.makeBytes(e)], this.qrEcc, this.minVersion, this.maxVersion, this.mask, this.boostEcl);
                        this.size = r.size, this.mask = r.mask, this.version = r.version, this.qrEcc = r.errorCorrectionLevel;
                        for (let i = 0; i < this.size; i++) {
                            this.marix[i] = [];
                            for (let e = 0; e < this.size; e++) this.marix[i][e] = r.getModule(e, i)
                        }
                    }
                    getMatrix() {
                        return this.marix
                    }
                    getPoint(e, r) {
                        return this.marix[r][e].valueOf()
                    }
                }
                return i
            })(), e.exports = t()
        },
        BMoG: function(e, r) {},
        Pszc: function(e, r) {},
        U96N: function(e, r, i) {},
        "Xu+P": function(e, r, i) {},
        cy9f: function(e, r, i) {},
        hGpA: function(e, r, i) {},
        o30X: function(e, r) {},
        t3EU: function(e, r, i) {},
        w4sY: function(e, r, i) {},
        xNPa: function(e, r, i) {},
        xNxX: function(e, r, i) {},
        y65y: function(e, r, i) {},
        yQh1: function(e, r, i) {},
        zn3J: function(e, r, i) {
            "use strict";
            i.r(r);
            i("TlRV"), i("m+NF");
            var t, s = i("J25b"),
                n = i("jDHv");
            Object(n.singleton)(s.b)(t = class {
                getHourNow() {
                    return (new Date).getHours()
                }
                getTimeNow() {
                    return Date.now()
                }
                getSystemTimeNow() {
                    return Date.now()
                }
            });
            i("bO0B"), i("dhzt"), i("jmmm"), i("GSxB"), i("xDXR"), i("WrSY"), i("LyOm"), i("lNuO"), i("xir9"), i("4Vil"), i("0rWR"), i("Lq8m"), i("EicM"), i("nUpV"), i("5yGw"), i("hRcX"), i("/2rj"), i("gpNb"), i("rhBN"), i("BP4/"), i("cF85"), i("9AEM"), i("fNRA"), i("7g9m");
            var g, D = i("drXQ"),
                a = i("Hw41"),
                c = i("DI/x"),
                d = i("x9oK"),
                l = i("xM06"),
                h = i("Uzj0"),
                o = i("Mgpg");
            let y = n.ModuleContainer.injectable()(g = Reflect.metadata("design:type", Function)(g = Reflect.metadata("design:paramtypes", [])(g = class {
                constructor() {
                    this.logger = void 0, this.installContainer = null;
                    const e = n.ModuleContainer.resolve(o.ZLoggerFactory);
                    this.logger = e.createZLogger("db", ["adapter-factory"])
                }
                async setupOnce() {
                    return null === this.installContainer && (this.installContainer = new h.c.Container, (async () => {
                        try {
                            const e = n.ModuleContainer.resolve(a.b),
                                r = await e.getPort(),
                                i = {
                                    typeID: l.j,
                                    data: {
                                        type: l.g,
                                        data: {}
                                    }
                                };
                            await r.invokeMessage(i), this.logger.zsymb(0, "QgLlFG", "Done clear sessional pools"), this.installContainer.resolve()
                        } catch (e) {
                            this.installContainer.reject(e)
                        }
                    })()), this.installContainer.promise
                }
                async createAdapter(e, r) {
                    if (await this.setupOnce(), r.sessional) throw new c.a(e, "Sessional database adapter is not allowed");
                    return D.a.factory(e, r)
                }
                async getExistedPartitionKeys(e) {
                    await this.setupOnce();
                    const r = n.ModuleContainer.resolve(a.b),
                        i = await r.getPort(),
                        t = {
                            typeID: l.j,
                            data: {
                                type: l.p,
                                data: {
                                    fullname: e
                                }
                            }
                        };
                    return i.invokeMessage(t)
                }
            }) || g) || g) || g;
            n.ModuleContainer.registerSingleton(d.c, y);
            i("6Pbj"), i("5lV7"), i("vUp1"), i("xRjI"), i("szdT"), i("Ws6j"), i("mneU"), i("daJc");
            var p = i("Jq/t"),
                A = (i("3KOX"), i("V48A"), i("Z5tB"), i("D5po")),
                B = i("VuQl"),
                E = i("JIt3"),
                x = i("yXvs"),
                m = i("rNEG"),
                u = i("GOkv"),
                f = i("uplc"),
                b = i("Msg7"),
                w = i("f/DQ"),
                C = i("XmdN"),
                k = i("AtyM"),
                _ = i("kPOY");
            class F extends E.a {
                constructor(e, r, i, t) {
                    super(), this.identityKeyPair = void 0, this.linkingSecretKey = void 0, this.relinkId = void 0, this.companionLinkingProof = void 0, this.linkingUid = void 0, this._publicIKString = void 0, this.identityKeyPair = e, this.linkingSecretKey = r, this.relinkId = i, this.linkingUid = t
                }
                get isRelink() {
                    return !!this.relinkId
                }
                get publicIdentityKey() {
                    return this._publicIKString || (this._publicIKString = Object(f.a)(this.identityKeyPair.publicKey)), this._publicIKString
                }
                getLinkingInfo() {
                    var e, r, i;
                    return {
                        uid: this.linkingUid,
                        publicIdentityKey: this.publicIdentityKey,
                        isRelink: this.isRelink,
                        masterId: null === (e = this.companionLinkingProof) || void 0 === e ? void 0 : e.masterId,
                        primaryPublicIdentityKey: null !== (r = this.companionLinkingProof) && void 0 !== r && r.primaryPublicIdentityKey ? Object(f.a)(this.companionLinkingProof.primaryPublicIdentityKey) : void 0,
                        linkingTimestamp: null === (i = this.companionLinkingProof) || void 0 === i ? void 0 : i.linkingTimestamp
                    }
                }
                async generateQr(e, r) {
                    const i = k.a.now();
                    try {
                        const i = await this.TrustProtocol.generateLinkingQR(this.identityKeyPair.publicKey, this.relinkId ? void 0 : this.linkingSecretKey, e, r, this.currentPlatform, this.relinkId ? this.relinkId : void 0);
                        return x.a.TrustProto.zsymb(0, "xthozA", `[linking-state] generated QR. isRelink ${this.isRelink}; ts ${r}; publicIK ${this.publicIdentityKey}`), i
                    } catch (t) {
                        throw _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.GENERATE_QR_FAIL, k.a.now() - i, [Object(x.b)(t)]), t
                    }
                }
                async createCompanionLinkingProof(e, r) {
                    const i = k.a.now();
                    try {
                        const i = await this.TrustProtocol.createCompanionLinkingProof(this.identityKeyPair.publicKey, this.identityKeyPair.privateKey, this.linkingSecretKey, m.b.wrap(Object(u.a)(e)), m.b.wrap(Object(u.a)(r)), this.currentPlatform);
                        this.companionLinkingProof = i;
                        let t = Object(f.a)(i.linkingMetadata),
                            s = Object(f.a)(i.accountSignature),
                            n = Object(f.a)(i.deviceSignature);
                        return x.a.TrustProto.zsymb(0, "MTyYMB", `[linking-state] created compLinkingProof. linkId ${i.linkId}; masterId ${i.masterId}; companionId ${i.companionId}; LinkingTs ${i.linkingTimestamp}; primaryIK ${Object(f.a)(i.primaryPublicIdentityKey)}`), x.a.TrustProto.zsymb(0, "YKA2R2", `[linkingData] responding compLinkingProof: metadata ${t}; accSignature ${s}; deviceSignature ${n}`), {
                            linkingMetadata: t,
                            accountSignature: s,
                            deviceSignature: n
                        }
                    } catch (t) {
                        throw x.a.TrustProto.zsymb(18, "JAQpcS", `[linking-state] FAILED on create compLinkingProof. primaryLinkingData ${e}; linkingHmac ${r}. ERR ${Object(x.b)(t)}`), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.CREATE_COMP_LINKING_PROOF_FAIL, k.a.now() - i, [Object(x.b)(t)]), t
                    }
                }
                async completeDeviceLink(e, r) {
                    const i = k.a.now();
                    if (!this.companionLinkingProof) throw x.a.TrustProto.zsymb(18, "NhZvJV", "[linking-state] companion linking proof does not created before"), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.UNKNOWN_ERROR, 0), new C.a("Missing companion linking proof");
                    let t = {
                        isSuccess: !1
                    };
                    x.a.TrustProto.zsymb(0, "z_cfl4", "[linking-state] finalizing new DeviceList from server: ", null == r ? void 0 : r.devices);
                    try {
                        this.linkingUid && this.linkingUid !== e && x.a.TrustProto.zsymb(6, "rw7Awr", `[linking-state] why uid different to relinking uid?? (changed from ${this.linkingUid} -> ${e})`);
                        const n = w.a.toQualifiedDeviceList(r),
                            g = Object(b.a)(),
                            D = await this.TrustProtocol.verifyDeviceList(n, this.companionLinkingProof.primaryPublicIdentityKey, g, this.identityKeyPair.publicKey);
                        if (D.isTrusted) {
                            const r = D.data;
                            x.a.TrustProto.zsymb(0, "0jv71i", "[linking-state] verify new DeviceList success. saving to DB...");
                            try {
                                await this.TrustStorage.saveNewDeviceLink({
                                    publicKey: this.identityKeyPair.publicKey,
                                    privateKey: this.identityKeyPair.privateKey
                                }, Object(f.a)(r), e, this.companionLinkingProof.primaryPublicIdentityKey, this.companionLinkingProof.masterId, this.companionLinkingProof.companionId, this.linkingSecretKey, this.companionLinkingProof.linkId, this.companionLinkingProof.linkingTimestamp), t.isSuccess = !0, x.a.TrustProto.zsymb(0, "g7lotl", "[linking-trust-server] completed link device.")
                            } catch (s) {
                                x.a.TrustProto.zsymb(18, "okv6aH", "[linking-state] FAILED on saving linking data to DB. ERR: ", Object(x.b)(s)), t.errorCode = "DB_ERROR", t.errorMessage = Object(x.b)(s), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.DB_SAVE_NEW_DEVICE_LINK_FAIL, k.a.now() - i, [t.errorMessage || ""])
                            }
                        } else x.a.TrustProto.zsymb(18, "lFXgEF", `[linking-state] FAILED on verify devicelist. ERR_CODE: ${D.verificationError}; verifyAt ${g}`), t.errorCode = D.verificationError || void 0, t.errorMessage = `Invalid DeviceList from primary. ERR_CODE ${D.verificationError}`, _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.VERIFY_PRIMARY_DEVICELIST_FAIL, k.a.now() - i, [D.verificationError || ""])
                    } catch (s) {
                        x.a.TrustProto.zsymb(18, "ZIgI7j", "[linking-state] FAILED on process new DeviceList. ERR: ", Object(x.b)(s)), t.errorCode = "UNKNOWN_ERROR", t.errorMessage = Object(x.b)(s), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.UNKNOWN_ERROR, k.a.now() - i, [t.errorMessage || ""])
                    }
                    return t.isSuccess && _.a.LinkDevice.recordLinkDeviceSuccess(this.isRelink, k.a.now() - i), t
                }
            }
            const v = (e, r) => {
                if (e.length !== r.length) return !1;
                for (let i = 0; i < e.length; i++)
                    if (e[i] !== r[i]) return !1;
                return !0
            };
            class S {
                constructor(e) {
                    this.algorithm = void 0, this.chunks = void 0, this.isFinalized = void 0, this.algorithm = e, this.chunks = [], this.isFinalized = !1
                }
                static create(e) {
                    return new S(e)
                }
                update(e) {
                    if (this.isFinalized) throw new Error("Cannot update a finalized hasher.");
                    return this.chunks.push(e), this
                }
                async finalize() {
                    if (this.isFinalized) throw new Error("Hasher has already been finalized.");
                    this.isFinalized = !0;
                    const e = this.combineChunks(),
                        r = await crypto.subtle.digest(this.algorithm, e);
                    return this.chunks = [], this.bufferToHex(r)
                }
                combineChunks() {
                    const e = this.chunks.reduce(((e, r) => e + r.length), 0),
                        r = new Uint8Array(e);
                    let i = 0;
                    for (const t of this.chunks) r.set(t, i), i += t.length;
                    return r
                }
                bufferToHex(e) {
                    return Array.from(new Uint8Array(e)).map((e => e.toString(16).padStart(2, "0"))).join("")
                }
            }
            var I;
            Object(A.c)(B.c.LinkingTrustService)(I = Reflect.metadata("design:type", Function)(I = Reflect.metadata("design:paramtypes", [])(I = class extends E.a {
                constructor() {
                    super()
                }
                async logSecretKeys(e, r) {
                    try {
                        const [i, t] = await Promise.all([e, r].map((e => {
                            return r = e, S.create("SHA-256").update(r).finalize();
                            var r
                        })));
                        x.a.TrustProto.zsymb(0, "2TJ42O", `[linking-trust-service] linkingSecret key hashed: ${i}; privateIdentity key hashed: ${t}`)
                    } catch (i) {}
                }
                async deleteLinkHistoryByUid(e) {
                    try {
                        const r = await this.TrustStorage.LinkHistory.deleteMultiByUid(e);
                        x.a.TrustProto.zsymb(0, "tE3QFL", `[linking-trust-service] delete linkHistory by ${e}; deleted masterId: ${JSON.stringify(r)}`)
                    } catch (r) {
                        throw x.a.TrustProto.zsymb(18, "xatn3N", `[linking-trust-service] FAILED on delete linkHistory by uid ${e}. ERR: `, Object(x.b)(r)), r
                    }
                }
                async deleteLinkHistoryByMasterId(e) {
                    try {
                        await this.TrustStorage.LinkHistory.deleteByMasterId(e), x.a.TrustProto.zsymb(0, "geR_dG", `[linking-trust-service] delete linkHistory by masterId ${e} successfully`)
                    } catch (r) {
                        throw x.a.TrustProto.zsymb(18, "dT-IqD", `[linking-trust-service] FAILED on delete linkHistory by masterId ${e}. ERR: `, Object(x.b)(r)), r
                    }
                }
                async createLinkingState(e) {
                    x.a.TrustProto.zsymb(0, "GUhybm", `[linking-trust-service] start create linking state. masterId: ${e}`);
                    const r = k.a.now();
                    let i;
                    try {
                        i = e ? await this.TrustStorage.LinkHistory.findByMasterId(e) : await this.TrustStorage.LinkHistory.findByLatestLinkingTimestamp()
                    } catch (a) {
                        if (!Object(C.b)(a)) throw x.a.TrustProto.zsymb(18, "TMobFg", "[linking-trust-service] failed on load Link History from DB. ERR: ", Object(x.b)(a)), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.DB_LOAD_LINK_HISTORY_FAIL, k.a.now() - r, [Object(x.b)(a)]), a;
                        {
                            var t;
                            const e = null === (t = a.details) || void 0 === t ? void 0 : t.masterId;
                            e && "string" == typeof e && (x.a.TrustProto.zsymb(6, "g6Skei", "[linking-trust-service] failed on decipher LinkHistory record from db. ERR: ", Object(x.b)(a)), await this.TrustStorage.LinkHistory.deleteByMasterId(e), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.DECRYPT_INVALD_LINK_HISTORY_RECORD, k.a.now() - r))
                        }
                    }
                    if (i) {
                        let e, t;
                        try {
                            e = await this.TrustStorage.TrustedIdentity.findByUid(i.uid)
                        } catch (a) {
                            if (!Object(C.b)(a)) throw x.a.TrustProto.zsymb(18, "z7nO_q", `[linking-trust-service] failed on load Trusted Identity from DB. uid ${i.uid}; ERR: `, Object(x.b)(a)), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.DB_LOAD_TRUSTED_IDENTITY_FAIL, k.a.now() - r, [Object(x.b)(a)]), a;
                            var s;
                            t = null === (s = a.details) || void 0 === s ? void 0 : s.uid, x.a.TrustProto.zsymb(6, "QYRyYj", "[linking-trust-service] failed on decipher Identity record from db. ERR: ", Object(x.b)(a)), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.DECRYPT_INVALD_TRUSTED_IDENTITY_RECORD, k.a.now() - r)
                        }
                        if (e && v(e.primaryKey, i.primaryIdentity) && v(e.pubKey, i.identity)) {
                            const r = {
                                    publicKey: e.pubKey,
                                    privateKey: e.privKey
                                },
                                t = e.primaryKey,
                                s = i.linkingSecret,
                                n = await this.TrustProtocol.getRelinkId(t, r.publicKey, s, i.linkingTimestamp);
                            return x.a.TrustProto.zsymb(0, "IGefVY", `[linking-trust-service] ready LinkingState for re-link. uid ${e.uid}; relinkId ${Object(f.a)(n)}; primaryIK ${Object(f.a)(e.primaryKey)}; pubIK ${Object(f.a)(e.pubKey)}; masterId ${i.masterId}; oldLinkingTs ${i.linkingTimestamp}`), this.logSecretKeys(i.linkingSecret, e.privKey), new F(r, s, n, e.uid)
                        } {
                            var n;
                            x.a.TrustProto.zsymb(6, "Zt96WP", `[linking-trust-service] mismatch keys for relink. identity: ${e?`${Object(f.a)(e.primaryKey)}-${Object(f.a)(e.pubKey)}`:"null"}; oldLinkingHistory: ${Object(f.a)(i.primaryIdentity)}-${Object(f.a)(i.identity)}`);
                            let s = t || (null === (n = e) || void 0 === n ? void 0 : n.uid);
                            await Promise.all([this.TrustStorage.LinkHistory.deleteByMasterId(i.masterId), s ? this.TrustStorage.TrustedIdentity.deleteByUid(s) : void 0]), x.a.TrustProto.zsymb(6, "ZHHxah", `[linking-trust-service] deleted invalid uid ${s} & masterId ${i.masterId}`), _.a.LinkDevice.recordLinkDeviceFail(_.a.LinkDevice.FAILURE.MISMATCH_KEYS, k.a.now() - r)
                        }
                    }
                    let {
                        identityKeyPair: g,
                        linkingSecretKey: D
                    } = await this.TrustProtocol.generateIdentityKeyPairAndLinkingSecret();
                    return x.a.TrustProto.zsymb(0, "UTVVtu", `linking-trust-service ready LinkingState to link new. pubIK ${Object(f.a)(g.publicKey)}`), this.logSecretKeys(D, g.privateKey), new F(g, D, void 0, void 0)
                }
            }) || I) || I);
            i("DpY6"), i("LCnh");
            var R = i("Jw0q"),
                N = i("A8Bs");

            function T(e, r = !1) {
                const i = new N.ZQR({
                    qrEcc: N.QrEcc.LOW,
                    minVersion: 9
                });
                i.encodeText(e);
                const t = function(e) {
                    const i = e.length,
                        t = i + 2,
                        s = 48,
                        n = (e, r, i, t, n, g = 0) => `<rect style="fill:${n}; shape-rendering: crispEdges; image-rendering: crisp-edges;" x="${e*s}" y="${r*s}" width="${i*s}" height="${t*s}" rx="${g}" ry="${g}"/>`,
                        g = (e, r) => {
                            const i = (e, r, i, t, n, g) => `<rect rx="${Math.round(g)}" ry="${Math.round(g)}" x="${e*s}" y="${r*s}" width="${i*s}" height="${t*s}" fill="${n}" style="fill:${n};"/>`,
                                t = i(e + 2, r + 2, 3, 3, "#005AE0", 0),
                                n = i(e + 1, r + 1, 5, 5, "white", 0);
                            return i(e, r, 7, 7, "black", 0) + n + t
                        };
                    let D = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" fill="white" width="${t*s}" height="${t*s}" viewBox="0 0 ${t*s} ${t*s}" shape-rendering="geometricPrecision">`;
                    D += '<rect width="100%" height="100%" fill="white"/>';
                    for (let r = 0; r < i; r++)
                        for (let t = 0; t < i; t++) {
                            const s = t < 7 && r < 7 || t >= i - 7 && r < 7 || t < 7 && r >= i - 7;
                            if (e[r][t] && !s) {
                                D += n(t + 1, r + 1, 1, 1, "black")
                            }
                        }
                    return D += g(1, 1), D += g(i - 7 + 1, 1), D += g(1, i - 7 + 1), r && (D += `<image \n\t\t\tx="${(t*s-624)/2}" \n\t\t\ty="${(t*s-624)/2}" \n\t\t\twidth="624" \n\t\t\theight="624" \n\t\t\thref="${M}" \n\t\t\tpreserveAspectRatio="xMidYMid slice"\n\t\t\t/>`), D += "</svg>", D
                }(i.getMatrix());
                return `data:image/svg+xml;utf8,${encodeURIComponent(t)}`
            }
            const M = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB0CAYAAABOpvapAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAtxSURBVHgB7V3tVeM6EB3eef+XrQBvBbAV4K0AtoINFQQqACpYqACoALaChAoWKki2AtgK9HTtKM8RtjSyJVtOdM8ZHPLhD13PaDQajfdoSyCEyORmX0p1CxxYfvpntV1KeV/Jy97e3jttAfZoZFgRmUs5pJLEIyoJ3Sf/eKGS+Ff1WhL/QiNC9ARLQnO5OaaSVEXmkCg0XMqzlLkkfE4RIzqCJaEgcCLlhOIg1AYQPpfyi0rClxQRoiBYIzWncWMu5YEiIXtQglfmF6ROKH5NbYN7KQ9DmvFBCF4Re0nj11Yu0GffSqLvqWf0SrAkdkIlsRntJpZSrvskuheC+9DY9/f3Ql5eXort379/i+1yuWz8zf7+/lo+ffpEWZYVr9U2IJZSLiTRTxQYQQlejVnvyDOxIBHy+vpabEGiicg2AMFHR0drOTw8LLaecU+lRi8pEIIRLMmdys0VeXCe5vM5PT8/F1uloUNAkZ7nOR0fHxdbD8DFgOQbGgOgtVJmogPe3t7EbDYTk8lEyEYV2G2MgnPDOT4+PgoPeFxZvHghTzCXshAtAVLPz8+jJpUsZOMaOmAhxXs/4AXyxKaiJe7u7oQ0d6Mi1CTSSRP39/eiAy4pJuCERAtcXV2NUlu50pHoS4oB8kR+Ckegz8LF08gIaysdiL6kISEcNXexWGyVKXYVXDvawBE/aQi4kntzc7PV5thF0DU54pL6hAu5u661TdJCm8+pD4hyKMTC79+/d6qvdRW0jSPJOYWEKIMYC86ZwJFKJtkuaCOHQMmbCBkMgVJyzgIeIxElcRAHL3tGISCY/S7uRiJKEpZkv/2xKE2zFehzk1luL2g7tCEDfk21KAPhRsBZSA5Vd3FwvGbkA3JHE87R5DTaaBoxdsEQiolT6grB8JoxcA91sbsqzGDIQpQZqe0gGNoLc9LHBe+iMPvjK2oLwdDe1O+GE6aphsPlrsWCob2Yx+37ondNEMNnwH3YJCzai7SapL3hBUMntLUFC2rAP3VvitI7y8iA29tb75mMCR+BBEO0tQWIU+TEhbCMe5P2RqnFM2KSa41apb63f2EOm+zOlmA4V0l7+xdoMQNXxCDYOPh6enoaVcNskzBScmdkIddqnpH7G8sF75owx8UZGQg+N/0yRa2GFaaztTEm1odJJ2QA1gYlDAcMmR4eHmxf2+BwTbAoPbDc9Mtfv35RwrCQPpDtK0eizpsWjGQ6GpE521Zhmulc8Vo10TkZkMxzHFCL3C1YzxNXCT42/SKZ53jA4OJQvagSbFy2yLhrEnoCg4s1l8UKf1GuSf1t+sXe3uiqHm4tUGlA9sO2r31BaQilwZnpm0l74wKzH87x59/VP0bz/OfPH/IB3Hk/f/pZLHd9fR1kulJOsBcVdxQuLi4GqwliAgrQWIrCZOtXwjI9iLIK5MHFxySFL4TK4tRTVmOdWAEnFtyBW2WijdNMMZroXU82YFx/od6sPjg2E4UMhxjNZp9gKF2htKoPzjrujAWQ8u3bN6ffTKdTOj093TgXaZ5o18G4wTP8+VdY1rj41BTsyyUippMLs/T9+3fr71CgDA7IwcFB8T+cRNwY6tiqfGF1v22B/cgp1KISngKOh2OFjP6p0o2mkosFt/BXTD01kq9pACcCTpSrY4X5UtOkOBwozGfrq/iohZOF95G6ZII6Xqg2YqxhyqyTDGiwUCfYJHULsGyevBx+ibZwJRg3GiPgv8bl5WWQdmJkeORREqwv2UDydyhyAReC8b8LuQohSGYQfGpNsus7B0sny5ZFAhOoQ9W5BBkQ2Y8bF1e7EKx/DrKR8ai+p0oa1plP38VoGAvGJ1aC+0yRxV1ehW3NMRpTb0jTSsem4ACXYP1msp2fToBvf2ZUBLdxqvQG55xr3VofLsFtolx6d+NTizkE1y5d6RuosP74+LjxHmLNtvH3ycnJh9/YIDW81dAP5whRwBCIM7zSl514qjHNxuAEYxwn+8yNxkOjgAgbqr+xle+vfq9N4KZ6LICbAKHnUKmxeV+wEvz582cKCdnvbjQeSOJGqqqDfBet9DE7xj1eyJBqddar6fAgeNlxJ60BcqtkglyXUGa18VweotFGi3SiuM9vCPCchzUY1/xu1eBQTx9BX6Sb4bOzM6ewIZ7joIDz5PRvsBZt+kH9vH78+MH52YfvVc+5FwjLcpUQqxnqIlVtCrnoSzmwT1udrrqygcT0ovXAgi14URcU8Tm/zA1VWpet+TohSN3Y1RapMone6E0FUHHcptgxl+C6tUFNJNdVk/U95GRgXyXdIYOr0RbD0fLlLMiLLGZfqmgzvyvHgIXZhLmFF173OdJasF/M9OCYTd1NNaFQkrLh9H358mXDPGM4V53hAvA5vGUcD8fA8E3vBpR/4StRgZN4t6cuTFjqcfhKj6kLK7ZFNWDASF8xgpgaTORUbnANmGnfKUaMlYZFlqxysowDQ1+eYCiPEolyLg5aFy1SSQuMRWDrY+H7vtOeOB40/iiCjQNDX8T48sjRaPpkOkyyavg6AlUxE5hcZEo2gRPAwL5g8nFTNU3q4xwQWfv69WuQnDYGJ3gs/TrxHYPRxnxWXLTe77SBnknRFhwNRAOoY9VFr6rnou9PD7zYoB55h62KqIVOCqzzBTRcrB+XJyxzwmnhd3zCGCLl4FZpMG5lo0vm05NO6Abm0pXPUoPLSBZekCVk2fcsSEIzGFwsV5xuTDY8d9xpQk9gcPGqXlQJNrp6eF5uQhxgcDH/8I6wpM8C6XkMwwtzfdd6DLXWYGmzocFGL0oPMSb0D2b/u7bG+nShcZSvp8gk9A/GNOW88RPBqFOZzHT05nkj+qFr8BNZzHRa+DUcmCOZufFTeQfMTLfHUGuVkrCiV09kg2AUREuPi+1fmIVIJ8QgGBkexsU3Q6xX2nVhrENaEBfyy1e2vSUt7k+YztUdcSEYdaOTFvcntnXIK2TkAmFxtoCkxeGF2ffekSsEw9lKWhxemE8izakNBEOLfdXQSvJRptOpYGBGbSEYWpyeoRRGHCoJ5NQFgqHFyVT7F8awCLijrhClR21/EkQy1d5Er3RgQEY+IBjjYpiTNBHRXVBPhIkr8gVRRrcWtiOmx7x3E4d+d0FMsFb4rxK4zmzfC7XUdBeAXGyssWK2IXsRtUsJh6XtCymtth0UuXqZiAZco5I7+YawPNMQpoVGZhJjEMeqeTMKAbljaym59NBKd2EGMhQWwpfXXIXcKess4P0RURKGYLThWH7xLRS5mWB4z2ntEl/qVv4zyA2z7lYwkvCAFKq0SwutVei+rLMJwvKwDsCleAruXsxt4g4OVWI3NgGxuNYWFWrxg5xCQlg8Zxu5uDiQiju37gJVwexttAAdiC2aRngyy8bHmYkyYpI1fY5V9XqtKggKjSHFkzmuW6/YD/UspD6BheBYIID04paBH6xK+B5krKtDMEy0b1RrPdOItBWTLcwZIBNQCre/cKBgTDKERMxk45w8kQrAjgdZUWAz0ZncLCgCKDOOLgH1Nvp+WJcqgYilmy7dDwNzKWehTLL1kaKSZBTymFKEAOGIf6MAGQjvWgAFpFULqqCAGl6r9z1jSSWxcwoIDsG4MhTVymhEUM8VMpFdrbTjUSNtwIwMqoTfqDILIcF6KPDKVKMkuw/X/X0lGe0WeiW2FUQZ2VoIN8CBgDeOeoN5x32NEYglwFkdZLK81WO9RUkUtBknfaB9jKp5qmrPi815WO1rIuUHbQ9w/XMpt6H7WBtaERwCqzsccVcQndP4AFLh2qNKwn0sZjgagqtYkZ1TSfgxxdtfL6kkdA6JsW+NkmAdonTy0CXkUg5pGA1X3Q5is9DUeS/hxI4YBcF1EGUwPqOS+IPV6/3Ktg2Uh68qDqGg2JIYvkSsGC3BNoj/MyAyy1eX+DNWAm34Dxd+yzMyQx71AAAAAElFTkSuQmCC";
            var O = i("Sn4A"),
                L = i("hn13");
            const P = async () => {
                await A.a.resolve(B.b.TrustProtocol).init()
            }, z = async () => {
                await A.a.resolve(B.b.TrustProtocol).terminate()
            }, K = e => {
                if (!0 === (null == e ? void 0 : e.disable_keychain_enc) && A.a.resolve(B.b.TrustStorage).setEnableKeychainEnc(!1), null != e && e.enc_algorithm && "number" == typeof e.enc_algorithm) {
                    const r = {
                        1: L.a.SAFE_STORAGE,
                        2: L.a.AES_256_GCM,
                        3: L.a.NOISE_BITWISE
                    } [e.enc_algorithm] || null;
                    r && A.a.resolve(B.b.TrustStorage).setEncryptionAlgorithm(r)
                }
            }, Q = () => A.a.resolve(B.c.LinkingTrustService), j = async e => A.a.resolve(B.b.TrustStorage).TrustedIdentity.updateStatus(e, m.c.DORMANT);
            var U = i("lxK4");
            n.ModuleContainer.registerSingleton(Object(n.define)("key_sync"), class {
                constructor() {
                    this._deviceLinkingState = void 0, this._noiseIdOfQr1 = void 0, this._noiseIdOfQr2 = void 0, this.dataSubmitWaitingScan = void 0, this.serverConfig = void 0, this.dataSubmitWaitingScan = {
                        encLinkingMetaData: "",
                        encAccountSign: "",
                        encDeviceSign: "",
                        encPK: "",
                        _isDone: !1
                    }, this.serverConfig = {
                        self_g: !1,
                        qr_format_trust_device: !1,
                        logo_qr: !0
                    }, this._noiseIdOfQr1 = "", this._noiseIdOfQr2 = "", this._deviceLinkingState = null
                }
                clearDataSubmitWaitingScan() {
                    this.dataSubmitWaitingScan = {
                        encLinkingMetaData: "",
                        encAccountSign: "",
                        encDeviceSign: "",
                        encPK: "",
                        _isDone: !1
                    }, R.a.zsymb(0, "7zyiQy", "Clearing submitted data for polling scan")
                }
                mergeServerConfig(e) {
                    try {
                        e && Object.keys(this.serverConfig).forEach(((r, i) => {
                            const t = r;
                            var s;
                            t in e && (this.serverConfig[t] = null !== (s = e[t]) && void 0 !== s ? s : i)
                        })), R.a.zsymb(0, "d-NtH4", "Server configuration has merged completed")
                    } catch (r) {
                        R.a.zsymb(18, "Y9PoBp", "Failed to merge server configuration", r)
                    }
                }
                genUrlWaitingConfirm(e) {
                    return this.dataSubmitWaitingScan._isDone && (e += `&encLinkingMetaData=${encodeURIComponent(this.dataSubmitWaitingScan.encLinkingMetaData)}&encAccountSign=${encodeURIComponent(this.dataSubmitWaitingScan.encAccountSign)}&encDeviceSign=${encodeURIComponent(this.dataSubmitWaitingScan.encDeviceSign)}&encPK=${encodeURIComponent(this.dataSubmitWaitingScan.encPK)}`), e
                }
                isLinkingTrustDevice() {
                    return !!this._deviceLinkingState
                }
                async genFirstQR(e, r, i) {
                    try {
                        var t;
                        if (this._deviceLinkingState && (this._deviceLinkingState = null), !this.serverConfig.self_g) {
                            if (r) return R.a.zsymb(0, "7fXum3", "Gen QR1 old format (image base64)"), `data:image/png;base64,${r}`;
                            throw new Error("No data QR base64 and self_g is not allowed")
                        }
                        if (!this.serverConfig.qr_format_trust_device) {
                            if (i) return R.a.zsymb(0, "dPmuM3", "Gen QR1 old format (forced self-generation)"), T(e, this.serverConfig.logo_qr);
                            if (r) return R.a.zsymb(0, "HRIQQW", "Gen QR1 old format (image base64)"), `data:image/png;base64,${r}`;
                            throw new Error("No data for old QR and new QR format is not allowed")
                        }
                        if (this._deviceLinkingState = await Q().createLinkingState(), !this._deviceLinkingState) throw new Error("Failed to create device linking state");
                        R.a.zsymb(0, "y73gN9", `Gen QR1 new format with isRelink = ${this._deviceLinkingState.isRelink}`), this.clearDataSubmitWaitingScan(), this._noiseIdOfQr1 = null !== (t = this._deviceLinkingState.linkingUid) && void 0 !== t ? t : "";
                        const s = await this._deviceLinkingState.generateQr(e, Object(O.a)());
                        return R.a.zsymb(0, "c1994Q", `Generated QR1 new format: ${s}`), T(s, this.serverConfig.logo_qr)
                    } catch (s) {
                        throw R.a.zsymb(18, "ooDhq8", "Failed to generate QR with error: ", null != s && s.code ? `${s.code}: ${s.message}` : `${s}`), s
                    }
                }
                async genSecondQR(e, r, i, t, s, n) {
                    try {
                        var g, D, a;
                        if (n) return R.a.zsymb(0, "UEnGPK", "Generating second QR old format (forced self-generation)"), T(e, this.serverConfig.logo_qr);
                        if (r) return R.a.zsymb(0, "CQ5739", "Generating second QR old format (image base64)"), `data:image/png;base64,${r}`;
                        if (this.clearDataSubmitWaitingScan(), this._noiseIdOfQr2 = this._noiseIdOfQr1, R.a.zsymb(0, "68iNXd", `Generating second QR code new format with regenQr: ${i}; uid: ${t}; masterId: ${s}`), t && s && this._noiseIdOfQr1 === t && s === (null === (g = this._deviceLinkingState) || void 0 === g || null === (D = g.getLinkingInfo()) || void 0 === D ? void 0 : D.masterId)) {
                            if (R.a.zsymb(0, "u-ZmbK", "Generating second QR code new format with match uid and match masterId"), 1 === i) {
                                return T(await this._deviceLinkingState.generateQr(e, Object(O.a)()), this.serverConfig.logo_qr)
                            }
                            await Q().deleteLinkHistoryByUid(t)
                        }
                        this._deviceLinkingState = await Q().createLinkingState(s), this._noiseIdOfQr2 = null !== (a = this._deviceLinkingState.getLinkingInfo().uid) && void 0 !== a ? a : "";
                        const c = await this._deviceLinkingState.generateQr(e, Object(O.a)());
                        return R.a.zsymb(0, "EwpR-a", `Generated QR2 new format: ${c}`), T(c, this.serverConfig.logo_qr)
                    } catch (c) {
                        throw R.a.zsymb(18, "1yGEao", "Failed to generate QR code!", c), c
                    }
                }
                async verifyDataWaitingScan({
                    enc_link_data: e,
                    enc_link_hmac: r
                }) {
                    try {
                        if (e.length && r.length) {
                            if (!this._deviceLinkingState) throw "device linking state is corrupt, terminating flow";
                            const i = await this._deviceLinkingState.createCompanionLinkingProof(e, r);
                            this.dataSubmitWaitingScan = {
                                encLinkingMetaData: i.linkingMetadata,
                                encAccountSign: i.accountSignature,
                                encDeviceSign: i.deviceSignature,
                                encPK: this._deviceLinkingState.publicIdentityKey,
                                _isDone: !0
                            }, R.a.zsymb(0, "MtRJpQ", "Verification of waiting scan data was successful")
                        }
                    } catch (i) {
                        throw R.a.zsymb(18, "Afvj_L", "Error verifying data waiting for scan", i), i
                    }
                }
                async triggerClearRecordAfterQR2RelinkFailed() {
                    R.a.zsymb(18, "y0eO4w", "QR2 is error with code -21 from server, uid:", this._noiseIdOfQr2), U.b.LinkDevice.recordLinkDeviceFail(U.b.LinkDevice.FAILURE.PRIMARY_VERIFY_RELINK_FAIL, 0), this._noiseIdOfQr2 && await Q().deleteLinkHistoryByUid(this._noiseIdOfQr2)
                }
                async completeLinkingDevice(e, r) {
                    try {
                        var i, t;
                        if (!r || null !== (i = this._deviceLinkingState) && void 0 !== i && i.isRelink && r !== this._deviceLinkingState.getLinkingInfo().uid) throw new Error("-1--do not match uid from server and uid relink");
                        const s = await (null === (t = this._deviceLinkingState) || void 0 === t ? void 0 : t.completeDeviceLink(r, {
                            devices: e
                        }));
                        if (!0 !== (null == s ? void 0 : s.isSuccess)) throw new Error(`${null==s?void 0:s.errorCode}-- ${null==s?void 0:s.errorMessage}`);
                        R.a.zsymb(0, "tkMLCr", "complete linking device")
                    } catch (s) {
                        throw R.a.zsymb(18, "vATOaQ", "Failed to trust device list:", s), s
                    }
                }
            });
            i("tPRg"), i("dThN");
            var G = i("z0WU"),
                W = (i("XS0u"), i("q1tI")),
                q = i.n(W),
                H = i("i8i4"),
                V = i("Ff2n");

            function Y() {
                return G.default.getZaloClientID()
            }
            var X = i("VTBJ"),
                $ = i("IeCS"),
                J = i("/PY/"),
                Z = i("ro+J"),
                ee = i("J39W"),
                re = i("3xbP"),
                ie = i("T2pR"),
                te = i("Yi2m"),
                se = i("4prX"),
                ne = i("imka"),
                ge = i("Vp9m"),
                De = i("KwLe"),
                ae = i("nQja"),
                ce = i("f4Qu");
            var de = i("Enw1");
            const le = q.a.createContext({
                    token: ""
                }),
                he = () => q.a.useContext(le);
            var oe = i("iuhU");
            let ye = function(e) {
                    return e.Idle = "Idle", e.LoginQR = "LoginQR", e.LoginPhoneNumber = "LoginPhoneNumber", e.LoginEmail = "LoginEmail", e.ForgetPassword = "ForgetPassword", e.LoginSuccess = "LoginSuccess", e
                }({}),
                pe = function(e) {
                    return e.WaitingScan = "WaitingScan", e.TimeoutQR = "TimeoutQR", e.WaitingAccept = "WaitingAccept", e
                }({});
            const Ae = new Proxy({
                main_choose_login_qr: "[main][choose-login-qr]",
                main_choose_login_normal: "[main][choose-login-normal]",
                main_choose_login_email: "[main][choose-login-email]",
                main_forget_password: "[main][forget-password]",
                main_accepted_login: "[main][accepted-login]",
                qr_scaned: "[qr][scaned]",
                qr_timeout: "[qr][timeout]",
                qr_accepted_login: "[qr][accepted-login]",
                qr_regen_qr: "[qr][regen-qr]"
            }, {
                get: (e, r, i) => Reflect.get(e, r, i),
                set: () => !1
            });
            class Be {
                constructor() {
                    this.key = void 0, this.data = void 0, this.enterTime = void 0, this.exitTime = void 0, this.env = void 0
                }
            }
            class Ee {
                constructor() {
                    this.stateKey = void 0, this.parrent = void 0, this.children = void 0
                }
            }
            class xe extends Be {
                constructor(e, r, i, t) {
                    super(), this.key = e, this.scope = r, this.env = i, this.logger = t, this.data = void 0, this.enterTime = void 0, this.exitTime = void 0, this.data = null, this.enterTime = 0, this.exitTime = 0
                }
                _formatDateTime(e) {
                    return `${e.getFullYear()}-${(e.getMonth()+1).toString().padStart(2,"0")}-${e.getDate().toString().padStart(2,"0")}T${e.getHours().toString().padStart(2,"0")}:${e.getMinutes().toString().padStart(2,"0")}:${e.getSeconds().toString().padStart(2,"0")}.${e.getMilliseconds().toString().padStart(3,"0")}Z`
                }
                enter() {
                    var e;
                    this.enterTime = Date.now(), null === (e = this.logger) || void 0 === e || e.zsymb(0, "OdTW-t", `env="${this.env}" feature="login-v2" scope="${this.scope}" level="info" timestamp="${this._formatDateTime(new Date(this.enterTime))}" state="${this.key}" message="Enter"`)
                }
                exit() {
                    var e;
                    this.exitTime = Date.now(), null === (e = this.logger) || void 0 === e || e.zsymb(0, "_zGZ4J", `env="${this.env}" feature="login-v2" scope="${this.scope}" level="info" timestamp="${this._formatDateTime(new Date(this.exitTime))}" state="${this.key}" message="Exit"`)
                }
                error(...e) {
                    var r;
                    null === (r = this.logger) || void 0 === r || r.zsymb(18, "jyowvg", `env="${this.env}" feature="login-v2" scope="${this.scope}" level="error" timestamp="${this._formatDateTime(new Date)}" state="${this.key}" message="${e}"`)
                }
                noti(...e) {
                    var r;
                    null === (r = this.logger) || void 0 === r || r.zsymb(0, "Sl_-RZ", `env="${this.env}" feature="login-v2" scope="${this.scope}" level="warning" timestamp="${this._formatDateTime(new Date)}" state="${this.key}" message="${e}"`)
                }
            }
            class me extends Ee {
                constructor(e, r, i) {
                    super(), this.logger = i, this.stateKey = void 0, this.action = void 0, this.parrent = void 0, this.children = void 0, this.parrent = e, this.children = null, this.stateKey = pe.WaitingScan;
                    const t = {};
                    Object.keys(pe).forEach((e => {
                        t[pe[e]] = new xe(pe[e], "login-qr-screen", r, this.logger)
                    })), this.action = Object(X.a)({}, t)
                }
                get state() {
                    return this.action[this.stateKey]
                }
                transaction(e) {
                    this.action[this.stateKey].exit(), this.stateKey = e, this.action[this.stateKey].enter()
                }
                handler(e) {
                    let r = null;
                    switch (e) {
                        case Ae.qr_scaned:
                            this.stateKey === pe.WaitingScan && (r = pe.WaitingAccept);
                            break;
                        case Ae.qr_timeout:
                            this.stateKey !== pe.WaitingScan && this.stateKey !== pe.WaitingAccept || (r = pe.TimeoutQR);
                            break;
                        case Ae.qr_regen_qr:
                            this.stateKey === pe.TimeoutQR && (r = pe.WaitingScan);
                            break;
                        case Ae.qr_accepted_login:
                            var i;
                            if (this.stateKey === pe.WaitingAccept) r = pe.TimeoutQR, null === (i = this.parrent) || void 0 === i || i.handler(Ae.main_accepted_login)
                    }
                    if (r) return this.transaction(r), this.state;
                    throw Error("state or event can not be adapted")
                }
            }
            class ue extends Ee {
                constructor(e, r) {
                    super(), this.logger = r, this.stateKey = void 0, this.action = void 0, this.parrent = void 0, this.children = void 0;
                    const i = {};
                    Object.keys(ye).forEach((r => {
                        i[ye[r]] = new xe(ye[r], "login-screen", e, this.logger)
                    })), this.action = Object(X.a)({}, i), this.stateKey = ye.Idle, this.parrent = null, this.children = (new Map).set("LoginQRStateMachine", new me(this, e, r)), this.action[this.stateKey].enter()
                }
                transaction(e) {
                    this.action[this.stateKey].exit(), this.stateKey = e, this.action[this.stateKey].enter(), e === ye.LoginQR && this.loginQrState.state.enter()
                }
                get state() {
                    return this.action[this.stateKey]
                }
                get loginQrState() {
                    var e;
                    const r = null === (e = this.children) || void 0 === e ? void 0 : e.get("LoginQRStateMachine");
                    if (r && this.children) return r;
                    throw "This children haven't been init"
                }
                handler(e) {
                    let r = null;
                    switch (e) {
                        case Ae.main_choose_login_qr:
                            this.stateKey !== ye.Idle && this.stateKey !== ye.LoginPhoneNumber && this.stateKey !== ye.LoginEmail || (r = ye.LoginQR);
                            break;
                        case Ae.main_choose_login_normal:
                            this.stateKey !== ye.LoginQR && this.stateKey !== ye.LoginEmail && this.stateKey !== ye.ForgetPassword || (r = ye.LoginPhoneNumber);
                            break;
                        case Ae.main_choose_login_email:
                            this.stateKey !== ye.LoginQR && this.stateKey !== ye.LoginPhoneNumber && this.stateKey !== ye.ForgetPassword || (r = ye.LoginEmail);
                            break;
                        case Ae.main_forget_password:
                            this.stateKey === ye.LoginPhoneNumber && (r = ye.ForgetPassword);
                            break;
                        case Ae.main_accepted_login:
                            this.stateKey !== ye.ForgetPassword && this.stateKey !== ye.LoginPhoneNumber && this.stateKey !== ye.LoginEmail && this.loginQrState.state.key !== pe.WaitingAccept || (r = ye.LoginSuccess)
                    }
                    if (r) return this.transaction(r), this.state;
                    throw Error("state or event can not be adapted")
                }
            }
            class fe {
                constructor(e, r) {
                    this.fn = void 0, this.scheduler = void 0, this.deps = [], this.fn = e, this.scheduler = r
                }
                _cleanupEffect() {
                    this.deps.forEach((e => {
                        e.delete(this)
                    })), this.deps.length = 0
                }
                run() {
                    this._cleanupEffect(), fe.activeEffect = this;
                    const e = this.fn();
                    return fe.activeEffect = null, e
                }
            }

            function be(e, r) {
                const i = new fe(e, r);
                return i.run(), i
            }
            fe.activeEffect = null;
            const we = new WeakMap;

            function Ce(e, r) {
                if (!fe.activeEffect) return;
                let i = we.get(e);
                i || (i = new Map, we.set(e, i));
                let t = i.get(r);
                t || (t = new Set, i.set(r, t)), t.has(fe.activeEffect) || (t.add(fe.activeEffect), fe.activeEffect.deps.push(t))
            }
            const ke = new WeakMap;

            function _e(e) {
                if (ke.has(e)) return ke.get(e);
                const r = new Map,
                    i = new Proxy(e, {
                        get(e, i, t) {
                            if (r.has(i)) return Ce(e, i), r.get(i);
                            {
                                const s = Object.getOwnPropertyDescriptor(e, i);
                                let n = Reflect.get(e, i, s ? t : e);
                                return "function" == typeof n ? n = n.bind(e) : "object" == typeof n && null !== n && (n = _e(n)), r.set(i, n), Ce(e, i), n
                            }
                        },
                        set: (e, i, t, s) => (r.set(i, t), function(e, r) {
                            const i = we.get(e);
                            if (!i) return;
                            const t = i.get(r);
                            t && new Set(t).forEach((e => {
                                e.scheduler ? e.scheduler() : e.run()
                            }))
                        }(e, i), Reflect.set(e, i, t, s))
                    });
                return ke.set(e, i), i
            }

            function Fe(e) {
                let r, i = !0;
                const t = be((() => {
                    i && (r = e(), i = !1)
                }), (() => i = !0));
                return {
                    get value() {
                        return i && t.run(), Ce({
                            effectFn: t
                        }, "value"), r
                    }
                }
            }

            function ve(e) {
                const [, r] = Object(W.useState)({}), i = Object(W.useRef)(e), t = Object(W.useRef)(_e(i.current)).current;
                return Object(W.useEffect)((() => {
                    be((() => {
                        for (const e in i.current) t[e];
                        r({})
                    }))
                }), [t]), t
            }
            var Se = i("lCMA"),
                Ie = i("zRkS"),
                Re = i("NGyP"),
                Ne = i("iQAb"),
                Te = i("wudS");

            function Me() {
                const e = Object(Te.f)();
                return Array.isArray(e) ? e.join(",") : ""
            }
            const Oe = ({
                    data: e
                }) => q.a.createElement("div", {
                    style: {
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxSizing: "border-box",
                        gap: "16px"
                    }
                }, q.a.createElement(Re.a, {
                    size: "xxl",
                    target: Object(X.a)({}, e),
                    userId: Me()
                }), q.a.createElement(Ne.a, {
                    className: "truncate",
                    style: {
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "24px",
                        color: "var(--text-primary)"
                    }
                }, e.displayName), q.a.createElement(Se.a, {
                    textKey: "STR_LOGIN_QR_PAGE_AWAIT_ACCEPTED",
                    style: {
                        color: "var(--text-secondary)",
                        width: "90%",
                        textAlign: "center",
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 400
                    }
                })),
                Le = () => q.a.createElement("div", {
                    className: "instructions"
                }, q.a.createElement("span", {
                    key: "qr-login-guide-1",
                    style: {
                        display: "flex",
                        flexDirection: "row",
                        color: "var(--text-primary)",
                        width: "100%",
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 400,
                        alignItems: "center"
                    }
                }, "1.  ", q.a.createElement(Se.a, {
                    textKey: "STR_LOGIN_QR_PAGE_GUIDE_1",
                    tagName: "div"
                })), q.a.createElement("span", {
                    key: "qr-login-guide-2",
                    style: {
                        flexWrap: "wrap",
                        display: "flex",
                        flexDirection: "row",
                        color: "var(--text-primary)",
                        width: "100%",
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 400,
                        alignItems: "center"
                    }
                }, "2.  ", q.a.createElement(Se.a, {
                    textKey: "STR_LOGIN_QR_PAGE_GUIDE_2_1",
                    tagName: "div"
                }), q.a.createElement(Ie.a, {
                    icon: "qr_code_20",
                    style: {
                        fontSize: "20px",
                        width: "20px",
                        height: "20px",
                        marginTop: "2px",
                        marginLeft: "1px",
                        marginRight: "1px"
                    }
                }), q.a.createElement(Se.a, {
                    textKey: "STR_LOGIN_QR_PAGE_GUIDE_2_2",
                    tagName: "div"
                })), q.a.createElement("span", {
                    key: "qr-login-guide-3",
                    style: {
                        display: "flex",
                        flexDirection: "row",
                        color: "var(--text-primary)",
                        width: "100%",
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 400,
                        alignItems: "center"
                    }
                }, "3.  ", q.a.createElement(Se.a, {
                    textKey: "STR_LOGIN_QR_PAGE_GUIDE_3",
                    tagName: "div"
                }))),
                Pe = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0yNy43MjA3IDMuNTg0M0MzMC4wMDc3IDQuNDY2NjYgMzIuMDk4NiA1Ljc5MDgzIDMzLjg3MzkgNy40ODEyM0MzNS42NDkxIDkuMTcxNjMgMzcuMDc0MSAxMS4xOTUxIDM4LjA2NzQgMTMuNDM2MkMzOS4wNjA2IDE1LjY3NzMgMzkuNjAyNyAxOC4wOTIxIDM5LjY2MjggMjAuNTQyN0MzOS43MjI4IDIyLjk5MzMgMzkuMjk5NSAyNS40MzE4IDM4LjQxNzIgMjcuNzE4OEMzNy41MzQ4IDMwLjAwNTggMzYuMjEwNyAzMi4wOTY3IDM0LjUyMDMgMzMuODcyQzMyLjgyOTkgMzUuNjQ3MyAzMC44MDYzIDM3LjA3MjIgMjguNTY1MiAzOC4wNjU1QzI2LjMyNDIgMzkuMDU4NyAyMy45MDk0IDM5LjYwMDggMjEuNDU4OCAzOS42NjA5QzE5LjAwODIgMzkuNzIwOSAxNi41Njk3IDM5LjI5NzYgMTQuMjgyNyAzOC40MTUzQzExLjk5NTYgMzcuNTMyOSA5LjkwNDggMzYuMjA4OCA4LjEyOTUxIDM0LjUxODRDNi4zNTQyMyAzMi44MjggNC45MjkyOCAzMC44MDQ1IDMuOTM2MDIgMjguNTYzNEMyLjk0Mjc2IDI2LjMyMjMgMi40MDA2NCAyMy45MDc1IDIuMzQwNjIgMjEuNDU2OUMyLjI4MDU5IDE5LjAwNjMgMi43MDM4NCAxNi41Njc4IDMuNTg2MTkgMTQuMjgwOEM0LjQ2ODU1IDExLjk5MzggNS43OTI3MiA5LjkwMjkxIDcuNDgzMTIgOC4xMjc2MkM5LjE3MzUyIDYuMzUyMzQgMTEuMTk3IDQuOTI3MzkgMTMuNDM4MSAzLjkzNDEzQzE1LjY3OTIgMi45NDA4NyAxOC4wOTQgMi4zOTg3NSAyMC41NDQ2IDIuMzM4NzNDMjIuOTk1MiAyLjI3ODcgMjUuNDMzNyAyLjcwMTk1IDI3LjcyMDcgMy41ODQzTDI3LjcyMDcgMy41ODQzWiIKICAgICAgICAgICAgc3Ryb2tlPSIjQzdFMEZGIiBzdHJva2Utd2lkdGg9IjQiIC8+CgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0yNy43MjA3IDMuNTg0M0MzMS4zOTg1IDUuMDAzMjIgMzQuNTMyNyA3LjU1MDAyIDM2LjY3NCAxMC44NTk3QzM4LjgxNTQgMTQuMTY5NCAzOS44NTQxIDE4LjA3MiAzOS42NDExIDIyLjAwODMiCiAgICAgICAgICAgIHN0cm9rZT0iIzMzODRGRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CiAgICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0KICAgICAgICAgICAgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIgogICAgICAgICAgICBiZWdpbj0iMHMiCiAgICAgICAgICAgIGR1cj0iNjAwbXMiCiAgICAgICAgICAgIHR5cGU9InJvdGF0ZSIKICAgICAgICAgICAgZnJvbT0iMCAyMSAyMSIKICAgICAgICAgICAgdG89IjM2MCAyMSAyMSIKICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiCiAgICAgICAgLz4KCiAgICA8L2c+Cjwvc3ZnPg==";
            var ze = i("0goA");

            function Ke(e) {
                var r, i, t, s, n, g, D, a, c, d, l;
                return {
                    base64Qr: null !== (r = null == e ? void 0 : e.base64_qr) && void 0 !== r ? r : "",
                    chkWaitCfirm: null !== (i = null == e ? void 0 : e.chk_wait_cfirm) && void 0 !== i ? i : "",
                    chkWaitScan: null !== (t = null == e ? void 0 : e.chk_wait_scan) && void 0 !== t ? t : "",
                    qrRetry: null !== (s = null == e ? void 0 : e.qr_retry) && void 0 !== s ? s : 0,
                    qrTimeout: null !== (n = null == e ? void 0 : e.qr_timeout) && void 0 !== n ? n : 0,
                    tokenId: null !== (g = null == e ? void 0 : e.token_id) && void 0 !== g ? g : "",
                    ntk: null !== (D = null == e ? void 0 : e.ntk) && void 0 !== D ? D : "",
                    qrCnt: null !== (a = null == e ? void 0 : e.qr_cnt) && void 0 !== a ? a : "",
                    uid: null !== (c = null == e ? void 0 : e.uid) && void 0 !== c ? c : "",
                    masterId: null !== (d = null == e ? void 0 : e.master_id) && void 0 !== d ? d : "",
                    regenQr: null !== (l = null == e ? void 0 : e.regen_qr) && void 0 !== l ? l : 0
                }
            }

            function Qe(e) {
                var r, i, t, s, n, g;
                return {
                    avatar: null !== (r = null == e ? void 0 : e.avatar) && void 0 !== r ? r : "",
                    displayName: null !== (i = null == e ? void 0 : e.display_name) && void 0 !== i ? i : "",
                    link_data: {
                        enc_link_data: null !== (t = null == e || null === (s = e.link_data) || void 0 === s ? void 0 : s.enc_link_data) && void 0 !== t ? t : "",
                        enc_link_hmac: null !== (n = null == e || null === (g = e.link_data) || void 0 === g ? void 0 : g.enc_link_hmac) && void 0 !== n ? n : ""
                    }
                }
            }
            var je = i("c51z");
            const Ue = {
                    get: (e, r, i) => Reflect.get(e, r, i),
                    set: () => !1
                },
                Ge = new Proxy(je.a, Ue);
            i("Pszc"), i("4I9T");
            i("o30X"), i("BMoG");
            var We = i("fBUP"),
                qe = i("igA5"),
                He = i("1pet");
            const Ve = new Proxy(He, {
                get: (e, r, i) => Reflect.get(e, r, i),
                set: () => !1
            });

            function Ye() {
                return Ve
            }
            var Xe = i("X4fA");
            class $e {
                constructor(e) {
                    this.value = e, this._tag = "Left"
                }
            }
            class Je {
                constructor(e) {
                    this.value = e, this._tag = "Right"
                }
            }
            const Ze = e => new $e(e),
                er = e => new Je(e);
            class rr extends Error {
                constructor({
                    code: e = "STR_ERROR_UNKNOWN",
                    name: r = "ErrorApi",
                    message: i = "STR_ERROR_UNKNOWN",
                    data: t = null
                }) {
                    super(i), this.code = void 0, this.message = void 0, this.name = void 0, this.data = void 0, this.code = e, this.message = i, this.name = r, this.data = t
                }
            }

            function ir(e) {
                return 0 === (null == e ? void 0 : e.error_code) ? er(null == e ? void 0 : e.data) : Ze(new rr({
                    code: null == e ? void 0 : e.error_code,
                    message: (null == e ? void 0 : e.error_message_localize) || (null == e ? void 0 : e.error_message),
                    data: (null == e ? void 0 : e.data) || null
                }))
            }
            var tr = i("byBP"),
                sr = i("qguG");
            const nr = n.ModuleContainer.resolve(o.ZLoggerFactory).createZLogger(["login-v2"]);
            async function gr(e, r) {
                try {
                    var i;
                    !r && !(null === (i = Object(tr.a)()) || void 0 === i || !i.isLinkingTrustDevice()) ? await (async () => {
                        if (null == e || !e.devices) throw U.b.LinkDevice.recordLinkDeviceFail(U.b.LinkDevice.FAILURE.PRIMARY_DEVICE_LIST_INCOMPLETE, 0), nr.zsymb(18, "IaSXRJ", "Link device fail due to received invalid devices (NULL)"), new Error("Received device list NULL");
                        var r;
                        null != e && e.devices && null != e && e.uid && await (null === (r = Object(tr.a)()) || void 0 === r ? void 0 : r.completeLinkingDevice(e.devices, e.uid))
                    })() : await (async () => {
                        try {
                            const i = r ? "password" : "old QR";
                            nr.zsymb(0, "qAKP7V", `Login without trust (entry: ${i})`), null != e && e.uid && await Promise.race([j(e.uid), new Promise((__res) => setTimeout(() => __res(false), 5e3))]) && nr.zsymb(6, "rBxVfn", "Trust Identity has gone into dormancy mode")
                        } catch (i) {}
                    })()
                } catch (s) {
                    throw nr.zsymb(18, "TIi-yN", "link device error:", s), s
                }
                try {
                    var t;
                    if (null != e && e.zpw_kt) await Promise.race([Object(sr.c)({
                        encK: "",
                        refreshToken: null !== (t = null == e ? void 0 : e.zpw_kt) && void 0 !== t ? t : ""
                    }), new Promise(((e, r) => {
                        setTimeout((() => {
                            r(new Error("timeout save renew session data from login flow"))
                        }), 3e4)
                    }))])
                } catch (s) {
                    nr.zsymb(18, "Rrw-Ax", "handle data login success error:", s)
                }
            }
            async function* Dr(e, r, i) {
                for (let u = i; u > 0; u--) try {
                    var t, s, n, g, D, a;
                    const i = await We.default.getStatusQRCode(e, r);
                    if (200 === (null == i ? void 0 : i.status) && null != i && null !== (t = i.data) && void 0 !== t && t.data && 0 === (null == i || null === (s = i.data) || void 0 === s ? void 0 : s.error_code)) yield {
                        data: i.data.data,
                        error_code: i.data.error_code,
                        error_message: i.data.error_message
                    };
                    else if (200 === (null == i ? void 0 : i.status) && null != i && null !== (n = i.data) && void 0 !== n && n.data && -20 === (null == i || null === (g = i.data) || void 0 === g ? void 0 : g.error_code)) {
                        var c, d;
                        const e = Object(X.a)({}, i.data.data);
                        e.base64_qr = null !== (c = await (null === (d = Object(tr.a)()) || void 0 === d ? void 0 : d.genSecondQR(e.ntk || e.qr_cnt, e.base64_qr, e.regen_qr, null == e ? void 0 : e.uid, null == e ? void 0 : e.master_id, !(!e.qr_cnt || e.ntk)))) && void 0 !== c ? c : "", yield {
                            data: e,
                            error_code: i.data.error_code,
                            error_message: i.data.error_message
                        }
                    } else if (200 === (null == i ? void 0 : i.status) && -21 == (null == i || null === (D = i.data) || void 0 === D ? void 0 : D.error_code)) {
                        var l;
                        await (null === (l = Object(tr.a)()) || void 0 === l ? void 0 : l.triggerClearRecordAfterQR2RelinkFailed()), yield {
                            data: null,
                            error_code: i.data.error_code,
                            error_message: i.data.error_message
                        }
                    } else if (200 === (null == i ? void 0 : i.status) && 18010 === (null == i || null === (a = i.data) || void 0 === a ? void 0 : a.error_code)) {
                        var h, o, y;
                        yield {
                            data: (null == i || null === (h = i.data) || void 0 === h ? void 0 : h.data) || null,
                            error_code: (null == i || null === (o = i.data) || void 0 === o ? void 0 : o.error_code) || i.status,
                            error_message: (null == i || null === (y = i.data) || void 0 === y ? void 0 : y.error_message) || i.statusText
                        }
                    } else {
                        var p, A, B, E, x;
                        if (!(u - 1 > 0)) throw {
                            data: (null == i || null === (p = i.data) || void 0 === p ? void 0 : p.data) || null,
                            error_code: (null == i || null === (A = i.data) || void 0 === A ? void 0 : A.error_code) || (null == i || null === (B = i.data) || void 0 === B ? void 0 : B.error) || i.status,
                            error_message: (null == i || null === (E = i.data) || void 0 === E ? void 0 : E.error_message) || (null == i || null === (x = i.data) || void 0 === x ? void 0 : x.errorMsg) || i.statusText
                        };
                        yield null
                    }
                } catch (m) {
                    throw m instanceof Error && "Network Error" === m.message ? new rr({
                        code: "STR_CONNECTION_ERROR",
                        message: "STR_CONNECTION_ERROR",
                        name: "Network Error"
                    }) : 408 === m.error_code ? new rr({
                        code: "STR_LOGIN_QR_PAGE_QR_TIMEOUT_ERROR",
                        message: "STR_LOGIN_QR_PAGE_QR_TIMEOUT_ERROR",
                        name: "408"
                    }) : m
                }
            }
            i("yQh1");
            var ar = i("kEG/");
            const cr = {
                    get: (e, r, i) => Reflect.get(e, r, i),
                    set: () => !1
                },
                dr = new Proxy(ar.a, cr),
                lr = () => {
                    const e = he(),
                        r = Object(W.useRef)(null),
                        i = Object(W.useRef)(null),
                        t = ve({
                            loginQrStateKey: e.stateMachine.loginQrState.state.key,
                            qrData: Ke(),
                            previewInfo: Qe(),
                            qrGenLimit: !1,
                            countDownQRLimited: 89,
                            errorMessage: ""
                        }),
                        s = Fe((() => t.loginQrStateKey === pe.TimeoutQR || t.qrGenLimit)),
                        n = Fe((() => !(t.loginQrStateKey === pe.TimeoutQR || t.qrGenLimit || t.qrData.base64Qr)));
                    async function g() {
                        let r = !1;
                        try {
                            const i = await async function(e, r, i) {
                                try {
                                    var t, s;
                                    const d = await We.default.getQRCode(e, r, i, null !== (t = Object(tr.a)()) && void 0 !== t && t.serverConfig.self_g ? 1 : 0, null !== (s = Object(tr.a)()) && void 0 !== s && s.serverConfig.qr_format_trust_device ? 1 : 0),
                                        l = ir(null == d ? void 0 : d.data);
                                    if ("Right" === l._tag) {
                                        var n, g, D, a, c;
                                        const e = Ke(null == l ? void 0 : l.value),
                                            r = Object(X.a)({}, e);
                                        return r.base64Qr = null !== (n = await (null === (g = Object(tr.a)()) || void 0 === g ? void 0 : g.genFirstQR(null !== (D = Object(tr.a)()) && void 0 !== D && D.serverConfig.qr_format_trust_device ? e.tokenId : e.qrCnt, e.base64Qr, null !== (a = null === (c = Object(tr.a)()) || void 0 === c ? void 0 : c.serverConfig.self_g) && void 0 !== a && a))) && void 0 !== n ? n : "", r
                                    }
                                    throw l.value
                                } catch (d) {
                                    throw d instanceof Error && "Network Error" === d.message ? new rr({
                                        code: "STR_CONNECTION_ERROR",
                                        message: "STR_CONNECTION_ERROR",
                                        name: "Network Error"
                                    }) : d
                                }
                            }(Y(), Me(), Ge.getCurrentLanguageName());
                            e.stateMachine.loginQrState.state.noti("Get QR code successfully"), D(i), t.qrData = i, r = !0
                        } catch (n) {
                            if (e.stateMachine.loginQrState.state.error(`Get QR code failed : ${JSON.stringify(n)}`), n instanceof rr)
                                if ("string" == typeof(null == n ? void 0 : n.code)) t.errorMessage = Ge.str(n.code);
                                else if (n.code === dr.REQUEST_RATE_LIMIT_EXCEEDED) {
                                var i, s;
                                t.errorMessage = n.message;
                                let e = null !== (i = n.data) && void 0 !== i && i.time_left && "number" == typeof(null === (s = n.data) || void 0 === s ? void 0 : s.time_left) ? Math.round(n.data.time_left / 1e3) : 89;
                                e += 5 - e % 5, t.countDownQRLimited = e > 20 ? e : 20, t.qrGenLimit = !0
                            } else t.errorMessage = n.message;
                            else t.errorMessage = Ge.str("STR_ERROR_UNKNOWN");
                            e.loginSession.loginQrStateStream.next(e.stateMachine.loginQrState.handler(Ae.qr_timeout))
                        } finally {
                            e.loginSession.logInfoV2Stream.next({
                                type: 152402,
                                subType: 0,
                                data: {
                                    qr_status: r
                                }
                            })
                        }
                    }
                    async function D(r) {
                        try {
                            t.previewInfo = await async function(e, r, i) {
                                const t = Dr(e + `&lang=${Ge.getCurrentLanguageName().toLowerCase()||"vi"}`, r, i);
                                try {
                                    for await (const e of t) {
                                        if (null === e) continue;
                                        const r = ir(e);
                                        if ("Right" === r._tag) {
                                            var s;
                                            const e = Qe(r.value);
                                            return await (null === (s = Object(tr.a)()) || void 0 === s ? void 0 : s.verifyDataWaitingScan(e.link_data)), e
                                        }
                                        throw r.value
                                    }
                                } catch (n) {
                                    throw n
                                }
                                throw new rr({})
                            }(r.chkWaitScan, r.qrTimeout, r.qrRetry), e.stateMachine.loginQrState.state.noti("User scan QR successfully"), e.loginSession.loginQrStateStream.next(e.stateMachine.loginQrState.handler(Ae.qr_scaned))
                        } catch (i) {
                            if (i instanceof rr)
                                if ("string" == typeof(null == i ? void 0 : i.code)) t.errorMessage = Ge.str(i.code);
                                else {
                                    if (-20 === i.code) return t.qrData = Ke(i.data), D(t.qrData), void e.stateMachine.loginQrState.state.error("User scan first time successfully but renew QR code in multi layer QR login mode");
                                    i.code === dr.REQUEST_RATE_LIMIT_EXCEEDED ? (t.qrGenLimit = !0, t.errorMessage = i.message) : t.errorMessage = i.message
                                }
                            else t.errorMessage = Ge.str("STR_ERROR_UNKNOWN");
                            e.stateMachine.loginQrState.state.error(`Waiting scan QR failed : ${JSON.stringify(i)}`), e.loginSession.loginQrStateStream.next(e.stateMachine.loginQrState.handler(Ae.qr_timeout))
                        }
                    }

                    function a() {
                        e.stateMachine.loginQrState.state.noti("User regen new QR after it timeout"), e.loginSession.logInfoV2Stream.next({
                            type: 152405,
                            subType: 0,
                            data: {}
                        }), e.loginSession.loginQrStateStream.next(e.stateMachine.loginQrState.handler(Ae.qr_regen_qr))
                    }
                    async function c() {
                        try {
                            const r = await async function(e, r, i) {
                                var t;
                                const s = Dr((null === (t = Object(tr.a)()) || void 0 === t ? void 0 : t.genUrlWaitingConfirm(e)) || e, r, i);
                                try {
                                    for await (const e of s) {
                                        if (null === e) continue;
                                        const r = ir(e);
                                        if ("Right" === r._tag) {
                                            var n, g, D;
                                            const e = r.value,
                                                i = qe.default.getInstance(),
                                                t = null !== (n = null == e ? void 0 : e.uid) && void 0 !== n ? n : "",
                                                s = null !== (g = null == e ? void 0 : e.dkey) && void 0 !== g ? g : "";
                                            if (t && s) {
                                                const e = Object(Te.c)(t);
                                                i.init(t, s), e || i.setItemForCurrentUser(Ye().FirstLoginLocalStorageKeys.IS_FIRST_LOGIN, "1")
                                            }
                                            G.default.extractPhoneInfoAndSaveRecent(e.profile.phonenum) || (i.removeItem(G.RECENT_PHONE), i.removeItem(G.RECENT_COUNTRY));
                                            const a = !!e.needSyncMsg || !!e.sync_msg_info;
                                            return i.setItem("z_needSyncMsg", a ? "1" : ""), i.setItem(Ye().KEY_REMEMBER, Xe.a.getValueRememberLogin() ? "1" : ""), i.setItem(Ye().KEY_SET_VALUE_ACTION_LOG, `${Xe.a.getValueActionLogRemember()}`), null != e && e.cptch_cert && i.setItem("captcha_cert", e.cptch_cert), i.setItem("FORCE_GET_FRIEND_LIST", "1"), await $zelectron.setAppCookie(null !== (D = null == e ? void 0 : e.zpw_sek) && void 0 !== D ? D : ""), await gr(e), t
                                        }
                                        throw r.value
                                    }
                                } catch (a) {
                                    throw a
                                }
                                throw new rr({})
                            }(t.qrData.chkWaitCfirm, t.qrData.qrTimeout, t.qrData.qrRetry);
                            e.stateMachine.loginQrState.state.noti("User accept to login QR on mobile"), e.loginSession.loginQrStateStream.next(e.stateMachine.loginQrState.handler(Ae.qr_accepted_login)), e.stateMachine.state.data = {
                                typeLogin: Ye().LOGIN_TYPE_QR
                            }, e.loginSession.loginStateStream.next(e.stateMachine.state), e.loginSession.logInfoV2Stream.next({
                                type: 152404,
                                subType: 0,
                                data: {
                                    authentication_status: !0,
                                    login_method: "qr",
                                    uid: r
                                }
                            })
                        } catch (r) {
                            e.stateMachine.loginQrState.state.error(`Waiting confirm login QR from mobile failed: ${JSON.stringify(r)}`), r instanceof rr ? "string" == typeof(null == r ? void 0 : r.code) ? t.errorMessage = Ge.str(r.code) : t.errorMessage = r.message : t.errorMessage = Ge.str("STR_ERROR_UNKNOWN"), e.loginSession.loginQrStateStream.next(e.stateMachine.loginQrState.handler(Ae.qr_timeout)), e.loginSession.logInfoV2Stream.next({
                                type: 152404,
                                subType: 0,
                                data: {
                                    authentication_status: !1,
                                    login_method: "qr",
                                    error_code: (null == r ? void 0 : r.code) || (null == r ? void 0 : r.error_code) || r
                                }
                            })
                        }
                    }
                    return Object(W.useEffect)((() => {
                        e.loginSession.loginQrStateStream.subscribe((e => {
                            e && (t.loginQrStateKey = e.key)
                        })), e.loginSession.loginStateStream.subscribe((r => {
                            if (r && r.key === ye.LoginPhoneNumber && t.loginQrStateKey === pe.WaitingScan && t.errorMessage && (t.errorMessage = ""), r && t.loginQrStateKey === pe.TimeoutQR && !t.qrGenLimit && r.key === ye.LoginQR) a();
                            else if (r && r.key === ye.LoginQR && !t.qrGenLimit && t.loginQrStateKey === pe.WaitingScan) {
                                var i, s, n;
                                if (null !== (i = r.data) && void 0 !== i && i.error_from_login_password) t.errorMessage = null !== (s = null === (n = Object(X.a)({}, r.data)) || void 0 === n ? void 0 : n.error_from_login_password) && void 0 !== s ? s : "", e.stateMachine.state.data = null
                            }
                        }))
                    }), []), Object(W.useEffect)((() => {
                        if (t.loginQrStateKey === pe.WaitingScan) {
                            var r, i, s;
                            if (null !== (r = e.stateMachine.state.data) && void 0 !== r && r.error_from_login_password) t.errorMessage = null !== (i = null === (s = Object(X.a)({}, e.stateMachine.state.data)) || void 0 === s ? void 0 : s.error_from_login_password) && void 0 !== i ? i : "", e.stateMachine.state.data = null;
                            else t.errorMessage = "";
                            g()
                        } else t.loginQrStateKey === pe.WaitingAccept ? c() : t.loginQrStateKey === pe.TimeoutQR && (t.previewInfo = Qe(), t.qrData = Ke())
                    }), [t.loginQrStateKey]), Object(W.useEffect)((() => {
                        if (t.qrGenLimit) {
                            i.current = window.setInterval((() => {
                                t.countDownQRLimited > 0 && t.countDownQRLimited--
                            }), 1e3);
                            const e = t.countDownQRLimited;
                            r.current = window.setTimeout((() => {
                                t.qrGenLimit = !1, t.countDownQRLimited = 89, a(), r.current && window.clearTimeout(r.current), i.current && window.clearTimeout(i.current)
                            }), 1e3 * e)
                        }
                        return () => {
                            r.current && window.clearTimeout(r.current), i.current && window.clearTimeout(i.current)
                        }
                    }), [t.qrGenLimit]), q.a.createElement(W.Fragment, null, q.a.createElement("div", {
                        className: "login-qr-page",
                        style: {
                            gap: t.loginQrStateKey === pe.WaitingAccept ? "60px" : void 0
                        }
                    }, q.a.createElement("div", {
                        className: "title"
                    }, q.a.createElement("img", {
                        draggable: !1,
                        src: ze.a,
                        style: {
                            height: "32px",
                            alignSelf: "center"
                        }
                    }), q.a.createElement(Se.a, {
                        textKey: "STR_LOGIN_QR_PAGE_TITLE",
                        style: {
                            margin: "0",
                            color: "var(--text-primary)",
                            fontSize: "18px",
                            lineHeight: "24px",
                            fontWeight: 600,
                            alignSelf: "center"
                        },
                        tagName: "div"
                    })), q.a.createElement("div", {
                        className: "qr-scan"
                    }, t.loginQrStateKey !== pe.WaitingAccept && q.a.createElement(q.a.Fragment, null, q.a.createElement("div", {
                        className: "login-qr__frame-qr"
                    }, q.a.createElement("img", {
                        draggable: !1,
                        className: "qr-image" + (s.value && !n.value ? "--none" : ""),
                        src: s.value ? "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20fill%3D%22white%22%20width%3D%222640%22%20height%3D%222640%22%20viewBox%3D%220%200%202640%202640%22%20shape-rendering%3D%22geometricPrecision%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22white%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%2248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%2296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22144%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22192%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22240%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22288%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22336%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22384%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%22432%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22480%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%22528%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%22576%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22624%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22672%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%22720%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22768%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22816%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%22864%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%22912%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%22960%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221008%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221056%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221104%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221152%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221200%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221248%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221296%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221344%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221392%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221440%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221488%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221536%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%221584%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221632%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221680%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221728%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221776%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221824%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%221872%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%221920%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%221968%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222016%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2248%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22240%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22288%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%222064%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%2296%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22144%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%222112%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22192%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22336%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22384%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221968%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%222160%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%222208%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%222256%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221056%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222304%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22528%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221296%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221776%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%222352%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22432%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%222400%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221104%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221200%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221344%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221920%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222256%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222304%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222544%22%20y%3D%222448%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22624%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22816%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22960%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221536%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221872%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222112%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222160%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%222496%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22480%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22576%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22672%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22720%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22768%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22864%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%22912%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221008%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221152%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221248%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221392%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221440%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221488%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221584%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221632%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221680%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221728%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%221824%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222016%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222064%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222208%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222352%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222400%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222448%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20style%3D%22fill%3Ablack%3B%20shape-rendering%3A%20crispEdges%3B%20image-rendering%3A%20crisp-edges%3B%22%20x%3D%222496%22%20y%3D%222544%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%220%22%20ry%3D%220%22%2F%3E%3Crect%20rx%3D%2267%22%20ry%3D%2267%22%20x%3D%2248%22%20y%3D%2248%22%20width%3D%22336%22%20height%3D%22336%22%20fill%3D%22black%22%20style%3D%22fill%3Ablack%3B%22%2F%3E%3Crect%20rx%3D%2248%22%20ry%3D%2248%22%20x%3D%2296%22%20y%3D%2296%22%20width%3D%22240%22%20height%3D%22240%22%20fill%3D%22white%22%20style%3D%22fill%3Awhite%3B%22%2F%3E%3Crect%20rx%3D%2229%22%20ry%3D%2229%22%20x%3D%22144%22%20y%3D%22144%22%20width%3D%22144%22%20height%3D%22144%22%20fill%3D%22%23005AE0%22%20style%3D%22fill%3A%23005AE0%3B%22%2F%3E%3Crect%20rx%3D%2267%22%20ry%3D%2267%22%20x%3D%222256%22%20y%3D%2248%22%20width%3D%22336%22%20height%3D%22336%22%20fill%3D%22black%22%20style%3D%22fill%3Ablack%3B%22%2F%3E%3Crect%20rx%3D%2248%22%20ry%3D%2248%22%20x%3D%222304%22%20y%3D%2296%22%20width%3D%22240%22%20height%3D%22240%22%20fill%3D%22white%22%20style%3D%22fill%3Awhite%3B%22%2F%3E%3Crect%20rx%3D%2229%22%20ry%3D%2229%22%20x%3D%222352%22%20y%3D%22144%22%20width%3D%22144%22%20height%3D%22144%22%20fill%3D%22%23005AE0%22%20style%3D%22fill%3A%23005AE0%3B%22%2F%3E%3Crect%20rx%3D%2267%22%20ry%3D%2267%22%20x%3D%2248%22%20y%3D%222256%22%20width%3D%22336%22%20height%3D%22336%22%20fill%3D%22black%22%20style%3D%22fill%3Ablack%3B%22%2F%3E%3Crect%20rx%3D%2248%22%20ry%3D%2248%22%20x%3D%2296%22%20y%3D%222304%22%20width%3D%22240%22%20height%3D%22240%22%20fill%3D%22white%22%20style%3D%22fill%3Awhite%3B%22%2F%3E%3Crect%20rx%3D%2229%22%20ry%3D%2229%22%20x%3D%22144%22%20y%3D%222352%22%20width%3D%22144%22%20height%3D%22144%22%20fill%3D%22%23005AE0%22%20style%3D%22fill%3A%23005AE0%3B%22%2F%3E%3Cimage%20%0A%09%09x%3D%22984%22%20%0A%09%09y%3D%22984%22%20%0A%09%09width%3D%22672%22%20%0A%09%09height%3D%22672%22%20%0A%09%09href%3D%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAH8AAAB6CAYAAACWcIygAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAuFSURBVHgB7V39Vds%2BFFV6fv%2BXTkA2IJ2AdALSCUgnKJ2AdALoBKETABMkTABMkHQCYAL9dGPLR7xItvwlS%2BHdcy5OghPZvtLT09fTSBwgpJRjdThSnORH8HN%2BBMaOr27z46viW37c6uNoNNqKA8JIJAwlMsQFT0Qm6ES4he0KTyLLDDg%2BiCxTPIkEkYz4Smhdks%2Fyoy7VsWAtsgxxj6PKEK8ickQtvhJ8qg6nitOcXthut%2BL19bU4%2Fvv3b3cEAfO1ifF4vDseHR3teHx8XLyeTCa7Yw2sRZYR1rFahujENwSfiwoTDnGfnp7E8%2FNz8VoL3gcgPjIIiMxwcnKyO%2BpMU3apineKf1OtInoDTLriheJKluDx8VFeX1%2FL2WwmlRASX42BuBZcE64N11gBnDDPndKPCzhsileKL7an9PLyIpfLpZzP51GJXUVlCXbXfHNzs7uHEiw%2FXCaAaXeVci34dDpNSvAywiogI3zoTIAbdIm%2BWq3kxcXFwQhuI%2B4NFmGz2XycTCCzOv3KJTpKuUhMyLbEPZdYg%2BVBZAJ1EzNpqdM%2FquiU8A8cmWCjOBcpIi%2FtKxbdPxPc3t6mbwVk5tBt3mVjVc%2Bx6NV0%2BAT4YCpih7rIS3rlaP8esiPXNfGs8MwsuBQxIjfzSy7t3RHPzmIFrkRMyIV%2FpHU76jGR2AOPjXiGeJYEeNbDD2rZhIfJEok95Ni5WCziygA24XGRItEHHDujygCSNOVY%2BEEywEqEhiQ9diz8oBkgnBMoSXOOhY8iA1yIviGzwZkC7NwNR0tfwET0BZk5eBudEtqgTS%2Bc2Q3J5JFNbw6gNDpxIDy344cnNCATRrqv%2F2U2OlcAfdBdXDyzPTFZhGAquoRp7jHTpqsLZ3ZDMiLYnfmXhnfP5j5OYjCImP%2BFaIvcu9%2BwuY%2BfmAZn4KV16adOXt83wGxH4v0vRFNI0qbnUh8%2FMQzcSek3Sz2GFUPdALMdyRDwQtRFXuoLDwLNiZA3wGzO1qVfZkuKuK5PlK1KP3v4aZN6%2FsIXMpt9y6U%2BYVra%2FVNB8EnYca5frNdrwUgPWKb%2B9%2B9f86Pzyi%2FJbOSuyDKTySSJnM7cZ23Hz3T00GEQy40wm5E4fnNhwGb2z%2FQLYjYYCeLh4cF8e1p6Mpv8wyI09PL62cs%2FTJJVP1ORg5r9mX7BXv7h4P7%2B3nxbaEzFP3F8gZEwSEEuNC5CseXNgKJO%2BPLlS28hzRhhgRByqsPH%2FOgLgkSaJb%2BY9ot4diz84QBaQlMDO62d4jMOCwhUaWBP%2FFPHiYwDACnQu3r%2FP%2BODsePETqDDlnaNEK0S27WnVjWS5zR990%2BzIdhHCBXL2rLWCNUXYbv21GYwQ1MT0PxTLnySzh47pf7QUcg1kH91nX9knpQK2DGtB%2Brxa%2FGLkp%2BKs4dM%2Bvv3b8Hwx9vbm%2Fl2rB2%2B3kv%2Bzc1NI%2BcMHRTL5XJvo4Pv37%2B%2FM2OMapDnVYg%2FdpzQacJNftsmPEq8b0bSu2SY3jquI9TYBdKfTqe7azDThwkOXW2R5%2F9591casXViipt3eXm552X7BoPAfWDxoivevQ7tDq8d09LRctCkaxSaePtI3xJCba%2B1EnJyLFnNu4pWfMuy493D8mmGXl1dyTqgu2PQJmRd8eumH2rxKxnbf9Tib3xuKhRxDTTypM8DQsbw2ObES4ym4sOaNE2z72eP3zeTdM3eHQyoI5W53OtR%2B%2FHjR6XPAP%2FArFtN0HZuH1AlXigzbv2f9jNc9TzuF%2Fddcwev9jCzg%2Bgx5%2FnQFnbcJ9rXz58%2FrSVKb9linlux0UGjko%2B62wbcD00f38Vv2vyRvgNfmIhKfJuD5%2FMwYO5tW5dUOVOuLucm4tvSr8q0tuoN6NPvIlrHIb6t5Pg6eLbvYrmST7q20OZ1xSfz472EL%2Ftun%2BHtiNbDi2%2BJKFXLAaJNqjoDPpZlTbXFpxkIv1fHeaNVXZ8DViYGd%2Fhcjs6vX7%2B8HTTq5P3580f4Ao5g2%2FmK2FnTBObK13Eu6foIPJMQjt%2Fg4sNDp549evDu7u6EL%2BiDqttz1ranrY%2F0Q4q%2F1R%2F0MeHCBeXg7bo%2BTWAMQJlZ0Qahm0tt0wt1vUTb18FKvmqa7YkMUwlzXxfUxNbNwNRs1wUtua6%2BBhds1xtgaL0Qv0gpRC7EzVLhcbPfvn1rdNNU%2FLOzM1EH1PrUBbZoN3F6elrrOdLr7WsncFfJDya%2By8Hz6cFzgTpsEFM19by%2Bi6qnbVVH%2FRPcG37XB7hW2isYaMQx01x5%2FUV3V9%2BjTLa%2B97bx%2Bm3NNbyv6ixx9Qo26eSxjeCh06osfQy02Dp5%2BurjJ%2F0hd1r8oqHq2znShLYePLRxu%2FhtEoOmgB62Nc%2FVw70uNBHf1lmj07d179qehT6%2Fr%2BdP7uNai3%2FRd%2BKuvu82oCKVjZ%2FDEuD8iv3srb%2FrO6rn2AjxXfolO2h792g2Jbm%2BCy1%2BMXiu6q9eEi676aagIsUwpFuWAarS7HtIlxSOmXb4irZK22aPDXCA%2Bug%2FoB6xbjHU6eEDunSw4GjWnViK9L9%2B%2Fdr7kDNxsre7vzILwlSga9NDJhF0hjJHEc5UWb0OM4xSimujo4K05Nvq86pSqrdGL6tmQu8obgK6m0u0NyKfyIlc2OXkQj2JsktYVp6Wpg3itZ5IShenmEuybL9Nl2zVsRZ6AifS15NK8P2QaySQvqoS9dun0Wj0tfinDNjcY4anrZlndu8WWb3rUsoYHkTTndZW8dE9yTgsEE3X%2BMNhWT4AKsOy4I1g03%2BQoCY%2F13pvMkcRrnE2mwnGYYBo%2BWA9SXIQxoMk6fWcChskibjN%2B%2BelT9rBJgy8M%2Fu03netPmGkA2Ly3018sE3jKqaScpMvfZyfn5tv70pPlrzZwsGafEk2W9gr%2BdT0s9efLshUsnvdxCuF6fVjVEokluOZGckcCv9SLHlDxaRJBnI2og7UF4rpK7yVanoks3b8pjJrUMcvplg9zHJaJp%2BMRV1IY1Yvl%2F50SEr9UjSBJFuoc%2BmPn52Ueg1pzPDh0h8%2FiYe%2FFG0gyVbqPMUrXlrWRoxFW5ieP9r9fS4sYDajJb7PQnSB3PMvfhlBBvu4AWZzkvh%2F0Kq7FbfSWNXDzl9ctEQrnYuuoX60WAURKmQos5wWc78UfYCaf%2Fb%2Bhydp0286cfJckMagD8DO33C0LPPufwhWGlG6uekXjfALEQKSl3YNyvPzcyr8rWiAptG4PgvGIMC0LISrM4CJNz9EKJhOHzf5Bi3xm14dPAqVWLFdA8%2FyCUdLHR9WeEAluNSp9x0bnpmFmrHs3jGI8DzEG5COUG0r2WXXrS8kd%2FAEoyNUWxY%2BLTRUwu%2Buhrt2%2ByGsqSWiGIbU52IIUOGbRMxE3YVAiRgR5IyzTzwTx85cq%2BD1uwat5xFhStTMyRCcRqWyRcb8iEShgIm3RO3CB%2FVm3XYNaQzlwhyJihuBk4ISDnF9ol1%2B1EyAe7YVihy3IUr7qOoEmQ0WFN2HCCFmi29PQ5U5gN4oLBma0n%2FgdxE8sc4OGykCYdlsm0zkWCv%2BHo1GaxEDJBnGbQBkbUwBnxq%2FiclmK9vJaNrAGhzSAlFX1WdgJV1BE4aGzOr9jfQDzlvKLJjzpOJ3MTx84%2FyhPCOk2J%2BgBa%2BIObwaUvRKs28iF3OsSDsZtjlfvVaC7v%2FuWB0WiqfC2M7dhI6KiY0VcAy1BboPzCif2DVDR9t0AM8HwYGvmzyrLlFL%2FBDIS8JcEXuPlPZk6b1psc2J3o%2B%2B7%2FBxptDHx8e7uttjKzRcFIJe3EVTn4sIxTdhZASnRaDQsW21pXh7e9u9phsp6880TGdVv8YRAuuo4R4im9iKLAxKVIKbiFp8E3nVMM2JuPCxBQrcisxbR6iztRJ8KyJHMuJTyGxwY5ITlkG%2F73vQA%2BZiK7Jm63N%2BfBq6%2Fm6CZMV3wcgUOI7z43H%2B77Fx6pF4n1G2ltfYM%2B01J0TepiiyC%2F8D9bOT%2F3ud1tgAAAAASUVORK5CYII%3D%22%20%0A%09%09preserveAspectRatio%3D%22xMidYMid%20slice%22%0A%09%09%2F%3E%3C%2Fsvg%3E" : t.qrData.base64Qr ? t.qrData.base64Qr : Pe,
                        alt: "QR Code"
                    }), q.a.createElement("div", {
                        className: "mask" + (s.value ? "" : "--none"),
                        style: {
                            fontSize: "13px",
                            lineHeight: "17px",
                            fontWeight: 400,
                            alignSelf: "center",
                            color: "var(--text-primary)",
                            cursor: t.qrGenLimit ? "not-allowed" : "pointer"
                        },
                        onClick: e => {
                            e.stopPropagation(), !t.qrGenLimit && s.value && a()
                        }
                    }, q.a.createElement(Ie.a, {
                        style: {
                            fontSize: "var(--f32)",
                            color: t.qrGenLimit ? "var(--icon-warning)" : "var(--icon-information)"
                        },
                        icon: t.qrGenLimit ? "TriangleWarning_24_Filled" : "Retry_24_Line"
                    }), q.a.createElement(Se.a, {
                        textKey: t.qrGenLimit ? "STR_QR_LIMIT_REACHED" : "STR_LOGIN_QR_PAGE_RETRY_GET_QR"
                    }))), q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "70%",
                            height: "fit-content",
                            minHeight: "20px",
                            alignItems: "center"
                        }
                    }, q.a.createElement(Se.a, {
                        textKey: `${t.errorMessage}`,
                        tagName: "div",
                        className: "login-error-message" + (t.errorMessage ? "" : "--none"),
                        style: {
                            textAlign: "center"
                        }
                    }), q.a.createElement(Se.a, {
                        textKey: "STR_LOGIN_QR_PAGE_QR_TIMEOUT_ERROR",
                        tagName: "div",
                        className: "login-error-message" + (!s.value || t.qrGenLimit || t.errorMessage ? "--none" : "")
                    }), q.a.createElement(Se.a, {
                        textKey: "STR_LOGIN_QR_PAGE_QR_LIMITED_ERROR",
                        textArguments: [`${t.countDownQRLimited}`],
                        tagName: "div",
                        className: "login-error-message" + (s.value && t.qrGenLimit && !t.errorMessage ? "" : "--none")
                    })), t.loginQrStateKey !== pe.WaitingAccept && q.a.createElement(Le, null)), t.loginQrStateKey === pe.WaitingAccept && q.a.createElement(Oe, {
                        data: t.previewInfo
                    }))))
                };
            var hr = i("v/qp"),
                or = i("Ja3U"),
                yr = i("XnQq");
            const pr = {
                    get: (e, r, i) => Reflect.get(e, r, i),
                    set: (e, r, i) => Reflect.set(e, r, i)
                },
                Ar = new Proxy(qe.default.getInstance(), pr);

            function Br() {
                return Ar
            }
            var Er = i("FInY");
            var xr = i("wx14"),
                mr = i("1ZEA");
            i("Q8hM"), i("xjxT");
            const ur = e => {
                const {
                    domRef: r,
                    onKeyPress: i,
                    className: t,
                    style: s,
                    borderMode: n,
                    needVerify: g = !1,
                    compareValue: D = null,
                    rules: a = []
                } = e, [c, d] = q.a.useState(!1), [l, h] = q.a.useState(!1), [o, y] = q.a.useState(!1), [p, A] = q.a.useState("");
                return q.a.useEffect((() => {
                    y(G.default.checkValidPassword(p, D || "", a))
                }), [D]), q.a.createElement("div", {
                    className: "rel z-input flx-1 flx-al-c " + (t || "") + (n ? " border-mode " : ""),
                    style: s,
                    onClick: () => {
                        r && r.focus()
                    }
                }, q.a.createElement(mr.a, Object(xr.a)({}, e, {
                    required: !0,
                    type: c ? "text" : "password",
                    maxLength: "100",
                    onKeyDown: function(e) {
                        if (e) {
                            let r = e.getModifierState("CapsLock");
                            r !== l && h(r)
                        }
                        i && i(e)
                    },
                    onChange: function(r) {
                        var i;
                        e.onChange && e.onChange(r);
                        let t = null == r || null === (i = r.target) || void 0 === i ? void 0 : i.value;
                        y(G.default.checkValidPassword(t, D || "", a)), A(t)
                    },
                    style: {
                        height: "20px",
                        padding: 0,
                        marginRight: "32px"
                    }
                })), !1, o && g ? q.a.createElement(Ie.a, {
                    className: "icon-solid-checked check-pw-icon "
                }) : null, q.a.createElement(Ie.a, {
                    icon: c ? "Eye_Off_24_Line" : "Eye_On_24_Line",
                    className: "toggle-pw-visiblity",
                    style: {
                        width: "24px",
                        height: "24px",
                        fontSize: "24px",
                        position: "absolute",
                        right: "0px",
                        top: "6px"
                    },
                    onClick: e => {
                        e && (e.stopPropagation(), e.preventDefault()), d(!c)
                    }
                }))
            };
            i("Xu+P");
            async function fr() {
                try {
                    const g = await We.default.getLoginCaptcha(Y()),
                        D = ir(null == g ? void 0 : g.data);
                    var e, r, i, t, s, n;
                    if ("Right" === D._tag) return {
                        captchaImg: null !== (e = null == D || null === (r = D.value) || void 0 === r ? void 0 : r.captcha_img) && void 0 !== e ? e : "",
                        expirationTime: null !== (i = null == D || null === (t = D.value) || void 0 === t ? void 0 : t.expiration_time) && void 0 !== i ? i : 0,
                        token: null !== (s = null == D || null === (n = D.value) || void 0 === n ? void 0 : n.token) && void 0 !== s ? s : ""
                    };
                    throw D.value
                } catch (g) {
                    if (g instanceof Error && "Network Error" === g.message) throw new rr({
                        code: "STR_CONNECTION_ERROR",
                        message: "STR_CONNECTION_ERROR",
                        name: "Network Error"
                    });
                    throw g
                }
            }
            const br = ({
                onEnter: e,
                onChangeCaptcha: r,
                isReset: i,
                isInit: t
            }) => {
                const s = Object(W.useRef)(null),
                    n = Object(W.useRef)(null),
                    g = Object(W.useRef)(Number.MAX_SAFE_INTEGER - 1),
                    D = Object(W.useRef)(1),
                    a = he(),
                    c = ve({
                        captcha: {
                            captchaImg: "",
                            expirationTime: 0,
                            token: ""
                        },
                        isLoading: !0
                    }),
                    d = Object(W.useCallback)((async () => {
                        if (null === n.current) try {
                            c.isLoading = !0;
                            const e = await fr();
                            a.stateMachine.state.noti("Get Captcha successfully"), s.current.value = "", r("", ""), c.captcha.captchaImg = "data:image/png;base64," + e.captchaImg, c.captcha.token = e.token, c.captcha.expirationTime = e.expirationTime, n.current = window.setInterval((() => {
                                var e, r;
                                c.captcha.expirationTime > 0 ? c.captcha.expirationTime -= 1 : (null !== n.current && window.clearInterval(n.current), n.current = null, g.current = Number.MAX_SAFE_INTEGER - 1, ("" !== (null == s || null === (e = s.current) || void 0 === e ? void 0 : e.value) || D.current > 0) && (D.current > 0 && "" === (null == s || null === (r = s.current) || void 0 === r ? void 0 : r.value) && (D.current -= 1), c.captcha.captchaImg = "", d()))
                            }), 1e3)
                        } catch (e) {
                            a.stateMachine.state.error(`Get Captcha was failed: ${e instanceof rr?e.message:e}`)
                        } finally {
                            setTimeout((() => {
                                c.isLoading = !1
                            }), 600)
                        }
                    }), []);

                function l() {
                    g.current > 0 && (g.current--, null !== n.current && window.clearInterval(n.current), n.current = null, D.current = 1, d())
                }
                return Object(W.useEffect)((() => () => {
                    null !== n.current && window.clearInterval(n.current)
                }), []), Object(W.useEffect)((() => {
                    i && l()
                }), [i]), Object(W.useEffect)((() => {
                    t && !i && l()
                }), [t]), q.a.createElement("div", {
                    className: Object(oe.a)(["z-input", "login-normal-page__captcha"]),
                    style: {
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "0",
                        height: "36px"
                    }
                }, q.a.createElement(mr.a, {
                    required: !0,
                    textKey: "STR_INPUT_CAPTCHA",
                    onKeyPress: r => {
                        e(r)
                    },
                    onChange: e => {
                        r(e.target.value, c.captcha.token)
                    },
                    type: "text",
                    inputRef: s,
                    style: {
                        padding: "0",
                        boxSizing: "border-box",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 400,
                        height: "36px"
                    }
                }), q.a.createElement("div", {
                    id: "captcha",
                    className: "flx flx-center flx-al-c",
                    style: {
                        width: "fit-content",
                        height: "fit-content",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        position: "absolute",
                        bottom: "0px",
                        right: "0px"
                    }
                }, q.a.createElement("img", {
                    draggable: !1,
                    src: c.isLoading ? Pe : c.captcha.captchaImg,
                    alt: "captcha",
                    style: {
                        height: c.isLoading ? "20px" : "34px"
                    }
                }), c.isLoading ? q.a.createElement("span", {
                    style: {
                        color: "var(--text-placeholder)",
                        fontSize: "14px",
                        lineHeight: "34px",
                        fontWeight: 400
                    }
                }, q.a.createElement(Se.a, {
                    textKey: "STR_LOADING"
                }), " ", "...") : q.a.createElement(hr.a, {
                    icon: "outline-reload",
                    onClick: () => {
                        l()
                    },
                    type: "tertiary-neutral",
                    size: "large",
                    disabled: 0 === g.current,
                    style: {
                        width: "24px",
                        height: "24px",
                        minWidth: "24px",
                        minHeight: "24px",
                        padding: "0"
                    }
                })))
            };

            function wr(e) {
                var r, i, t, s, n, g, D;
                return {
                    choices: null !== (r = null == e || null === (i = e.choices) || void 0 === i ? void 0 : i.map((e => function(e) {
                        var r, i, t;
                        return {
                            title: null !== (r = null == e ? void 0 : e.title) && void 0 !== r ? r : "",
                            value: null !== (i = null == e ? void 0 : e.value) && void 0 !== i ? i : "",
                            thumb: null !== (t = null == e ? void 0 : e.thumb) && void 0 !== t ? t : ""
                        }
                    }(e)))) && void 0 !== r ? r : [],
                    content: null !== (t = null == e ? void 0 : e.content) && void 0 !== t ? t : "",
                    questionFormat: null !== (s = null == e ? void 0 : e.questionFormat) && void 0 !== s ? s : 0,
                    questionType: null !== (n = null == e ? void 0 : e.questionType) && void 0 !== n ? n : 0,
                    answerType: null !== (g = null == e ? void 0 : e.answerType) && void 0 !== g ? g : 0,
                    cptchCert: null !== (D = null == e ? void 0 : e.cptch_cert) && void 0 !== D ? D : ""
                }
            }
            var Cr = i("egaF"),
                kr = i("O8ue");
            i("cy9f");

            function _r() {
                const e = Math.round((new Date).getTimezoneOffset() / -60);
                return (e < 0 ? "" : "+") + (e > 9 ? `${e}:00` : `0${e}:00`)
            }
            const Fr = ({
                    dataSecQues: e,
                    dataUser: r,
                    onBack: i,
                    onSubmit: t,
                    usedForResetPassword: s = !1
                }) => {
                    var n, g;
                    const D = e.content + ` ${je.a.trans("STR_SECURITY_QUESTION_MESSAGE_SUBTEXT",[(null!==(n=e.answerType)&&void 0!==n?n:0).toString()])}`,
                        a = Object(W.useRef)(null),
                        c = ve({
                            checkedItems: new Array(0),
                            messageError: ""
                        });
                    async function d() {
                        try {
                            s && r && await async function({
                                phone: e,
                                token: r,
                                answerData: i,
                                options: t
                            }) {
                                try {
                                    const s = Y(),
                                        n = await We.default.loginByResetPassword(e, s, "", "", r, _r(), t.isoCode, Ge.getCurrentLanguageName(), i),
                                        g = ir(null == n ? void 0 : n.data);
                                    if ("Right" === g._tag) return g.value;
                                    throw g.value
                                } catch (s) {
                                    if (s instanceof Error && "Network Error" === s.message) throw new rr({
                                        code: "STR_CONNECTION_ERROR",
                                        message: "STR_CONNECTION_ERROR",
                                        name: "Network Error"
                                    });
                                    throw s
                                }
                            }({
                                answerData: {
                                    answers: Array.from(c.checkedItems).join(","),
                                    answer_type: e.answerType,
                                    question_type: e.questionType
                                },
                                options: {
                                    isoCode: r.isoCode
                                },
                                phone: r.phone,
                                token: r.token
                            }), await t({
                                answers: Array.from(c.checkedItems).join(","),
                                answer_type: e.answerType,
                                question_type: e.questionType
                            }), i()
                        } catch (n) {
                            if (l(), n instanceof rr) {
                                if (n.code === dr.OUT_OF_SECQ_QUOTA || n.code === dr.OUT_OF_SECQ_2_STEP_QUOTA) return void i(!0, `${(null==n?void 0:n.message)||""}`);
                                c.messageError = n.message
                            } else c.messageError = Ge.str("STR_ERROR_UNKNOWN")
                        }
                    }

                    function l() {
                        c.checkedItems.length > 0 && (c.checkedItems = [])
                    }
                    return Object(W.useEffect)((() => (a.current = window.setInterval((() => {
                        l()
                    }), 3e4), () => {
                        a.current && window.clearInterval(a.current)
                    })), []), q.a.createElement("div", {
                        className: "security-question-screen",
                        style: {
                            backgroundColor: "var(--layer-background)",
                            zIndex: 12
                        }
                    }, q.a.createElement("div", {
                        className: "title"
                    }, q.a.createElement("img", {
                        draggable: !1,
                        src: ze.a,
                        style: {
                            height: "32px",
                            alignSelf: "center"
                        }
                    }), q.a.createElement(Se.a, {
                        textKey: "STR_LOGIN_ACCOUNT",
                        style: {
                            margin: "0",
                            color: "var(--B95)",
                            fontSize: "18px",
                            fontWeight: "600",
                            alignSelf: "center"
                        },
                        tagName: "div"
                    }), q.a.createElement("span", {
                        style: {
                            margin: "0",
                            color: "var(--B95)",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            alignSelf: "center",
                            textAlign: "center"
                        }
                    }, `${D}`)), q.a.createElement("div", {
                        className: "body"
                    }, q.a.createElement(Se.a, {
                        className: Object(oe.a)("error", "text-center"),
                        textKey: `${c.messageError}`
                    }), q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            height: "230px",
                            width: "100%",
                            border: "1px solid var(--border)"
                        }
                    }, q.a.createElement(Cr.a, {
                        autoHide: !1
                    }, (null !== (g = e.choices) && void 0 !== g ? g : []).map((e => q.a.createElement(vr, {
                        key: "item_qs_" + e.value,
                        id: e.value,
                        thumb: e.thumb,
                        title: e.title,
                        onClick: e => {
                            ! function(e) {
                                const r = c.checkedItems.indexOf(e);
                                r > -1 ? c.checkedItems.splice(r, 1) : c.checkedItems.push(e), c.checkedItems = [...c.checkedItems]
                            }(e)
                        },
                        checked: void 0 !== c.checkedItems.find((r => r === e.value))
                    })))))), q.a.createElement("div", {
                        className: "footer"
                    }, q.a.createElement(hr.a, {
                        disabled: c.checkedItems.length !== e.answerType,
                        onClick: () => {
                            d()
                        },
                        size: "large",
                        textKey: "STR_ANSWER",
                        style: {
                            width: "100%"
                        }
                    }), q.a.createElement(hr.a, {
                        type: "tertiary-primary",
                        size: "large",
                        textKey: "STR_BACK",
                        onClick: i
                    })))
                },
                vr = ({
                    id: e,
                    onClick: r,
                    thumb: i,
                    title: t,
                    checked: s
                }) => q.a.createElement("div", {
                    className: Object(oe.a)("rel", "flx flx-al-c", "security-question-screen__list-friend__item"),
                    onClick: () => {
                        r(e)
                    }
                }, i && q.a.createElement(Re.a, {
                    userId: e,
                    target: {
                        displayName: t,
                        avatar: i
                    },
                    size: "l"
                }), q.a.createElement("div", {
                    className: Object(oe.a)("name", i && "ml-12")
                }, t), q.a.createElement(kr.b, {
                    className: "fl-r",
                    checked: s,
                    onChange: () => {
                        r(e)
                    }
                }));
            i("hGpA"), i("y65y");
            var Sr = i("Z8OR");
            const Ir = Object(W.forwardRef)((({
                className: e,
                style: r,
                textKey: i,
                inputProps: t,
                onChange: s,
                countryCode: n = 84,
                phoneNumber: g = "",
                countryIsoCode: D = "VN"
            }, a) => {
                const c = Object(W.useRef)(null),
                    [d, l] = Object(W.useState)(!1);
                return Object(W.useImperativeHandle)(a, (() => c.current), []), q.a.createElement("fieldset", {
                    className: Object(oe.a)(["input-phone-v2", null != e ? e : ""]),
                    style: r
                }, q.a.createElement("div", {
                    className: "iso-picker",
                    onClick: () => {
                        l(!0)
                    }
                }, "+" + n, q.a.createElement(Ie.a, {
                    icon: "solid-down-1",
                    style: {
                        fontSize: "12px",
                        color: "var(--icon-secondary)"
                    }
                })), q.a.createElement("input", Object(xr.a)({
                    className: "phone",
                    value: g,
                    onChange: e => {
                        ! function(e) {
                            let r = n,
                                i = D,
                                t = e.split("").filter((e => e >= "0" && e <= "9" || "+" === e)).join("").trim();
                            if (t.startsWith("+")) {
                                const e = G.default.getPhoneNumber(t);
                                e.isPossibleNumber() && (r = e.getCountryCode(), i = e.getISOCountryCode(), t = e.getPhone())
                            }
                            s && s({
                                countryCode: r,
                                countryIsoCode: i,
                                phoneNumber: t
                            })
                        }(e.currentTarget.value)
                    }
                }, t, {
                    ref: c,
                    "data-translate-placeholder": i
                })), d && q.a.createElement(Sr.a, {
                    onCountrySelected: e => {
                        var r, i, t;
                        (r = e) && s && s({
                            countryCode: r.country_code,
                            countryIsoCode: r.iso_country_code,
                            phoneNumber: null !== (i = null === (t = c.current) || void 0 === t ? void 0 : t.value) && void 0 !== i ? i : ""
                        }), l(!1)
                    },
                    countries: [{
                        country_code: 93,
                        iso_country_code: "AF",
                        country_name: "Afghanistan"
                    }, {
                        country_code: 376,
                        iso_country_code: "AD",
                        country_name: "Andorra"
                    }, {
                        country_code: 244,
                        iso_country_code: "AO",
                        country_name: "Angola"
                    }, {
                        country_code: 1264,
                        iso_country_code: "AI",
                        country_name: "Anguilla"
                    }, {
                        country_code: 1268,
                        iso_country_code: "AG",
                        country_name: "Antigua and Barbuda"
                    }, {
                        country_code: 54,
                        iso_country_code: "AR",
                        country_name: "Argentina"
                    }, {
                        country_code: 297,
                        iso_country_code: "AW",
                        country_name: "Aruba"
                    }, {
                        country_code: 61,
                        iso_country_code: "AU",
                        country_name: "Australia"
                    }, {
                        country_code: 43,
                        iso_country_code: "AT",
                        country_name: "Austria"
                    }, {
                        country_code: 1242,
                        iso_country_code: "BS",
                        country_name: "Bahamas"
                    }, {
                        country_code: 973,
                        iso_country_code: "BH",
                        country_name: "Bahrain"
                    }, {
                        country_code: 880,
                        iso_country_code: "BD",
                        country_name: "Bangladesh"
                    }, {
                        country_code: 1246,
                        iso_country_code: "BB",
                        country_name: "Barbados"
                    }, {
                        country_code: 375,
                        iso_country_code: "BY",
                        country_name: "Belarus"
                    }, {
                        country_code: 32,
                        iso_country_code: "BE",
                        country_name: "Belgium"
                    }, {
                        country_code: 501,
                        iso_country_code: "BZ",
                        country_name: "Belize"
                    }, {
                        country_code: 229,
                        iso_country_code: "BJ",
                        country_name: "Benin"
                    }, {
                        country_code: 1441,
                        iso_country_code: "BM",
                        country_name: "Bermuda"
                    }, {
                        country_code: 975,
                        iso_country_code: "BT",
                        country_name: "Bhutan"
                    }, {
                        country_code: 591,
                        iso_country_code: "BO",
                        country_name: "Bolivia"
                    }, {
                        country_code: 387,
                        iso_country_code: "BA",
                        country_name: "Bosnia and Herzegovina"
                    }, {
                        country_code: 267,
                        iso_country_code: "BW",
                        country_name: "Botswana"
                    }, {
                        country_code: 55,
                        iso_country_code: "BR",
                        country_name: "Brazil"
                    }, {
                        country_code: 673,
                        iso_country_code: "BN",
                        country_name: "Brunei"
                    }, {
                        country_code: 359,
                        iso_country_code: "BG",
                        country_name: "Bulgaria"
                    }, {
                        country_code: 226,
                        iso_country_code: "BF",
                        country_name: "Burkina Faso"
                    }, {
                        country_code: 257,
                        iso_country_code: "BI",
                        country_name: "Burundi"
                    }, {
                        country_code: 855,
                        iso_country_code: "KH",
                        country_name: "Cambodia"
                    }, {
                        country_code: 237,
                        iso_country_code: "CM",
                        country_name: "Cameroon"
                    }, {
                        country_code: 1,
                        iso_country_code: "CA",
                        country_name: "Canada"
                    }, {
                        country_code: 1345,
                        iso_country_code: "KY",
                        country_name: "Cayman Islands"
                    }, {
                        country_code: 236,
                        iso_country_code: "CF",
                        country_name: "Central African Republic"
                    }, {
                        country_code: 235,
                        iso_country_code: "TD",
                        country_name: "Chad"
                    }, {
                        country_code: 56,
                        iso_country_code: "CL",
                        country_name: "Chile"
                    }, {
                        country_code: 86,
                        iso_country_code: "CN",
                        country_name: "China"
                    }, {
                        country_code: 269,
                        iso_country_code: "KM",
                        country_name: "Comoros"
                    }, {
                        country_code: 682,
                        iso_country_code: "CK",
                        country_name: "Cook Islands"
                    }, {
                        country_code: 506,
                        iso_country_code: "CR",
                        country_name: "Costa Rica"
                    }, {
                        country_code: 385,
                        iso_country_code: "HR",
                        country_name: "Croatia"
                    }, {
                        country_code: 53,
                        iso_country_code: "CU",
                        country_name: "Cuba"
                    }, {
                        country_code: 357,
                        iso_country_code: "CY",
                        country_name: "Cyprus"
                    }, {
                        country_code: 420,
                        iso_country_code: "CZ",
                        country_name: "Czech Republic"
                    }, {
                        country_code: 243,
                        iso_country_code: "CD",
                        country_name: "Democratic Republic of the Congo"
                    }, {
                        country_code: 45,
                        iso_country_code: "DK",
                        country_name: "Denmark"
                    }, {
                        country_code: 253,
                        iso_country_code: "DJ",
                        country_name: "Djibouti"
                    }, {
                        country_code: 1767,
                        iso_country_code: "DM",
                        country_name: "Dominica"
                    }, {
                        country_code: 1809,
                        iso_country_code: "DO",
                        country_name: "Dominican Republic"
                    }, {
                        country_code: 670,
                        iso_country_code: "TL",
                        country_name: "East Timor"
                    }, {
                        country_code: 593,
                        iso_country_code: "EC",
                        country_name: "Ecuador"
                    }, {
                        country_code: 20,
                        iso_country_code: "EG",
                        country_name: "Egypt"
                    }, {
                        country_code: 503,
                        iso_country_code: "SV",
                        country_name: "El Salvador"
                    }, {
                        country_code: 240,
                        iso_country_code: "GQ",
                        country_name: "Equatorial Guinea"
                    }, {
                        country_code: 372,
                        iso_country_code: "EE",
                        country_name: "Estonia"
                    }, {
                        country_code: 251,
                        iso_country_code: "ET",
                        country_name: "Ethiopia"
                    }, {
                        country_code: 298,
                        iso_country_code: "FO",
                        country_name: "Faroe Islands"
                    }, {
                        country_code: 679,
                        iso_country_code: "FJ",
                        country_name: "Fiji"
                    }, {
                        country_code: 358,
                        iso_country_code: "FI",
                        country_name: "Finland"
                    }, {
                        country_code: 33,
                        iso_country_code: "FR",
                        country_name: "France"
                    }, {
                        country_code: 220,
                        iso_country_code: "GM",
                        country_name: "Gambia"
                    }, {
                        country_code: 995,
                        iso_country_code: "GE",
                        country_name: "Georgia"
                    }, {
                        country_code: 49,
                        iso_country_code: "DE",
                        country_name: "Germany"
                    }, {
                        country_code: 233,
                        iso_country_code: "GH",
                        country_name: "Ghana"
                    }, {
                        country_code: 350,
                        iso_country_code: "GI",
                        country_name: "Gibraltar"
                    }, {
                        country_code: 30,
                        iso_country_code: "GR",
                        country_name: "Greece"
                    }, {
                        country_code: 299,
                        iso_country_code: "GL",
                        country_name: "Greenland"
                    }, {
                        country_code: 1473,
                        iso_country_code: "GD",
                        country_name: "Grenada"
                    }, {
                        country_code: 1671,
                        iso_country_code: "GU",
                        country_name: "Guam"
                    }, {
                        country_code: 502,
                        iso_country_code: "GT",
                        country_name: "Guatemala"
                    }, {
                        country_code: 224,
                        iso_country_code: "GN",
                        country_name: "Guinea"
                    }, {
                        country_code: 245,
                        iso_country_code: "GW",
                        country_name: "Guinea-Bissau"
                    }, {
                        country_code: 509,
                        iso_country_code: "HT",
                        country_name: "Haiti"
                    }, {
                        country_code: 504,
                        iso_country_code: "HN",
                        country_name: "Honduras"
                    }, {
                        country_code: 852,
                        iso_country_code: "HK",
                        country_name: "Hong Kong"
                    }, {
                        country_code: 36,
                        iso_country_code: "HU",
                        country_name: "Hungary"
                    }, {
                        country_code: 354,
                        iso_country_code: "IS",
                        country_name: "Iceland"
                    }, {
                        country_code: 91,
                        iso_country_code: "IN",
                        country_name: "India"
                    }, {
                        country_code: 62,
                        iso_country_code: "ID",
                        country_name: "Indonesia"
                    }, {
                        country_code: 98,
                        iso_country_code: "IR",
                        country_name: "Iran"
                    }, {
                        country_code: 964,
                        iso_country_code: "IQ",
                        country_name: "Iraq"
                    }, {
                        country_code: 353,
                        iso_country_code: "IE",
                        country_name: "Ireland"
                    }, {
                        country_code: 972,
                        iso_country_code: "IL",
                        country_name: "Israel"
                    }, {
                        country_code: 39,
                        iso_country_code: "IT",
                        country_name: "Italy"
                    }, {
                        country_code: 1876,
                        iso_country_code: "JM",
                        country_name: "Jamaica"
                    }, {
                        country_code: 81,
                        iso_country_code: "JP",
                        country_name: "Japan"
                    }, {
                        country_code: 44,
                        iso_country_code: "JE",
                        country_name: "Jersey"
                    }, {
                        country_code: 962,
                        iso_country_code: "JO",
                        country_name: "Jordan"
                    }, {
                        country_code: 7,
                        iso_country_code: "KZ",
                        country_name: "Kazakhstan"
                    }, {
                        country_code: 254,
                        iso_country_code: "KE",
                        country_name: "Kenya"
                    }, {
                        country_code: 686,
                        iso_country_code: "KI",
                        country_name: "Kiribati"
                    }, {
                        country_code: 965,
                        iso_country_code: "KW",
                        country_name: "Kuwait"
                    }, {
                        country_code: 996,
                        iso_country_code: "KG",
                        country_name: "Kyrgyzstan"
                    }, {
                        country_code: 856,
                        iso_country_code: "LA",
                        country_name: "Laos"
                    }, {
                        country_code: 371,
                        iso_country_code: "LV",
                        country_name: "Latvia"
                    }, {
                        country_code: 961,
                        iso_country_code: "LB",
                        country_name: "Lebanon"
                    }, {
                        country_code: 266,
                        iso_country_code: "LS",
                        country_name: "Lesotho"
                    }, {
                        country_code: 231,
                        iso_country_code: "LR",
                        country_name: "Liberia"
                    }, {
                        country_code: 218,
                        iso_country_code: "LY",
                        country_name: "Libya"
                    }, {
                        country_code: 423,
                        iso_country_code: "LI",
                        country_name: "Liechtenstein"
                    }, {
                        country_code: 370,
                        iso_country_code: "LT",
                        country_name: "Lithuania"
                    }, {
                        country_code: 352,
                        iso_country_code: "LU",
                        country_name: "Luxembourg"
                    }, {
                        country_code: 853,
                        iso_country_code: "MO",
                        country_name: "Macau"
                    }, {
                        country_code: 389,
                        iso_country_code: "MK",
                        country_name: "Macedonia"
                    }, {
                        country_code: 261,
                        iso_country_code: "MG",
                        country_name: "Madagascar"
                    }, {
                        country_code: 265,
                        iso_country_code: "MW",
                        country_name: "Malawi"
                    }, {
                        country_code: 60,
                        iso_country_code: "MY",
                        country_name: "Malaysia"
                    }, {
                        country_code: 960,
                        iso_country_code: "MV",
                        country_name: "Maldives"
                    }, {
                        country_code: 223,
                        iso_country_code: "ML",
                        country_name: "Mali"
                    }, {
                        country_code: 356,
                        iso_country_code: "MT",
                        country_name: "Malta"
                    }, {
                        country_code: 52,
                        iso_country_code: "MX",
                        country_name: "Mexico"
                    }, {
                        country_code: 691,
                        iso_country_code: "FM",
                        country_name: "Micronesia"
                    }, {
                        country_code: 373,
                        iso_country_code: "MD",
                        country_name: "Moldova"
                    }, {
                        country_code: 377,
                        iso_country_code: "MC",
                        country_name: "Monaco"
                    }, {
                        country_code: 976,
                        iso_country_code: "MN",
                        country_name: "Mongolia"
                    }, {
                        country_code: 382,
                        iso_country_code: "ME",
                        country_name: "Montenegro"
                    }, {
                        country_code: 1664,
                        iso_country_code: "MS",
                        country_name: "Montserrat"
                    }, {
                        country_code: 212,
                        iso_country_code: "MA",
                        country_name: "Morocco"
                    }, {
                        country_code: 258,
                        iso_country_code: "MZ",
                        country_name: "Mozambique"
                    }, {
                        country_code: 95,
                        iso_country_code: "MM",
                        country_name: "Myanmar"
                    }, {
                        country_code: 264,
                        iso_country_code: "NA",
                        country_name: "Namibia"
                    }, {
                        country_code: 977,
                        iso_country_code: "NP",
                        country_name: "Nepal"
                    }, {
                        country_code: 31,
                        iso_country_code: "NL",
                        country_name: "Netherlands"
                    }, {
                        country_code: 599,
                        iso_country_code: "AN",
                        country_name: "Netherlands Antilles"
                    }, {
                        country_code: 687,
                        iso_country_code: "NC",
                        country_name: "New Caledonia"
                    }, {
                        country_code: 64,
                        iso_country_code: "NZ",
                        country_name: "New Zealand"
                    }, {
                        country_code: 850,
                        iso_country_code: "KP",
                        country_name: "North Korea"
                    }, {
                        country_code: 47,
                        iso_country_code: "NO",
                        country_name: "Norway"
                    }, {
                        country_code: 968,
                        iso_country_code: "OM",
                        country_name: "Oman"
                    }, {
                        country_code: 970,
                        iso_country_code: "PS",
                        country_name: "Palestine"
                    }, {
                        country_code: 507,
                        iso_country_code: "PA",
                        country_name: "Panama"
                    }, {
                        country_code: 675,
                        iso_country_code: "PG",
                        country_name: "Papua New Guinea"
                    }, {
                        country_code: 595,
                        iso_country_code: "PY",
                        country_name: "Paraguay"
                    }, {
                        country_code: 51,
                        iso_country_code: "PE",
                        country_name: "Peru"
                    }, {
                        country_code: 63,
                        iso_country_code: "PH",
                        country_name: "Philippines"
                    }, {
                        country_code: 48,
                        iso_country_code: "PL",
                        country_name: "Poland"
                    }, {
                        country_code: 351,
                        iso_country_code: "PT",
                        country_name: "Portugal"
                    }, {
                        country_code: 1787,
                        iso_country_code: "PR",
                        country_name: "Puerto Rico"
                    }, {
                        country_code: 974,
                        iso_country_code: "QA",
                        country_name: "Qatar"
                    }, {
                        country_code: 242,
                        iso_country_code: "CG",
                        country_name: "Republic Of The Congo"
                    }, {
                        country_code: 262,
                        iso_country_code: "RE",
                        country_name: "Réunion Island"
                    }, {
                        country_code: 40,
                        iso_country_code: "RO",
                        country_name: "Romania"
                    }, {
                        country_code: 7,
                        iso_country_code: "RU",
                        country_name: "Russia"
                    }, {
                        country_code: 250,
                        iso_country_code: "RW",
                        country_name: "Rwanda"
                    }, {
                        country_code: 1869,
                        iso_country_code: "KN",
                        country_name: "Saint Kitts and Nevis"
                    }, {
                        country_code: 508,
                        iso_country_code: "PM",
                        country_name: "Saint Pierre and Miquelon"
                    }, {
                        country_code: 1784,
                        iso_country_code: "VC",
                        country_name: "Saint Vincent and The Grenadines"
                    }, {
                        country_code: 685,
                        iso_country_code: "WS",
                        country_name: "Samoa"
                    }, {
                        country_code: 239,
                        iso_country_code: "ST",
                        country_name: "Sao Tome and Principe"
                    }, {
                        country_code: 966,
                        iso_country_code: "SA",
                        country_name: "Saudi Arabia"
                    }, {
                        country_code: 221,
                        iso_country_code: "SN",
                        country_name: "Senegal"
                    }, {
                        country_code: 381,
                        iso_country_code: "RS",
                        country_name: "Serbia"
                    }, {
                        country_code: 248,
                        iso_country_code: "SC",
                        country_name: "Seychelles"
                    }, {
                        country_code: 232,
                        iso_country_code: "SL",
                        country_name: "Sierra Leone"
                    }, {
                        country_code: 65,
                        iso_country_code: "SG",
                        country_name: "Singapore"
                    }, {
                        country_code: 421,
                        iso_country_code: "SK",
                        country_name: "Slovakia"
                    }, {
                        country_code: 386,
                        iso_country_code: "SI",
                        country_name: "Slovenia"
                    }, {
                        country_code: 252,
                        iso_country_code: "SO",
                        country_name: "Somalia"
                    }, {
                        country_code: 27,
                        iso_country_code: "ZA",
                        country_name: "South Africa"
                    }, {
                        country_code: 82,
                        iso_country_code: "KR",
                        country_name: "South Korea"
                    }, {
                        country_code: 211,
                        iso_country_code: "SS",
                        country_name: "South Sudan"
                    }, {
                        country_code: 34,
                        iso_country_code: "ES",
                        country_name: "Spain"
                    }, {
                        country_code: 94,
                        iso_country_code: "LK",
                        country_name: "Sri Lanka"
                    }, {
                        country_code: 249,
                        iso_country_code: "SD",
                        country_name: "Sudan"
                    }, {
                        country_code: 597,
                        iso_country_code: "SR",
                        country_name: "Suriname"
                    }, {
                        country_code: 268,
                        iso_country_code: "SZ",
                        country_name: "Swaziland"
                    }, {
                        country_code: 46,
                        iso_country_code: "SE",
                        country_name: "Sweden"
                    }, {
                        country_code: 41,
                        iso_country_code: "CH",
                        country_name: "Switzerland"
                    }, {
                        country_code: 963,
                        iso_country_code: "SY",
                        country_name: "Syria"
                    }, {
                        country_code: 886,
                        iso_country_code: "TW",
                        country_name: "Taiwan"
                    }, {
                        country_code: 992,
                        iso_country_code: "TJ",
                        country_name: "Tajikistan"
                    }, {
                        country_code: 255,
                        iso_country_code: "TZ",
                        country_name: "Tanzania"
                    }, {
                        country_code: 66,
                        iso_country_code: "TH",
                        country_name: "Thailand"
                    }, {
                        country_code: 228,
                        iso_country_code: "TG",
                        country_name: "Togo"
                    }, {
                        country_code: 676,
                        iso_country_code: "TO",
                        country_name: "Tonga"
                    }, {
                        country_code: 1868,
                        iso_country_code: "TT",
                        country_name: "Trinidad and Tobago"
                    }, {
                        country_code: 216,
                        iso_country_code: "TN",
                        country_name: "Tunisia"
                    }, {
                        country_code: 90,
                        iso_country_code: "TR",
                        country_name: "Turkey"
                    }, {
                        country_code: 993,
                        iso_country_code: "TM",
                        country_name: "Turkmenistan"
                    }, {
                        country_code: 1649,
                        iso_country_code: "TC",
                        country_name: "Turks and Caicos Islands"
                    }, {
                        country_code: 256,
                        iso_country_code: "UG",
                        country_name: "Uganda"
                    }, {
                        country_code: 380,
                        iso_country_code: "UA",
                        country_name: "Ukraine"
                    }, {
                        country_code: 971,
                        iso_country_code: "AE",
                        country_name: "United Arab Emirates"
                    }, {
                        country_code: 44,
                        iso_country_code: "GB",
                        country_name: "United Kingdom"
                    }, {
                        country_code: 1,
                        iso_country_code: "US",
                        country_name: "United States"
                    }, {
                        country_code: 998,
                        iso_country_code: "UZ",
                        country_name: "Uzbekistan"
                    }, {
                        country_code: 58,
                        iso_country_code: "VE",
                        country_name: "Venezuela"
                    }, {
                        country_code: 84,
                        iso_country_code: "VN",
                        country_name: "Vietnam"
                    }, {
                        country_code: 1284,
                        iso_country_code: "VG",
                        country_name: "Virgin Islands British"
                    }, {
                        country_code: 967,
                        iso_country_code: "YE",
                        country_name: "Yemen"
                    }, {
                        country_code: 260,
                        iso_country_code: "ZM",
                        country_name: "Zambia"
                    }, {
                        country_code: 263,
                        iso_country_code: "ZW",
                        country_name: "Zimbabwe"
                    }],
                    countryCode: n,
                    oftenCountries: []
                }))
            }));
            var Rr = i("NDmK");
            const Nr = ({
                    isFocusLoginNormal: e
                }) => {
                    const r = he(),
                        i = ve({
                            password: "",
                            phoneNumber: "",
                            countryCode: 84,
                            countryIsoCode: "VN",
                            captcha: "",
                            captchaToken: "",
                            errorMessage: "",
                            secQuestion: null,
                            coutingFailureSubmited: 0,
                            isReloadCaptcha: !1,
                            currentLanguage: Ge.getCurrentLanguageName() || "vi"
                        }),
                        t = Fe((() => i.phoneNumber.length >= 6 && i.password.length >= 3 && i.captcha.length > 0)),
                        s = Fe((() => 1 !== Rr.default.authentication.enable_content_notify_off_login_password ? "" : Rr.default.authentication.content_notify_off_login_password[i.currentLanguage])),
                        n = Object(W.useRef)(null),
                        g = Object(W.useRef)(null),
                        D = Object(W.useRef)(null);

                    function a(e) {
                        r.stateMachine.handler(Ae.main_choose_login_qr), e && (r.stateMachine.state.data = {
                            error_from_login_password: e
                        }), r.loginSession.loginStateStream.next(r.stateMachine.state), i.captcha = "", i.captchaToken = "", i.password = "", g.current && (g.current.value = ""), d(null)
                    }

                    function c(e) {
                        13 === e.which && (t.value && l(), e.preventDefault())
                    }

                    function d(e) {
                        i.errorMessage = null != e ? e : ""
                    }
                    async function l(e) {
                        var t;
                        "activeElement" in document && (null === (t = document.activeElement) || void 0 === t || t.blur());
                        try {
                            r.loginSession.isLoading.next(!0);
                            const t = await async function({
                                phone: e,
                                pass: r,
                                captcha: i,
                                captchaToken: t,
                                imei: s,
                                makeAnswer: n,
                                answerData: g,
                                country: D
                            }) {
                                try {
                                    const o = Br().getItem("quest_cert"),
                                        y = Br().getItem("captcha_cert"),
                                        p = await We.default.signInPasswordV2(e, r, i, t, s, n, g, g ? null : o, i ? null : y, D.iso, Ge.getCurrentLanguageName(), Er.a.getUidLogin(), null, null),
                                        A = ir(null == p ? void 0 : p.data);
                                    if ("Right" === A._tag) {
                                        var a, c, d, l, h;
                                        const r = A.value,
                                            i = null !== (a = null == r ? void 0 : r.uid) && void 0 !== a ? a : "",
                                            t = null !== (c = null == r ? void 0 : r.dkey) && void 0 !== c ? c : "";
                                        if (i && t) {
                                            const e = Object(Te.c)(i);
                                            Br().init(i, t), e || Br().setItemForCurrentUser(Ye().FirstLoginLocalStorageKeys.IS_FIRST_LOGIN, "1")
                                        }
                                        Br().setItem(G.RECENT_PHONE, e), Br().setItem(G.RECENT_COUNTRY, JSON.stringify(D));
                                        const s = !(null === (d = A.value) || void 0 === d || !d.needSyncMsg) || !(null === (l = A.value) || void 0 === l || !l.sync_msg_info);
                                        return Br().setItem("z_needSyncMsg", s ? "1" : ""), Br().setItem(Ye().KEY_REMEMBER, Xe.a.getValueRememberLogin() ? "1" : ""), Br().setItem(Ye().KEY_SET_VALUE_ACTION_LOG, `${Xe.a.getValueActionLogRemember()}`), null != r && r.quest_cert && Br().setItem("quest_cert", r.quest_cert), null != r && r.cptch_cert && Br().setItem("captcha_cert", r.cptch_cert), Br().setItem("FORCE_GET_FRIEND_LIST", "1"), await $zelectron.setAppCookie(null !== (h = null == r ? void 0 : r.zpw_sek) && void 0 !== h ? h : ""), await gr(r, !0), Br().removeItem("FORGOT_PASSWORD"), null != i ? i : ""
                                    }
                                    throw A.value
                                } catch (o) {
                                    if (o instanceof Error && "Network Error" === o.message) throw new rr({
                                        code: "STR_CONNECTION_ERROR",
                                        message: "STR_CONNECTION_ERROR",
                                        name: "Network Error"
                                    });
                                    throw o
                                }
                            }({
                                phone: i.phoneNumber,
                                pass: i.password,
                                captcha: i.captcha,
                                captchaToken: i.captchaToken,
                                imei: Y(),
                                makeAnswer: e ? 1 : 0,
                                answerData: e || null,
                                country: {
                                    code: i.countryCode,
                                    iso: i.countryIsoCode
                                }
                            });
                            r.stateMachine.handler(Ae.main_accepted_login), r.stateMachine.state.data = {
                                typeLogin: Ye().LOGIN_TYPE_PASSWORD
                            }, r.loginSession.loginStateStream.next(r.stateMachine.state), r.loginSession.logInfoV2Stream.next({
                                type: 152404,
                                subType: 0,
                                data: {
                                    authentication_status: !0,
                                    login_method: "password",
                                    uid: t
                                }
                            })
                        } catch (s) {
                            if (i.isReloadCaptcha = !0, e) throw s;
                            if (s instanceof rr && s.code === dr.SECURITY_QUESTION_REQUIRED && s.data) return i.secQuestion = wr(s.data), r.stateMachine.state.error((function(e) {
                                return e[0]
                            })`Require security question when login with password: ${s.code}`), void(s.data.cptch_cert && Br().setItem("captcha_cert", s.data.cptch_cert));
                            if (r.loginSession.logInfoV2Stream.next({
                                    type: 152404,
                                    subType: 0,
                                    data: {
                                        authentication_status: !1,
                                        login_method: "password",
                                        error_code: (null == s ? void 0 : s.code) || (null == s ? void 0 : s.error_code) || s
                                    }
                                }), r.stateMachine.state.error(`Submit login with password was failed: ${JSON.stringify(s)}`), i.isReloadCaptcha = !0, s instanceof rr) {
                                if ("string" == typeof s.code) return void d(Ge.str("STR_SIGNIN_ERROR_NO_NETWORK"));
                                s.code === dr.OUT_OF_SECQ_QUOTA || s.code === dr.OUT_OF_SECQ_2_STEP_QUOTA || s.code === dr.SENSITIVE_FLOW_REQUIRE_OTP_OR_CONFIRM_MOBILE || s.code === dr.SENSITIVE_FLOW_REQUIRE_OTP ? d(s.message) : [18041, 18042, 18043].includes(s.code) ? d(s.message ? s.message : Ge.str("STR_SIGNIN_ERROR_RECYCLE_SIM")) : 18044 === s.code ? d(s.message ? s.message : Ge.str("STR_SIGNIN_ERROR_CHANGED_NUMPHONE")) : d(s.message)
                            } else d(Ge.str("STR_ERROR_UNKNOWN"));
                            i.coutingFailureSubmited++, 3 === i.coutingFailureSubmited && (a("STR_LOGIN_PASSWORD_PAGE_ERROR_SUBMIT_TOO_MUCH"), i.coutingFailureSubmited = 0)
                        } finally {
                            r.loginSession.isLoading.next(!1), i.isReloadCaptcha = !1
                        }
                    }
                    return Object(W.useEffect)((() => {
                        var r;
                        e && (null === (r = n.current) || void 0 === r || r.focus(), n.current && (n.current.value = "", i.phoneNumber = ""))
                    }), [e]), Object(W.useEffect)((() => {
                        const e = () => {
                            i.currentLanguage = Ge.getCurrentLanguageName()
                        };
                        return Ge.callUpdate(e), () => {
                            Ge.removeUpdate(e)
                        }
                    }), []), q.a.createElement(W.Fragment, null, q.a.createElement("form", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            flex: 1,
                            padding: "60px 32px 0px 32px",
                            gap: "16px",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            boxSizing: "border-box"
                        },
                        onSubmit: e => {
                            e.preventDefault(), l()
                        },
                        ref: D
                    }, q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "16px",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            boxSizing: "border-box"
                        }
                    }, q.a.createElement("img", {
                        draggable: !1,
                        src: ze.a,
                        style: {
                            height: "32px",
                            alignSelf: "center"
                        }
                    }), q.a.createElement(Se.a, {
                        textKey: "STR_LOGIN_PHONE_NUMBER_PAGE_TITLE",
                        style: {
                            margin: "0",
                            color: "var(--text-primary)",
                            fontSize: "18px",
                            lineHeight: "24px",
                            fontWeight: 600,
                            alignSelf: "center"
                        },
                        tagName: "div"
                    }), s.value.length > 0 && q.a.createElement(yr.a, {
                        style: {
                            padding: "8px",
                            backgroundColor: "var(--layer-information-background)",
                            color: "var(--text-primary)",
                            borderRadius: "6px"
                        },
                        status: "emphasis-info",
                        alignment: "start",
                        closable: !1,
                        content: q.a.createElement("span", {
                            style: {
                                marginTop: "-2px",
                                display: "inline-block"
                            }
                        }, s.value),
                        iconOptions: {
                            size: 20,
                            alignment: "top",
                            rounded: !0
                        },
                        maxContentLines: 5,
                        className: "system-banner-comp"
                    })), q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "16px",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            boxSizing: "border-box"
                        }
                    }, q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "16px",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            boxSizing: "border-box"
                        }
                    }, q.a.createElement(Ir, {
                        countryCode: i.countryCode,
                        countryIsoCode: i.countryIsoCode,
                        phoneNumber: i.phoneNumber,
                        textKey: "STR_PHONE_NUMBER",
                        onChange: ({
                            countryCode: e,
                            countryIsoCode: r,
                            phoneNumber: t
                        }) => {
                            var s;
                            s = {
                                countryCode: e,
                                countryIsoCode: r,
                                phoneNumber: t
                            }, i.countryCode = s.countryCode, i.countryIsoCode = s.countryIsoCode.trim(), i.phoneNumber = s.phoneNumber.trim(), d(null)
                        },
                        inputProps: {
                            placeholder: Ge.str("STR_PHONE_NUMBER"),
                            onKeyPress: e => {
                                c(e)
                            }
                        },
                        ref: n
                    }), q.a.createElement(ur, {
                        textKey: "STR_PASSWORD",
                        inputRef: e => {
                            g.current = e
                        },
                        domref: g,
                        onKeyPress: e => {
                            c(e)
                        },
                        onChange: e => {
                            ! function(e) {
                                i.password = e.target.value, d(null)
                            }(e)
                        },
                        style: {
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "8px 0px 7px 0px",
                            color: "var(--text-primary)",
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 400
                        }
                    }), q.a.createElement(br, {
                        onChangeCaptcha: (e, r) => {
                            var t, s;
                            t = e, s = r, i.captcha = t, i.captchaToken = s
                        },
                        onEnter: e => {
                            c(e)
                        },
                        isInit: e,
                        isReset: i.isReloadCaptcha
                    }), q.a.createElement("span", {
                        className: "login-error-message" + (i.errorMessage ? "" : "--none"),
                        style: {
                            textAlign: "start",
                            width: "100%",
                            marginTop: "-8px"
                        }
                    }, i.errorMessage)), q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "16px",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            boxSizing: "border-box"
                        }
                    }, q.a.createElement(hr.a, {
                        textKey: "STR_SIGNIN",
                        onClick: () => {
                            var e;
                            null === (e = D.current) || void 0 === e || e.dispatchEvent(new Event("submit", {
                                cancelable: !0,
                                bubbles: !0
                            }))
                        },
                        disabled: !t.value,
                        size: "large",
                        style: {
                            margin: "0",
                            width: "100%"
                        }
                    }), Rr.default.authentication.enable_change_password ? q.a.createElement(Se.a, {
                        textKey: "STR_SIGNIN_FORGET",
                        tagName: "div",
                        onClick: () => (r.stateMachine.handler(Ae.main_forget_password), r.stateMachine.state.data = {
                            phoneNumber: i.phoneNumber,
                            countryIsoCode: i.countryIsoCode,
                            countryCode: i.countryCode
                        }, i.captcha = "", i.captchaToken = "", i.password = "", g.current && (g.current.value = ""), d(null), void r.loginSession.loginStateStream.next(r.stateMachine.state)),
                        style: {
                            margin: "0",
                            width: "fit-content",
                            textAlign: "start",
                            color: "var(--text-primary)",
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 400,
                            cursor: "pointer"
                        }
                    }) : null))), q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "row",
                            padding: "16px 32px 16px 32px",
                            gap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box"
                        }
                    }, q.a.createElement(hr.a, {
                        size: "medium",
                        textKey: "STR_LOGIN_QR_PAGE",
                        onClick: () => {
                            a()
                        },
                        type: "tertiary-neutral"
                    })), null !== i.secQuestion && q.a.createElement(Fr, {
                        usedForResetPassword: !1,
                        dataSecQues: i.secQuestion,
                        onBack: (e, t) => {
                            e && (a(), t && r.loginSession.popupStream.next(q.a.createElement(or.default, {
                                visible: !0,
                                showCloseButton: !1,
                                idName: "noti-answer-security-too-much-when-reset-password",
                                noPadding: !0,
                                border: "no-border",
                                title: Ge.str("STR_CONFIG_NOTI"),
                                style: {
                                    borderRadius: "8px",
                                    background: "transparent"
                                },
                                okText: Ge.str("STR_CLOSE"),
                                onOk: () => {
                                    r.loginSession.popupStream.next(null)
                                },
                                preventPageClickForceClose: !1,
                                message: t
                            }))), i.secQuestion = null
                        },
                        onSubmit: l
                    }))
                },
                Tr = Ye().KEY_REMEMBER,
                Mr = Ye().KEY_SET_VALUE_ACTION_LOG,
                Or = Ye().FirstLoginLocalStorageKeys.IS_FIRST_LOGIN;
            i("xNxX");
            const Lr = ["className", "hasError"],
                Pr = Object(W.forwardRef)(((e, r) => {
                    let {
                        className: i,
                        hasError: t
                    } = e, s = Object(V.a)(e, Lr);
                    return q.a.createElement("input", Object(xr.a)({
                        ref: r
                    }, s, {
                        className: Object(oe.a)("email-input-field", t && "has-error", i),
                        autoComplete: "off",
                        "aria-autocomplete": "none"
                    }))
                })),
                zr = ["className", "label"],
                Kr = Object(W.forwardRef)(((e, r) => {
                    let {
                        className: i,
                        label: t
                    } = e, s = Object(V.a)(e, zr);
                    return q.a.createElement("fieldset", {
                        className: "input-field-label"
                    }, q.a.createElement(Pr, Object(xr.a)({
                        ref: r
                    }, s)))
                })),
                Qr = ["onChangeCaptcha", "isReset", "isInit"],
                jr = Object(W.forwardRef)(((e, r) => {
                    let {
                        onChangeCaptcha: i,
                        isReset: t,
                        isInit: s
                    } = e, n = Object(V.a)(e, Qr);
                    const g = Object(W.useRef)(null),
                        D = Object(W.useRef)(null),
                        a = Object(W.useRef)(Number.MAX_SAFE_INTEGER - 1),
                        c = Object(W.useRef)(1),
                        d = he(),
                        l = ve({
                            captcha: {
                                captchaImg: "",
                                expirationTime: 0,
                                token: ""
                            },
                            isLoading: !0
                        }),
                        h = Object(W.useCallback)((async () => {
                            if (null === D.current) try {
                                l.isLoading = !0;
                                const e = await fr();
                                d.stateMachine.state.noti("Get Captcha successfully"), i("", ""), l.captcha.captchaImg = "data:image/png;base64," + e.captchaImg, l.captcha.token = e.token, l.captcha.expirationTime = e.expirationTime, D.current = window.setInterval((() => {
                                    var e, r;
                                    l.captcha.expirationTime > 0 ? l.captcha.expirationTime -= 1 : (null !== D.current && window.clearInterval(D.current), D.current = null, a.current = Number.MAX_SAFE_INTEGER - 1, ("" !== (null == g || null === (e = g.current) || void 0 === e ? void 0 : e.value) || c.current > 0) && (c.current > 0 && "" === (null == g || null === (r = g.current) || void 0 === r ? void 0 : r.value) && (c.current -= 1), l.captcha.captchaImg = "", h()))
                                }), 1e3)
                            } catch (e) {
                                d.stateMachine.state.error(`Get Captcha was failed: ${e instanceof rr?e.message:e}`)
                            } finally {
                                setTimeout((() => {
                                    l.isLoading = !1
                                }), 600)
                            }
                        }), []);

                    function o() {
                        a.current > 0 && (a.current--, null !== D.current && window.clearInterval(D.current), D.current = null, c.current = 1, h())
                    }
                    return Object(W.useImperativeHandle)(r, (() => g.current), []), Object(W.useEffect)((() => () => {
                        null !== D.current && window.clearInterval(D.current)
                    }), []), Object(W.useEffect)((() => {
                        t && o()
                    }), [t]), Object(W.useEffect)((() => {
                        s && !t && o()
                    }), [s]), q.a.createElement("fieldset", {
                        className: "input-captcha rel flx flx-sp-btw flx-al-e w100 bs",
                        style: {
                            padding: "0",
                            gap: "16px",
                            border: "none",
                            margin: 0
                        }
                    }, q.a.createElement(Kr, Object(xr.a)({}, n, {
                        ref: g,
                        label: je.a.str("STR_INPUT_CAPTCHA"),
                        placeholder: je.a.str("STR_LOGIN_ZENTERPRISE_ENTER_CAPTCHA"),
                        onChange: e => i(e.target.value, l.captcha.token)
                    })), q.a.createElement("div", {
                        className: "rel flx flx-center flx-al-c",
                        style: {
                            height: "40px",
                            width: "143px",
                            gap: "8px"
                        }
                    }, q.a.createElement("img", {
                        draggable: !1,
                        src: l.isLoading ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAAAAADj8UOMAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAd0SU1FB+kJBQg3GqQnel8AAAE9SURBVBjTZY87SEJxGMXP/96b2FAmtBQ1OLQJViAWtLQUzdFUtLVIQ2lb0OIiQkTkEBS026Q1tETPoSiSHmTvBykaDYlmWt37Pw0XpfCbDoff+Q5HEFVHQ5GCGmhAq5iiGqQAAOjSUtHAn4jpGgpEcq39sPU16u8Ll6bwD5QQAoYqKKBCCuvpRvZY3+kazz0qvh/NfKoAgKII4KN7X0yEx74YtC1GPW0W33nmSn9DTbmcku+r24kCOdP52Zuvm950Jy4iAyn7bD7uwNzTZbpAkgRJPXm0HtvN0dnjzYZs7iXSO09XkH7fs/0md3cWL5qgJEneRh4CODHobNK5pb3QMcnB+gUckDQMkhoo8nvfqrXW2dA42mGgOaCi5GvBUD9Cy5mYRwpzB0gWr+/TOjnsSpErI9QlKSWpk+U6kr9G8rbM4MnKnQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0wNVQwODo1NToxOCswMDowMNE3K2sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMDVUMDg6NTU6MTgrMDA6MDCgapPXAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA5LTA1VDA4OjU1OjI2KzAwOjAwKc/OtgAAAABJRU5ErkJggg==" : l.captcha.captchaImg,
                        alt: "captcha",
                        style: {
                            height: "40px",
                            width: "108px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            filter: l.isLoading ? "blur(4px)" : "none"
                        }
                    }), q.a.createElement(hr.a, {
                        icon: "outline-reload",
                        onClick: () => {
                            o()
                        },
                        type: "tertiary-neutral",
                        size: "large",
                        disabled: l.isLoading || 0 === a.current,
                        style: {
                            width: "24px",
                            height: "24px",
                            minWidth: "24px",
                            minHeight: "24px",
                            padding: "4px"
                        }
                    })))
                })),
                Ur = Object(W.forwardRef)(((e, r) => q.a.createElement(Kr, Object(xr.a)({}, e, {
                    label: je.a.str("STR_BUSINESS_INFO_EMAIL"),
                    ref: r,
                    autoComplete: "off",
                    placeholder: je.a.str("STR_LOGIN_ZENTERPRISE_ENTER_EMAIL")
                }))));
            var Gr = i("6Be5");
            const Wr = ({}) => {
                    var e;
                    const [r, i] = q.a.useState(!1), t = q.a.useRef(null), s = q.a.useCallback((() => {
                        i(!0)
                    }), []), n = q.a.useCallback((() => {
                        i(!1)
                    }), []);
                    q.a.useEffect((() => {
                        const e = e => {
                            t.current && !t.current.contains(e.target) && i(!1)
                        };
                        return r && document.addEventListener("mousedown", e), () => {
                            document.removeEventListener("mousedown", e)
                        }
                    }), [r]);
                    const g = null === (e = Rr.default.authentication.zent_explanation_text) || void 0 === e ? void 0 : e[Ge.getCurrentLanguageName() || "vi"];
                    return q.a.createElement("span", {
                        className: "flx flx-al-c bs"
                    }, q.a.createElement(Se.a, {
                        textKey: "STR_LOGIN_ZENTERPRISE_ONLY_SUPPORT",
                        style: {
                            margin: "0",
                            color: "var(--text-secondary)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 400,
                            alignSelf: "start",
                            marginRight: "4px"
                        },
                        tagName: "span"
                    }), g ? q.a.createElement(Gr.a, {
                        disableHoverListener: !0,
                        open: r,
                        onClose: n,
                        title: q.a.createElement("div", {
                            className: "search-message-promote__tip flx-al-s",
                            style: {
                                columnGap: "8px"
                            }
                        }, q.a.createElement("span", null, g), q.a.createElement(Ie.a, {
                            onClick: n,
                            icon: "Close_24_Line",
                            className: "clickable search-message-promote__tip-close"
                        }))
                    }, q.a.createElement("div", {
                        ref: t
                    }, q.a.createElement(Se.a, {
                        onClick: s,
                        textKey: "STR_LOGIN_ZENTERPRISE_ACCOUNT",
                        className: "clickable",
                        style: {
                            margin: "0",
                            color: "var(--text-information)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 400,
                            alignSelf: "start"
                        },
                        tagName: "div"
                    }))) : q.a.createElement(Se.a, {
                        onClick: s,
                        textKey: "STR_LOGIN_ZENTERPRISE_ACCOUNT",
                        style: {
                            margin: "0",
                            color: "var(--text-information)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 400,
                            alignSelf: "start"
                        },
                        tagName: "div"
                    }))
                },
                qr = Object(W.forwardRef)(((e, r) => {
                    const i = Object(W.useRef)(null),
                        [t, s] = q.a.useState(!1);
                    return Object(W.useImperativeHandle)(r, (() => i.current), []), q.a.createElement("div", {
                        className: "rel flx-1 flx-al-c w100",
                        onClick: () => {
                            var e, r;
                            null === (e = i.current) || void 0 === e || null === (r = e.focus) || void 0 === r || r.call(e)
                        }
                    }, q.a.createElement("fieldset", {
                        className: "flx w100 bs",
                        style: {
                            margin: 0,
                            padding: 0,
                            border: "none"
                        }
                    }, q.a.createElement(Kr, Object(xr.a)({}, e, {
                        required: !0,
                        ref: i,
                        label: je.a.str("STR_PASSWORD"),
                        placeholder: je.a.str("STR_LOGIN_ZENTERPRISE_ENTER_PASSWORD"),
                        type: t ? "text" : "password",
                        maxLength: 100,
                        style: {
                            paddingRight: "40px"
                        }
                    })), q.a.createElement(Ie.a, {
                        icon: t ? "Eye_Off_24_Line" : "Eye_On_24_Line",
                        className: "toggle-pw-visiblity",
                        style: {
                            width: "24px",
                            height: "24px",
                            fontSize: "24px",
                            position: "absolute",
                            right: "12px",
                            bottom: "8px"
                        },
                        onClick: e => {
                            e && (e.stopPropagation(), e.preventDefault()), s(!t)
                        }
                    })))
                }));
            const Hr = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/iu,
                Vr = ({
                    isFocus: e
                }) => {
                    const r = he(),
                        i = ve({
                            email: "",
                            hasErrorEmail: !1,
                            errorMessageEmail: "",
                            password: "",
                            hasErrorPassword: !1,
                            captcha: "",
                            captchaToken: "",
                            hasErrorCaptcha: !1,
                            errorMessage: "",
                            coutingFailureSubmited: 0,
                            isReloadCaptcha: !1,
                            currentLanguage: Ge.getCurrentLanguageName() || "vi"
                        }),
                        t = Object(W.useRef)(null),
                        s = Object(W.useRef)(null),
                        n = Object(W.useRef)(null),
                        g = Object(W.useRef)(null),
                        D = Fe((() => i.email.length > 0 && Hr.test(i.email) && i.password.length >= 3 && i.captcha.length > 0));
                    async function a() {
                        var e;
                        "activeElement" in document && (null === (e = document.activeElement) || void 0 === e || e.blur());
                        try {
                            r.loginSession.isLoading.next(!0);
                            const e = await async function({
                                email: e,
                                pass: r,
                                captcha: i,
                                captchaToken: t,
                                imei: s
                            }) {
                                try {
                                    const d = await We.default.signInZEnterpriseWithEmail({
                                            email: e,
                                            password: r,
                                            captcha: i,
                                            token: t,
                                            imei: s,
                                            language: Ge.getCurrentLanguageName(),
                                            loggedUids: Er.a.getUidLogin()
                                        }),
                                        l = ir(null == d ? void 0 : d.data);
                                    if ("Right" === l._tag) {
                                        var n, g, D, a, c;
                                        const e = l.value,
                                            r = null !== (n = null == e ? void 0 : e.uid) && void 0 !== n ? n : "",
                                            i = null !== (g = null == e ? void 0 : e.dkey) && void 0 !== g ? g : "",
                                            t = Br();
                                        r && i && (t.init(r, i), Object(Te.c)(r) || t.setItemForCurrentUser(Or, "1"));
                                        const s = !(null === (D = l.value) || void 0 === D || !D.needSyncMsg) || !(null === (a = l.value) || void 0 === a || !a.sync_msg_info);
                                        return t.setItem("z_needSyncMsg", s ? "1" : ""), t.setItem(Tr, Xe.a.getValueRememberLogin() ? "1" : ""), t.setItem(Mr, `${Xe.a.getValueActionLogRemember()}`), t.setItem("FORCE_GET_FRIEND_LIST", "1"), await $zelectron.setAppCookie(null !== (c = null == e ? void 0 : e.zpw_sek) && void 0 !== c ? c : ""), r
                                    }
                                    throw l.value
                                } catch (d) {
                                    if (d instanceof Error && "Network Error" === d.message) throw new rr({
                                        code: "STR_CONNECTION_ERROR",
                                        message: "STR_CONNECTION_ERROR",
                                        name: "Network Error"
                                    });
                                    throw d
                                }
                            }({
                                email: i.email,
                                pass: i.password,
                                captcha: i.captcha,
                                captchaToken: i.captchaToken,
                                imei: Y()
                            });
                            r.stateMachine.handler(Ae.main_accepted_login), r.stateMachine.state.data = {
                                typeLogin: Ye().LOGIN_TYPE_ZENTERPRISE_EMAIL
                            }, r.loginSession.loginStateStream.next(r.stateMachine.state), r.loginSession.logInfoV2Stream.next({
                                type: 152404,
                                subType: 0,
                                data: {
                                    authentication_status: !0,
                                    login_method: "zenterprise_email",
                                    uid: e
                                }
                            })
                        } catch (t) {
                            if (i.isReloadCaptcha = !0, r.loginSession.logInfoV2Stream.next({
                                    type: 152404,
                                    subType: 0,
                                    data: {
                                        authentication_status: !1,
                                        login_method: "zenterprise_email",
                                        error_code: (null == t ? void 0 : t.code) || (null == t ? void 0 : t.error_code) || t
                                    }
                                }), r.stateMachine.state.error(`Submit login with zenterprise email was failed: ${JSON.stringify(t)}`), t instanceof rr) {
                                if ("string" == typeof t.code) return i.errorMessage = Ge.str("STR_SIGNIN_ERROR_NO_NETWORK"), void(i.captcha = "");
                                switch (t.code) {
                                    case dr.INVALID_EMAIL_OR_PASSWORD:
                                        i.hasErrorEmail = !0, i.hasErrorPassword = !0, i.hasErrorCaptcha = !0, i.errorMessage = t.message;
                                        break;
                                    case dr.INVALID_CAPTCHA:
                                    case dr.CAPTCHA_EXPIRED:
                                    case dr.CAPTCHA_REQUIRED:
                                        i.hasErrorEmail = !1, i.hasErrorPassword = !1, i.hasErrorCaptcha = !0, i.errorMessage = t.message;
                                        break;
                                    case dr.USER_WAS_BANNED:
                                    case dr.ACCOUNT_NOT_ACTIVE:
                                        i.hasErrorEmail = !1, i.hasErrorPassword = !1, i.hasErrorCaptcha = !1, i.errorMessage = t.message;
                                        break;
                                    case dr.PASSWORD_NOT_SET:
                                        i.hasErrorEmail = !1, i.hasErrorPassword = !0, i.hasErrorCaptcha = !1, i.errorMessage = t.message;
                                        break;
                                    default:
                                        i.errorMessage = Ge.str("STR_ERROR_UNKNOWN")
                                }
                            }
                        } finally {
                            r.loginSession.isLoading.next(!1), i.isReloadCaptcha = !1
                        }
                    }
                    return Object(W.useEffect)((() => {
                        var r;
                        e && (null === (r = s.current) || void 0 === r || r.focus(), s.current && (s.current.value = "", i.email = ""))
                    }), [e]), Object(W.useEffect)((() => {
                        const e = () => {
                            i.currentLanguage = Ge.getCurrentLanguageName()
                        };
                        Ge.callUpdate(e);
                        const t = r.loginSession.loginStateStream.subscribe((e => {
                            (null == e ? void 0 : e.key) !== ye.LoginEmail && (i.email = "", i.hasErrorEmail = !1, i.password = "", i.hasErrorPassword = !1, i.captcha = "", i.hasErrorCaptcha = !1, i.captchaToken = "", i.errorMessage = "", i.errorMessageEmail = "")
                        }));
                        return () => {
                            Ge.removeUpdate(e), t()
                        }
                    }), []), q.a.createElement(W.Fragment, null, q.a.createElement("form", {
                        ref: t,
                        className: "w100 h100 flx flx-col flx-start flx-al-c bs",
                        style: {
                            flex: 1,
                            padding: "60px 32px 0px 32px",
                            gap: "48px"
                        },
                        onSubmit: e => {
                            e.preventDefault(), a()
                        }
                    }, q.a.createElement("div", {
                        className: "w100 flx flx-col flx-center flx-al-c bs",
                        style: {
                            gap: "16px"
                        }
                    }, q.a.createElement("img", {
                        draggable: !1,
                        src: ze.a,
                        style: {
                            height: "32px",
                            alignSelf: "center"
                        }
                    }), q.a.createElement("div", {
                        className: "flx flx-col bs",
                        style: {
                            gap: "8px"
                        }
                    }, q.a.createElement(Se.a, {
                        textKey: "STR_LOGIN_EMAIL_PAGE",
                        style: {
                            margin: "0",
                            color: "var(--text-primary)",
                            fontSize: "18px",
                            lineHeight: "24px",
                            fontWeight: 600,
                            alignSelf: "center"
                        },
                        tagName: "div"
                    }), q.a.createElement(Wr, null))), q.a.createElement("div", {
                        className: "w100 flx flx-col flx-start flx-al-c bs",
                        style: {
                            gap: "20px"
                        }
                    }, q.a.createElement(Ur, {
                        ref: s,
                        value: i.email,
                        onBlur: function() {
                            i.email.length > 0 && !Hr.test(i.email) && (i.hasErrorEmail = !0, i.errorMessageEmail = Ge.str("STR_LOGIN_EMAIL_INVALID_FORMAT"))
                        },
                        hasError: i.hasErrorEmail,
                        onChange: function(e) {
                            i.email = e.currentTarget.value.trim(), i.errorMessage = "", i.hasErrorEmail = !1, i.hasErrorPassword = !1, i.errorMessageEmail = ""
                        }
                    }), q.a.createElement(qr, {
                        ref: n,
                        value: i.password,
                        hasError: i.hasErrorPassword,
                        onChange: function(e) {
                            i.password = e.currentTarget.value, i.errorMessage = "", i.hasErrorEmail = !1, i.hasErrorPassword = !1
                        },
                        onKeyDown: function(e) {
                            13 === e.keyCode && (D.value && a(), e.preventDefault())
                        }
                    }), q.a.createElement(jr, {
                        ref: g,
                        isInit: e,
                        value: i.captcha,
                        isReset: i.isReloadCaptcha,
                        hasError: i.hasErrorCaptcha,
                        onChangeCaptcha: function(e, r) {
                            i.captcha = e, i.captchaToken = r, (e || r) && (i.errorMessage = "", i.hasErrorCaptcha = !1)
                        },
                        onKeyDown: function(e) {
                            13 === e.keyCode && (D.value && a(), e.preventDefault())
                        }
                    }), q.a.createElement("span", {
                        className: "login-error-message" + (i.errorMessage || i.errorMessageEmail ? "" : "--none"),
                        style: {
                            textAlign: "start",
                            width: "100%",
                            marginTop: "-8px"
                        }
                    }, i.errorMessage || i.errorMessageEmail), q.a.createElement(hr.a, {
                        textKey: "STR_SIGNIN",
                        onClick: () => {
                            var e;
                            null === (e = t.current) || void 0 === e || e.dispatchEvent(new Event("submit", {
                                cancelable: !0,
                                bubbles: !0
                            }))
                        },
                        disabled: !D.value,
                        size: "large",
                        style: {
                            margin: "0",
                            width: "100%"
                        }
                    }))), q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "row",
                            padding: "16px 32px 16px 32px",
                            gap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box"
                        }
                    }, q.a.createElement(hr.a, {
                        size: "medium",
                        textKey: "STR_LOGIN_QR_PAGE",
                        onClick: () => {
                            var e;
                            r.stateMachine.handler(Ae.main_choose_login_qr), e && (r.stateMachine.state.data = {
                                error_from_login_password: e
                            }), r.loginSession.loginStateStream.next(r.stateMachine.state), i.email = "", i.hasErrorEmail = !1, i.password = "", i.hasErrorPassword = !1, i.captcha = "", i.hasErrorCaptcha = !1, i.captchaToken = "", i.errorMessage = "", i.errorMessageEmail = ""
                        },
                        type: "tertiary-neutral"
                    })))
                };
            const Yr = ({
                next: e
            }) => {
                var r, i, t, s;
                const n = he(),
                    g = ve({
                        errorMessage: "",
                        otp: "",
                        secQuestion: null
                    }),
                    D = Object(W.useRef)(null),
                    a = Fe((() => g.otp.length > 0 && "" === g.errorMessage));
                async function c() {
                    try {
                        var r, i, t, s;
                        n.loginSession.isLoading.next(!0);
                        const a = await async function({
                            imei: e,
                            phoneNumber: r,
                            isoCode: i,
                            otp: t,
                            timeZone: s,
                            language: n
                        }) {
                            try {
                                const y = await We.default.validateActiveCode(e, r, i, t, s, !0, 3, {
                                        language: n
                                    }),
                                    p = ir(null == y ? void 0 : y.data);
                                var g, D, a, c, d, l, h, o;
                                if ("Right" === p._tag) return Br().setItem("FORGOT_PASSWORD", "1"), {
                                    enk: null !== (g = null === (D = p.value) || void 0 === D ? void 0 : D.enk) && void 0 !== g ? g : "",
                                    question: null !== (a = null === (c = p.value) || void 0 === c ? void 0 : c.question) && void 0 !== a ? a : null,
                                    requireSEQ: null !== (d = null === (l = p.value) || void 0 === l ? void 0 : l.requireSEQ) && void 0 !== d ? d : 0,
                                    token: null !== (h = null === (o = p.value) || void 0 === o ? void 0 : o.token) && void 0 !== h ? h : ""
                                };
                                throw p.value
                            } catch (y) {
                                if (y instanceof Error && "Network Error" === y.message) throw new rr({
                                    code: "STR_CONNECTION_ERROR",
                                    message: "STR_CONNECTION_ERROR",
                                    name: "Network Error"
                                });
                                throw y
                            }
                        }({
                            imei: Y(),
                            isoCode: null !== (r = null === (i = n.stateMachine.state.data) || void 0 === i ? void 0 : i.countryIsoCode) && void 0 !== r ? r : "VN",
                            otp: g.otp,
                            phoneNumber: null !== (t = null === (s = n.stateMachine.state.data) || void 0 === s ? void 0 : s.phoneNumber) && void 0 !== t ? t : "",
                            timeZone: _r(),
                            language: Ge.getCurrentLanguageName()
                        });
                        if (a.token && (n.stateMachine.state.data.authToken = a.token), a.enk && (D = a.enk, G.default.setDecryptKey(D)), 1 === a.requireSEQ) return g.secQuestion = wr(a.question), void n.stateMachine.state.noti("Verify otp successfully but required security question");
                        n.stateMachine.state.noti("Verify otp successfully"), e()
                    } catch (a) {
                        n.stateMachine.state.error(`Verify otp was failed: ${JSON.stringify(a)}`), a instanceof rr ? "string" == typeof(null == a ? void 0 : a.code) ? g.errorMessage = Ge.str(a.code) : 18025 === (null == a ? void 0 : a.code) ? g.errorMessage = Ge.str("STR_SIGNIN_ERROR_INVALID_PHONE_NUMBER") : g.errorMessage = a.message : g.errorMessage = Ge.str("STR_ERROR_UNKNOWN")
                    } finally {
                        n.loginSession.isLoading.next(!1)
                    }
                    var D
                }
                return Object(W.useEffect)((() => {
                    var e;
                    return null === (e = D.current) || void 0 === e || e.focus(), D.current && D.current.addEventListener("input", (function() {
                        var e;
                        this.value = this.value.replace(/[^0-9]/g, ""), e = this.value, g.otp = e, g.errorMessage = ""
                    })), () => {
                        var e, r;
                        null === (e = D.current) || void 0 === e || e.blur(), null === (r = D.current) || void 0 === r || r.removeEventListener("input", (() => {}))
                    }
                }), [D.current]), q.a.createElement(W.Fragment, null, q.a.createElement("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "16px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        boxSizing: "border-box"
                    }
                }, q.a.createElement(Se.a, {
                    textKey: "STR_RESET_PASSWORD_PAGE_INSTRUCTION_SEND_SMS",
                    style: {
                        margin: "0",
                        color: "var(--B95)",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "20px",
                        alignSelf: "center",
                        textAlign: "center"
                    },
                    tagName: "div"
                }), q.a.createElement("input", {
                    className: "forget-password-page__input-otp",
                    required: !0,
                    type: "text",
                    ref: D,
                    onKeyDown: function(e) {
                        13 == e.which && (a.value && c(), e.preventDefault())
                    },
                    "data-translate-placeholder": "STR_ACTIVATION_CODE",
                    placeholder: Ge.str("STR_ACTIVATION_CODE")
                }), q.a.createElement("span", {
                    className: "login-error-message" + (g.errorMessage ? "" : "--none"),
                    style: {
                        marginTop: "-8px"
                    }
                }, g.errorMessage)), q.a.createElement("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "16px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        boxSizing: "border-box"
                    }
                }, q.a.createElement(hr.a, {
                    textKey: "STR_CONTINUE",
                    onClick: () => {
                        c()
                    },
                    disabled: !a.value,
                    size: "large",
                    "data-id": "btn_forget_password_verify_otp",
                    style: {
                        margin: "0",
                        width: "100%"
                    }
                })), null !== g.secQuestion && q.a.createElement(Fr, {
                    usedForResetPassword: !0,
                    dataUser: {
                        isoCode: null !== (r = null === (i = n.stateMachine.state.data) || void 0 === i ? void 0 : i.countryIsoCode) && void 0 !== r ? r : "84",
                        token: n.stateMachine.state.data.authToken || "",
                        phone: null !== (t = null === (s = n.stateMachine.state.data) || void 0 === s ? void 0 : s.phoneNumber) && void 0 !== t ? t : "0"
                    },
                    dataSecQues: g.secQuestion,
                    onBack: (e, r) => {
                        g.secQuestion = null, e && r && (n.stateMachine.state.error(`Answer security question failed: ${r}`), n.loginSession.popupStream.next(q.a.createElement(or.default, {
                            visible: !0,
                            showCloseButton: !1,
                            idName: "noti-answer-security-too-much-when-reset-password",
                            noPadding: !0,
                            border: "no-border",
                            title: Ge.str("STR_CONFIG_NOTI"),
                            style: {
                                borderRadius: "8px",
                                background: "transparent"
                            },
                            okText: Ge.str("STR_CLOSE"),
                            onCloseConfirm: () => {
                                n.loginSession.popupStream.next(null)
                            },
                            preventPageClickForceClose: !1,
                            message: r
                        })))
                    },
                    onSubmit: async r => {
                        n.stateMachine.state.data.answerData = r, n.stateMachine.state.noti("Answer security question successfully"), e()
                    }
                }))
            };
            const Xr = ({
                submit: e
            }) => {
                const r = Object(W.useRef)(null),
                    i = Object(W.useRef)(null),
                    t = he(),
                    s = ve({
                        errorMessage: "",
                        rules: []
                    });
                async function n() {
                    (function(e) {
                        let r = !0;
                        s.errorMessage = "";
                        for (let t = 0; t < s.rules.length; t++)
                            if (r = r && RegExp(s.rules[t].regex).test(e), !r) {
                                var i;
                                if (s.errorMessage = null !== (i = s.rules[t]["vi" === Ge.getCurrentLanguageName() ? "msg" : "msg_en"]) && void 0 !== i ? i : "", "" !== s.errorMessage) break;
                                r = !0
                            } return r
                    })(r.current.value) && function(e) {
                        let i = !0;
                        return e === r.current.value ? s.errorMessage = "" : (s.errorMessage = Ge.str("STR_CONFORM_PW_NOT_MATCH"), i = !1), i
                    }(i.current.value) && (t.loginSession.isLoading.next(!0), async function({
                        phoneNumber: e,
                        countryCode: r,
                        isoCode: i,
                        password: t,
                        rePassword: s,
                        authToken: n,
                        timeZone: g,
                        imei: D,
                        language: a,
                        answerData: c
                    }) {
                        try {
                            const p = await We.default.loginByResetPassword(e, D, G.default.encodeAES(`${t}`.trim()), G.default.encodeAES(`${s}`.trim()), n, g, i, a, c),
                                A = ir(null == p ? void 0 : p.data);
                            if ("Right" !== A._tag) throw A.value;
                            var d, l, h;
                            if (!(null !== (d = A.value) && void 0 !== d && d.quest_cert || null !== (l = A.value) && void 0 !== l && l.zpw_sek)) throw new rr({});
                            if (null !== (h = A.value) && void 0 !== h && h.zpw_sek) {
                                var o, y;
                                const t = A.value,
                                    s = null !== (o = null == t ? void 0 : t.uid) && void 0 !== o ? o : "",
                                    n = null !== (y = null == t ? void 0 : t.dkey) && void 0 !== y ? y : "";
                                if (s && n) {
                                    const e = Object(Te.c)(s);
                                    Br().init(s, n), e || Br().setItemForCurrentUser(Ye().FirstLoginLocalStorageKeys.IS_FIRST_LOGIN, "1")
                                }
                                const g = {
                                    code: r,
                                    iso: i
                                };
                                return Br().setItem(G.RECENT_PHONE, e), Br().setItem(G.RECENT_COUNTRY, JSON.stringify(g)), Br().setItem(Ye().KEY_REMEMBER, Xe.a.getValueRememberLogin() ? "1" : ""), Br().setItem(Ye().KEY_SET_VALUE_ACTION_LOG, `${Xe.a.getValueActionLogRemember()}`), Br().setItem("FORCE_GET_FRIEND_LIST", "1"), await $zelectron.setAppCookie(t.zpw_sek), await gr(t, !0), Br().removeItem("FORGOT_PASSWORD"), s
                            }
                        } catch (p) {
                            if (p instanceof Error && "Network Error" === p.message) throw new rr({
                                code: "STR_CONNECTION_ERROR",
                                message: "STR_CONNECTION_ERROR",
                                name: "Network Error"
                            });
                            throw p
                        }
                        throw new rr({})
                    }({
                        imei: Y(),
                        countryCode: t.stateMachine.state.data.countryCode,
                        isoCode: t.stateMachine.state.data.countryIsoCode,
                        phoneNumber: t.stateMachine.state.data.phoneNumber,
                        password: r.current.value,
                        rePassword: i.current.value,
                        authToken: t.stateMachine.state.data.authToken,
                        language: Ge.getCurrentLanguageName(),
                        timeZone: _r(),
                        answerData: t.stateMachine.state.data.answerData || null
                    }).then((r => {
                        t.stateMachine.state.noti("Submit login by new password successfully"), e(r)
                    })).catch((e => {
                        t.stateMachine.state.error(`Submit login by new password was failed: ${JSON.stringify(e)}`), e instanceof rr ? "string" == typeof(null == e ? void 0 : e.code) ? s.errorMessage = Ge.str(e.code) : s.errorMessage = e.message : s.errorMessage = Ge.str("STR_ERROR_UNKNOWN"), t.loginSession.logInfoV2Stream.next({
                            type: 152404,
                            subType: 0,
                            data: {
                                authentication_status: !1,
                                login_method: "recover_password",
                                error_code: (null == e ? void 0 : e.code) || (null == e ? void 0 : e.error_code) || e
                            }
                        })
                    })).finally((() => {
                        t.loginSession.isLoading.next(!1)
                    })))
                }
                return Object(W.useEffect)((() => {
                    t.loginSession.isLoading.next(!0), async function(e) {
                        try {
                            return await G.default.getPasswordRules(e, We.default) || []
                        } catch (r) {
                            throw r
                        }
                    }(Y()).then((e => {
                        t.stateMachine.state.error((function(e) {
                            return e[0]
                        })`Get rule update password successfully`), s.rules = e
                    })).catch((e => {
                        t.stateMachine.state.error(`Get rule update password failed: ${JSON.stringify(e)}`)
                    })).finally((() => {
                        var e;
                        t.loginSession.isLoading.next(!1), null === (e = r.current) || void 0 === e || e.focus()
                    }))
                }), []), q.a.createElement(W.Fragment, null, q.a.createElement("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "16px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        boxSizing: "border-box"
                    }
                }, q.a.createElement(Se.a, {
                    textKey: "STR_RESET_PASSWORD_PAGE_NOTE_DESCRIPTION_NEW_PASSWORD",
                    style: {
                        textAlign: "center"
                    }
                }), q.a.createElement(ur, {
                    textKey: "STR_NEW_PASSWORD",
                    inputRef: e => {
                        r.current = e
                    },
                    domRef: r.current,
                    onChange: () => {
                        s.errorMessage = ""
                    },
                    onKeyPress: e => {
                        ! function(e) {
                            13 == e.which && ("" === s.errorMessage && n(), e.preventDefault())
                        }(e)
                    },
                    style: {
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 0px"
                    }
                }), q.a.createElement(ur, {
                    textKey: "STR_CONFIRM_NEW_PASSWORD",
                    inputRef: e => {
                        i.current = e
                    },
                    domRef: i.current,
                    onChange: () => {
                        s.errorMessage = ""
                    },
                    onKeyPress: e => {
                        ! function(e) {
                            13 == e.which && ("" === s.errorMessage && n(), e.preventDefault())
                        }(e)
                    },
                    style: {
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 0px"
                    }
                }), q.a.createElement("span", {
                    className: "login-error-message" + (s.errorMessage ? "" : "--none"),
                    style: {
                        width: "100%",
                        textAlign: "start",
                        marginTop: "-8px"
                    }
                }, s.errorMessage)), q.a.createElement("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "16px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        boxSizing: "border-box"
                    }
                }, q.a.createElement(hr.a, {
                    textKey: "STR_LOGIN_PASSWORD_PAGE_SUBMIT_NEW_PASSWORD",
                    onClick: () => {
                        n()
                    },
                    disabled: "" !== s.errorMessage,
                    size: "large",
                    "data-id": "btn_forget_password_verify_phone",
                    style: {
                        margin: "0",
                        width: "100%"
                    }
                })))
            };
            const $r = ({
                next: e
            }) => {
                var r, i, t, s, n, g, D, a;
                const c = Object(W.useRef)(null),
                    d = he(),
                    l = ve({
                        phoneNumber: null !== (r = null === (i = d.stateMachine.state.data) || void 0 === i ? void 0 : i.phoneNumber) && void 0 !== r ? r : "",
                        countryCode: null !== (t = null === (s = d.stateMachine.state.data) || void 0 === s ? void 0 : s.countryCode) && void 0 !== t ? t : 84,
                        countryIsoCode: null !== (n = null === (g = d.stateMachine.state.data) || void 0 === g ? void 0 : g.countryIsoCode) && void 0 !== n ? n : "VN",
                        enableNext: (null !== (D = null === (a = d.stateMachine.state.data) || void 0 === a ? void 0 : a.phoneNumber) && void 0 !== D ? D : "").length >= 6,
                        errorMessage: ""
                    });
                async function h() {
                    try {
                        var r;
                        d.loginSession.isLoading.next(!0), await async function({
                            imei: e,
                            phoneNumber: r,
                            isoCode: i,
                            language: t,
                            context: s = 2,
                            captchaAnswer: n = "",
                            captchaToken: g = null,
                            activeType: D = 1
                        }) {
                            try {
                                const a = {
                                        language: t,
                                        context: s,
                                        captchaToken: g,
                                        captchaAnswer: n
                                    },
                                    c = await We.default.verifyPhoneNumber(e, r, i, D, a),
                                    d = ir(null == c ? void 0 : c.data);
                                if ("Right" === d._tag) return;
                                throw d.value
                            } catch (a) {
                                if (a instanceof Error && "Network Error" === a.message) throw new rr({
                                    code: "STR_CONNECTION_ERROR",
                                    message: "STR_CONNECTION_ERROR",
                                    name: "Network Error"
                                });
                                throw a
                            }
                        }({
                            imei: Y(),
                            isoCode: null !== (r = l.countryIsoCode) && void 0 !== r ? r : "VN",
                            language: Ge.getCurrentLanguageName(),
                            phoneNumber: l.phoneNumber
                        }), d.stateMachine.state.data = {
                            phoneNumber: l.phoneNumber,
                            countryCode: l.countryCode,
                            countryIsoCode: l.countryIsoCode
                        }, d.stateMachine.state.noti("Verify phone number successfully"), e()
                    } catch (i) {
                        d.stateMachine.state.error(`Verify phone number was failed: ${JSON.stringify(i)}`), i instanceof rr ? "string" == typeof(null == i ? void 0 : i.code) ? l.errorMessage = Ge.str(i.code) : i.code === dr.REJECTED_OTP ? (d.stateMachine.state.data = {
                            phoneNumber: l.phoneNumber,
                            countryCode: l.countryCode,
                            countryIsoCode: l.countryIsoCode
                        }, e()) : l.errorMessage = Ge.str("STR_SIGNIN_ERROR_INVALID_PHONE_NUMBER") : l.errorMessage = Ge.str("STR_ERROR_UNKNOWN")
                    } finally {
                        d.loginSession.isLoading.next(!1)
                    }
                }
                return Object(W.useEffect)((() => {
                    var e;
                    return null === (e = c.current) || void 0 === e || e.focus(), () => {
                        var e;
                        null === (e = c.current) || void 0 === e || e.blur()
                    }
                }), [c.current]), q.a.createElement(W.Fragment, null, q.a.createElement("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "16px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        boxSizing: "border-box"
                    }
                }, q.a.createElement(Se.a, {
                    textKey: "STR_ENTER_PHONE_FOR_ACTIVATION_CODE",
                    style: {
                        margin: "0",
                        color: "var(--B95)",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "20px",
                        alignSelf: "center",
                        textAlign: "center"
                    },
                    tagName: "div"
                }), q.a.createElement(Ir, {
                    countryCode: l.countryCode,
                    countryIsoCode: l.countryIsoCode,
                    phoneNumber: l.phoneNumber,
                    textKey: "STR_PHONE_NUMBER",
                    onChange: ({
                        countryCode: e,
                        countryIsoCode: r,
                        phoneNumber: i
                    }) => {
                        var t;
                        t = {
                            countryCode: e,
                            countryIsoCode: r,
                            phoneNumber: i
                        }, l.errorMessage = "", l.phoneNumber = t.phoneNumber, l.countryIsoCode = t.countryIsoCode, l.countryCode = t.countryCode, l.enableNext = l.phoneNumber.length >= 6
                    },
                    inputProps: {
                        placeholder: Ge.str("STR_PHONE_NUMBER"),
                        onKeyPress: e => {
                            ! function(e) {
                                13 == e.which && (l.enableNext && h(), e.preventDefault())
                            }(e)
                        }
                    },
                    ref: c
                }), q.a.createElement("span", {
                    className: "login-error-message" + (l.errorMessage ? "" : "--none"),
                    style: {
                        marginTop: "-8px",
                        width: "100%",
                        textAlign: "start"
                    }
                }, l.errorMessage)), q.a.createElement("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "16px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        boxSizing: "border-box"
                    }
                }, q.a.createElement(hr.a, {
                    textKey: "STR_CONTINUE",
                    onClick: () => {
                        h()
                    },
                    disabled: !l.enableNext || "" !== l.errorMessage,
                    size: "large",
                    "data-id": "btn_forget_password_verify_phone",
                    style: {
                        margin: "0",
                        width: "100%"
                    }
                })))
            };
            i("36dD");
            const Jr = () => {
                const e = he(),
                    r = ve({
                        step: "idle"
                    });

                function i() {
                    e.stateMachine.handler(Ae.main_choose_login_normal), e.stateMachine.state.data = {
                        phoneNumber: "",
                        countryIsoCode: "VN",
                        countryCode: 84,
                        authToken: ""
                    }, e.loginSession.loginStateStream.next(e.stateMachine.state), r.step = "idle"
                }
                return Object(W.useEffect)((() => {
                    "idle" === r.step && e.stateMachine.state.key === ye.ForgetPassword ? r.step = "verify-phone" : e.stateMachine.state.key !== ye.ForgetPassword && "idle" !== r.step && (r.step = "idle")
                }), [r.step, e.stateMachine.state]), q.a.createElement(W.Fragment, null, q.a.createElement("div", {
                    className: "forget-password-page"
                }, q.a.createElement("div", {
                    className: "title"
                }, q.a.createElement("img", {
                    draggable: !1,
                    src: ze.a,
                    style: {
                        height: "32px",
                        alignSelf: "center"
                    }
                }), "idle" !== r.step && q.a.createElement(Se.a, {
                    textKey: (() => {
                        switch (r.step) {
                            case "verify-phone":
                                return "STR_PASSWORD_RECOVERY";
                            case "required-otp":
                                return "STR_VERIFY_ACCOUNT";
                            case "setup-password":
                                return "STR_UPDATE_LOGIN_PASSWORD"
                        }
                    })(),
                    style: {
                        margin: "0",
                        color: "var(--text-primary)",
                        fontSize: "18px",
                        lineHeight: "24px",
                        fontWeight: 600,
                        alignSelf: "center"
                    },
                    tagName: "div"
                })), q.a.createElement("div", {
                    className: "body"
                }, "verify-phone" === r.step && q.a.createElement($r, {
                    next: () => {
                        r.step = "required-otp"
                    }
                }), "required-otp" === r.step && q.a.createElement(Yr, {
                    next: () => {
                        r.step = "setup-password"
                    }
                }), "setup-password" === r.step && q.a.createElement(Xr, {
                    submit: r => {
                        var i;
                        i = r, e.stateMachine.state.data = null, e.stateMachine.handler(Ae.main_accepted_login), e.stateMachine.state.data = {
                            typeLogin: Ye().LOGIN_TYPE_PASSWORD
                        }, e.loginSession.loginStateStream.next(e.stateMachine.state), e.loginSession.logInfoV2Stream.next({
                            type: 152404,
                            subType: 0,
                            data: {
                                authentication_status: !0,
                                login_method: "recover_password",
                                uid: i
                            }
                        })
                    }
                }))), q.a.createElement("div", {
                    className: "forget-password-page__footer"
                }, q.a.createElement(hr.a, {
                    size: "medium",
                    textKey: "STR_CANCEL",
                    onClick: () => {
                        "setup-password" === r.step ? e.loginSession.popupStream.next(q.a.createElement(or.default, {
                            visible: !0,
                            showCloseButton: !0,
                            idName: "noti-user-really-want-to-cancel-change-password-modal",
                            noPadding: !0,
                            border: "no-border",
                            style: {
                                borderRadius: "8px",
                                background: "transparent"
                            },
                            okText: Ge.str("STR_DISCARD"),
                            okType: "secondary-danger",
                            cancelText: Ge.str("STR_CLOSE"),
                            onOk: () => {
                                i()
                            },
                            onCloseConfirm: () => {
                                e.loginSession.popupStream.next(null)
                            },
                            preventPageClickForceClose: !0,
                            message: Ge.str("STR_DISCARD_RESET_PW")
                        })) : i()
                    },
                    className: "footer-btn",
                    type: "tertiary-neutral"
                })))
            };
            i("47Cz");
            const Zr = 0,
                ei = 1,
                ri = () => {
                    const [e, r] = q.a.useState(Zr), i = Object(W.useRef)(null);

                    function t() {
                        i.current = window.setTimeout((() => {
                            r(ei)
                        }), 12e4)
                    }
                    return q.a.useEffect((() => (t(), () => {
                        null !== i.current && clearTimeout(i.current)
                    })), []), e === Zr ? q.a.createElement("div", {
                        className: "network-comp--no-network-banner"
                    }, q.a.createElement(Ie.a, {
                        icon: "outline-disconnect",
                        style: {
                            color: "var(--text-primary)"
                        }
                    }), q.a.createElement(Se.a, {
                        tagName: "div",
                        textKey: "STR_INFO_NO_NETWORK",
                        style: {
                            color: "var(--text-primary)"
                        }
                    })) : q.a.createElement("div", {
                        className: "network-comp--no-network-screen"
                    }, q.a.createElement("div", {
                        className: "body"
                    }, q.a.createElement("img", {
                        draggable: !1,
                        src: ze.a,
                        style: {
                            height: "32px",
                            alignSelf: "center"
                        }
                    }), q.a.createElement("div", {
                        className: "content"
                    }, q.a.createElement(Ie.a, {
                        icon: "icon-disconnect",
                        style: {
                            color: "var(--icon-secondary)",
                            fontSize: "68px"
                        }
                    }), q.a.createElement("span", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "356px"
                        }
                    }, q.a.createElement(Se.a, {
                        textKey: "STR_CANT_CONNECT_1",
                        tagName: "div",
                        style: {
                            fontSize: "1.125rem",
                            fontWeight: 500,
                            lineHeight: "1.5",
                            textAlign: "center"
                        }
                    }), q.a.createElement(Se.a, {
                        textKey: "STR_CANT_CONNECT_3",
                        tagName: "div",
                        style: {
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            lineHeight: "1.5",
                            textAlign: "center"
                        }
                    })))), q.a.createElement("div", {
                        className: "footer"
                    }, q.a.createElement(hr.a, {
                        type: "tertiary-neutral",
                        size: "medium",
                        textKey: "STR_BACK_TO_LOGIN",
                        onClick: function() {
                            r(Zr), t()
                        }
                    })))
                };
            var ii = () => {
                const [e, r] = Object(W.useState)(null), i = Object(W.useCallback)((() => {
                    const r = new Date(e.startTime),
                        i = new Date(e.endTime),
                        t = e => e.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit"
                        }),
                        s = e => e.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }),
                        n = t(r),
                        g = s(r),
                        D = t(i),
                        a = s(i);
                    return g === a ? `${n} - ${D}, ${a}` : `${n}, ${g} - ${D}, ${a}`
                }), [e]);
                Object(W.useEffect)((() => {
                    let e = -1;
                    const i = Object(p.c)().listenMaintenanceMode((i => {
                        const t = Date.now();
                        if (i.serverMaintenanceData && i.serverMaintenanceData.startTime > t) {
                            r(i.serverMaintenanceData);
                            const s = i.serverMaintenanceData.startTime - t;
                            e = window.setTimeout((() => {
                                Object(p.c)().restartApp(), window.clearTimeout(e)
                            }), s - 1e3)
                        } else r(null)
                    }));
                    return () => {
                        window.clearTimeout(e), i()
                    }
                }), []);
                return {
                    show: !!e,
                    renderComponent: e => q.a.createElement(yr.a, {
                        status: "warning",
                        alignment: "center",
                        closable: !1,
                        content: q.a.createElement(q.a.Fragment, null, q.a.createElement(Se.a, {
                            style: {
                                fontSize: null != e ? e : "inherit"
                            },
                            className: "truncate",
                            textKey: "STR_BANNER_WARNING_MAINTENANCE_MODE"
                        }), q.a.createElement("span", {
                            style: {
                                fontSize: null != e ? e : "inherit"
                            },
                            className: "z-banner__info__title truncate"
                        }, ` ${i()}`)),
                        iconOptions: {
                            size: 0
                        },
                        maxContentLines: 1,
                        className: "system-banner-comp"
                    })
                }
            };
            i("t3EU");
            const ti = () => {
                const e = he(),
                    r = ii(),
                    i = ve({
                        loginStateKey: e.stateMachine.state.key,
                        isNoNetwork: !window.navigator.onLine
                    });
                return Object(W.useEffect)((() => {
                    e.loginSession.loginStateStream.subscribe((e => {
                        e && (i.loginStateKey = e.key)
                    })), G.default.checkNetwork((r => {
                        i.isNoNetwork = !r, e.stateMachine.state.error("Internet status change: " + (r ? "Connected" : "Disconnected"))
                    }))
                }), []), q.a.createElement("div", {
                    className: "login-layout"
                }, q.a.createElement("div", {
                    style: {
                        height: "fit-content",
                        position: "absolute",
                        width: "100%",
                        top: "40px",
                        display: i.isNoNetwork || r.show && !i.isNoNetwork ? "block" : "none"
                    },
                    className: Object(oe.a)(["wrap-loss-network", i.isNoNetwork || r.show && !i.isNoNetwork ? "slideInDown" : "slideOutUp"])
                }, i.isNoNetwork && q.a.createElement(ri, null), r.show && !i.isNoNetwork && r.renderComponent("12px")), q.a.createElement("div", {
                    key: "LoginQRPage",
                    style: {
                        display: i.loginStateKey === ye.LoginQR ? "flex" : "none"
                    },
                    className: Object(oe.a)(["login-page-wrap", "" + (i.loginStateKey === ye.LoginQR ? "login-page-wrap__animation--show" : "login-page-wrap__animation--hide")])
                }, q.a.createElement(lr, null)), e.enableEntryLoginPassword && q.a.createElement("div", {
                    key: "LoginNormalPage",
                    style: {
                        display: i.loginStateKey === ye.LoginPhoneNumber ? "flex" : "none"
                    },
                    className: Object(oe.a)(["login-page-wrap", "" + (i.loginStateKey === ye.LoginPhoneNumber ? "login-page-wrap__animation--show" : "login-page-wrap__animation--hide")])
                }, q.a.createElement(Nr, {
                    isFocusLoginNormal: i.loginStateKey === ye.LoginPhoneNumber
                })), e.enableEntryLoginEmail && q.a.createElement("div", {
                    key: "LoginEmail",
                    style: {
                        display: i.loginStateKey === ye.LoginEmail ? "flex" : "none"
                    },
                    className: Object(oe.a)(["login-page-wrap", "" + (i.loginStateKey === ye.LoginEmail ? "login-page-wrap__animation--show" : "login-page-wrap__animation--hide")])
                }, q.a.createElement(Vr, {
                    isFocus: i.loginStateKey === ye.LoginEmail
                })), e.enableEntryLoginPassword && q.a.createElement("div", {
                    key: "ForgetPasswordPage",
                    style: {
                        display: i.loginStateKey === ye.ForgetPassword ? "flex" : "none"
                    },
                    className: Object(oe.a)(["login-page-wrap", "" + (i.loginStateKey === ye.ForgetPassword ? "login-page-wrap__animation--show" : "login-page-wrap__animation--hide")])
                }, q.a.createElement(Jr, null)), q.a.createElement("div", {
                    key: "LoginSuccessPage",
                    style: {
                        display: i.loginStateKey === ye.LoginSuccess ? "flex" : "none"
                    }
                }))
            };
            var si = i("MEZx");
            const ni = ({
                country: e
            }) => q.a.createElement("span", {
                className: "emoji-sizer emoji-outer ",
                style: {
                    background: `url(${Rr.default.emojiImg})`,
                    backgroundSize: "6500%",
                    backgroundPosition: Rr.default.emojiMapPos[`:flag-${e}:`],
                    WebkitUserSelect: "none",
                    marginLeft: "5px",
                    verticalAlign: "text-bottom",
                    height: "18px"
                }
            });
            var gi = i("IjM+");
            i("w4sY");
            const Di = "z_reclogtype",
                ai = ({
                    platform: e,
                    handlerCloseAppOnWindowOS: r,
                    openAppInfo: i,
                    submitQoSLog: t,
                    isSubmittingQoSLog: s,
                    loginWithQR: n,
                    loginWithPhoneNumber: g,
                    loginWithEmail: D,
                    handlerMinimiseAppWindowOS: a,
                    enableBadgeMenu: c
                }) => {
                    const d = Object(W.useRef)(null),
                        l = Object(W.useRef)(null),
                        h = ve({
                            languageSelected: je.a.currentLanguage(),
                            isShowMenu: !1,
                            adminConfig: "",
                            enableBadgeMenu: c
                        });

                    function o(e) {
                        var r;
                        je.a.changeToLang(e), h.languageSelected = e, $zapp.changeLanguage(je.a.getCurrentLanguageName()), null === (r = d.current) || void 0 === r || r.close(null)
                    }
                    return q.a.createElement(q.a.Fragment, null, q.a.createElement("div", {
                        className: "login-title-bar"
                    }, "WIN32" === e && q.a.createElement("div", null, q.a.createElement("i", {
                        className: "fa fa-Minus_24_Line login-title-bar__hide-icon",
                        onClick: e => {
                            e.stopPropagation(), a()
                        }
                    }), q.a.createElement("i", {
                        className: "fa fa-Close_24_Line login-title-bar__close-icon",
                        onClick: e => {
                            e.stopPropagation(), r()
                        }
                    }))), q.a.createElement("div", {
                        className: "login-title-bar__setting-button",
                        style: {
                            right: "DARWIN" === e ? 0 : void 0,
                            left: "DARWIN" === e ? void 0 : 0
                        }
                    }, q.a.createElement(hr.a, {
                        icon: "icon-outline-menu",
                        type: "tertiary-neutral",
                        size: "large",
                        ref: e => {
                            l.current = e
                        },
                        onClick: e => {
                            var r;
                            null === (r = d.current) || void 0 === r || r.show(e, l.current)
                        },
                        isActive: h.isShowMenu,
                        style: {
                            padding: "0"
                        }
                    }), h.enableBadgeMenu && q.a.createElement(gi.a, {
                        style: {
                            position: "absolute",
                            top: "8px",
                            left: "DARWIN" === e ? "8px" : void 0,
                            right: "DARWIN" === e ? void 0 : "8px"
                        }
                    })), q.a.createElement(si.default, {
                        popoverProps: {
                            identity: {
                                windowId: re.c,
                                name: He.PopoverIdentitiesDefine.SWITCH_LANGUAGE
                            }
                        },
                        ref: d,
                        onShow: () => {
                            h.isShowMenu = !0
                        },
                        onClose: () => {
                            h.isShowMenu = !1, Br().setItem("z_press_menu_button_with_badge", "1"), h.enableBadgeMenu = !1
                        },
                        items: [...n ? [{
                            textKey: "STR_LOGIN_QR_PAGE",
                            onclick: () => {
                                n()
                            }
                        }] : [], ...g ? [{
                            textKey: "STR_LOGIN_PASSWORD_PAGE_MENU",
                            onclick: () => {
                                g()
                            },
                            rightIcon: h.enableBadgeMenu ? {
                                html: q.a.createElement(gi.a, {
                                    style: {
                                        position: "absolute",
                                        top: "16px",
                                        left: void 0,
                                        right: "16px"
                                    }
                                })
                            } : void 0
                        }] : [], ...D ? [{
                            textKey: "STR_LOGIN_EMAIL_PAGE_MENU",
                            onclick: () => {
                                D()
                            }
                        }] : [], {
                            type: si.MENU_ITEM_TYPE.SEPARATE
                        }, ...Rr.default.submit_log_conf.enable ? [{
                            textKey: "STR_MENU_SUBMITLOG",
                            onclick: t,
                            disabled: s
                        }] : [], {
                            type: si.MENU_ITEM_TYPE.SUBMENU,
                            textKey: "STR_MENU_LANGUAGE",
                            items: [{
                                text: "Tiếng Việt",
                                icon: {
                                    html: q.a.createElement(ni, {
                                        country: "vn"
                                    })
                                },
                                onclick: () => {
                                    o(He.LANG_INDEX_VI)
                                },
                                checked: h.languageSelected === He.LANG_INDEX_VI
                            }, {
                                text: "English",
                                icon: {
                                    html: q.a.createElement(ni, {
                                        country: "us"
                                    })
                                },
                                onclick: () => {
                                    o(He.LANG_INDEX_EN)
                                },
                                checked: h.languageSelected === He.LANG_INDEX_EN
                            }]
                        }, {
                            textKey: "STR_ABOUT",
                            onclick: () => {
                                i()
                            }
                        }]
                    }))
                };

            function ci() {
                var e;
                return null !== (e = Br().getItem("zlast_uid")) && void 0 !== e ? e : ""
            }
            var di = i("6LLQ");
            const li = "screen-old-app",
                hi = {
                    Root: li,
                    Container: `${li}__container`,
                    Logo: `${li}__logo`,
                    Title: `${li}__title`,
                    Btn: `${li}__btn`
                },
                oi = () => q.a.createElement("div", {
                    className: `flx flx-col ${hi.Root}`
                }, q.a.createElement("img", {
                    src: ze.a,
                    className: hi.Logo
                }), q.a.createElement("img", {
                    src: di.a
                }), q.a.createElement(Se.a, {
                    textKey: "STR_SCREEN_OLD_APP_TITLE",
                    tagName: "div",
                    className: hi.Title
                }), q.a.createElement(Se.a, {
                    textKey: "STR_SCREEN_OLD_APP_DESC",
                    tagName: "div"
                }), q.a.createElement(hr.a, {
                    textKey: "STR_SCREEN_OLD_APP_DOWNLOAD_NEW",
                    onClick: () => {
                        $zupdater.openUpdatePage()
                    },
                    size: "large",
                    className: hi.Btn
                }));
            var yi = i("Dy6U"),
                pi = () => {
                    const {
                        appVersionState: e
                    } = Object(De.a)(), r = he(), i = ve({
                        loginStateKey: r.stateMachine.state.key,
                        popup: null,
                        isLoading: !1,
                        isSubmittingLog: !1
                    });

                    function t(e, i) {
                        i && i.forceFallback ? r.loginSession.popupStream.next(q.a.createElement(J.default, {
                            info: i,
                            cancel: () => {
                                r.loginSession.popupStream.next(null)
                            }
                        })) : r.loginSession.popupStream.next(q.a.createElement($.default, {
                            info: i,
                            cancel: () => {
                                r.loginSession.popupStream.next(null)
                            }
                        }))
                    }

                    function s(e, r) {
                        r && function(e) {
                            de.g.setRecentUpdate(e)
                        }(r)
                    }

                    function g() {
                        r.loginSession.popupStream.next(q.a.createElement(ee.a, {
                            cancel: () => {
                                r.loginSession.popupStream.next(null)
                            }
                        }))
                    }

                    function D() {
                        r.loginSession.logInfoV2Stream.next({
                            type: 152406,
                            subType: 0,
                            data: {}
                        });
                        const e = document.getElementById("login-splash-screen");
                        e && (e.style.display = "flex"), te.default.logAction(117241), te.default._log(), window.setTimeout((() => {
                            n.ModuleContainer.resolve(ce.a).requestQuitApp()
                        }), 600)
                    }
                    return Object(W.useEffect)((() => {
                        var e, n;
                        r.dropServerConfig && r.stateMachine.state.error("Drop server config"), r.loginSession.loginStateStream.subscribe((e => {
                            if (e) {
                                if (i.loginStateKey = e.key, e.key === ye.LoginSuccess.toString()) {
                                    var t, s;
                                    const e = document.getElementById("login-splash-screen");
                                    e && (e.style.display = "flex"), r.loginSession.popupStream.next(null), Br().setItem(Di, null === (t = r.stateMachine.state.data) || void 0 === t ? void 0 : t.typeLogin), Br().setItem(Di, null === (s = r.stateMachine.state.data) || void 0 === s ? void 0 : s.typeLogin), Br().setItemForCurrentUser(yi.a, Date.now().toString()), r.stateMachine.loginQrState.state.key !== pe.TimeoutQR && r.loginSession.loginQrStateStream.next(r.stateMachine.loginQrState.handler(Ae.qr_timeout)), setTimeout((() => {
                                        var e;
                                        r.loginSession.notiLoginSuccess({
                                            loginTime: null === (e = r.stateMachine.state) || void 0 === e ? void 0 : e.enterTime
                                        })
                                    }), 600)
                                }
                                e.key === ye.LoginPhoneNumber.toString() && r.loginSession.logInfoV2Stream.next({
                                    type: 152403,
                                    subType: 0,
                                    data: {
                                        has_previous_account: ci().length > 0
                                    }
                                })
                            }
                        })), r.loginSession.loginStateStream.next(r.stateMachine.handler(Ae.main_choose_login_qr)), r.loginSession.popupStream.subscribe((e => {
                            e && (i.popup = null), i.popup = e
                        })), r.loginSession.isLoading.subscribe((e => {
                            e ? i.isLoading = e : setTimeout((() => {
                                i.isLoading = e || !1
                            }), 600)
                        }));
                        const D = null !== (e = Br().getItem("z_session_expired_14days")) && void 0 !== e ? e : "";
                        return r.loginSession.logInfoV2Stream.subscribe((e => {
                            const i = Object(X.a)({}, (null != e ? e : {}).data);
                            if (D && (i.login_source = "session_timeout_14day"), e) {
                                switch (!0) {
                                    case !0 === r.enableEntryLoginPassword:
                                        i.login_version = "password_and_qr";
                                        break;
                                    case !1 === r.enableEntryLoginPassword:
                                        i.login_version = "qr_only"
                                }
                                i.device_imei = Y(), i.session_id = r.sessionId, e.data = i, se.default.increaseSuccess(e.type, 0, 10, [JSON.stringify(i)]), 152404 === e.type && i.authentication_status && se.default.flush()
                            }
                        })), r.loginSession.logInfoV2Stream.next({
                            type: 152401,
                            subType: 0,
                            data: {
                                last_uid: ci()
                            }
                        }), r.loginSession.logInfoV2Stream.next({
                            type: 152408,
                            subType: 0,
                            data: {
                                last_uid: ci()
                            }
                        }), null !== (n = window.$zenv) && void 0 !== n && n.isPreloaded && ($zsub.$zupdater.onNewUpdate(s), $zsub.$zupdater.onNewManualUpdate(s), $zsub.$zupdater.onFallbackUpdate(t)), $zlogin.onRequestShowAbout(g), () => {
                            r.loginSession.dispose()
                        }
                    }), []), i.loginStateKey === ye.Idle.toString() || i.loginStateKey === ye.LoginSuccess.toString() || e === ae.a.NONE ? q.a.createElement(q.a.Fragment, null) : q.a.createElement("div", {
                        id: "app-page",
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            boxSizing: "border-box",
                            backgroundColor: "var(--layer-background)"
                        }
                    }, q.a.createElement(ai, {
                        handlerCloseAppOnWindowOS: () => {
                            D()
                        },
                        handlerMinimiseAppWindowOS: () => {
                            $zwindow.minimize(re.c)
                        },
                        platform: "DARWIN",
                        openAppInfo: () => {
                            g()
                        },
                        submitQoSLog: () => {
                            i.isSubmittingLog = !0, ne.a.submitLogManually().then((() => {
                                ge.ZToastManagerHolder.getZToastManagerByWindowId(re.c).show({
                                    noBackground: !0,
                                    textKey: "STR_MENU_SUBMITLOG_SUCCESS",
                                    type: ge.TOAST_TYPE.SUCCESS
                                })
                            })).catch((e => {
                                ge.ZToastManagerHolder.getZToastManagerByWindowId(re.c).show({
                                    noBackground: !0,
                                    textKey: "STR_SUBMITLOG_FAIL",
                                    type: ge.TOAST_TYPE.ERROR
                                })
                            })).finally((() => {
                                i.isSubmittingLog = !1
                            }))
                        },
                        isSubmittingQoSLog: i.isSubmittingLog,
                        loginWithQR: r.enableEntryLoginPassword && i.loginStateKey !== ye.LoginQR && e === ae.a.VERIFIED ? () => {
                            try {
                                r.loginSession.loginStateStream.next(r.stateMachine.handler(Ae.main_choose_login_qr))
                            } catch (e) {
                                r.stateMachine.state.error(`Can not switch to login QR screen: ${e}`)
                            }
                        } : void 0,
                        loginWithPhoneNumber: r.enableEntryLoginPassword && i.loginStateKey !== ye.LoginPhoneNumber && e === ae.a.VERIFIED ? () => {
                            try {
                                r.loginSession.loginStateStream.next(r.stateMachine.handler(Ae.main_choose_login_normal))
                            } catch (e) {
                                r.stateMachine.state.error(`Can not switch to login password screen: ${e}`)
                            }
                        } : void 0,
                        loginWithEmail: r.enableEntryLoginEmail && i.loginStateKey !== ye.LoginEmail && e === ae.a.VERIFIED ? () => {
                            try {
                                r.loginSession.loginStateStream.next(r.stateMachine.handler(Ae.main_choose_login_email))
                            } catch (e) {
                                r.stateMachine.state.error(`Can not switch to login email screen: ${e}`)
                            }
                        } : void 0,
                        enableBadgeMenu: r.enableBadgeSettingButton
                    }), q.a.createElement(Z.a, null, q.a.createElement(ti, null)), q.a.createElement(Z.a, null, Object(H.createPortal)(i.popup, document.body, "popup")), q.a.createElement(ie.b, {
                        windowId: re.c
                    }), Object(H.createPortal)(i.isLoading && q.a.createElement("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            boxSizing: "border-box",
                            position: "fixed",
                            left: 0,
                            top: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            backdropFilter: "blur(8px)",
                            backgroundColor: "rgba(255, 255, 255, 0.3)"
                        }
                    }, q.a.createElement("img", {
                        draggable: !1,
                        src: Pe
                    })), document.body, "loading-retry-get-config-server"))
                };
            class Ai {
                constructor(e, r) {
                    if (this.dataCenterId = void 0, this.workerId = void 0, this.sequence = 0, this.lastTimestamp = -1, e < 0 || e > Ai.MAX_DATA_CENTER_ID) throw new Error(`Data center ID must be between 0 and ${Ai.MAX_DATA_CENTER_ID}`);
                    if (r < 0 || r > Ai.MAX_WORKER_ID) throw new Error(`Worker ID must be between 0 and ${Ai.MAX_WORKER_ID}`);
                    this.dataCenterId = e, this.workerId = r
                }
                generateId() {
                    let e = Date.now() - Ai.EPOCH;
                    if (e < this.lastTimestamp) throw new Error("Clock moved backwards. Refusing to generate id.");
                    if (e === this.lastTimestamp) {
                        if (this.sequence = this.sequence + 1 & Ai.MAX_SEQUENCE, 0 === this.sequence)
                            for (; e <= this.lastTimestamp;) e = Date.now() - Ai.EPOCH
                    } else this.sequence = 0;
                    this.lastTimestamp = e;
                    return (BigInt(e) << BigInt(Ai.TIMESTAMP_SHIFT) | BigInt(this.dataCenterId) << BigInt(Ai.DATA_CENTER_ID_SHIFT) | BigInt(this.workerId) << BigInt(Ai.WORKER_ID_SHIFT) | BigInt(this.sequence)).toString()
                }
            }
            Ai.EPOCH = 13437792e5, Ai.TIMESTAMP_BITS = 41, Ai.DATA_CENTER_ID_BITS = 5, Ai.WORKER_ID_BITS = 5, Ai.SEQUENCE_BITS = 12, Ai.MAX_DATA_CENTER_ID = (1 << Ai.DATA_CENTER_ID_BITS) - 1, Ai.MAX_WORKER_ID = (1 << Ai.WORKER_ID_BITS) - 1, Ai.MAX_SEQUENCE = (1 << Ai.SEQUENCE_BITS) - 1, Ai.WORKER_ID_SHIFT = Ai.SEQUENCE_BITS, Ai.DATA_CENTER_ID_SHIFT = Ai.SEQUENCE_BITS + Ai.WORKER_ID_BITS, Ai.TIMESTAMP_SHIFT = Ai.SEQUENCE_BITS + Ai.WORKER_ID_BITS + Ai.DATA_CENTER_ID_BITS;
            class Bi {
                constructor() {
                    this.key = void 0, this.value = void 0
                }
            }
            class Ei extends Bi {
                constructor() {
                    super(), this.key = void 0, this.value = void 0, this.observer = void 0, this.key = Symbol(new Ai(0, 1).generateId()), this.value = null, this.observer = new Map
                }
                subscribe(e) {
                    this.observer.set(e.getName(), e)
                }
                unsubcrise(e) {
                    this.observer.delete(e.getName())
                }
                close() {
                    this.observer.clear()
                }
                notify() {
                    this.observer.forEach((e => {
                        e.update(this)
                    }))
                }
            }
            class xi {
                constructor() {
                    this.key = void 0
                }
            }
            class mi extends xi {
                constructor(e) {
                    super(), this.key = void 0, this.handler = void 0, this.key = Symbol(new Ai(0, 0).generateId()), this.handler = e
                }
                getName() {
                    return this.key.toString()
                }
                update(e) {
                    e instanceof Bi && this.handler && this.handler(e.value)
                }
            }
            class ui {
                constructor() {
                    this.key = void 0, this.subject = void 0, this.closed = !1, this.key = Symbol(new Ai(0, 2).generateId()), this.subject = new Ei
                }
                next(e) {
                    this.closed || (this.subject.value = e, this.subject.notify())
                }
                subscribe(e) {
                    const r = new mi(e);
                    if (!this.closed) return this.subject.subscribe(r), () => {
                        this.subject.unsubcrise(r)
                    };
                    throw Error("This stream is closed, no longer can be subcrise")
                }
                complete() {
                    this.closed || (this.subject.close(), this.closed = !0)
                }
            }
            class fi {
                constructor() {
                    this.key = void 0, this.loginStateStream = void 0, this.loginQrStateStream = void 0, this.isLoading = void 0, this.popupStream = void 0, this.logInfoV2Stream = void 0, this.key = Symbol("LoginSessionService"), this.loginStateStream = new ui, this.loginQrStateStream = new ui, this.isLoading = new ui, this.popupStream = new ui, this.logInfoV2Stream = new ui
                }
                getName() {
                    var e;
                    return null !== (e = this.key.description) && void 0 !== e ? e : ""
                }
                notiLoginSuccess(e) {
                    var r;
                    return qe.default.getInstance().setItem("login_info", JSON.stringify({
                        isNewSession: !0,
                        loginAt: null !== (r = e.loginTime) && void 0 !== r ? r : Date.now()
                    })), (async () => {
                        try {
                            await $zlogin.notifyLoginSuccess()
                        } catch (e) {
                            throw nr.zsymb(18, "UP6Hmy", "Error when call notifyLoginSuccess to main proccess", e), e
                        }
                    })()
                }
                dispose() {
                    this.loginStateStream.complete(), this.loginQrStateStream.complete(), this.popupStream.complete(), this.isLoading.complete(), this.logInfoV2Stream.complete(), z()
                }
            }
            i("xNPa");

            function bi(e) {
                if (e.config_option_remember) {
                    let r = e.config_option_remember;
                    ["number", "string"].includes(typeof r) && ("string" == typeof r && (r = parseInt(r)), !isNaN(r) && r >= 0 && r <= 2 && (Br().setItem(Ye().KEY_CONFIG_OPTION_REMEMBER, r), Br().setItem(Ye().KEY_CONFIG_NEW_REMEMBER, r)))
                }
                if (e.sentry_config) {
                    i("2ua2").default.saveSentryConfig(e.sentry_config)
                }
                e.auto_relaunch_mode && e.auto_relaunch_timeout
            }
            const wi = ["enableEntryLoginPassword", "enableEntryLoginEmail", "enableBadgeSettingButton", "dropServerConfig", "autoUpdater"];
            var Ci = e => {
                    let {
                        enableEntryLoginPassword: r,
                        enableEntryLoginEmail: i,
                        enableBadgeSettingButton: t,
                        dropServerConfig: s,
                        autoUpdater: n
                    } = e, g = Object(V.a)(e, wi);
                    const {
                        maintenanceMode: D
                    } = Object(p.d)({
                        isLoginScreen: !0
                    });

                    function a() {
                        return {
                            imei: Y(),
                            installerType: "unknown",
                            autoUpdaterConfig: n
                        }
                    }
                    Object(W.useEffect)((() => (window.addEventListener("mouseup", (e => {
                        3 !== e.button && 4 !== e.button || e.preventDefault()
                    })), $zresource.onRequestImei(a), () => {
                        window.removeEventListener("mouseup", (() => {})), $zresource.removeListenRequestImei(a)
                    })), []);
                    const c = Object(W.useMemo)((() => {
                        return e = e => q.a.createElement(pi, e), n = {
                            token: "login-v2",
                            loginSession: new fi,
                            stateMachine: new ue("production", nr),
                            enableEntryLoginPassword: r,
                            enableEntryLoginEmail: i,
                            dropServerConfig: s,
                            sessionId: new Ai(0, 3).generateId(),
                            enableBadgeSettingButton: t
                        }, r => q.a.createElement(le.Provider, {
                            value: n
                        }, q.a.createElement(e, r));
                        var e, n
                    }), []);
                    return null === D ? q.a.createElement(p.a, null) : D ? q.a.createElement(p.b, null) : q.a.createElement(c, g)
                },
                ki = i("YGiT"),
                _i = i("ZwwW"),
                Fi = i("HuPi");
            i("U96N"), new Promise((async e => {
                let r = !0;
                try {
                    var t, s, n, g, D, a, c, d, l, h, o, y, A, B, E, x, m;
                    Object(ki.a)();
                    i("2ua2").default.init();
                    G.default.checkSupport();
                    const R = null !== (t = qe.default.getInstance().getItem("viewerkey")) && void 0 !== t ? t : "",
                        N = !!qe.default.getInstance().getItem("z_press_menu_button_with_badge");
                    ne.a.init({
                        viewerkey: R,
                        type: Rr.default.apiType,
                        version: Rr.default.apiVersion,
                        apiUrl: ""
                    }), P(), await Object(p.c)().getServerInfoCheck();
                    const T = _i.b.getServerConfig();
                    var u, f, b, w, C, k, _, F, v, S, I;
                    if (T) bi(T), se.default.startQoSNotLogged(), null === (u = Object(tr.a)()) || void 0 === u || u.mergeServerConfig({
                        self_g: 1 === (null !== (f = null === (b = Rr.default.authentication) || void 0 === b || null === (w = b.trusted_device) || void 0 === w ? void 0 : w.self_g) && void 0 !== f ? f : 0),
                        qr_format_trust_device: 1 === (null !== (C = null === (k = Rr.default.authentication) || void 0 === k || null === (_ = k.trusted_device) || void 0 === _ ? void 0 : _.qr_format_trust_device) && void 0 !== C ? C : 0),
                        logo_qr: 1 === (null !== (F = null === (v = Rr.default.authentication) || void 0 === v || null === (S = v.trusted_device) || void 0 === S ? void 0 : S.logo_qr) && void 0 !== F ? F : 0)
                    }), K((null === Rr.default || void 0 === Rr.default || null === (I = Rr.default.authentication) || void 0 === I ? void 0 : I.trusted_device) || {});
                    r = !1;
                    const M = {
                        enable_entry_login_pw: null !== (s = null === (n = Rr.default.authentication) || void 0 === n || null === (g = n.login_scr) || void 0 === g ? void 0 : g.enable_entry_login_pw) && void 0 !== s ? s : 0,
                        enable_zent_login_email: null !== (D = null === (a = Rr.default.authentication) || void 0 === a || null === (c = a.login_scr) || void 0 === c ? void 0 : c.enable_zent_login_email) && void 0 !== D ? D : 1,
                        flag_login_gr_has_uid: null !== (d = null === (l = Rr.default.authentication) || void 0 === l || null === (h = l.login_scr) || void 0 === h ? void 0 : h.flag_login_gr_has_uid) && void 0 !== d ? d : 0,
                        flag_login_gr_non_uid: null !== (o = null === (y = Rr.default.authentication) || void 0 === y || null === (A = y.login_scr) || void 0 === A ? void 0 : A.flag_login_gr_non_uid) && void 0 !== o ? o : 0,
                        enable_badge_login_pw: null !== (B = null === (E = Rr.default.authentication) || void 0 === E || null === (x = E.login_scr) || void 0 === x ? void 0 : x.enable_badge_login_pw) && void 0 !== B ? B : 0
                    };
                    if (R && M.flag_login_gr_has_uid) {
                        const i = !!M.enable_entry_login_pw;
                        return e({
                            enableEntryLoginPassword: i,
                            enableZEntLoginEmail: !!M.enable_zent_login_email,
                            dropServerConfig: r,
                            enableBadgeSettingButton: !!i && (!!M.enable_badge_login_pw && !N)
                        })
                    }
                    if (!R && null !== (m = M.flag_login_gr_non_uid) && void 0 !== m && m) {
                        const i = !!M.enable_entry_login_pw;
                        return e({
                            enableEntryLoginPassword: i,
                            enableZEntLoginEmail: !!M.enable_zent_login_email,
                            dropServerConfig: r,
                            enableBadgeSettingButton: !!i && (!!M.enable_badge_login_pw && !N)
                        })
                    }
                } catch (R) {
                    r = !0, Object(p.c)().getServerInfoCheck().then((() => {
                        var e, r, i, t, s, n, g, D, a, c;
                        bi(_i.b.getServerConfig()), se.default.startQoSNotLogged(), null === (e = Object(tr.a)()) || void 0 === e || e.mergeServerConfig({
                            self_g: 1 === (null !== (r = null === (i = Rr.default.authentication) || void 0 === i || null === (t = i.trusted_device) || void 0 === t ? void 0 : t.self_g) && void 0 !== r ? r : 0),
                            qr_format_trust_device: 1 === (null !== (s = null === (n = Rr.default.authentication) || void 0 === n || null === (g = n.trusted_device) || void 0 === g ? void 0 : g.qr_format_trust_device) && void 0 !== s ? s : 0),
                            logo_qr: 1 === (null !== (D = null === (a = Rr.default.authentication) || void 0 === a || null === (c = a.trusted_device) || void 0 === c ? void 0 : c.logo_qr) && void 0 !== D ? D : 0)
                        })
                    }))
                }
                return e({
                    enableEntryLoginPassword: !0,
                    enableBadgeSettingButton: !1,
                    enableZEntLoginEmail: !0,
                    dropServerConfig: r
                })
            })).then((e => {
                qe.default.getInstance().setItem("z_loginversion", "2"), Object(H.render)([q.a.createElement(Fi.a, {
                    _window: window
                }), q.a.createElement(Ci, {
                    enableBadgeSettingButton: e.enableBadgeSettingButton,
                    enableEntryLoginPassword: e.enableEntryLoginPassword,
                    enableEntryLoginEmail: e.enableZEntLoginEmail,
                    dropServerConfig: e.dropServerConfig,
                    autoUpdater: Rr.default.auto_updater
                })], document.getElementById("app"))
            })).catch((() => {
                qe.default.getInstance().setItem("z_loginversion", "2"), Object(H.render)([q.a.createElement(Fi.a, {
                    _window: window
                }), q.a.createElement(Ci, {
                    enableBadgeSettingButton: !1,
                    enableEntryLoginPassword: !0,
                    enableEntryLoginEmail: !1,
                    dropServerConfig: !0,
                    autoUpdater: Rr.default.auto_updater
                })], document.getElementById("app"))
            })).finally((() => {
                requestAnimationFrame((() => {
                    const e = document.getElementById("login-splash-screen");
                    e && (e.style.display = "none")
                }))
            }));
            i("B3nq"), i("Ppsz");
            var vi, Si = i("wH4e"),
                Ii = (i("69Uf"), i("+eUS")),
                Ri = (i("uiYo"), i("Q97H"));
            Object(n.singleton)(ce.a)(vi = class {
                requestQuitApp() {
                    this.doQuitApp()
                }
                requestRelaunch() {}
                doQuitApp() {
                    Ri.a.clearSessionBeforeQuit(), Ri.a.closeDB($zapp.requestQuitAppImmediately)
                }
            });
            i("pQlW");
            Object(Ii.a)(Si.i.Host)
        }
    }
]);
//# sourceMappingURL=../sourcemaps/lazy/login-startup.cdc0ebe7d54dc91a9c23.js.map