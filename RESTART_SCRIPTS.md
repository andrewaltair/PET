# Restart Scripts Guide

Quick reference for restarting the PetService development environment.

## Available Scripts

### 1. `hard-restart.bat` ⚡ **RECOMMENDED FOR PROBLEMS**
**Use when**: Client/server frozen, errors persist, or after config changes

**What it does**:
- ✅ Kills ALL Node.js processes
- ✅ Cleans client `.next` cache
- ✅ Cleans server `dist` cache
- ✅ Cleans root `node_modules/.cache`
- ✅ Hard restarts both client and server

**Usage**:
```cmd
hard-restart.bat
```

**When to use**:
- Client freezes or hangs
- "EADDRINUSE" port errors
- Webpack build errors
- After modifying `next.config.js`
- After server code changes don't reflect
- General "it's not working" scenarios

---

### 2. `kill-and-restart.bat` 🚀 **QUICK RESTART**
**Use when**: Just need to restart servers quickly

**What it does**:
- ✅ Kills Node.js processes
- ✅ Restarts client and server
- ❌ Does NOT clean caches

**Usage**:
```cmd
kill-and-restart.bat
```

**When to use**:
- Quick restart after code changes
- Servers running but need restart
- Normal development workflow
- When everything is working fine

---

## Manual Restart Process

If scripts don't work, follow these steps:

### Step 1: Kill Processes
```powershell
taskkill /F /IM node.exe
taskkill /F /IM npm.exe
taskkill /F /IM tsx.exe
taskkill /F /IM next.exe
```

### Step 2: Clean Caches
```powershell
# Client cache
cd client
Remove-Item -Recurse -Force .next
cd ..

# Server cache
cd server
Remove-Item -Recurse -Force dist
cd ..
```

### Step 3: Start Servers
```powershell
# Start both with concurrently
npm run dev:full

# OR start manually in separate terminals
# Terminal 1 - Client
cd client
npm run dev

# Terminal 2 - Server
cd server
npm run dev
```

---

## Troubleshooting

### Concurrently Not Found

If you see: `'concurrently' is not recognized as an internal or external command`

**Solution**:
```powershell
npm install concurrently --save-dev
```

Or use the script anyway - it will automatically fall back to using `npx concurrently` or start servers manually.

### Port Still in Use

```powershell
# Find what's using port 5000
netstat -ano | findstr ":5000"

# Kill specific process (replace PID)
taskkill /F /PID <PID>

# For port 3001 (server)
netstat -ano | findstr ":3001"
taskkill /F /PID <PID>
```

### Client Freezes

1. Run `hard-restart.bat`
2. If still freezing, check `next.config.js` webpack config
3. Remove complex polling/watch configurations
4. Try: `cd client && npm run clean && npm run dev`

### Server Won't Start

1. Check database connection
2. Verify `.env` file exists in `server/`
3. Run: `cd server && npm run db:init`
4. Check for TypeScript errors: `npm run type-check`

### "Cannot find module" Errors

```powershell
# Clean install
cd client
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install
npm run dev
```

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Client (Next.js) | 5000 | http://localhost:5000 |
| Server (Express) | 3001 | http://localhost:3001 |
| Socket.IO | 3001 | ws://localhost:3001 |

---

## Quick Commands

### Check Running Processes
```powershell
Get-Process -Name node | Select-Object Id, Name, CPU, WorkingSet
```

### Check Port Usage
```powershell
netstat -ano | findstr ":5000"
netstat -ano | findstr ":3001"
```

### Kill Everything
```powershell
taskkill /F /IM node.exe /T
```

### View Logs
- Client logs: In the terminal running `npm run dev`
- Server logs: In the terminal running `npm run dev`
- Check browser console for client errors

---

## Best Practices

1. **Use `hard-restart.bat`** if experiencing any issues
2. **Check ports** before restarting if getting EADDRINUSE errors
3. **Clean caches** after config changes (`next.config.js`, `tailwind.config.js`)
4. **Monitor both terminals** - client and server logs will show errors
5. **Use separate terminals** for manual debugging instead of concurrently

---

## Environment Files

Make sure these exist:
- `client/.env.local` - Client environment variables
- `server/.env` - Server environment variables
- Root `.env` - Shared environment variables (if any)

---

## Performance Tips

- Use `hard-restart.bat` sparingly (it's slower due to cache cleaning)
- Use `kill-and-restart.bat` for quick restarts during normal development
- Only clean caches when needed (build errors, config changes)
- Keep terminal output visible to catch errors early

---

## Emergency Nuclear Option 🔥

If everything is broken:

```powershell
# 1. Kill everything
taskkill /F /IM node.exe /T

# 2. Delete all caches
Remove-Item -Recurse -Force client\.next
Remove-Item -Recurse -Force server\dist
Remove-Item -Recurse -Force node_modules\.cache

# 3. Reinstall dependencies (if needed)
Remove-Item -Recurse -Force client\node_modules
Remove-Item -Recurse -Force server\node_modules
npm install

# 4. Start fresh
npm run dev:full
```

---

## Summary

| Situation | Script | Time |
|-----------|--------|------|
| Everything broken | `hard-restart.bat` | ~15s |
| Quick restart | `kill-and-restart.bat` | ~5s |
| Normal dev | Just save files | 0s |

