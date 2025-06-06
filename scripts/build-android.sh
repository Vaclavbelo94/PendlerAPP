
#!/bin/bash
# Script pro rychlý build Android APK

echo "🏗️  Začínám build Android aplikace..."

# Kontrola závislostí
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm není nainstalovaný"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "❌ npx není dostupný"
    exit 1
fi

# Build webové aplikace
echo "📦 Building web aplikace..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build webové aplikace selhal"
    exit 1
fi

# Synchronizace s Capacitor
echo "🔄 Synchronizuji s Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync selhal"
    exit 1
fi

echo "✅ Build dokončen!"
echo "🚀 Nyní spusťte: npx cap open android"
echo "📱 V Android Studio použijte Build → Generate Signed Bundle / APK"
