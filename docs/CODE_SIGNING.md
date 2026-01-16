# Code Signing Guide

Hướng dẫn đầy đủ về code signing cho Windows executables để tránh false positive từ antivirus.

## Tổng quan

Code signing là quá trình ký số (digital signature) cho file executable để:
- ✅ Xác minh danh tính người phát hành
- ✅ Đảm bảo file không bị thay đổi sau khi build
- ✅ Giảm false positive từ antivirus
- ✅ Tăng độ tin cậy với người dùng

## Tại sao cần Code Signing?

### Vấn đề không có Code Signing

1. **Windows SmartScreen Warning**
   - Hiển thị "Unknown Publisher"
   - Người dùng phải click "More info" → "Run anyway"
   - Trải nghiệm kém

2. **Antivirus False Positive**
   - Windows Defender có thể block file
   - Các antivirus khác cũng có thể phát hiện sai
   - Người dùng phải thêm vào whitelist

3. **Thiếu Trust**
   - Người dùng không tin tưởng file
   - Giảm số lượng download
   - Khó phân phối

### Lợi ích có Code Signing

- ✅ Không có "Unknown Publisher" warning
- ✅ Giảm đáng kể false positive
- ✅ Tăng độ tin cậy
- ✅ Trải nghiệm người dùng tốt hơn

## Các loại Code Signing Certificate

### 1. EV (Extended Validation) Certificate

**Đặc điểm:**
- ✅ Highest level of trust
- ✅ Không cần build reputation (instant SmartScreen pass)
- ✅ Private key lưu trên hardware token (USB)
- 💰 **Giá:** ~$300-500/năm

**Phù hợp với:**
- Commercial software
- Enterprise applications
- Applications cần trust ngay lập tức

### 2. OV (Organization Validation) Certificate

**Đặc điểm:**
- ✅ Organization verified
- ⚠️ Cần build reputation (mất vài tuần)
- ✅ Private key lưu trên máy tính
- 💰 **Giá:** ~$200-400/năm

**Phù hợp với:**
- Business applications
- Open source projects có organization
- Applications có thời gian build reputation

### 3. Code Signing Certificate Miễn phí

#### SignPath Foundation (Khuyến nghị cho Open Source)

**Đặc điểm:**
- ✅ **Hoàn toàn miễn phí** cho open source projects
- ✅ Certificate được Windows tin cậy
- ✅ Private key lưu trên HSM (Hardware Security Module)
- ✅ Tích hợp với CI/CD
- ⚠️ Chỉ sign file build từ source code trong CI/CD

**Điều kiện:**
- Project phải là open source (public repository)
- Có automated build system
- Build được verify từ source code

**Xem thêm:** [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md)

## Cách sử dụng Code Signing

### Với Tauri

#### Option 1: Sử dụng Certificate Thumbprint

```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERTIFICATE_THUMBPRINT"
    }
  }
}
```

**Cách lấy thumbprint:**
```powershell
# Trên Windows
Get-ChildItem -Path Cert:\CurrentUser\My | Where-Object {$_.Subject -like "*Your Name*"} | Select-Object Thumbprint
```

#### Option 2: Sử dụng Custom Sign Command

```json
{
  "bundle": {
    "windows": {
      "signCommand": "signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com \"{{artifact}}\""
    }
  }
}
```

#### Option 3: Sử dụng SignPath trong CI/CD

Xem hướng dẫn chi tiết: [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md)

### Với signtool (Windows)

```powershell
# Sign file
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com file.exe

# Verify signature
signtool verify /pa /v file.exe
```

### Với osslsigncode (Cross-platform)

```bash
# Sign file
osslsigncode sign -certs certificate.pem -key private.key \
  -n "Your App Name" \
  -i "https://yourwebsite.com" \
  -t http://timestamp.digicert.com \
  -in file.exe -out file-signed.exe

# Verify signature
osslsigncode verify file-signed.exe
```

## Timestamping

**Quan trọng:** Luôn sử dụng timestamp server khi sign!

**Lý do:**
- Certificate có thể expire
- File đã sign vẫn hợp lệ sau khi certificate hết hạn
- Người dùng có thể verify file ngay cả khi certificate không còn active

**Timestamp Servers:**
- DigiCert: `http://timestamp.digicert.com`
- Sectigo: `http://timestamp.sectigo.com`
- GlobalSign: `http://timestamp.globalsign.com/tsa/r6advanced1`

## Kiểm tra Signature

### PowerShell

```powershell
# Kiểm tra signature
Get-AuthenticodeSignature .\file.exe

# Kết quả:
# Status: Valid
# SignerCertificate: [Certificate Info]
# TimeStamperCertificate: [Certificate Info]
```

### Command Line

```cmd
signtool verify /pa /v file.exe
```

### Visual

1. Right-click file → Properties
2. Tab "Digital Signatures"
3. Xem thông tin certificate

## Troubleshooting

### Lỗi: "The certificate chain was issued by an authority that is not trusted"

**Nguyên nhân:** Certificate không được Windows tin cậy

**Giải pháp:**
- Sử dụng certificate từ trusted CA (DigiCert, Sectigo, GlobalSign)
- Hoặc sử dụng SignPath Foundation (đã được trust)

### Lỗi: "The signature is invalid"

**Nguyên nhân:** File bị thay đổi sau khi sign

**Giải pháp:**
- Không chỉnh sửa file sau khi sign
- Sign file cuối cùng (sau khi build xong)
- Nếu cần update, sign lại file mới

### Lỗi: "The certificate has expired"

**Nguyên nhân:** Certificate đã hết hạn

**Giải pháp:**
- Renew certificate
- Nếu đã dùng timestamp, file vẫn hợp lệ (chỉ cần renew cho file mới)

### SmartScreen vẫn hiện warning

**Nguyên nhân:** Chưa có reputation

**Giải pháp:**
- EV certificate: Pass ngay lập tức
- OV certificate: Cần vài tuần để build reputation
- Có nhiều người download và sử dụng
- Submit lên VirusTotal

## Best Practices

1. **Luôn sử dụng Timestamp**
   - File vẫn hợp lệ sau khi certificate expire
   - Người dùng có thể verify file lâu dài

2. **Sign file cuối cùng**
   - Sign sau khi build xong
   - Không sign file trung gian

3. **Bảo vệ Private Key**
   - Không commit private key vào git
   - Sử dụng secrets trong CI/CD
   - EV certificate: Private key trên hardware token

4. **Automate trong CI/CD**
   - Tự động sign mỗi release
   - Đảm bảo consistency
   - Giảm lỗi manual

5. **Verify sau khi sign**
   - Luôn verify signature sau khi sign
   - Đảm bảo signature hợp lệ

## Chi phí so sánh

| Loại | Chi phí | Trust Level | SmartScreen | Phù hợp |
|------|---------|-------------|-------------|---------|
| **SignPath** | **Miễn phí** | ✅ High | ⚠️ Cần reputation | Open Source |
| **OV Certificate** | $200-400/năm | ✅ High | ⚠️ Cần reputation | Business/OSS |
| **EV Certificate** | $300-500/năm | ✅✅ Highest | ✅ Instant | Commercial |

## Tài liệu tham khảo

- [Tauri Code Signing](https://tauri.app/v1/guides/building/signing)
- [Windows Code Signing](https://learn.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
- [SignPath Foundation](https://signpath.org/)
- [Authenticode Signing](https://learn.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)

## Xem thêm

- [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md) - Hướng dẫn setup SignPath
- [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md) - Xử lý false positive
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting chi tiết
