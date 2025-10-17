# NEXA TEST

---

# 🧩 Fullstack Task App

Proyek ini terdiri dari dua bagian utama:

-   **Backend**: `node-task` (menggunakan Node.js, NestJS, Prisma, PostgreSQL)
-   **Frontend**: `next-task` (menggunakan Next.js dan React)
-   **Stuktur Database**

          **Task Table:**

               **- id**

               **- title**

               **- description**

               **- deadline**

               **- status**

               **- created_by**

               **- user_id**

         **User:**

               **- id**

               **- name**

               **- username**

               **- password**

---

## ⚙️ Backend Setup (`node-task`)

### 1. Buat Database di PostgreSQL

Buat database baru di PostgreSQL, misalnya:

```sql
CREATE DATABASE task_db;
```

### 2. Buka Proyek Backend

Masuk ke folder proyek:

```bash
cd node-task
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Jalankan Migrasi Prisma

Migrasikan struktur database:

```bash
npx prisma migrate dev --name init
```

### 6. Jalankan Server Development

```bash
npm run start:dev
```

> Server default berjalan di: [http://localhost:8000](http://localhost:8000)

---

## 🌐 Frontend Setup (`next-task`)

### 1. Buka Proyek Frontend

Masuk ke folder proyek:

```bash
cd next-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup File `.env`

Buat file `.env.local` di root proyek Next.js dan tambahkan konfigurasi berikut:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

> Pastikan URL sesuai dengan alamat backend yang sedang berjalan.

### 4. Jalankan Development Server

```bash
npm run dev
```

> Frontend default berjalan di: [http://localhost:3000](http://localhost:3000) (atau port lain yang tersedia)

---

## Catatan

-   Pastikan PostgreSQL sedang berjalan.
    
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/task_db?schema=public"
    ```
