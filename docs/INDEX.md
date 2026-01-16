# Documentation Index

Tổng hợp tất cả tài liệu trong thư mục `docs/`.

## 📚 Tài liệu chính

### Getting Started

- **[README.md](./README.md)** - Tổng quan về project, cài đặt và sử dụng cơ bản

### Build & Development

- **[BUILD.md](./BUILD.md)** - Hướng dẫn build chi tiết cho macOS và Windows
- **[CROSS_COMPILE.md](./CROSS_COMPILE.md)** - Hướng dẫn cross-compilation từ macOS sang Windows

## 🔐 Code Signing & Security

### Code Signing

- **[CODE_SIGNING.md](./CODE_SIGNING.md)** - Hướng dẫn đầy đủ về code signing
  - Tại sao cần code signing
  - Các loại certificate (EV, OV, Free)
  - Cách sử dụng với Tauri
  - Best practices

- **[SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md)** - Setup SignPath Foundation
  - Đăng ký SignPath (miễn phí cho open source)
  - Tích hợp với GitHub Actions
  - Tự động sign trong CI/CD

### Antivirus & Security

- **[ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md)** - Xử lý false positive
  - Tại sao bị antivirus phát hiện
  - Giải pháp tạm thời (whitelist)
  - Giải pháp lâu dài (code signing)

## 🛠️ Troubleshooting

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Hướng dẫn xử lý các vấn đề
  - Antivirus false positive
  - Build errors
  - Code signing issues
  - Runtime errors
  - Windows SmartScreen

- **[FAQ.md](./FAQ.md)** - Câu hỏi thường gặp
  - Build & compilation
  - Code signing
  - Antivirus & security
  - Windows SmartScreen
  - Distribution
  - Performance

## 📖 Hướng dẫn đọc

### Cho người mới bắt đầu

1. Bắt đầu với [README.md](./README.md) để hiểu tổng quan
2. Xem [BUILD.md](./BUILD.md) để biết cách build
3. Nếu gặp vấn đề, xem [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Cho việc phân phối ứng dụng

1. Đọc [CODE_SIGNING.md](./CODE_SIGNING.md) để hiểu về code signing
2. Setup [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md) để có certificate miễn phí
3. Xem [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md) để xử lý false positive

### Cho troubleshooting

1. Xem [FAQ.md](./FAQ.md) để tìm câu hỏi tương tự
2. Xem [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) để xử lý vấn đề cụ thể
3. Nếu không tìm thấy, tạo issue trên GitHub

## 🔗 Links nhanh

### Code Signing
- [SignPath Foundation](https://signpath.org/) - Code signing miễn phí cho OSS
- [Tauri Code Signing](https://tauri.app/v1/guides/building/signing)

### Security
- [VirusTotal](https://www.virustotal.com) - Kiểm tra file với nhiều antivirus
- [Windows SmartScreen](https://learn.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-smartscreen/microsoft-defender-smartscreen-overview)

### Build Tools
- [Tauri Documentation](https://tauri.app/)
- [Rust Documentation](https://doc.rust-lang.org/)
- [cargo-xwin](https://github.com/rust-lang/cargo-xwin)

## 📝 Cấu trúc tài liệu

```
docs/
├── README.md                    # Tổng quan
├── INDEX.md                      # File này
│
├── BUILD.md                      # Build guide
├── CROSS_COMPILE.md              # Cross-compilation
│
├── CODE_SIGNING.md               # Code signing guide
├── SIGNPATH_SETUP.md             # SignPath setup
├── ANTIVIRUS_FALSE_POSITIVE.md   # Antivirus issues
│
├── TROUBLESHOOTING.md            # Troubleshooting
└── FAQ.md                        # FAQ
```

## 💡 Tips

- **Luôn đọc tài liệu trước khi hỏi** - Hầu hết câu hỏi đã được trả lời trong docs
- **Tìm kiếm trong docs** - Sử dụng Ctrl+F để tìm nhanh
- **Cập nhật docs** - Nếu tìm thấy giải pháp mới, hãy cập nhật docs

## 🤝 Đóng góp

Nếu bạn tìm thấy lỗi hoặc muốn cải thiện tài liệu:
1. Tạo issue trên GitHub
2. Hoặc submit pull request

## 📞 Hỗ trợ

- GitHub Issues: [Tạo issue mới](https://github.com/your-repo/issues)
- Documentation: Xem các file trong thư mục `docs/`
- Tauri Docs: https://tauri.app/
