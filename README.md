# 📰 Chronicles — Contemporary Global Journalism Portal

**Chronicles** is a news portal built with vanilla modern JavaScript. It demonstrates core modern JavaScript principles including **ES6 syntax**, **API integration (fetching live data)**, and **Asynchronous JavaScript (Promises & Async/Await)**.

---

## 🎯 Core Technical Concepts Implemented

### 1. Modern ES6 Features
- **Arrow Functions (`() => {}`):** Used consistently for event listeners, data transformations, API calls, and utility formatters.
- **Object & Array Destructuring:**
  - Destructuring incoming HTTP responses: `const { title, description, url, imageUrl } = article;`
  - Array destructuring to separate top editorial stories: `const [leadStory, secondStory, ...streamArticles] = articles;`
- **Default Parameters & Template Literals:** Dynamic string interpolation for HTML generation, API URL building, and fallback parameters (`category = "all"`).
- **Spread & Rest Operators (`...`):** Merging article lists, creating non-mutating array copies for bookmarks, and rest parameters in filtering pipelines.
- **ES Modules (`import` / `export`):** Modular code architecture splitting concerns across `mockData.js`, `api.js`, `bookmarks.js`, and `app.js`.

### 2. API Integration (Fetching Data)
- **Live HTTP Requests:** Connects to live RSS-to-JSON endpoints converting global news wire feeds (Technology, World, Science, Business, Health, Arts, Sports) into JSON models in real-time.
- **Data Normalization:** Maps variable external payload formats into a uniform `Article` data model.
- **Resilient Fallback Data:** Curated editorial dataset ensuring the portal functions smoothly even when offline, rate-limited, or in environments with network restrictions.

### 3. Asynchronous JavaScript (Promises & Async/Await)
- **`async` / `await`:** Clean, non-blocking asynchronous execution flow when loading categories and searching topics.
- **Promise Pipelines:**
  - `Promise.race()` to enforce network request timeouts (4.5s) to guarantee high-speed responsiveness.
  - Custom `Promise` constructors for artificial delays and timeout management.
- **`AbortController`:** Automatically cancels stale, in-flight search requests when the user rapidly types in the search drawer.
- **Error Handling:** Robust `try / catch / finally` blocks with graceful error recovery and informative UI state banners.

---

## ✨ Features & Functionality

1. **Editorial Showcase (Hero Layout):** Displays a featured primary lead story with high-resolution imagery and a side column of companion dispatches.
2. **Category Navigation:** One-click filtering across *All Dispatches*, *Technology*, *World*, *Business*, *Science*, *Health*, *Arts & Culture*, and *Sports*.
3. **Real-Time Asynchronous Search:** Instant debounced search filtering across titles, summaries, and full articles with keyboard shortcut (`/` or `Ctrl+K`).
4. **Interactive Full-Article Reader Modal:** In-depth reading mode featuring complete article typography, original source links, and copyable article share links.
5. **Saved Reading List (Bookmarks):** Save articles to a personal reading list backed by browser `localStorage`.
6. **Dark & Light Mode:** Seamless toggle between a classic print-editorial ivory theme and a contemporary dark-slate mode.
7. **Breaking Flash Ticker:** Live ticker at the top of the portal updating dynamically with the latest headlines and current global date.

---

## 📂 Project Architecture

```
Chronicles/
│
├── index.html          # Semantic HTML layout, modals, search drawer, and ticker
├── README.md           # Documentation and educational reference
│
├── css/
│   └── style.css       # Journalistic typography (Newsreader + Plus Jakarta Sans), CSS Grid & Flexbox
│
└── js/
    ├── mockData.js     # Curated fallback editorial dataset
    ├── api.js          # API service layer (Fetch, AbortController, Promise.race)
    ├── bookmarks.js    # Persistent reading list manager (localStorage)
    └── app.js          # Main application coordinator, event listeners & rendering engine
```

---

## 🚀 How to Run Chronicles

No compilation, bundler, or build step required!

### Option 1: Open Directly in Browser
```powershell
Start-Process "C:\projects\Next-gen projects\Chronicles\index.html"
```

### Option 2: Run with Local HTTP Server (Python or Node)
Because the project uses standard **ES Modules** (`type="module"`), running with a local server ensures smooth cross-origin module loading:

```powershell
# Using Python
cd "C:\projects\Next-gen projects\Chronicles"
python -m http.server 8000
```
Then visit: `http://localhost:8000`

```powershell
# Using Node.js
cd "C:\projects\Next-gen projects\Chronicles"
npx serve .
```

