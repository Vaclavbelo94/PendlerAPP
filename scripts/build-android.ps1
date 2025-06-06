
# PowerShell script pro Windows uživatele
Write-Host "🏗️  Začínám build Android aplikace..." -ForegroundColor Green

# Kontrola Node.js
try {
    npm --version | Out-Null
} catch {
    Write-Host "❌ Node.js/npm není nainstalovaný" -ForegroundColor Red
    exit 1
}

# Build webové aplikace
Write-Host "📦 Building web aplikace..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build webové aplikace selhal" -ForegroundColor Red
    exit 1
}

# Synchronizace s Capacitor
Write-Host "🔄 Synchronizuji s Capacitor..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Capacitor sync selhal" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build dokončen!" -ForegroundColor Green
Write-Host "🚀 Nyní spusťte: npx cap open android" -ForegroundColor Cyan
Write-Host "📱 V Android Studio použijte Build → Generate Signed Bundle / APK" -ForegroundColor Cyan
