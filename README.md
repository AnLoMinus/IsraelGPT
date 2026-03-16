# IsraelGPT - צ'אט בינה מלאכותית עם חכמי ישראל

🔗 **[קישור לאפליקציה](https://ai.studio/apps/374b8f24-ed31-494b-8785-9de86ebc82bb?fullscreenApplet=true)**

<p align="center">
  <img src="https://github.com/user-attachments/assets/fe49b5bb-019c-4197-b6fb-0c27c5bb0b7d" alt="logo" width="400" />
</p>

## 📸 גלריית תמונות

| | | |
| :---: | :---: | :---: |
| ![image](https://github.com/user-attachments/assets/eae82823-af5c-4a79-a68a-d88bddaf5f06) | ![image (4)](https://github.com/user-attachments/assets/51ea0837-28d0-44c4-9643-41ce6e9d208a) | ![image (3)](https://github.com/user-attachments/assets/733de895-2dce-4242-b15f-a196fe53f8c4) |
| ![image (2)](https://github.com/user-attachments/assets/5bdf7c80-ec8d-4ed9-9cd6-1d748cbe4e7b) | ![image (1)](https://github.com/user-attachments/assets/9a045d9b-3d8c-4905-86c3-1aa511d499b8) | ![Gemini_Generated_Image_xoh8pdxoh8pdxoh8](https://github.com/user-attachments/assets/12fb3b8c-929a-4a9f-bb6a-cead630a1422) |
| ![Gemini_Generated_Image_u41prbu41prbu41p](https://github.com/user-attachments/assets/afda7b41-0cb2-42aa-8f13-65b8bab184ed) | ![Gemini_Generated_Image_nn2fcvnn2fcvnn2f](https://github.com/user-attachments/assets/afffcd4b-950a-41ef-af0b-1fcca46490c5) | ![Gemini_Generated_Image_h3jou4h3jou4h3jo](https://github.com/user-attachments/assets/94ea2dbd-0d72-4399-9428-900d8bde48e8) |

<p align="center">
  <strong>שיחות חכמות עם גדולי האומה.</strong>
</p>

---

## 📜 מבוא

IsraelGPT הוא פרויקט חדשני המשלב את היכולות המתקדמות של מודל השפה **Gemini של גוגל** עם העושר והעומק של המחשבה היהודית וההיסטוריה הישראלית. האפליקציה מאפשרת למשתמשים לנהל שיחות חכמות, מרתקות ומעוררות השראה עם דמויות מפתח מההיסטוריה שלנו - מאבות האומה ונביאים, דרך תנאים ואמוראים, ועד להוגים ומנהיגים ציוניים מהעת החדשה.

הפרויקט נבנה באמצעות **React, TypeScript ו-Tailwind CSS**, ומציע חווית משתמש מודרנית, אינטראקטיבית ונגישה במלואה בעברית.

## ✨ תכונות מרכזיות (נכון לגרסה 0.9.1)

*   **🗣️ שיחה עם דמויות היסטוריות:** בחר דמות מהרשימה ונהל איתה שיחה אישית. כל דמות מוגדרת עם "הנחיות אופי" (System Instructions) ייחודיות המשקפות את סגנונה, תפיסת עולמה ותקופתה.
*   **🏛️ בית מדרש (דיון רב-משתתפים):** בחר עד 4 דמויות, הצג נושא לדיון, וצפה בהן מנהלות דיון ער ומעמיק ביניהן, מתווכחות, מביאות מקורות ומגיעות לתובנות משותפות.
*   **📅 לוח שנה עברי וזמנים:** הצגת תאריך עברי עדכני, פרשת השבוע ודף יומי.
*   **📜 פרשת השבוע:** לימוד מעמיק על הפרשה הנוכחית עם דמויות היסטוריות.
*   **📖 דף יומי:** מעקב אחר הלימוד היומי והצטרפות ללימוד עם החכמים.
*   **📚 מקורות מדויקים:** הדמויות הונחו להשתדל ולספק מראה מקום מדויק (פסוק, גמרא, שו"ע) לציטוטים ורעיונות שהן מעלות.
*   **📂 ניהול היסטוריית שיחות:** כל השיחות נשמרות בדפדפן. ניתן לחפש שיחות קודמות לפי מילות מפתח ולמחוק שיחות ישנות.
*   **👤 יצירת דמויות מותאמות אישית:** הוסף דמויות משלך על ידי הגדרת שם, תיאור, אייקון, הנחיות אופי ומשפט פתיחה.
*   **🎤 תמיכה קולית:**
    *   **זיהוי דיבור (Voice-to-Text):** דבר אל האפליקציה במקום להקליד.
    *   **הקראת טקסט (Text-to-Speech):** האזן לתשובות הדמויות בקול.
*   **🖼️ יצירת תמונות:** בקש מהדמויות לצייר עבורך תמונות, והן ישתמשו במודל יצירת התמונות של Gemini כדי להגשים את בקשתך.
*   **📤 שיתוף והורדה:** שתף הודעות בודדות כתמונה מעוצבת, או הורד שיחות שלמות כמסמכי Markdown.
*   **🎨 עיצוב מודרני:** ממשק משתמש נקי ומזמין, עם תמיכה מלאה במצב כהה (Dark Mode) ורקע אינטראקטיבי.

## 🛠️ טכנולוגיות וכלים

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **AI Model:** Google Gemini API (`@google/genai`)
*   **Animations:** Motion (from `motion/react`)
*   **Icons:** Lucide React
*   **Markdown Rendering:** `react-markdown`
*   **Image Generation:** `html-to-image`

## 📁 מבנה הפרויקט ופירוט קבצים

להלן סקירה של מבנה התיקיות והקבצים המרכזיים בפרויקט:

```
/src
├── components/
│   ├── PrivacyPolicy.tsx
│   ├── TermsOfUse.tsx
│   ├── ParashatHashavua.tsx
│   └── DafYomi.tsx
├── characters/
│   ├── index.ts
│   ├── types.ts
│   └── (כל קבצי הדמויות, למשל: abraham.ts, david.ts, ...)
├── App.tsx
├── main.tsx
└── index.css
/public
└── changelog.md
/README.md
```

### `/src/App.tsx`

זהו הקובץ המרכזי של האפליקציה. הוא מכיל את הלוגיקה הראשית, ניהול המצב (State), ורינדור כל הרכיבים.

**חלקים עיקריים בקובץ:**

1.  **Interfaces (ממשקים):**
    *   `Message`: מגדיר את מבנה ההודעה בצ'אט (id, role, text, sageId, וכו').
    *   `ChatSession`: מגדיר את מבנה סשן שיחה בהיסטוריה.

2.  **State Management (ניהול מצב):**
    *   `useState` משמש לניהול כל המצבים של האפליקציה: `isDarkMode`, `isSidebarOpen`, `messages`, `sessions`, `activeSages`, `isLoading` ועוד.

3.  **Core Functions (פונקציות ליבה):**
    *   `handleSend`: הפונקציה המרכזית שמטפלת בשליחת הודעה. היא בונה את הפרומפט (Prompt) המתאים ל-Gemini בהתבסס על מצב האפליקציה (צ'אט רגיל או "חברותא"), שולחת את הבקשה ל-API, ומטפלת בתשובה המתקבלת ב-Streaming.
    *   `saveSession` / `loadSession`: פונקציות לניהול שמירה וטעינה של שיחות מה-LocalStorage.
    *   `startNewChat`: מאתחל שיחה חדשה.

4.  **Component Rendering (רינדור רכיבים):**
    *   הקובץ מרנדר את כל חלקי הממשק: סרגל צד, חלון צ'אט ראשי, אזור קלט, ומודלים (חלונות קופצים) שונים.

### `/src/characters/`

תיקייה זו היא הלב של תוכן האפליקציה ומכילה את כל המידע על הדמויות.

*   **`/src/characters/types.ts`**: מגדיר את ה-Interface של `Character`.
    ```typescript
    export interface Character {
      id: string;
      name: string;
      description: string;
      icon: string;
      systemInstruction: string;
      greeting: string;
      era?: string;
    }
    ```

*   **קבצי דמויות (למשל, `/src/characters/david.ts`):** כל קובץ מייצא אובייקט `Character` עם ההגדרות הייחודיות של אותה דמות.
    ```typescript
    import { Character } from './types';

    export const david: Character = {
      id: 'david',
      name: 'דוד המלך',
      description: 'נעים זמירות ישראל, מלכות ותשובה',
      icon: '👑',
      systemInstruction: 'אתה דוד המלך. ענה מתוך שירה, רגש עמוק...',
      greeting: 'מזמור לדוד! אשמח לנגן על מיתרי ליבך...',
      era: 'נביאים ומנהיגים'
    };
    ```

*   **`/src/characters/index.ts`**: קובץ זה מייבא את כל הדמויות הבודדות ומייצא אותן במערך אחד (`characters`) לשימוש קל ומרכזי בקומפוננטת `App`.

### `/src/components/`

תיקייה זו מכילה רכיבי React משותפים הניתנים לשימוש חוזר.

*   **`TermsOfUse.tsx` ו-`PrivacyPolicy.tsx`**: רכיבים פשוטים המציגים את תנאי השימוש ומדיניות הפרטיות בחלון מודאלי.

## 🚀 היסטוריית גרסאות

*   **v0.9.0:** "סידור קול הרבים" - הוספת עמוד נפרד לסידור "קול הרבים - תפילת האחדות", וניהול משתמשים מתקדם.
*   **v0.8.9:** אימות משתמשים (Firebase Auth) ושיפור איכות הקול (TTS).
*   **v0.8.8:** לוח שנה עברי, פרשת השבוע ודף יומי.
*   **v0.8.7:** פיצ'ר "בית מדרש" (דיון של עד 4 דמויות בו-זמנית).
*   **v0.8.2:** חיפוש ומחיקה בהיסטוריית השיחות.
*   **v0.8.1:** שדרוג המודל להבאת מקורות מדויקים.
*   **v0.8.0:** פיצ'ר "חברותא" (דיאלוג בין שתי דמויות).
*   **v0.7.x:** הוספת דמויות חדשות רבות.
*   **v0.7.0:** הוספת Streaming, יצירת תמונות וייצוא מתקדם.
*   **v0.6.0:** הוספת תמיכה קולית (VTT/TTS) ושיתוף/הורדת שיחות.
*   **v0.5.0:** הוספת היסטוריית שיחות, יצירת דמויות אישיות ומצב כהה.
*   **v0.4.2:** שדרוג הסידור לחלון מודל במסך מלא.
*   **v0.4.1:** עדכון תפילות ללשון רבים והוספת הסברים.
*   **v0.4.0:** חיבור ראשוני ל-Gemini API והרחבת מאגר הדמויות.
*   **v0.3.0:** עיצוב מחדש של הממשק ותמיכה מלאה בעברית.

## 🏁 תחילת עבודה (הוראות למפתחים)

1.  **שכפל את המאגר (Repository):**
    ```bash
    git clone https://github.com/AnLoMinus/IsraelGPT
    cd IsraelGPT
    ```

2.  **התקן תלויות:**
    ```bash
    npm install
    ```

3.  **הגדר מפתח API:**
    *   צור קובץ `.env` בתיקיית השורש.
    *   הוסף את מפתח ה-API של Gemini לקובץ:
        ```
        GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```

4.  **הפעל את שרת הפיתוח:**
    ```bash
    npm run dev
    ```

## 🤝 תרומה ופיתוח עתידי

הפרויקט נמצא בפיתוח מתמיד. רעיונות, הצעות ודיווחים על באגים יתקבלו בברכה. ניתן לפתוח Issue או Pull Request במאגר ה-GitHub של הפרויקט.

---

<p align="center">
  תודה על השימוש ב-IsraelGPT!
</p>
