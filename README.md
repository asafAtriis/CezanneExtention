# Cezanne HR Time Auto-Filler

תוסף דפדפן למילוי אוטומטי של שעות עבודה במערכת Cezanne HR.

## תיאור

התוסף מאפשר מילוי אוטומטי של דיווחי שעות במערכת Cezanne HR. במקום למלא ידנית כל יום, התוסף עובר על טווח התאריכים שנבחר וממלא את השעות באופן אוטומטי.

### יכולות

- בחירת טווח תאריכים (מתאריך עד תאריך)
- הגדרת שעת התחלה וסיום יומית
- הגדרת משך הפסקה בדקות
- דילוג אוטומטי על סופי שבוע
- שמירת הגדרות אחרונות
- טיפול בשגיאות ועצירה אוטומטית לאחר 3 כשלונות

## מבנה הפרויקט

```
CezanneExtention/
├── manifest.json          # הגדרות התוסף (Manifest V3)
├── README.md              # קובץ זה
├── CHANGELOG.md           # יומן שינויים
├── popup/
│   ├── popup.html         # ממשק המשתמש
│   ├── popup.css          # עיצוב
│   └── popup.js           # לוגיקת הטופס ותקשורת
├── content/
│   └── content.js         # מנוע האוטומציה (DOM manipulation)
└── icons/                 # אייקונים (אופציונלי)
```

## התקנה לפיתוח (Development)

### דרישות מקדימות

- דפדפן Chrome (גרסה 88 ומעלה) או Edge
- גישה למערכת Cezanne HR

### שלבי התקנה

1. **פתיחת מנהל התוספים**
   ```
   Chrome: chrome://extensions
   Edge: edge://extensions
   ```

2. **הפעלת מצב מפתח**
   - סמן את "Developer mode" / "מצב מפתח" בפינה הימנית העליונה

3. **טעינת התוסף**
   - לחץ על "Load unpacked" / "טען ללא אריזה"
   - בחר את תיקיית הפרויקט: `C:\Projects\CezanneExtention`

4. **אימות הטעינה**
   - התוסף אמור להופיע ברשימה עם השם "Cezanne HR Time Auto-Filler"
   - אייקון התוסף יופיע בסרגל הכלים

### עדכון שינויים בזמן פיתוח

לאחר שינוי קוד:

1. חזור ל-`chrome://extensions`
2. לחץ על כפתור הרענון (חץ מעגלי) בכרטיס התוסף
3. רענן את דף Cezanne HR אם פתוח

### צפייה בלוגים

1. פתח את דף Cezanne HR
2. לחץ `F12` לפתיחת Developer Tools
3. עבור ללשונית "Console"
4. סנן לפי `[CezanneAutoFill]` לראות את הודעות התוסף

## שימוש

1. **ניווט לדף הנוכחות**
   - היכנס למערכת Cezanne HR
   - נווט לדף דיווח השעות / Timesheet

2. **פתיחת התוסף**
   - לחץ על אייקון התוסף בסרגל הכלים

3. **הגדרת הפרמטרים**
   - **Start Date**: תאריך התחלה
   - **End Date**: תאריך סיום
   - **Daily Start Time**: שעת כניסה (ברירת מחדל: 09:00)
   - **Daily End Time**: שעת יציאה (ברירת מחדל: 17:00)
   - **Break Duration**: משך הפסקה בדקות (ברירת מחדל: 60)
   - **Skip Weekends**: דלג על שישי-שבת (מסומן כברירת מחדל)

4. **הפעלה**
   - לחץ על "Start Auto-Fill"
   - המתן לסיום התהליך

## התקנה לייצור (Production)

### יצירת קובץ ZIP לפרסום

1. **הכנת הקבצים**
   ```bash
   # ודא שאין קבצים מיותרים
   # מחק קבצי .git, node_modules וכו' אם קיימים
   ```

2. **הוספת אייקונים** (מומלץ)
   - צור אייקונים בגדלים: 16x16, 48x48, 128x128 פיקסלים
   - שמור בתיקיית `icons/` בשמות: `icon16.png`, `icon48.png`, `icon128.png`
   - עדכן את `manifest.json`:
   ```json
   "action": {
     "default_popup": "popup/popup.html",
     "default_icon": {
       "16": "icons/icon16.png",
       "48": "icons/icon48.png",
       "128": "icons/icon128.png"
     }
   },
   "icons": {
     "16": "icons/icon16.png",
     "48": "icons/icon48.png",
     "128": "icons/icon128.png"
   }
   ```

3. **יצירת ZIP**
   ```bash
   # Windows PowerShell
   Compress-Archive -Path * -DestinationPath ../cezanne-autofill.zip
   ```

### פרסום ב-Chrome Web Store

1. היכנס ל-[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. שלם את דמי הרישום החד-פעמיים ($5)
3. לחץ "New Item" והעלה את קובץ ה-ZIP
4. מלא את פרטי התוסף (תיאור, צילומי מסך, קטגוריה)
5. שלח לבדיקה

### התקנה פרטית (Enterprise)

להפצה פנים-ארגונית ללא Chrome Web Store:

1. **אריזת התוסף**
   - ב-`chrome://extensions` לחץ "Pack extension"
   - בחר את תיקיית הפרויקט
   - יווצרו קבצים: `.crx` (התוסף) ו-`.pem` (מפתח פרטי)

2. **התקנה באמצעות Group Policy**
   - העלה את קובץ ה-CRX לשרת פנימי
   - הגדר את כתובת ההורדה ב-Group Policy

## התאמה ל-DOM של Cezanne

אם התוסף לא מזהה נכון את האלמנטים בדף, יש לעדכן את הסלקטורים בקובץ `content/content.js`:

```javascript
const SELECTORS = {
  // עדכן את הסלקטורים בהתאם למבנה הדף
  calendarGrid: '.calendar-grid, .timesheet-grid',
  dayCell: '[data-date], .day-cell',
  addButton: '.add-entry, .add-time',
  modal: '.modal, .dialog, [role="dialog"]',
  startTimeInput: 'input[name*="start"]',
  endTimeInput: 'input[name*="end"]',
  breakInput: 'input[name*="break"]',
  saveButton: 'button[type="submit"], .btn-save',
  // ...
};
```

### כיצד למצוא את הסלקטורים הנכונים

1. פתח את דף Cezanne HR
2. לחץ `F12` → לשונית "Elements"
3. השתמש בכלי הבחירה (חץ בפינה השמאלית) ולחץ על האלמנט הרצוי
4. העתק את ה-class או ה-id של האלמנט
5. עדכן את `SELECTORS` בהתאם

## פתרון בעיות

| בעיה | פתרון |
|------|-------|
| התוסף לא נטען | ודא שכל הקבצים קיימים ושאין שגיאות ב-manifest.json |
| "Please navigate to Cezanne HR first" | נווט לדף cezannehr.com או cezanneondemand.com |
| "Failed to communicate with page" | רענן את הדף ונסה שוב |
| "Could not find cell for [date]" | עדכן את SELECTORS.dayCell |
| "Modal did not appear" | עדכן את SELECTORS.modal |
| "Could not find save button" | עדכן את SELECTORS.saveButton |

## רישיון

פרויקט פנימי - לשימוש אישי בלבד.

## תמיכה

לדיווח על באגים או בקשות לשיפור, פנה למפתח.
