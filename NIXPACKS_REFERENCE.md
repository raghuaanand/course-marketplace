# Nixpacks.toml Structure Reference

## ✅ CORRECT Structure:

```toml
# Variables section (Node.js will be auto-detected)
[variables]
NODE_VERSION = "18"

# Install phase
[phases.install]
cmds = [
  "cd shared && npm ci && npm run build",
  "cd backend && npm ci && npx prisma generate"
]

# Build phase
[phases.build]
cmds = [
  "cd backend && npm run build"
]

# Deploy phase (runs during deployment)
[phases.deploy]
cmds = [
  "cd backend && npx prisma migrate deploy"
]

# Start command
[start]
cmd = "cd backend && npm start"
```

## ❌ COMMON ERRORS:

### Error 1: Wrong provider name
```toml
# ❌ WRONG - "nodejs" doesn't exist
providers = ["nodejs"]

# ✅ CORRECT - Use "node" or omit for auto-detection
providers = ["node"]
# OR better yet, just omit it entirely - Nixpacks auto-detects Node.js
```

### Error 2: Providers as section
```toml
# ❌ WRONG
[providers]
node = {}
```

### Error 3: Providers under variables
```toml
# ❌ WRONG
[variables]
NODE_VERSION = "18"
providers = ["node"]  # This causes parsing errors!
```

## 📝 Key Points:

1. **`providers`** is OPTIONAL - Nixpacks auto-detects Node.js projects
2. If you specify **`providers`**, use `["node"]` not `["nodejs"]`
3. **`NODE_VERSION`** goes under `[variables]` section
4. **Phases** are defined as `[phases.phasename]`
5. **Start command** is under `[start]` section
6. Use `npm ci` instead of `npm install` for faster, reliable builds

## 🔍 Validation:

Run `./validate-nixpacks.sh` to check your configuration!
