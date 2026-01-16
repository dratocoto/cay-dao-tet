# Frequently Asked Questions (FAQ)

Các câu hỏi thường gặp về build, phân phối và xử lý các vấn đề với ứng dụng Windows.

## Build & Compilation

### Q: Tại sao build trên macOS lại chậm?

**A:** Cross-compilation từ macOS sang Windows cần:
- Compile Rust code cho Windows target
- Download Windows SDK và dependencies
- Build qua cargo-xwin (chậm hơn native)

**Giải pháp:**
- Build trên Windows machine (nhanh hơn)
- Sử dụng CI/CD (GitHub Actions với Windows runner)
- Cache dependencies

### Q: Có thể build MSI installer từ macOS không?

**A:** Không. MSI installers yêu cầu Windows host. Từ macOS chỉ có thể build:
- ✅ NSIS installer (.exe)
- ❌ MSI installer

**Giải pháp:**
- Sử dụng NSIS installer (đã được hỗ trợ)
- Hoặc build MSI trên Windows machine/CI/CD

### Q: Tại sao file .exe lớn như vậy?

**A:** File .exe bao gồm:
- Rust runtime
- Tauri framework
- Frontend assets (React, CSS, JS)
- Dependencies

**Giảm kích thước:**
- Enable compression trong build
- Remove unused dependencies
- Optimize frontend bundle
- Use UPX compression (không khuyến nghị - có thể trigger antivirus)

## Code Signing

### Q: Có code signing certificate miễn phí không?

**A:** Có! **SignPath Foundation** cung cấp certificate miễn phí cho open source projects.

**Điều kiện:**
- Project phải là open source
- Có automated build system
- Build được verify từ source code

**Xem thêm:** [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md)

### Q: Tại sao cần code signing?

**A:** Code signing giúp:
- ✅ Giảm false positive từ antivirus
- ✅ Không có "Unknown Publisher" warning
- ✅ Tăng độ tin cậy với người dùng
- ✅ Trải nghiệm tốt hơn

### Q: Self-signed certificate có được không?

**A:** Không. Self-signed certificate:
- ❌ Không được Windows tin cậy
- ❌ Vẫn hiện "Unknown Publisher"
- ❌ Không giải quyết được vấn đề

**Giải pháp:**
- Sử dụng SignPath Foundation (miễn phí)
- Hoặc mua certificate từ trusted CA

## Antivirus & Security

### Q: Tại sao antivirus phát hiện file là virus?

**A:** Đây là **false positive** (báo động sai). Nguyên nhân:
- File không có code signing
- File mới, chưa có reputation
- Heuristic detection

**Giải pháp:**
- Code signing (giảm đáng kể false positive)
- Thêm vào whitelist
- Submit lên VirusTotal
- Xem: [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md)

### Q: File có an toàn không?

**A:** Có, file hoàn toàn an toàn. Đây chỉ là false positive từ antivirus.

**Cách kiểm tra:**
- Upload lên VirusTotal
- Kiểm tra source code trên GitHub
- Xem file signature (nếu có)

### Q: Làm sao để người dùng tin tưởng file?

**A:**
1. **Code signing** - Quan trọng nhất
2. **GitHub Releases** - Upload lên GitHub
3. **Documentation** - Có README và hướng dẫn rõ ràng
4. **Website** - Có website chính thức
5. **Transparency** - Source code công khai

## Windows SmartScreen

### Q: Tại sao SmartScreen hiện warning?

**A:** SmartScreen hiện warning vì:
- File không có code signing
- File chưa có reputation
- File mới, chưa được nhiều người download

**Giải pháp:**
- Code signing (EV certificate pass ngay, OV cần reputation)
- Build reputation (nhiều người download)
- User click "More info" → "Run anyway"

### Q: SmartScreen vẫn hiện warning sau khi sign?

**A:** Đây là bình thường. OV certificate cần build reputation:
- EV certificate: Pass ngay lập tức
- OV certificate: Cần vài tuần để build reputation
- Có nhiều người download và sử dụng

## Distribution

### Q: Nên phân phối file qua đâu?

