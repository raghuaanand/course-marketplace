#!/bin/bash

# Nixpacks Configuration Validator
# Quick check for common nixpacks.toml syntax issues

echo "🔍 Validating nixpacks.toml syntax..."

if [ ! -f "nixpacks.toml" ]; then
    echo "❌ Error: nixpacks.toml not found"
    exit 1
fi

# Check for common syntax issues
echo "   Checking providers syntax..."
if grep -q "^\[providers\]" nixpacks.toml; then
    echo "❌ Error: Found [providers] section - should be 'providers = [\"node\"]' or omitted for auto-detection"
    echo "   Fix: Replace '[providers]' section with 'providers = [\"node\"]' or remove it entirely"
    exit 1
fi

# Check if providers is incorrectly under [variables]
if grep -A 10 "^\[variables\]" nixpacks.toml | grep -q "^providers"; then
    echo "❌ Error: 'providers' found under [variables] section"
    echo "   Fix: Move 'providers = [\"node\"]' to root level (before [variables]) or remove it"
    exit 1
fi

if grep -q "^providers = \[" nixpacks.toml; then
    if grep -q "nodejs" nixpacks.toml; then
        echo "❌ Error: Provider 'nodejs' not found - should be 'node'"
        echo "   Fix: Change 'providers = [\"nodejs\"]' to 'providers = [\"node\"]'"
        exit 1
    fi
    echo "✅ Providers syntax is correct"
else
    echo "✅ No providers specified - Nixpacks will auto-detect Node.js"
fi

echo "   Checking Node.js version..."
if grep -q "NODE_VERSION" nixpacks.toml; then
    version=$(grep "NODE_VERSION" nixpacks.toml | cut -d'"' -f2)
    echo "✅ Node.js version: $version"
else
    echo "⚠️  Warning: NODE_VERSION not specified, will use default"
fi

echo "   Checking phases..."
phases=("install" "build" "deploy")
for phase in "${phases[@]}"; do
    if grep -q "^\[phases.$phase\]" nixpacks.toml; then
        echo "✅ Found $phase phase"
    else
        echo "⚠️  Warning: $phase phase not found"
    fi
done

echo "   Checking start command..."
if grep -q "^\[start\]" nixpacks.toml; then
    echo "✅ Found start command"
else
    echo "❌ Error: Start command not found"
    exit 1
fi

echo ""
echo "🎉 nixpacks.toml syntax validation passed!"
echo ""
echo "Current configuration:"
echo "======================"
cat nixpacks.toml
