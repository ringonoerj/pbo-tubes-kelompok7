# PANDUAN PENGGUNAAN APACHE NETBEANS UNTUK SMARTCASHIER

Panduan ini menjelaskan langkah demi langkah untuk mengimpor, mengonfigurasi, menjalankan, dan melakukan debugging proyek **SMARTCASHIER** menggunakan **Apache NetBeans IDE** (versi 12 ke atas).

---

## 🛠️ PREREQUISITES DI NETBEANS
Sebelum memulai, pastikan NetBeans Anda telah mendukung Java Development Kit (JDK) 17:
1. Buka NetBeans.
2. Masuk ke menu **Tools** -> **Java Platforms**.
3. Pastikan **JDK 17** terdaftar sebagai salah satu platform aktif. Jika belum ada, klik **Add Platform...**, pilih **Java Standard Edition**, lalu arahkan ke folder instalasi JDK 17 Anda.

---

## 📂 LANGKAH 1: MENGIMPOR BACKEND KE NETBEANS (MAVEN)
Karena backend SMARTCASHIER menggunakan **Maven** (`pom.xml`), NetBeans dapat membukanya secara langsung tanpa konfigurasi tambahan:
1. Buka Apache NetBeans.
2. Klik **File** -> **Open Project...** (atau shortcut `Ctrl + Shift + O`).
3. Navigasikan ke folder proyek: `c:\PROJECT\pbo-tubes-kelompok7\backend`.
4. NetBeans akan mendeteksi `pom.xml` dan menampilkan ikon proyek Maven (ikon berbentuk kubus dengan huruf 'M').
5. Pilih folder `backend`, lalu klik **Open Project**.

---

## ⚙️ LANGKAH 2: MERESOLUSI DEPENDENSI (MANDATORY)
Saat pertama kali dibuka, NetBeans akan melakukan indexing dan mengunduh library Spring Boot yang didefinisikan di `pom.xml`.
* Jika ada tanda seru merah pada ikon proyek, klik kanan pada nama proyek (`smartcashier`), pilih **Resolve Project Problems...**, lalu ikuti instruksi untuk mengunduh dependensi yang hilang.
* Atau, klik kanan pada proyek dan pilih **Clean and Build**. NetBeans akan menjalankan perintah Maven (`mvn clean install`) untuk mengunduh semua file `.jar` yang diperlukan ke repositori lokal.

---

## 🗄️ LANGKAH 3: MENGATUR KONEKSI DATABASE
Untuk menyesuaikan password database Anda:
1. Di panel **Projects** sebelah kiri, ekspansi proyek `smartcashier`.
2. Buka folder **Other Sources** -> **src/main/resources** -> **application.properties**.
3. Edit baris berikut sesuai dengan kredensial PostgreSQL lokal Anda:
   ```properties
   spring.datasource.password=PASSWORD_POSTGRES_ANDA
   ```
4. Simpan file (`Ctrl + S`).

---

## 🚀 LANGKAH 4: MENJALANKAN BACKEND DARI NETBEANS
Ada dua cara untuk menjalankan backend Spring Boot di NetBeans:

### Cara A: Menjalankan Main Class Langsung
1. Klik kanan pada proyek `smartcashier` -> **Run**.
2. Jika NetBeans meminta Anda memilih *Main Class*, pilih:
   `com.smartcashier.SmartcashierApplication`
3. Log output startup Spring Boot akan muncul di tab **Output** di bagian bawah NetBeans.

### Cara B: Menggunakan Maven Goals (Direkomendasikan)
1. Klik kanan pada proyek `smartcashier` -> **Run Maven** -> **Goals...**.
2. Pada kolom **Goals**, ketik:
   ```text
   spring-boot:run
   ```
3. Klik **OK**. NetBeans akan menjalankan aplikasi menggunakan plugin Spring Boot Maven.

---

## 🐞 LANGKAH 5: MELAKUKAN DEBUGGING DI NETBEANS
Debugging sangat berguna untuk meletakkan *break point* pada baris kode Java guna melacak jalannya variabel:
1. Buka file Java yang ingin didebug (misal: `AuthController.java` atau `TransactionService.java`).
2. Klik pada nomor baris di sebelah kiri untuk membuat titik merah (*break point*).
3. Klik kanan pada proyek `smartcashier` -> **Debug**.
4. Jika menggunakan custom goal, pilih **Debug Maven** -> **Debug Goals...** dan ketik `spring-boot:run`.
5. Aplikasi akan berjalan dalam mode debug. Ketika alur program menyentuh *break point* yang Anda buat, eksekusi akan terjeda dan Anda bisa memantau isi variabel di panel **Variables** NetBeans.

---

## 🎨 LANGKAH 6: BAGAIMANA DENGAN FRONTEND (REACT)?
Secara bawaan, Apache NetBeans adalah IDE Java dan tidak menjalankan server Node.js secara otomatis saat Anda menekan tombol "Run" pada backend. 
Untuk menjalankan frontend React bersisian dengan NetBeans:

1. Anda dapat membuka Terminal bawaan di Windows (PowerShell/CMD).
2. Arahkan ke folder frontend:
   ```powershell
   cd c:\PROJECT\pbo-tubes-kelompok7\frontend
   ```
3. Jalankan perintah:
   ```bash
   npm run dev
   ```
4. Frontend Anda akan berjalan di `http://localhost:5173/` dan otomatis meneruskan request API ke backend NetBeans di port `8080`.
5. Jika Anda ingin mengedit kode React di NetBeans, Anda bisa membuka folder `frontend` via **File** -> **Open Project** (NetBeans akan mendeteksinya sebagai HTML5/JavaScript Project jika plugin terkait aktif) atau mengeditnya menggunakan VS Code secara paralel.
