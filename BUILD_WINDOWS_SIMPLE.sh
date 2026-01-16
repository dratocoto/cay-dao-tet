#!/bin/bash

# Simple script to build Windows .exe from macOS
# Prerequisites must be installed first:
# - NSIS: brew install nsis
# - LLVM: brew install llvm
# - Rust Windows target: rustup target add x86_64-pc-windows-msvc
# - cargo-xwin: cargo install --locked cargo-xwin

set -e

echo "🚀 Building Windows .exe from macOS"
echo "===================================="
echo ""

cd "$(dirname "$0")"

# Ensure Rust is in PATH
source "$HOME/.cargo/env" 2>/dev/null || true

# Ensure LLVM is in PATH
export PATH="/opt/homebrew/opt/llvm/bin:$PATH"

# Unset CI to avoid Tauri CLI issues
unset CI

echo "📦 Building frontend..."
npm run build

echo ""
echo "🔨 Building Windows installer with cargo-xwin..."
echo "   This may take 10-20 minutes on first build..."
echo ""

# Build with Tauri using cargo-xwin runner (npm run tauri = npx tauri)
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Windows installer location:"
echo "   src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/"
echo ""
ls -lh src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/*.exe 2>/dev/null || echo "   (Checking for .exe files...)"
echo ""
