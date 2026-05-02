# 📝 Advanced Task Manager

A clean, responsive, and feature-rich **frontend task management app** built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

![Advanced Task Manager](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

- ✅ **Add Tasks** — With title, category, deadline, priority, and optional description
- 🗂️ **Categorize** — Work, Personal, or Errands
- 🔥 **Priority Levels** — High, Medium, Low with color-coded badges
- 📅 **Deadline Tracking** — Overdue tasks are automatically flagged
- ✔️ **Complete / Undo** — Toggle task completion status at any time
- 🗑️ **Delete Tasks** — Remove tasks with a single click
- 🖱️ **Drag & Drop Reordering** — Reorder open tasks intuitively
- 📊 **Live Summary Panel** — Instant count of Open, Completed, and Overdue tasks
- 🌙 **Dark / Light Mode** — One-click theme toggle with system preference detection
- 💾 **Persistent Storage** — Tasks and theme saved to `localStorage` (survives page refresh)
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

---

## 🚀 Getting Started

No build tools or installation needed. Just open the file in a browser!

### Option 1 — Open Directly

```bash
# Clone the repository
git clone https://github.com/devsp0007/Simple-Task_Manager-FrontEnd-.git

# Navigate into the folder
cd Simple-Task_Manager-FrontEnd-

# Open in your browser
start to-do.html       # Windows
open to-do.html        # macOS
xdg-open to-do.html    # Linux
```

### Option 2 — Live Server (VS Code)

1. Install the **Live Server** extension in VS Code
2. Right-click `to-do.html` → **"Open with Live Server"**
3. App opens at `http://127.0.0.1:5500/to-do.html`

---

## 📁 Project Structure

```
Simple-Task_Manager-FrontEnd-/
│
├── to-do.html      # Main HTML — app layout & structure
├── sttyle.css      # Stylesheet — design system, dark mode, responsive layout
├── to-do.js        # JavaScript — all app logic, drag & drop, localStorage
└── README.md       # You are here
```

---

## 🎨 Design Highlights

| Feature | Detail |
|---|---|
| **Typography** | Inter / System UI font stack |
| **Color Palette** | Cool blues & slates, fully themed for dark mode |
| **Layout** | CSS Grid — two-column panel + board layout |
| **Components** | Rounded cards, pill badges, smooth button hovers |
| **Animations** | CSS transitions on hover, drag ghost, button lift effect |
| **Themes** | Light & Dark mode, auto-detected from OS preference |
| **Main** | Full working to-do web app with all important features|
---

## 🛠️ How It Works

### Task Lifecycle

```
[Form Submission]
      │
      ▼
  addTask() ── validates ──▶ tasks[] ── saveTasks() ──▶ localStorage
                                 │
                                 ▼
                           renderTasks()
                          /             \
                   openList          completedList
```

### Key Functions

| Function | Role |
|---|---|
| `init()` | Bootstraps the app on load |
| `addTask()` | Validates & stores a new task |
| `toggleComplete()` | Flips task completed state |
| `deleteTask()` | Removes task from array |
| `renderTasks()` | Re-renders both task lists & counters |
| `handleDragStart/End/Over/Drop` | Drag-and-drop reorder logic |
| `applyTheme()` / `toggleTheme()` | Dark/light mode management |
| `isOverdue()` | Checks if an open task is past deadline |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request



<div align="center">
  Made with ❤️ by <a href="https://github.com/devsp0007">devsp0007</a>
</div>
