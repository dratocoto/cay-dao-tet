# Cây Đào Tết - Tauri Version

Desktop overlay application displaying a peach tree with falling petals effect, built with Tauri for cross-platform support.

## Features

- Transparent, frameless window
- Always-on-top display
- Draggable window
- Falling petals animation
- Configurable settings (window position, animation parameters)
- Cross-platform (Windows, macOS, Linux)

## Prerequisites

### macOS Development

- Node.js 18+ và npm
- Rust toolchain (via rustup)
- Xcode Command Line Tools: `xcode-select --install`

### Windows Cross-Compilation (from macOS)

- NSIS: `brew install nsis`
- LLVM/LLD: `brew install llvm`
- Windows Rust target: `rustup target add x86_64-pc-windows-msvc`
- cargo-xwin: `cargo install cargo-xwin`

## Installation

1. **Clone repository** (if not already done)

```bash
cd cay-daotet-tauri
```

2. **Install dependencies**

```bash
npm install
```

3. **Run in development mode**

```bash
npm run tauri:dev
```

## Building

### macOS

```bash
npm run tauri:build:macos
```

Output: `src-tauri/target/x86_64-apple-darwin/release/bundle/`

### Windows (from macOS - Experimental)

```bash
# First, ensure cross-compilation tools are installed (see Prerequisites)
npm run tauri:build:windows
```

Output: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/`

**Note**: Cross-compilation from macOS to Windows is experimental. For production builds, consider using a Windows machine or CI/CD pipeline.

## Project Structure

```
cay-daotet-tauri/
├── src/                    # Frontend React code
│   ├── components/
│   │   ├── OverlayWindow.tsx
│   │   └── ParticleSystem.tsx
│   ├── hooks/
│   │   └── useSettings.ts
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   └── commands.rs     # Tauri commands
│   ├── tauri.conf.json
│   └── Cargo.toml
├── public/
│   └── tree.png           # Peach tree image
└── docs/                   # Documentation
```

## Settings

Settings are stored in the app data directory:
- **macOS**: `~/Library/Application Support/com.truongtran.cay-daotet-tauri/settings.json`
- **Windows**: `%APPDATA%\com.truongtran.cay-daotet-tauri\settings.json`

Settings structure:
```json
{
  "window": {
    "x": 100,
    "y": 100,
    "width": 338,
    "height": 423
  },
  "animation": {
    "enabled": true,
    "petal_count": 65,
    "wind_strength": 0.5,
    "speed": 1.0
  },
  "ui": {
    "opacity": 1.0,
    "always_on_top": true
  }
}
```

## Documentation

### Build & Development

- [BUILD.md](./BUILD.md) - Hướng dẫn build chi tiết
- [CROSS_COMPILE.md](./CROSS_COMPILE.md) - Cross-compilation từ macOS sang Windows

### Code Signing & Security

- [CODE_SIGNING.md](./CODE_SIGNING.md) - Hướng dẫn code signing đầy đủ
- [SIGNPATH_SETUP.md](./SIGNPATH_SETUP.md) - Setup SignPath Foundation (code signing miễn phí)
- [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md) - Xử lý false positive từ antivirus

### Troubleshooting

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Hướng dẫn xử lý các vấn đề thường gặp
- [FAQ.md](./FAQ.md) - Câu hỏi thường gặp

## Troubleshooting

### Build Errors

- **Rust not found**: Install Rust via `rustup`: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Windows cross-compilation fails**: Ensure all prerequisites are installed and `cargo-xwin` is in PATH
- Xem chi tiết: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Runtime Issues

- **Window not transparent**: Check `tauri.conf.json` window settings
- **Settings not saving**: Check app data directory permissions
- Xem chi tiết: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Antivirus False Positive

Nếu file `.exe` bị antivirus phát hiện là virus (false positive):
- Xem: [ANTIVIRUS_FALSE_POSITIVE.md](./ANTIVIRUS_FALSE_POSITIVE.md)
- Giải pháp tốt nhất: Code signing với [SignPath Foundation](./SIGNPATH_SETUP.md) (miễn phí cho open source)

## License

[Add license if applicable]
