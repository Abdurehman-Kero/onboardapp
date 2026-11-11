# LaunchBoard API Contract

Specification for the LaunchBoard REST API. All endpoints accept and return JSON.

- **Base URL:** `VITE_API_URL`
- **Content-Type:** `application/json`

---

## 1. Data Models

### Project Object
The public representation of a submitted project. **Note:** `student_email` is stored internally for bootcamp administration and is **NEVER** returned in any public response.

```json
{
  "id": 1,
  "title": "TenaConnect",
  "tagline": "Telemedicine triage platform connecting rural clinics to urban specialists",
  "description": "A lightweight web portal allowing rural health extension workers across Ethiopia to log patient vitals, upload diagnostic notes, and schedule asynchronous consultations with medical specialists in Addis Ababa.",
  "student_name": "Selamawit Tadesse",
  "cohort": "Cohort 1",
  "category": "Health",
  "tech_stack": ["React", "Node.js", "PostgreSQL", "WebRTC"],
  "github_url": "https://github.com/example/tenaconnect",
  "live_url": "https://tenaconnect.et",
  "status": "live",
  "likes": 42,
  "created_at": "2026-10-15T09:30:00.000Z"
}
```

---

## 2. Validation Rules

| Field | Type | Required | Rules & Constraints |
| :--- | :--- | :--- | :--- |
| `title` | string | Yes | 3 to 60 characters |
| `tagline` | string | Yes | 5 to 100 characters |
| `description` | string | Yes | Maximum 600 characters |
| `student_name`| string | Yes | 2 to 60 characters |
| `student_email` | string | No | Valid email format if provided. **Never published.** |
| `cohort` | string | No | Default: `'Cohort 1'` |
| `category` | string | Yes | One of: `Web App`, `E-commerce`, `Education`, `Health`, `Social`, `Productivity`, `Other` |
| `tech_stack` | string[] | Yes | Array of 1 to 8 tags; each tag maximum 24 characters |
| `github_url` | string | Yes | Must match format: `https://github.com/user/repo` |
| `live_url` | string | Conditional | Optional for `idea` or `building`. **Required** when status is `live`. Must begin with `https://` |
| `status` | string | Yes | One of: `idea`, `building`, `live`. Default: `building` |

---

## 3. Endpoints

### 3.1 Get Overview Statistics
Returns aggregate figures for the dashboard hero banner.

- **Method:** `GET`
- **Path:** `/stats`
- **Response `200 OK`:**
  ```json
  {
    "total": 8,
    "live": 4,
    "builders": 8
  }
  ```

---

### 3.2 List & Filter Projects
Returns an array of project objects matching query parameters.

- **Method:** `GET`
- **Path:** `/projects`
- **Query Parameters:**
  - `search` *(string, optional)*: Matches against `title`, `tagline`, `student_name`, and `tech_stack` (case-insensitive substring match).
  - `category` *(string, optional)*: Filters by exact category name (e.g. `Health`), or omitted / empty for all categories.
  - `status` *(string, optional)*: Filters by status (`idea`, `building`, `live`), or omitted / empty for all statuses.
  - `sort` *(string, optional)*: `newest` (default, sorted by `created_at DESC`) or `popular` (sorted by `likes DESC, created_at DESC`).
- **Response `200 OK`:**
  ```json
  [
    {
      "id": 1,
      "title": "TenaConnect",
      "tagline": "Telemedicine triage platform connecting rural clinics to urban specialists",
      "description": "A lightweight web portal allowing rural health extension workers across Ethiopia to log patient vitals...",
      "student_name": "Selamawit Tadesse",
      "cohort": "Cohort 1",
      "category": "Health",
      "tech_stack": ["React", "Node.js", "PostgreSQL", "WebRTC"],
      "github_url": "https://github.com/example/tenaconnect",
      "live_url": "https://tenaconnect.et",
      "status": "live",
      "likes": 42,
      "created_at": "2026-10-15T09:30:00.000Z"
    }
  ]
  ```

---

### 3.3 Get Single Project by ID
Retrieves details for a specific project.

- **Method:** `GET`
- **Path:** `/projects/:id`
- **Response `200 OK`:** Project object
- **Response `404 Not Found`:**
  ```json
  {
    "error": "Project not found"
  }
  ```

---

### 3.4 Submit a New Project
Submits a student project to the board.

- **Method:** `POST`
- **Path:** `/projects`
- **Request Body:**
  ```json
  {
    "title": "GebetaPlay",
    "tagline": "Multiplayer turn-based Mancala web game with ranked matchmaking",
    "description": "A digital reimagining of the ancient East African board game Gebeta, featuring real-time multiplayer matchmaking, spectator mode, and Amharic stickers.",
    "student_name": "Martha Assefa",
    "student_email": "martha.a@example.com",
    "cohort": "Cohort 1",
    "category": "Social",
    "tech_stack": ["React", "WebSockets", "Node.js", "Redis"],
    "github_url": "https://github.com/example/gebeta-play",
    "live_url": "https://gebetaplay.com",
    "status": "live"
  }
  ```
- **Response `201 Created`:** Created Project object (with `id`, `likes: 0`, and `created_at`).
- **Response `400 Bad Request`:**
  ```json
  {
    "error": "Validation failed",
    "fields": {
      "title": "Title must be between 3 and 60 characters",
      "live_url": "Live URL is required when status is 'live'"
    }
  }
  ```

---

### 3.5 Like a Project
Increments the like counter of a project by 1.

- **Method:** `PATCH`
- **Path:** `/projects/:id/like`
- **Request Body:** None
- **Response `200 OK`:** Updated Project object with incremented `likes`.
- **Response `404 Not Found`:**
  ```json
  {
    "error": "Project not found"
  }
  ```
