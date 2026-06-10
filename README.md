# SMARTCASHIER - PROTOTIPE APLIKASI KASIR

Aplikasi Kasir Modern berbasis Web dengan Backend Spring Boot (Java) dan Frontend React.js. Dibuat untuk memenuhi Tugas Besar Pemrograman Berorientasi Objek - Kelompok 7.

---

## 🛠️ Persiapan Awal (Prerequisites)

Pastikan komponen berikut terinstal pada komputer Anda:

| Komponen | Versi Minimal | Keterangan |
|----------|---------------|-------------|
| **Java JDK** | 17 | Untuk menjalankan Spring Boot backend |
| **PostgreSQL** | 14 | Database utama untuk menyimpan data transaksi & inventory |
| **Node.js** | 18.x | Runtime untuk menjalankan React frontend |
| **NPM** | 9.x | Package manager untuk menginstal library frontend |
| **IDE Java** | NetBeans 12+, IntelliJ, atau VS Code | Untuk membuka & memodifikasi kode backend |

---

## 🗄️ Langkah Konfigurasi Database (PostgreSQL)

1. **Buat Database Baru:**
   Buka terminal PostgreSQL (pgAdmin atau psql CLI) dan jalankan perintah:
   ```sql
   CREATE DATABASE smartcashier_db;
   ```

2. **Eksekusi Script Skema & Seeding Data:**
   Gunakan script SQL yang tersedia di file [schema.sql](file:///c:/PROJECT/pbo-tubes-kelompok7/schema.sql) untuk membuat tabel dan mengisi data awal. Jalankan perintah sql tersebut di database `smartcashier_db`.

---

## ⚙️ Langkah Konfigurasi Koneksi Database di Backend

1. Buka file konfigurasi backend di:
   [application.properties](file:///c:/PROJECT/pbo-tubes-kelompok7/backend/src/main/resources/application.properties)
2. Sesuaikan kredensial username dan password PostgreSQL Anda pada baris berikut:
   ```properties
   spring.datasource.username=postgres
   spring.datasource.password=ISI_PASSWORD_DATABASE_ANDA_DISINI
   ```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Backend (Spring Boot)
Anda dapat menjalankan backend menggunakan IDE Anda (seperti NetBeans dengan mengimpor folder `backend` sebagai Maven Project), atau melalui terminal command line.

**Melalui Command Line (di dalam folder `backend`):**
Jika Anda memiliki Maven terinstal pada System PATH:
```bash
cd backend
mvn spring-boot:run
```
Atau jika menggunakan Maven wrapper, jalankan script wrapper:
```bash
cd backend
.\mvnw spring-boot:run
```

*Backend akan berjalan di port `8080` (`http://localhost:8080`).*

### 2. Menjalankan Frontend (React.js + Vite)
Buka terminal baru di direktori root project, lalu jalankan perintah berikut:
```bash
cd frontend
npm install
npm run dev
```

*Frontend akan berjalan di port `5173` (`http://localhost:5173`).*

---

## 🔑 Akun Demo Pengujian (Testing Credentials)

Gunakan akun berikut untuk melakukan login karyawan pada halaman awal aplikasi:

* **Akun 1:**
  * ID Karyawan: `EMP001`
  * Password: `rahasia123`
* **Akun 2:**
  * ID Karyawan: `EMP002`
  * Password: `rahasia123`

---

## 💡 Anggota Kelompok 7:
1. **Farel Gusviransyah**
2. **Lutfi Nasrullah Aziz**
3. **Muhammad Alfin Ramadhan**
4. **Muhammad Fadli Al Hafizh Wibiksana**
5. **Ringo Noer Junaedy**
