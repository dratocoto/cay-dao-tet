# Cây Đào Tết - Tauri Version

Desktop overlay application displaying a peach tree with falling petals effect, built with Tauri for cross-platform support.

## 🚀 Quick Start

### Development

```bash
npm install
npm run tauri:dev
```

### Build for macOS

```bash
npm run tauri:build:macos
```

### Build for Windows (from macOS)

See [docs/CROSS_COMPILE.md](docs/CROSS_COMPILE.md) for detailed instructions.

```bash
# Install prerequisites first
brew install nsis llvm
rustup target add x86_64-pc-windows-msvc
cargo install cargo-xwin

# Then build
npm run tauri:build:windows
```

## 📋 Features

- ✅ Transparent, frameless window
- ✅ Always-on-top display
- ✅ Draggable window
- ✅ Falling petals animation
- ✅ Configurable settings
- ✅ Cross-platform (Windows, macOS, Linux)

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Tauri v2 (Rust)
- **Animation**: Canvas API
- **Build**: Cross-platform compilation support

## 📁 Project Structure

```
cay-daotet-tauri/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   └── App.tsx            # Main app component
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands.rs    # Tauri commands
│   │   └── lib.rs         # Entry point
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
└── docs/                  # Documentation
```

## 📖 Documentation

- [README](docs/README.md) - Detailed setup and usage
- [BUILD.md](docs/BUILD.md) - Build instructions
- [CROSS_COMPILE.md](docs/CROSS_COMPILE.md) - Cross-compilation guide

## ⚙️ Settings

Settings are automatically saved in the app data directory:

- **macOS**: `~/Library/Application Support/com.truongtran.cay-daotet-tauri/`
- **Windows**: `%APPDATA%\com.truongtran.cay-daotet-tauri\`

## 🐛 Troubleshooting

See [docs/README.md](docs/README.md#troubleshooting) for common issues and solutions.

## 📝 License

[Add license if applicable]