**A:** Các kênh tốt:
1. **GitHub Releases** (Khuyến nghị)
   - Miễn phí
   - Có versioning
   - Dễ quản lý

2. **Website chính thức**
   - Professional
   - Có thể track downloads

3. **Package Managers**
   - Chocolatey (Windows)
   - Scoop
   - winget

### Q: Có cần installer không?

**A:** Tùy vào use case:
- **Installer (NSIS/MSI):** Phù hợp cho applications cần cài đặt
- **Portable .exe:** Phù hợp cho utilities, không cần cài đặt

**Tauri hỗ trợ cả hai:**
- NSIS installer (từ macOS)
- Portable .exe

## Performance

### Q: Tại sao ứng dụng chậm khi khởi động?

**A:** Có thể do:
- First launch cần extract resources
- Antivirus scan file
- Network checks

**Tối ưu:**
- Code signing (giảm scan time)
- Optimize startup code
- Lazy load resources

### Q: Ứng dụng tốn nhiều RAM?

**A:** Tauri apps thường nhẹ hơn Electron, nhưng vẫn cần:
- Rust runtime
- WebView (Chromium-based)
- Application code

**Tối ưu:**
- Optimize frontend bundle
- Remove unused dependencies
- Use efficient data structures

## Development

### Q: Có thể debug trên Windows từ macOS không?

**A:** Có, nhưng hạn chế:
- Có thể build và test
- Debugging khó hơn
- Khuyến nghị: Remote debug hoặc Windows machine

**Giải pháp:**
- Sử dụng Windows VM
- Remote Windows machine
- CI/CD với Windows runner

### Q: Có thể test trên Windows từ macOS không?

**A:** Có thể:
- Build file .exe
- Copy sang Windows machine
- Test trên Windows

**Hoặc:**
- Sử dụng Windows VM
- Remote Windows machine
- CI/CD với Windows runner

## Troubleshooting

### Q: Build bị lỗi, làm sao?

**A:** Xem [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) để:
- Tìm lỗi tương tự
- Xem giải pháp
- Debug step-by-step

### Q: File không chạy trên Windows, tại sao?

**A:** Có thể do:
- Missing dependencies (Visual C++ Redistributable)
- Permission issues
- Antivirus block
- Windows version không tương thích

**Giải pháp:**
- Kiểm tra Windows Event Viewer
- Test trên clean Windows machine
- Check dependencies

## General

### Q: Tauri vs Electron?

**A:** So sánh:

| Feature | Tauri | Electron |
|--------|-------|----------|
| Bundle size | ✅ Nhỏ hơn (5-10MB) | ❌ Lớn hơn (100MB+) |
| Memory | ✅ Ít hơn | ❌ Nhiều hơn |
| Performance | ✅ Nhanh hơn | ❌ Chậm hơn |
| Security | ✅ Better (Rust) | ⚠️ OK |
| Ecosystem | ⚠️ Nhỏ hơn | ✅ Lớn hơn |

**Khuyến nghị:**
- Tauri: Cho applications cần performance, nhẹ
- Electron: Cho applications cần ecosystem lớn

### Q: Có thể build cho Linux không?

**A:** Có! Tauri hỗ trợ:
- ✅ Windows
- ✅ macOS
- ✅ Linux

**Build cho Linux:**
```bash
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

### Q: Có thể build cho mobile không?

**A:** Hiện tại Tauri chưa hỗ trợ mobile. Chỉ hỗ trợ:
- Desktop: Windows, macOS, Linux
- Web: Có thể build web version

## Tài liệu tham khảo

- [CODE_SIGNING.md](./CODE_SIGNING.md) - Code signing guide
- [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md) - Antivirus issues
- [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md) - SignPath setup
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting guide
- [Tauri Documentation](https://tauri.app/)
- [Tauri Troubleshooting](https://tauri.app/v1/guides/troubleshooting)

## Câu hỏi khác?

Nếu có câu hỏi khác, vui lòng:
1. Xem các tài liệu trong thư mục `docs/`
2. Tạo issue trên GitHub
3. Tham khảo [Tauri Documentation](https://tauri.app/)
