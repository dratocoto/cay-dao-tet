# Xử lý False Positive từ Antivirus

## Vấn đề

File `.exe` được build có thể bị Windows Defender hoặc các antivirus khác phát hiện là virus. Đây là **false positive** (báo động sai) phổ biến với các file executable mới, đặc biệt là:

1. **Không có code signing**: File không được ký số bằng certificate
2. **File mới**: Chưa có reputation trong cộng đồng
3. **Cross-compilation**: Build từ macOS có thể tạo pattern khác thường

## Giải pháp tạm thời

### 1. Thêm vào Windows Defender Whitelist

1. Mở **Windows Security** (Windows Defender)
2. Vào **Virus & threat protection**
3. Click **Manage settings** trong **Virus & threat protection settings**
4. Scroll xuống **Exclusions** và click **Add or remove exclusions**
5. Click **Add an exclusion** → **Folder** hoặc **File**
6. Chọn thư mục chứa file `.exe` hoặc file cụ thể

### 2. Thêm vào Antivirus khác

- **Avast/AVG**: Settings → General → Exceptions → Add
- **Kaspersky**: Settings → Additional → Threats and Exclusions → Exclusions
- **Norton**: Settings → Antivirus → Scans and Risks → Exclusions/Low Risks
- **McAfee**: Real-Time Scanning → Excluded Files → Add File

## Giải pháp lâu dài

### 1. Code Signing (Khuyến nghị cho Production)

Code signing yêu cầu certificate từ Certificate Authority (CA):

#### ✅ Tùy chọn miễn phí: SignPath Foundation

**SignPath Foundation** cung cấp code signing certificate **MIỄN PHÍ** cho các dự án open source:

- 🌟 **Hoàn toàn miễn phí** cho open source projects
- ✅ Certificate được Windows tin cậy
- 🔒 Private key được lưu trên HSM (Hardware Security Module)
- 🔄 Tích hợp với automated builds (CI/CD)
- 📦 Hỗ trợ nhiều loại file: EXE, DLL, MSI, MSIX

**Điều kiện:**
- Project phải là open source (public repository)
- Cần có automated build system (GitHub Actions, GitLab CI, etc.)
- Build phải được verify từ source code repository

**Cách đăng ký:**
1. Truy cập [SignPath Foundation](https://signpath.org/)
2. Đăng ký tài khoản
3. Submit project của bạn (cần GitHub/GitLab repo)
4. Sau khi được approve, bạn sẽ nhận được certificate
5. Tích hợp vào CI/CD pipeline để tự động sign

**Tài liệu:**
- Website: https://signpath.org/
- Hướng dẫn: https://about.signpath.io/product/open-source/

#### 💰 Tùy chọn trả phí (nếu không đủ điều kiện SignPath):

- **DigiCert**: ~$200-400/năm
- **Sectigo (Comodo)**: ~$200-300/năm
- **GlobalSign**: ~$200-400/năm

**Cách sử dụng certificate:**
1. Có code signing certificate (từ SignPath hoặc mua)
2. Export certificate với private key (hoặc dùng HSM với SignPath)
3. Cấu hình trong `tauri.conf.json`:
```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERTIFICATE_THUMBPRINT"
    }
  }
}
```

Hoặc sử dụng `sign_command` để tự định nghĩa lệnh sign:
```json
{
  "bundle": {
    "windows": {
      "signCommand": "signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com file.exe"
    }
  }
}
```

### 2. Submit lên VirusTotal

1. Upload file `.exe` lên [VirusTotal.com](https://www.virustotal.com)
2. Các antivirus sẽ scan và học file này
3. Sau vài ngày, false positive sẽ giảm

### 3. Build trên Windows

Build trực tiếp trên Windows machine có thể giảm false positive vì:
- Có thể sử dụng Windows SDK đầy đủ
- Metadata được embed tốt hơn
- Có thể code sign dễ dàng hơn

### 4. Tăng Reputation

- Upload lên GitHub Releases
- Có nhiều người download và sử dụng
- Có website và documentation rõ ràng
- Sau một thời gian, reputation sẽ tăng và false positive giảm

## Kiểm tra File

### Xem thông tin file

```powershell
# Trong PowerShell trên Windows
Get-ItemProperty "path\to\file.exe" | Select-Object *
```

### Kiểm tra hash

```bash
# Trên macOS/Linux
shasum -a 256 cay-daotet-tauri_0.1.0_x64-setup.exe
```

## Lưu ý

- **False positive là bình thường** với file executable mới
- **Không phải virus thật** - đây chỉ là heuristic detection
- **Code signing là giải pháp tốt nhất** nhưng cần chi phí
- **Whitelist là giải pháp nhanh nhất** cho người dùng

## Tham khảo

- [Tauri Code Signing Guide](https://tauri.app/v1/guides/building/signing)
- [Windows Code Signing](https://learn.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
- [VirusTotal](https://www.virustotal.com)
