# Troubleshooting Guide

Hướng dẫn xử lý các vấn đề thường gặp khi build và phân phối ứng dụng Windows.

## Mục lục

1. [Antivirus False Positive](#antivirus-false-positive)
2. [Build Errors](#build-errors)
3. [Code Signing Issues](#code-signing-issues)
4. [Runtime Errors](#runtime-errors)
5. [Windows SmartScreen](#windows-smartscreen)

## Antivirus False Positive

### Triệu chứng

- Windows Defender block file `.exe`
- Antivirus khác phát hiện "virus"
- File bị xóa tự động
- Không thể chạy file

### Nguyên nhân

1. **Không có code signing**
   - File không được ký số
   - Antivirus không tin cậy

2. **File mới, chưa có reputation**
   - Chưa có người dùng
   - Chưa được scan bởi antivirus

3. **Heuristic detection**
   - Pattern giống malware
   - Behavior analysis

### Giải pháp

#### Giải pháp tạm thời

**1. Thêm vào Windows Defender Whitelist:**

```
Windows Security → Virus & threat protection → Manage settings → Exclusions → Add exclusion
```

**2. Thêm vào Antivirus khác:**
- Avast/AVG: Settings → General → Exceptions
- Kaspersky: Settings → Additional → Threats and Exclusions
- Norton: Settings → Antivirus → Scans and Risks → Exclusions

**3. Submit lên VirusTotal:**
- Upload file lên https://www.virustotal.com
- Các antivirus sẽ học file này
- Sau vài ngày, false positive giảm

#### Giải pháp lâu dài

**1. Code Signing (Khuyến nghị):**
- Sử dụng SignPath Foundation (miễn phí cho OSS)
- Hoặc mua certificate từ CA
- Xem: [CODE_SIGNING.md](./CODE_SIGNING.md)

**2. Build Reputation:**
- Upload lên GitHub Releases
- Có nhiều người download
- Có website và documentation

**3. Submit False Positive Report:**
- Gửi report cho antivirus vendor
- Cung cấp thông tin về file
- Đợi whitelist

Xem chi tiết: [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md)

## Build Errors

### Error: "can't find crate for `std`"

**Nguyên nhân:** Rust target chưa được cài đặt

**Giải pháp:**
```bash
rustup target add x86_64-pc-windows-msvc
```

### Error: "linker `link.exe` not found"

**Nguyên nhân:** Thiếu Windows SDK hoặc linker

**Giải pháp:**
```bash
# Sử dụng cargo-xwin
cargo install cargo-xwin
export PATH="/opt/homebrew/opt/llvm/bin:$PATH"  # macOS
npm run tauri:build:windows
```

### Error: "NSIS not found"

**Nguyên nhân:** NSIS chưa được cài đặt

**Giải pháp:**
```bash
# macOS
brew install nsis

# Windows
# Download từ https://nsis.sourceforge.io/
```

### Error: "llvm-rc not found"

**Nguyên nhân:** LLVM chưa được cài hoặc không có trong PATH

**Giải pháp:**
```bash
# macOS
brew install llvm
export PATH="/opt/homebrew/opt/llvm/bin:$PATH"

# Thêm vào ~/.zshrc hoặc ~/.bash_profile
echo 'export PATH="/opt/homebrew/opt/llvm/bin:$PATH"' >> ~/.zshrc
```

### Error: Rust version mismatch

**Nguyên nhân:** Nhiều Rust installations (ServBay, rustup, etc.)

**Giải pháp:**
```bash
# Đảm bảo rustup được ưu tiên trong PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Kiểm tra
which rustc
rustc --version
```

### Error: "Cross-platform compilation is experimental"

**Cảnh báo, không phải lỗi:**
- Tauri cảnh báo về cross-compilation
- Build vẫn thành công
- Có thể gặp issues với một số features

**Giải pháp:**
- Build trên Windows để tránh cảnh báo
- Hoặc bỏ qua cảnh báo này

## Code Signing Issues

### Error: "The certificate chain was issued by an authority that is not trusted"

**Nguyên nhân:** Certificate không được Windows tin cậy

**Giải pháp:**
- Sử dụng certificate từ trusted CA
- Hoặc sử dụng SignPath Foundation

### Error: "The signature is invalid"

**Nguyên nhân:** File bị thay đổi sau khi sign

**Giải pháp:**
- Sign file cuối cùng (sau khi build xong)
- Không chỉnh sửa file sau khi sign
- Nếu cần update, sign lại file mới

### Error: "The certificate has expired"

**Nguyên nhân:** Certificate đã hết hạn

**Giải pháp:**
- Renew certificate
- Nếu đã dùng timestamp, file cũ vẫn hợp lệ
- Chỉ cần renew cho file mới

### Error: "certificateThumbprint not found"

**Nguyên nhân:** Certificate không có trong Windows Certificate Store

**Giải pháp:**
```powershell
# Import certificate
Import-PfxCertificate -FilePath certificate.pfx -CertStoreLocation Cert:\CurrentUser\My

# Hoặc sử dụng signCommand thay vì certificateThumbprint
```

Xem chi tiết: [CODE_SIGNING.md](./CODE_SIGNING.md)

## Runtime Errors

### Error: "The application was unable to start correctly"

**Nguyên nhân:**
- Missing dependencies
- Corrupted installation
- Permission issues

**Giải pháp:**
1. Kiểm tra Windows Event Viewer
2. Chạy với Administrator rights
3. Reinstall application
4. Kiểm tra dependencies (Visual C++ Redistributable)

### Error: "Access Denied"

**Nguyên nhân:** Permission issues

**Giải pháp:**
- Chạy với Administrator rights
- Kiểm tra file permissions
- Kiểm tra antivirus không block

### Error: "File not found" hoặc "Resource not found"

**Nguyên nhân:** Missing resources hoặc incorrect paths

**Giải pháp:**
- Kiểm tra resources được bundle đúng chưa
- Kiểm tra paths (Windows dùng `\`, không phải `/`)
- Kiểm tra file tồn tại trong installer

## Windows SmartScreen

### Warning: "Windows protected your PC"

**Nguyên nhân:**
- File không có code signing
- File chưa có reputation

**Giải pháp:**

**1. Code Signing:**
- Sử dụng SignPath hoặc certificate
- Xem: [CODE_SIGNING.md](./CODE_SIGNING.md)

**2. Build Reputation:**
- Có nhiều người download
- Có website và documentation
- Upload lên GitHub Releases

**3. User Action:**
- Click "More info"
- Click "Run anyway"
- Sau nhiều lần, Windows sẽ nhớ

### SmartScreen vẫn hiện warning sau khi sign

**Nguyên nhân:** Chưa có reputation

**Giải pháp:**
- EV certificate: Pass ngay lập tức
- OV certificate: Cần vài tuần
- Có nhiều người download và sử dụng
- Submit lên VirusTotal

## Kiểm tra và Debug

### Kiểm tra file signature

```powershell
# PowerShell
Get-AuthenticodeSignature .\file.exe

# Command Line
signtool verify /pa /v file.exe
```

### Kiểm tra file hash

```bash
# macOS/Linux
shasum -a 256 file.exe

# Windows PowerShell
Get-FileHash file.exe -Algorithm SHA256
```

### Kiểm tra dependencies

```powershell
# Windows
dumpbin /dependents file.exe

# Hoặc sử dụng Dependency Walker
```

### Kiểm tra Windows Event Viewer

1. Mở Event Viewer
2. Windows Logs → Application
3. Tìm errors liên quan đến application

### Kiểm tra antivirus logs

- Windows Defender: Windows Security → Protection history
- Antivirus khác: Check logs trong settings

## Best Practices

1. **Luôn test trên clean Windows machine**
   - Không có development tools
   - Giống môi trường người dùng

2. **Kiểm tra trên nhiều Windows versions**
   - Windows 10
   - Windows 11
   - Các phiên bản khác nhau

3. **Code sign mọi release**
   - Giảm false positive
   - Tăng trust

4. **Document rõ ràng**
   - README với hướng dẫn
   - Troubleshooting guide
   - Known issues

5. **Monitor feedback**
   - GitHub Issues
   - User reports
   - Antivirus detections

## Tài liệu tham khảo

- [CODE_SIGNING.md](./CODE_SIGNING.md) - Code signing guide
- [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md) - Antivirus issues
- [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md) - SignPath setup
- [Tauri Troubleshooting](https://tauri.app/v1/guides/troubleshooting)
- [Windows Event Viewer](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil)
