# Quick Start Guide 🚀

## Double-Click to Start!

### 🎯 Main Restart Scripts

| Script | When to Use | What It Does |
|--------|-------------|--------------|
| **`hard-restart.bat`** ⚡ | Client frozen, errors, config changes | Kills everything, cleans caches, restarts |
| **`kill-and-restart.bat`** 🚀 | Quick restart during development | Kills processes, restarts (no cleanup) |

---

## 🚀 Fastest Way to Start

1. **Double-click** `hard-restart.bat`
2. **Wait** ~15 seconds
3. **Access** http://localhost:5000

That's it! ✅

---

## 📋 What Happens

### `hard-restart.bat` Process

```
1. Kills all Node.js processes
2. Waits for ports to release
3. Cleans client/.next cache
4. Cleans server/dist cache
5. Cleans node_modules/.cache
6. Checks dependencies (installs if needed)
7. Starts both client and server
```

**Total time**: ~15 seconds

### `kill-and-restart.bat` Process

```
1. Kills Node.js processes
2. Waits 2 seconds
3. Starts both servers
```

**Total time**: ~5 seconds

---

## 🎯 When to Use Each

### Use `hard-restart.bat` When:
- ❌ Client freezes or hangs
- ❌ Won't start
- ❌ Build errors
- ❌ Webpack errors
- ❌ Changed `next.config.js`
- ❌ Changed `tailwind.config.js`
- ❌ General "it's not working"
- ✅ **Safe default choice**

### Use `kill-and-restart.bat` When:
- ✅ Quick restart during normal development
- ✅ Just finished code changes
- ✅ Everything working fine
- ✅ Faster restart needed

---

## 🌐 Access Your App

Once started:

| Service | URL |
|---------|-----|
| **Homepage** | http://localhost:5000 |
| **Login** | http://localhost:5000/en/login |
| **Register** | http://localhost:5000/en/register |
| **Dashboard** | http://localhost:5000/en/dashboard |

---

## ⚠️ Common Issues

### "Concurrently not found"
**Solution**: Script will handle automatically with fallbacks

### "Port in use"
**Solution**: Script kills processes, then starts

### "Still not working"
**Solution**: 
1. Close all terminals
2. Double-click `hard-restart.bat`
3. Wait for completion

---

## 🔧 Troubleshooting

### Nothing Starts
```powershell
# Check Node.js version
node --version

# Should be >= 18.0.0
```

### Port Conflicts
```powershell
# Find what's using port 5000
netstat -ano | findstr ":5000"

# Kill specific process
taskkill /F /PID <PID>
```

### Persistent Errors
```powershell
# Nuclear option
cd client
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
cd ..
cd server
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force dist
cd ..
npm install
.\hard-restart.bat
```

---

## 📚 More Help

- **Detailed Guide**: `RESTART_SCRIPTS.md`
- **Freeze Fix**: `CLIENT_FREEZE_FIX.md`
- **Change Log**: `changes.md`

---

## 🎯 TL;DR

```
Problem: Client frozen?
Solution: Double-click hard-restart.bat

Problem: Quick restart?
Solution: Double-click kill-and-restart.bat

Problem: Still broken?
Solution: Read RESTART_SCRIPTS.md
```

---

## ✨ Summary

**Just double-click `hard-restart.bat` and you're good to go!** 🎉

The script handles everything automatically:
- ✅ Process management
- ✅ Cache cleaning
- ✅ Dependency installation
- ✅ Server startup
- ✅ Error recovery

No manual commands needed! 🚀

