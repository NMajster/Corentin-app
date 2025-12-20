# Script d'auto-commit toutes les 30 minutes
# Lancer avec: powershell -ExecutionPolicy Bypass -File auto-commit.ps1

$projectPath = "C:\Users\nmajs\Dropbox\Cursor\Corentin\Projet-Corentin"
$intervalMinutes = 30

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AUTO-COMMIT ACTIVE" -ForegroundColor Green
Write-Host "  Intervalle: $intervalMinutes minutes" -ForegroundColor Yellow
Write-Host "  Projet: $projectPath" -ForegroundColor Yellow
Write-Host "  Ctrl+C pour arreter" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan

Set-Location $projectPath

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "auto-save: $timestamp"
    
    # Vérifier s'il y a des changements
    $status = git status --porcelain
    
    if ($status) {
        Write-Host "`n[$timestamp] Changements detectes, commit en cours..." -ForegroundColor Yellow
        
        git add -A
        git commit -m $commitMessage
        
        Write-Host "[$timestamp] Commit effectue: $commitMessage" -ForegroundColor Green
        
        # Optionnel: push automatique (décommentez si vous voulez)
        # git push origin main
        # Write-Host "[$timestamp] Push effectue" -ForegroundColor Green
    } else {
        Write-Host "[$timestamp] Aucun changement detecte" -ForegroundColor Gray
    }
    
    Write-Host "Prochain check dans $intervalMinutes minutes..." -ForegroundColor Cyan
    Start-Sleep -Seconds ($intervalMinutes * 60)
}

