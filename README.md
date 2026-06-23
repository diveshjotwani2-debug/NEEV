# Neev 🚀
### Laid the foundation for your career.

**Neev** (meaning *Foundation* in Sanskrit/Hindi) is a comprehensive, free, data-backed career guidance platform tailored for post-12th Indian students, specifically targeting Tier-2 cities (such as Belgaum, Hubballi, Dharwad, and Mysuru) where professional guidance is traditionally sparse and expensive.

The application features a **super-premium, Apple-inspired dark interface** utilizing interactive **3D WebGL graphics**, trailing mix-blend cursors, and coordinate-tilted card layouts.

---

## 🌟 Key Features

1. **Interactive 3D Graphics (Three.js)**: 
   - A glowing WebGL particle constellation field floats in the background, rotating and drifting dynamically based on the student's cursor movements.
   - A central morphing geometric core acts as the visual anchor of the landing page.
2. **Apple-inspired Luxury UI/UX**:
   - Clean, border-glow layouts, glassmorphic panels, and standard typography weights using the *Outfit* and *Inter* font families.
   - Slim custom scrollbars styled with glowing indigo-to-violet linear gradients.
3. **Trailing Mix-Blend Cursor**:
   - A custom trailing circle cursor follows the pointer using linear interpolation (lerp), using `mix-blend-mode: difference` to invert colors when hovering over buttons, text, and active panels.
4. **3D Perspective Card Tilt (Parallax)**:
   - Hovering over career grids, specialization cells, and video cards tilts them up to 12 degrees along the X and Y axes depending on mouse coordinates inside the element.
5. **Self-Paced Task checklist Editor**:
   - Students can completely customize their learning tasks in-place: adding new goals, renaming descriptions, and deleting items. Progress percentages and active phase tags recalculate in real-time.
6. **Curated YouTube Learning Resources**:
   - Replaced generic advice with real, high-quality course links and lecture guides matching the active path (e.g., *Harvard's CS50*, *3Blue1Brown*, *sentdex*, *CA Rachana Ranade*, *Peak Frameworks*).
7. **Excel-based Database**:
   - Career descriptions, annual fee breakdowns, year-by-year syllabus parameters, and top recruiters are loaded dynamically from an Excel spreadsheet database (`data/careers.xlsx`).

---

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3 (variables, transitions, keyframes, 3D transform matrices), JavaScript (ES6 Single Page Application architecture), **Three.js** (WebGL particle scenes).
- **Backend**: Node.js, Express (REST API endpoints).
- **Database**:
  - *Career Engine*: Microsoft Excel (`.xlsx`) parsed via the `xlsx` NPM package.
  - *State Storage*: Lightweight local JSON stores (`users.json`, `enrollments.json`) managing accounts and checklist progress.
- **Security**: Password hashing using `bcryptjs` and session authentication tokens signed via `jsonwebtoken` (JWT).

---

## 🚀 Quick Start & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16.0.0 or higher is recommended).

### 1. Install Dependencies
Clone the repository, open a terminal in the folder, and run:
```bash
npm install
```
*(Windows Users: If PowerShell execution policies block scripting, run `npm.cmd install` instead).*

### 2. Seed the Excel Career Database
Generate the `careers.xlsx` database containing all Science, Commerce, and Arts paths:
```bash
npm run seed
```

### 3. Run the Development Server
Start the local server:
```bash
npm start
```
The server will boot up. Navigate to **[http://localhost:3000](http://localhost:3000)** in your web browser.

---

## 🧪 Running Integration Tests
Validate backend routers, user signup/login, Excel details retrieval, task checklist syncing, and video recommendation loads:
```bash
npm run test-api
```

---

## 📂 Project Structure

```text
├── data/
│   ├── careers.xlsx          # Excel Career database (Seeded)
│   ├── users.json            # Student accounts database (Created on signup)
│   └── enrollments.json      # Checklist progress database (Created on signup)
├── public/
│   ├── index.html            # Main SPA entry point
│   ├── styles.css            # Custom layout engine and animations
│   └── app.js                # Three.js animation setup and SPA router
├── routes/
│   ├── auth.js               # JWT login & registration endpoints
│   ├── careers.js            # Careers Excel extraction router
│   └── dashboard.js          # Student checklist and settings router
├── utils/
│   ├── authMiddleware.js     # JWT token checker
│   ├── excelDb.js            # XLSX file parser engine
│   └── jsonDb.js             # User JSON db actions
├── scripts/
│   ├── seedExcel.js          # Seed generation script
│   └── testApi.js            # Integration test suite
├── server.js                 # Express server root
└── package.json              # Project manifests
```
