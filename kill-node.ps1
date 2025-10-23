# Kill all Node.js processes script
Write-Host "Killing all Node.js processes..." -ForegroundColor Yellow
Write-Host ""

# Function to kill processes
function Kill-Processes {
    param($ProcessName)
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($processes) {
        foreach ($process in $processes) {
            try {
                Stop-Process -Id $process.Id -Force
                Write-Host "Killed $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Green
            } catch {
                Write-Host "Could not kill $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "No $ProcessName processes found" -ForegroundColor Gray
    }
}

# Kill different Node.js related processes
Kill-Processes "node"
Kill-Processes "npm"
Kill-Processes "tsx"
Kill-Processes "next"

Write-Host ""
Write-Host "Done! Port 5000 should now be free." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


