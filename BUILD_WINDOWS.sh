#!/bin/bash

# Script to build Windows .exe from macOS
# This script installs prerequisites and builds the Windows installer

set -e

echo "🚀 Building Windows .exe from macOS"
echo "===================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Step 1: Install NSIS
echo "📦 Step 1: Installing NSIS..."
if ! command -v makensis &> /dev/null; then
    brew install nsis
else
    echo "   ✓ NSIS already installed"
fi

# Step 2: Install LLVM
echo ""
echo "📦 Step 2: Installing LLVM..."
if ! command -v llvm-rc &> /dev/null; then
    brew install llvm
    echo "   ⚠️  Note: You may need to add LLVM to PATH:"
    echo "      export PATH=\"/opt/homebrew/opt/llvm/bin:\$PATH\""
    echo "      (Add to ~/.zshrc or ~/.bash_profile)"
else
    echo "   ✓ LLVM already installed"
fi

# Step 3: Check Rust
echo ""
echo "📦 Step 3: Checking Rust installation..."
if ! command -v rustup &> /dev/null; then
    echo "   ❌ Rust/rustup not found. Installing..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    echo "   ✓ Rust already installed"
fi

# Step 4: Add Windows target
echo ""
echo "📦 Step 4: Adding Windows Rust target..."
rustup target add x86_64-pc-windows-msvc

# Step 5: Install cargo-xwin
echo ""
echo "📦 Step 5: Installing cargo-xwin..."
if ! cargo xwin --version &> /dev/null; then
    cargo install cargo-xwin
else
    echo "   ✓ cargo-xwin already installed"
fi

# Step 6: Build
echo ""
echo "🔨 Step 6: Building Windows installer..."
echo "   This may take several minutes..."
echo ""

cd "$(dirname "$0")"

# Ensure LLVM is in PATH for this session
export PATH="/opt/homebrew/opt/llvm/bin:$PATH"

# Build with cargo-xwin
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Windows installer location:"
echo "   src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/"
echo ""
