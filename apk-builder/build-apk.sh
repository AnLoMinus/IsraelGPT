#!/bin/bash

# עצור במקרה של שגיאה
set -e

echo "🚀 מתחיל תהליך בניית אפליקציית אנדרואיד מקצועית (APK)..."

# 1. התקנת תלויות של Capacitor ופלאגינים למובייל
echo "📦 מתקין חבילות ופלאגינים של Capacitor להתאמה מושלמת למובייל..."
npm install @capacitor/core @capacitor/android
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard
npm install -D @capacitor/cli @capacitor/assets

# 2. בניית אפליקציית ה-React/Vite
echo "🏗️ בונה את אפליקציית הוואב לטובת מובייל (npm run build)..."
npm run build

# 3. אתחול Capacitor (אם טרם הוגדר)
if [ ! -f "../capacitor.config.json" ] && [ ! -f "../capacitor.config.ts" ]; then
  echo "⚙️ מאתחל את Capacitor..."
  npx cap init IsraelGPT com.israelgpt.app --web-dir dist
fi

# 4. הוספת פלטפורמת אנדרואיד
if [ ! -d "../android" ]; then
  echo "🤖 מוסיף פלטפורמת אנדרואיד..."
  npx cap add android
fi

# 5. יצירת מסכי פתיחה ואייקונים אוטומטית אם קיימת תיקיית נכסים (assets)
if [ -d "../assets" ]; then
    echo "🎨 מתאים את האייקונים ומסכי הפתיחה..."
    npx @capacitor/assets generate --android
fi

# 6. סנכרון הקבצים והפלאגינים למובייל
echo "🔄 מסנכרן קבצים, הגדרות ופלאגינים לתיקיית האנדרואיד..."
npx cap sync android

# 7. קימפול ה-APK באמצעות Gradle
echo "🔨 מקמפל את ה-APK באמצעות Gradle (מוכוון מובייל)..."
cd ../android
./gradlew assembleDebug

# 8. העתקת ה-APK לתיקייה הראשית
echo "📋 מעתיק את הקובץ המוכן..."
cp app/build/outputs/apk/debug/app-debug.apk ../IsraelGPT-Mobile.apk
cd ../apk-builder

echo "✅ תהליך הבנייה הסתיים בהצלחה!"
echo "📱 קובץ ההתקנה מותאם למובייל זמין בתיקייה הראשית בשם: IsraelGPT-Mobile.apk"
