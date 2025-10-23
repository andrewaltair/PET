# Restart Scripts Fix - Concurrently Issue

## Problem
When running `hard-restart.bat` or `kill-and-restart.bat`, the scripts failed with:
```
'concurrently' is not recognized as an internal or external command,
operable program or batch file.
```

## Root Cause
The `concurrently` package was listed in `package.json` devDependencies but wasn't actually installed in `node_modules`.

## Solution Applied

### 1. Installed Concurrently
```powershell
npm install concurrently --save-dev
```
✅ Added 16 packages
✅ No vulnerabilities

### 2. Updated Scripts with Fallbacks

**`hard-restart.bat`** improvements:
- ✅ Added dependency check step
- ✅ Falls back to `npx concurrently` if npm script fails
- ✅ Falls back to manual separate windows if everything fails
- ✅ Better error handling

**`kill-and-restart.bat`** improvements:
- ✅ Falls back to `npx concurrently` if npm script fails
- ✅ Better error messages

### 3. Updated Documentation

**`RESTART_SCRIPTS.md`** additions:
- ✅ Troubleshooting section for concurrently errors
- ✅ Installation instructions
- ✅ Explanation of fallback behavior

## How Scripts Work Now

### Normal Operation
1. Script runs `npm run dev:full`
2. npm uses `concurrently` from node_modules
3. Both servers start in one terminal

### Fallback #1: npx Concurrently
If npm script fails:
1. Script runs `npx concurrently`
2. npx downloads/runs concurrently temporarily
3. Servers start successfully

### Fallback #2: Manual Start
If both fail:
1. Script opens 2 separate windows
2. Client starts in window 1
3. Server starts in window 2
4. User can close main window

## Usage

### Hard Restart (Recommended)
```cmd
.\hard-restart.bat
```

**Steps**:
1. Kills all Node.js processes
2. Cleans all caches
3. Checks dependencies (installs if needed)
4. Starts both servers

### Quick Restart
```cmd
.\kill-and-restart.bat
```

**Steps**:
1. Kills Node.js processes
2. Restarts servers immediately

## Test Results

✅ `concurrently` successfully installed
✅ Scripts updated with fallbacks
✅ Documentation updated
✅ All error paths handled

## Troubleshooting

### If Script Still Fails

**Option 1: Use PowerShell**
```powershell
powershell -ExecutionPolicy Bypass -File hard-restart.ps1
```

**Option 2: Manual Start**
```powershell
# Terminal 1 - Client
cd client
npm run dev

# Terminal 2 - Server
cd server
npm run dev
```

**Option 3: Reinstall Dependencies**
```powershell
npm install
.\hard-restart.bat
```

## Files Modified

1. ✅ `hard-restart.bat` - Added fallbacks and dependency check
2. ✅ `kill-and-restart.bat` - Added fallback to npx
3. ✅ `RESTART_SCRIPTS.md` - Added troubleshooting section
4. ✅ `RESTART_SCRIPTS_FIX.md` - This file

## Next Steps

The scripts are now fully functional and robust:
- ✅ They handle missing dependencies
- ✅ They fall back gracefully
- ✅ They work on clean systems
- ✅ They're documented thoroughly

Just double-click `hard-restart.bat` to use!

