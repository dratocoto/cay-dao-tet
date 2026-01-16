# Hướng dẫn Setup SignPath Foundation (Code Signing Miễn Phí)

## Giới thiệu

SignPath Foundation cung cấp code signing certificate **MIỄN PHÍ** cho các dự án open source. Đây là giải pháp tốt nhất để tránh false positive từ antivirus.

## Điều kiện

- ✅ Project phải là **open source** (public repository trên GitHub/GitLab)
- ✅ Có **automated build system** (GitHub Actions, GitLab CI, etc.)
- ✅ Build phải được verify từ source code repository

## Bước 1: Đăng ký SignPath

1. Truy cập: https://signpath.org/
2. Click **"Get Started"** hoặc **"Apply for Open Source Certificate"**
3. Điền thông tin:
   - Tên project
   - Repository URL (GitHub/GitLab)
   - Mô tả project
   - License (phải là open source license)
4. Submit application
5. Đợi approval (thường 1-3 ngày)

## Bước 2: Setup Repository

SignPath yêu cầu build từ source code, không phải upload file đã build sẵn.

### Tạo GitHub Actions Workflow

Tạo file `.github/workflows/build-windows.yml`:

```yaml
name: Build and Sign Windows

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build:
    runs-on: windows-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: x86_64-pc-windows-msvc
          
      - name: Install dependencies
        run: |
          cd cay-daotet-tauri
          npm install
          
      - name: Build Tauri app
        run: |
          cd cay-daotet-tauri
          npm run tauri:build:windows
          
      - name: Sign with SignPath
        uses: signpath/signpath-github-action@v1
        with:
          service-url: 'https://app.signpath.io/API/v1'
          organization-id: '${{ secrets.SIGNPATH_ORG_ID }}'
          project-slug: 'cay-daotet-tauri'
          artifact-path: 'cay-daotet-tauri/src-tauri/target/x86_64-pc-windows-msvc/release/cay-daotet-tauri.exe'
          
      - name: Upload signed artifact
        uses: actions/upload-artifact@v4
        with:
          name: signed-windows-exe
          path: cay-daotet-tauri/src-tauri/target/x86_64-pc-windows-msvc/release/cay-daotet-tauri.exe
```

## Bước 3: Cấu hình Secrets

1. Vào GitHub repository → Settings → Secrets and variables → Actions
2. Thêm secret:
   - `SIGNPATH_ORG_ID`: Organization ID từ SignPath dashboard
   - `SIGNPATH_API_TOKEN`: API token từ SignPath (nếu cần)

## Bước 4: Tích hợp với Tauri

### Option 1: Sử dụng SignPath trong CI/CD (Khuyến nghị)

Sign file sau khi build trong GitHub Actions:

```yaml
- name: Sign with SignPath
  uses: signpath/signpath-github-action@v1
  with:
    service-url: 'https://app.signpath.io/API/v1'
    organization-id: '${{ secrets.SIGNPATH_ORG_ID }}'
    project-slug: 'cay-daotet-tauri'
    artifact-path: 'cay-daotet-tauri/src-tauri/target/x86_64-pc-windows-msvc/release/cay-daotet-tauri.exe'
```

### Option 2: Sử dụng certificate trực tiếp (Nâng cao)

Nếu SignPath cho phép export certificate (một số trường hợp):

1. Export certificate từ SignPath dashboard
2. Lưu vào GitHub Secrets (base64 encoded)
3. Sử dụng trong build:

```yaml
- name: Setup certificate
  run: |
    echo "${{ secrets.SIGNPATH_CERT }}" | base64 -d > cert.pfx
    
- name: Sign executable
  run: |
    signtool sign /f cert.pfx /p "${{ secrets.SIGNPATH_CERT_PASSWORD }}" /t http://timestamp.digicert.com file.exe
```

## Bước 5: Test

1. Push code lên GitHub
2. Tạo tag: `git tag v0.1.0 && git push origin v0.1.0`
3. GitHub Actions sẽ tự động build và sign
4. Download file đã sign từ artifacts
5. Kiểm tra signature:
   ```powershell
   Get-AuthenticodeSignature .\cay-daotet-tauri.exe
   ```

## Troubleshooting

### Lỗi: "Organization not found"
- Kiểm tra `SIGNPATH_ORG_ID` trong Secrets
- Đảm bảo đã được approve bởi SignPath

### Lỗi: "Project not found"
- Kiểm tra project slug trong SignPath dashboard
- Đảm bảo project đã được setup đúng

### File không được sign
- Kiểm tra artifact path có đúng không
- Đảm bảo file tồn tại sau bước build
- Kiểm tra logs trong GitHub Actions

## Lưu ý

- ⚠️ SignPath chỉ sign file được build từ source code trong CI/CD
- ⚠️ Không thể sign file đã build sẵn (local build)
- ✅ Certificate được lưu trên HSM, an toàn hơn
- ✅ Tự động sign mỗi khi release

## Tham khảo

- [SignPath Foundation](https://signpath.org/)
- [SignPath Documentation](https://about.signpath.io/)
- [SignPath GitHub Action](https://github.com/signpath/signpath-github-action)
- [Tauri Code Signing](https://tauri.app/v1/guides/building/signing)
