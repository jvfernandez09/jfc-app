# 🍗 JFC App — Full Stack Coding Challenge

A full-stack CRUD app built with **Next.js v15 (App Router)** and **PostgreSQL**, using **Server Components + Server Actions**, and styled with **Tailwind CSS v4**.

---

## ✨ Features

✅ Full CRUD for **Businesses** and **People**  
✅ Businesses can belong to **one or more Categories**  
✅ People may belong to **one Business** *(optional)*  
✅ Tags can be assigned to both **Businesses** and **People**  
✅ CRUD pages to manage **Tags** and **Categories**  
✅ Assign **Tasks** to both **People** and **Businesses**  
✅ View all **Assigned Tasks**  
✅ All users have access to all Businesses and People *(no role-based access control)*

---

## 🧰 Tech Stack

- 🎨 **Frontend:** Next.js v15 (App Router)
- ⚙️ **Backend:** Next.js Server Components + Server Actions
- 🗄️ **Database:** PostgreSQL (local) psql (PostgreSQL) v16.11
- 🔌 **DB Client:** `pg` (connection pool)
- 💅 **CSS:** Tailwind CSS v4

---

## ✅ Requirements

Make sure you have these installed:

- 🟢 Node.js (**Recommended: Node 20+**)
- 📦 npm
- 🐘 PostgreSQL (**Local installation**)

---

## 🐘 PostgreSQL Installation (Windows)

Download PostgreSQL Installer:

- Official PostgreSQL Windows download page:
  https://www.postgresql.org/download/windows/

Installer hosted by EDB (EnterpriseDB):
- https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

✅ During installation:
- keep default **port 5432**
- set a password for user **postgres**
- make sure **pgAdmin 4** is included

---

## 🚀 Setup Instructions

### 1) Install dependencies

```bash
npm install
```

---

### 2) Create PostgreSQL database locally

Create a database named:

```txt
jfc_db
```

You can create it via **pgAdmin**, or run:

```sql
CREATE DATABASE jfc_db;
```

---

### 3) Environment Variables (`.env.local`)

⚠️ For convenience in this coding challenge, `.env.local` is included in the repository so you can simply:

```bash
npm install
```

Then initialize the database using the command below.

---

### 4) Initialize database schema + seed data

This project uses a plain SQL setup (**no Prisma migrations**).

#### ✅ Windows (PowerShell) — Run `init.sql` using full psql path

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d jfc_db -f src/database/init.sql
```

When prompted, enter your **Postgres password**.

✅ This will create + seed all required tables and sample data.

---

### 5) Run the app

```bash
npm run dev
```

Then open:

👉 http://localhost:3000

---

## 📌 Database Notes

### Relationships

- A **Business** can have many **Categories**
  - `business_categories(business_id, category_id)`

- A **Business** can have many **Tags**
  - `business_tags(business_id, tag_id)`

- A **Person** can belong to one **Business**
  - `people.business_id` *(nullable)*

- A **Person** can have many **Tags**
  - `person_tags(person_id, tag_id)`

- A **Task** can be assigned to either:
  - one **Business**, OR
  - one **Person**

Enforced by:

- `task_assignments` with a `CHECK` constraint ensuring **only one target**
- unique indexes preventing duplicates per task target

---

## 🧠 Implementation Notes (What we did)

- Built the app using **Next.js App Router (v15)**.
- Used **Server Components** for list pages.
- Used **Server Actions** for create/update/delete forms.
- Implemented Business listing with `json_agg` so every business returns:
  - `categories: []`
  - `tags: []`
- Focused on keeping the codebase clean:
  - strict TypeScript types
  - consistent patterns across People and Business modules

---

## 🧾 Useful Commands

```bash
npm run dev
npm run build
npm run start
```

---

## 👨‍💻 Author

Built by **Jose Fernandez** ✅
