# To-Do List Web App

> A minimalistic and modular task manager built for productivity enthusiasts, students, and professionals.  
> Built with Vanilla JavaScript, HTML5, and CSS3 — no frameworks, just raw skill.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screens & Navigation](#-screens--navigation)
- [Data Models](#-data-models)
- [How to Run](#-how-to-run)
- [Known Limitations & Future Enhancements](#-known-limitations--future-enhancements)
- [License](#-license)

---

## 🔍 Overview

The **Smart To-Do List Web App** is a browser-based productivity tool that helps users manage daily tasks, set priorities, track durations, and visualize weekly progress — all without using third-party libraries or frameworks.

---

## ✨ Features

### ✅ Authentication
- Local Signup/Login
- Duplicate user checks and form validation
- Data stored in `localStorage`

### 📌 Task Management
- Add, Edit, Delete tasks with priority and duration
- Toggle completion with clear visual feedback (e.g., strikethrough)
- Emoji-based priority tagging 🔥 🙂 😴

### 🗂️ Task Organization
- Filter tasks by priority, status, or search keyword
- Assign durations (15 mins to 3 hours)

### 📅 Weekly Navigation
- Navigate between current, previous, and next weeks
- Highlight today’s date

### 🧩 Component Architecture
- Modular JavaScript files for separation of concerns
- Planned: Use of `CustomEvent` for inter-component communication

---

## 🧰 Tech Stack

| Layer        | Tech                     |
| ------------| ------------------------ |
| **Frontend** | HTML5, CSS3, JavaScript  |
| **Storage**  | Browser LocalStorage     |
| **Libraries**| None (fully custom-built)|

---

## 🏗️ Architecture

```plaintext
📦 Project Root
├── index.html           → Task dashboard
├── login.html           → Auth screen
├── tasklist.html        → Filtered task view
├── css/
│   └── styles.css       → Core styling
├── js/
│   ├── app.js               → Core logic
│   ├── tasklist.js          → Filtering & rendering
│   ├── login.js             → Signup/Login handlers
│   ├── activityService.js   → Storage utils
│   └── activityList.js      → Task list rendering

Screens & Navigation
👤 New User Journey
Lands on login.html

Signs up → redirected to index.html

Adds tasks → sees live updates

🔁 Returning User
Logs in

Manages tasks and filters them

Navigates through week views

📊 Data Models
👤 User
js
Copy
Edit
{
  id: Number,
  name: String,
  email: String,
  password: String
}
📌 Task
js
Copy
Edit
{
  id: Number,
  text: String,
  priority: "Low" | "Medium" | "High",
  date: "YYYY-MM-DD",
  duration: String, // in minutes
  completed: Boolean
}




## License

This project is open-source and available under the MIT License.
