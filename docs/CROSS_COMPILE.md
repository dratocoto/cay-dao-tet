# Cross-Compilation Guide

Hướng dẫn build Windows .exe từ macOS.

## Prerequisites

### 1. Install NSIS

NSIS (Nullsoft Scriptable Install System) cần thiết để tạo Windows installer:

```bash
brew install nsis
```

### 2. Install LLVM/LLD

LLVM cung cấp linker và tools cần thiết:

```bash
brew install llvm
```

Thêm LLVM vào PATH (thêm vào `~/.zshrc` hoặc `~/.bash_profile`):

```bash
export PATH="/opt/homebrew/opt/llvm/bin:$PATH"
```

### 3. Add Windows Rust Target

Thêm Windows target cho Rust:

```bash
rustup target add x86_64-pc-windows-msvc
```

### 4. Install cargo-xwin

cargo-xwin giúp quản lý Windows SDK dependencies:

```bash
cargo install cargo-xwin
```

## Build Process

### Step 1: Verify Prerequisites

```bash
# Check NSIS
which makensis

# Check LLVM
which llvm-rc
which lld-link

# Check Rust target
rustup target list | grep x86_64-pc-windows-msvc

# Check cargo-xwin
cargo xwin --version
```

### Step 2: Build for Windows

```bash
npm run tauri:build:windows
```

Hoặc với cargo-xwin runner:

```bash
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc
```

### Step 3: Find Output

Windows installer sẽ được tạo tại:

```
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/cay-daotet-tauri_0.1.0_x64-setup.exe
```

## Troubleshooting

### Error: "linker `link.exe` not found"

**Solution**: Install cargo-xwin và sử dụng nó như runner:

```bash
cargo install cargo-xwin
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc
```

### Error: "NSIS not found"

**Solution**: Install NSIS via Homebrew:

```bash
brew install nsis
```

### Error: "llvm-rc not found"

**Solution**: Install LLVM và thêm vào PATH:

```bash
brew install llvm
export PATH="/opt/homebrew/opt/llvm/bin:$PATH"
```

### Build Fails with Linker Errors

**Solution**: Đảm bảo cargo-xwin đã được cài đặt và sử dụng làm runner:

```bash
cargo install cargo-xwin
```

Sau đó build với:

```bash
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc
```

## Limitations

1. **MSI Installers**: Không thể build MSI từ macOS. Chỉ NSIS installers được hỗ trợ.

2. **Code Signing**: Windows code signing thường yêu cầu Windows host hoặc external tools.

3. **Experimental**: Cross-compilation là experimental và có thể gặp issues. Để production builds, nên sử dụng Windows machine hoặc CI/CD.

## Alternative: Using CI/CD

Để build đáng tin cậy hơn, có thể sử dụng GitHub Actions hoặc CI/CD khác:

```yaml
# .github/workflows/build-windows.yml
name: Build Windows
on: [push]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions-rs/toolchain@v1
      - run: npm install
      - run: npm run tauri:build:windows
```
