# 📰 Sharing Vision — Article Management Dashboard

Website manajemen artikel (CRUD) yang dibangun sebagai frontend test untuk **Sharing Vision**. Aplikasi ini menyediakan dashboard untuk mengelola artikel (Create, Read, Update, Delete) beserta halaman preview blog untuk melihat tampilan artikel yang sudah dipublikasikan.

---

## ✨ Fitur Utama

- **All Posts** — Menampilkan daftar semua artikel dengan tab filter berdasarkan status (`Publish`, `Draft`, `Thrash`), dilengkapi pagination.
- **Add New Post** — Form untuk membuat artikel baru dengan validasi input (title, content, category, status).
- **Edit Post** — Mengedit artikel yang sudah ada.
- **Delete Post** — Menghapus artikel dengan konfirmasi dialog.
- **Preview Blog** — Halaman preview blog yang menampilkan artikel dengan status `Publish` dalam tampilan card/blog-style.
- **Toast Notifications** — Feedback visual menggunakan Sonner untuk setiap aksi CRUD.

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
| --- | --- |
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM v7 |
| **State Management** | Redux Toolkit + RTK Query |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Icons** | Lucide React |
| **Font** | Inter (via @fontsource-variable) |
| **Notifications** | Sonner |

---

## 📁 Struktur Folder

```
src/
├── app/                    # Konfigurasi Redux store
│   ├── hooks.ts            # Typed hooks (useAppDispatch, useAppSelector)
│   ├── rootReducer.ts      # Root reducer (combineReducers)
│   └── store.ts            # Store configuration
├── assets/                 # Aset statis (gambar, dsb.)
├── components/
│   ├── common/             # Komponen umum (Header, EmptyState, LoadingSpinner)
│   └── ui/                 # Komponen UI dari shadcn/ui (Button, Card, Table, dll.)
├── features/
│   └── articles/
│       ├── api/            # RTK Query API definition (articleApi.ts)
│       ├── slices/         # Redux slices (articleSlice, articleFormSlice)
│       ├── types/          # TypeScript types & interfaces
│       └── utils/          # Utility functions khusus articles
├── lib/                    # Utility umum (cn helper dari shadcn)
├── pages/                  # Halaman-halaman utama
│   ├── AllPostsPage.tsx
│   ├── AddNewPostPage.tsx
│   ├── EditPostPage.tsx
│   └── PreviewBlogPage.tsx
├── routes/                 # Konfigurasi routing
│   └── AppRoutes.tsx
├── App.tsx                 # Root component
├── main.tsx                # Entry point (ReactDOM + Redux Provider)
└── index.css               # Global styles & Tailwind directives
```

---

## 🚀 Cara Setup & Menjalankan

### Prasyarat

- **Node.js** ≥ 18
- **npm** (bawaan Node.js) atau **yarn** / **pnpm**
- **Backend API** sudah berjalan (default: `http://localhost:8080`)

### 1. Clone Repository

```bash
git clone https://github.com/teukufaandii/frontend-sharing-vision-test.git
cd frontend-sharing-vision-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env` lalu sesuaikan URL backend API:

```bash
cp .env.example .env
```

Isi file `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

> **Catatan:** Ganti URL di atas sesuai dengan alamat backend API yang kamu gunakan.

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (default Vite).

### 5. Build untuk Production

```bash
npm run build
```

Hasil build akan tersimpan di folder `dist/`.

### 6. Preview Production Build

```bash
npm run preview
```

---

## 📜 Daftar Script

| Script | Perintah | Keterangan |
| --- | --- | --- |
| **dev** | `npm run dev` | Menjalankan development server dengan HMR |
| **build** | `npm run build` | Build TypeScript & bundle untuk production |
| **lint** | `npm run lint` | Menjalankan ESLint untuk pengecekan kode |
| **preview** | `npm run preview` | Preview hasil build production secara lokal |

---

## 🔗 API Endpoints yang Digunakan

Aplikasi ini berkomunikasi dengan backend REST API melalui RTK Query. Berikut endpoint yang digunakan:

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/article/:limit/:offset` | Mengambil daftar artikel dengan pagination |
| `GET` | `/article/:id` | Mengambil detail artikel berdasarkan ID |
| `POST` | `/article/` | Membuat artikel baru |
| `PUT` | `/article/:id` | Mengupdate artikel berdasarkan ID |
| `DELETE` | `/article/:id` | Menghapus artikel berdasarkan ID |

---

## 🗺️ Routing

| Path | Halaman | Keterangan |
| --- | --- | --- |
| `/` | — | Redirect ke `/posts` |
| `/posts` | All Posts | Dashboard daftar artikel |
| `/posts/new` | Add New Post | Form tambah artikel baru |
| `/posts/edit/:id` | Edit Post | Form edit artikel |
| `/preview` | Preview Blog | Preview tampilan blog publik |

---

## 📝 Catatan Tambahan

- Pastikan backend API sudah berjalan sebelum menggunakan aplikasi ini agar data artikel dapat dimuat dengan benar.
- Aplikasi menggunakan **path alias** `@/` yang di-resolve ke folder `src/` melalui konfigurasi Vite.
- Komponen UI menggunakan **shadcn/ui** dengan style `base-rhea` dan tema warna `neutral`.
