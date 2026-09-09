# Chạy thử / debug instance trên máy dev

App hard-code `userData = ~/.config/ZaloData` (bỏ qua `--user-data-dir`) và dùng
`requestSingleInstanceLock()`, nên không thể chạyinstance thứ hai song song để test:
- `--user-data-dir` bị ghi đè → vẫn dùng chung `~/.config/ZaloData`
- Instance mới thấy lock của instance đang chạy → im lặng thoát (second-instance)

Chạy thử cô lập (không đụng app đang chạy / dữ liệu đăng nhập):

```bash
cp -a ~/.local/share/zalo /tmp/zalo-smoke-app
sed -i 's/ZaloData/ZaloSmokeData/g' /tmp/zalo-smoke-app/main-dist/{migration,main,compact-app}.js
ELECTRON_ENABLE_LOGGING=1 ~/.local/electron-v22.3.27/electron --no-sandbox /tmp/zalo-smoke-app
```

`~/.config/ZaloSmokeData` là hồ sơ tạm; xoá khi xong.
