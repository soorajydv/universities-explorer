# 🎓 UniExplorer — MERN University Explorer

A full-stack MERN application that scrapes all university data from `studies-overseas.com`, stores it in MongoDB with proper structure, and provides a polished UI with advanced filtering, search, sorting, and pagination.

---

## 🗂 Project Structure

```
uni-explorer/
├── backend/
│   ├── models/
│   │   └── University.js      # Mongoose schema
│   ├── scraper.js             # Bulk data scraper
│   ├── server.js              # Express API server
│   ├── .env                   # Config (MONGO_URI, PORT)
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── UniversityCard.js    # Card component
│   │   │   ├── FilterSidebar.js     # Left filter panel
│   │   │   └── UniversityModal.js   # Detail modal
│   │   ├── hooks/
│   │   │   └── useApi.js            # API hooks
│   │   ├── pages/
│   │   │   └── UniversitiesPage.js  # Main page
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── package.json               # Root scripts
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (or provide a cloud URI)

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment
Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/uni_explorer
PORT=5000
```

### 4. Scrape all data
```bash
npm run scrape
```
This fetches ALL universities from `cms.studies-overseas.com` in batches of 25, transforms the data, and upserts into MongoDB. Run it once (or periodically to refresh).

### 5. Start the app
```bash
npm run dev
```
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

---

## 🔌 API Reference

### `GET /api/universities`

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 12, max: 100) |
| `search` | string | Full-text search across name, location, country |
| `country` | string | Comma-separated country names e.g. `USA,UK,Canada` |
| `sortBy` | string | `priority` \| `name` \| `country` \| `created_at` \| `updated_at` |
| `sortOrder` | string | `asc` \| `desc` |
| `hasScholarship` | `true` | Filter to universities with scholarships |
| `intakeType` | string | `Fall` \| `Spring` \| `Winter` |
| `level` | string | `Masters` \| `Bachelors` \| `PhD` |
| `minAcceptance` | number | Minimum acceptance rate % |
| `maxAcceptance` | number | Maximum acceptance rate % |

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1, "limit": 12, "total": 350,
    "totalPages": 30, "hasNext": true, "hasPrev": false
  }
}
```

### `GET /api/universities/:slug`
Fetch a single university by slug.

### `GET /api/filters/meta`
Returns available filter options derived from actual DB data:
```json
{
  "countries": [{ "value": "USA", "label": "USA", "count": 120 }],
  "intakes": ["Fall Intake (August)", "Spring Intake (January)"],
  "levels": ["Masters", "Bachelors"]
}
```

### `GET /api/stats`
```json
{ "total": 350, "countries": 18 }
```

---

## 🎨 Frontend Features

- **Search**: Debounced full-text search with MongoDB text index
- **Country Filter**: Multi-select with counts, scrollable list
- **Degree Level Filter**: Masters / Bachelors / PhD
- **Intake Filter**: Fall / Spring / Winter
- **Acceptance Rate Range**: Min/max numeric inputs
- **Scholarship Filter**: Toggle to show only scholarship-offering universities
- **Sort**: 6 sort options
- **Grid Layout**: Toggle between 2/3/4 column grid
- **Pagination**: Smart page numbers with ellipsis
- **Per-page control**: 12 / 24 / 48
- **Detail Modal**: Full university info with rankings, courses, scholarships, placements
- **Skeleton loading** states
- **Active filter counter** with clear-all button

---

## 🔧 Why the original API fails for UK

The source API uses exact string matching on the `country` field. UK universities are stored with country values like `"United Kingdom"` or `"UK"` inconsistently. The scraper fetches **all** records without any country filter, stores them in your own MongoDB, and you can then query with case-insensitive regex matching that handles any variant.

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express |
| Scraping | Axios with batch pagination |
| Frontend | React 18 |
| Styling | CSS-in-JS (inline styles) |
| Fonts | Syne + DM Sans |
