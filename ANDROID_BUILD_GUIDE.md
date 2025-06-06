
# 📱 Návod pro vytvoření Android APK aplikace

## 🔧 Požadavky
- **Android Studio** (nejnovější verze)
- **Java JDK 17** nebo novější
- **Node.js** (verze 18+)
- **Git**

## 📋 Krok za krokem návod

### 1. Export projektu z Lovable
1. Klikněte na tlačítko **"Export to Github"** v Lovable
2. Vytvořte nový GitHub repository
3. Klonujte projekt na váš počítač:
```bash
git clone https://github.com/vas-username/vas-repository.git
cd vas-repository
```

### 2. Instalace závislostí
```bash
npm install
```

### 3. Inicializace Capacitor projektu
```bash
npx cap init
```
- **App ID**: `app.lovable.43a9f196fcd94f8db60a9c37d14325e5`
- **App Name**: `Pendlerův Pomocník`

### 4. Přidání Android platformy
```bash
npx cap add android
```

### 5. Build webové aplikace
```bash
npm run build
```

### 6. Synchronizace s Android
```bash
npx cap sync android
```

### 7. Otevření v Android Studio
```bash
npx cap open android
```

## 🏗️ Vytvoření APK v Android Studio

### 1. Konfigurace podpisu aplikace
1. **File** → **Project Structure** → **Modules** → **app** → **Signing Configs**
2. Klikněte na **"+"** a vytvořte nový signing config:
   - **Config Name**: `release`
   - **Store File**: Vytvořte nový keystore soubor (`.jks`)
   - **Store Password**: Silné heslo
   - **Key Alias**: `pendler-key`
   - **Key Password**: Silné heslo
   - **Validity (years)**: 25

### 2. Konfigurace Build Variants
1. **Build** → **Select Build Variant**
2. Vyberte **"release"** pro oba moduly

### 3. Nastavení verze aplikace
V souboru `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 4. Optimalizace pro produkci
V `android/app/build.gradle` přidejte:
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

### 5. Generování APK
1. **Build** → **Generate Signed Bundle / APK**
2. Vyberte **APK**
3. Vyberte váš keystore soubor
4. Zadejte hesla
5. Vyberte **release** build variant
6. Klikněte **Finish**

## 📦 Výsledný APK soubor
APK soubor najdete v:
```
android/app/release/app-release.apk
```

## 🔄 Aktualizace aplikace
Pro nové verze:
```bash
# 1. Aktualizujte kód v Lovable a exportujte
git pull origin main

# 2. Instalujte nové závislosti (pokud jsou)
npm install

# 3. Build nové verze
npm run build

# 4. Synchronizujte změny
npx cap sync android

# 5. Otevřete v Android Studio a vytvořte nový APK
npx cap open android
```

## 🛠️ Řešení problémů

### Gradle Build chyby
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Chyby s Java verzí
Ujistěte se, že používáte Java JDK 17:
```bash
java -version
# Mělo by zobrazit verzi 17.x.x
```

### Chyby s Android SDK
V Android Studio:
1. **File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**
2. Nainstalujte nejnovější **Android API Level** (34+)
3. Nainstalujte **Android SDK Build-Tools** (nejnovější verze)

## 📱 Testování APK
1. Zapněte **Developer Options** na Android zařízení
2. Povolte **USB Debugging**
3. Připojte zařízení k počítači
4. Nainstalujte APK:
```bash
adb install android/app/release/app-release.apk
```

## 🔐 Bezpečnost Keystore
- **NIKDY** nenahrávejte keystore soubor na GitHub
- Zálohujte keystore soubor na bezpečném místě
- Zapamatujte si hesla - bez nich nemůžete vytvořit aktualizace

## 📋 Checklist před publikováním
- [ ] Aplikace funguje na testovacím zařízení
- [ ] Všechny funkce fungují offline
- [ ] Ikona aplikace je správně nastavená
- [ ] Splash screen se zobrazuje správně
- [ ] Žádné console chyby
- [ ] Verze v `build.gradle` je správná
- [ ] Keystore je bezpečně zálohovaný

## 🚀 Další kroky (volitelné)
- Nastavení **Google Play Console** pro distribuce
- Implementace **Push Notifications**
- Přidání **In-App Updates**
- Integrace **Google Analytics**
