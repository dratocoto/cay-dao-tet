# Build Instructions

## Development Build

```bash
npm run tauri:dev
```

This will:
1. Start Vite dev server
2. Build Rust backend in debug mode
3. Launch the application

## Production Build

### macOS

```bash
npm run tauri:build:macos
```

Output location: `src-tauri/target/x86_64-apple-darwin/release/bundle/`

### Windows (Cross-Compilation from macOS)

**Prerequisites:**

1. Install NSIS:
   ```bash
   brew install nsis
   ```

2. Install LLVM/LLD:
   ```bash
   brew install llvm
   ```

3. Add Windows Rust target:
   ```bash
   rustup target add x86_64-pc-windows-msvc
   ```

4. Install cargo-xwin:
   ```bash
   cargo install cargo-xwin
   ```

**Build:**

```bash
npm run tauri:build:windows
```

Output location: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/`

**Note**: Cross-compilation is experimental. For reliable Windows builds, use a Windows machine or CI/CD.

## Build Configuration

Window settings are configured in `src-tauri/tauri.conf.json`:

```json
{
  "app": {
    "windows": [
      {
        "title": "Cây Đào Tết",
        "width": 338,
        "height": 423,
        "transparent": true,
        "decorations": false,
        "alwaysOnTop": true,
        "skipTaskbar": true,
        "resizable": false
      }
    ]
  }
}
```

## Bundle Types

- **macOS**: Creates `.app` bundle and optionally `.dmg`
- **Windows**: Creates NSIS installer (`.exe`)

MSI installers require a Windows host and cannot be built from macOS.
