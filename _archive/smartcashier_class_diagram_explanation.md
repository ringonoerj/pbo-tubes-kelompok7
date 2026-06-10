# PENJELASAN CLASS DIAGRAM - SMARTCASHIER

Dokumen ini berisi penjelasan detail untuk setiap kelas yang ada di dalam Class Diagram SMARTCASHIER (Versi #1 - Domain Model) beserta kaitannya dengan konsep Pemrograman Berorientasi Objek (PBO).

---

## 📂 STRUKTUR KELAS & METODE

### 1. User (Abstract Class)
* **Tujuan**: Sebagai kelas induk (blueprint dasar) untuk semua entitas yang berupa pengguna di dalam aplikasi SMARTCASHIER.
* **Konsep OOP**:
  * **Abstraction**: Dideklarasikan sebagai kelas abstrak karena kita tidak pernah membuat objek User secara langsung (instansiasi), melainkan hanya melalui turunannya (Karyawan atau Member).
  * **Inheritance**: Atribut umum seperti id, name, dan phoneNumber diwariskan otomatis ke semua kelas anak.
* **Metode Utama**: `displayProfile()` dideklarasikan sebagai abstract method tanpa isi, yang mewajibkan setiap kelas anak untuk membuat cara pencetakan profilnya masing-masing.

### 2. Karyawan (Sub-class)
* **Tujuan**: Mewakili data kasir/karyawan yang mengoperasikan aplikasi dan melayani transaksi.
* **Konsep OOP**:
  * **Inheritance**: Mewarisi seluruh atribut milik User.
  * **Polymorphism (Method Overriding)**: Mengisi logika pada metode `displayProfile()` untuk menampilkan performa kasir (termasuk nilai KPI).
* **Fitur Penting**: Menyimpan data login (employeeId, password) dan kpiScore (indikator performa kasir). Memiliki metode `login()` untuk memeriksa kecocokan kredensial kasir.

### 3. Member (Sub-class)
* **Tujuan**: Mewakili pelanggan tetap yang terdaftar dalam program loyalitas toko untuk mendapatkan keuntungan diskon belanja.
* **Konsep OOP**:
  * **Inheritance**: Mewarisi seluruh atribut milik User.
  * **Polymorphism**: Mengisi logika metode `displayProfile()` untuk menampilkan profil pelanggan dan tingkat diskonnya.
* **Fitur Penting**: Menyimpan tanggal bergabung (joinDate) dan besaran diskon (discountRate, default 0.05 atau 5%). Memiliki metode `applyDiscount()` untuk memotong total belanjaan dengan rate diskon pelanggan.

### 4. Product (Class)
* **Tujuan**: Mewakili barang dagangan atau produk yang terdaftar di toko dan siap untuk dijual.
* **Fitur Penting**: Menyimpan informasi produk seperti nama barang (productName), kategori (category), jumlah stok tersedia (quantity), dan harga satuan (price).

### 5. Transaction (Class)
* **Tujuan**: Mewakili satu bundel nota penjualan/transaksi belanja utuh yang dilakukan kasir.
* **Relasi & Konsep OOP**:
  * **Composition (Komposisi)**: Memiliki relasi erat terhadap daftar belanjaan (List of TransactionItem). Jika objek Transaction dihapus, seluruh detail barang belanjaannya (TransactionItem) ikut terhapus dari memori.
  * **Association**: Merujuk ke satu kasir (Karyawan) yang melayani, dan dapat merujuk ke satu pelanggan (Member) jika pembeli memiliki kartu member.
* **Metode Utama**: `calculateTotal()` bertugas mengalkulasi harga subtotal dari semua item belanjaan, lalu otomatis memotong harganya dengan diskon jika pembeli terdaftar sebagai member aktif.

### 6. TransactionItem (Class)
* **Tujuan**: Mewakili satu baris detail barang yang dibeli dalam nota transaksi.
* **Fitur Penting**: Menyimpan hubungan antara transaksi induk, produk yang dibeli (product), jumlah yang dibeli (quantity), dan subtotal harga barang tersebut (subtotal).
* *Contoh*: Jika membeli 3 buah Indomie Goreng, maka detail "Indomie Goreng", jumlah "3", dan subtotal "Rp10.500" disimpan di kelas ini.

### 7. CalculatorTools (Utility Class)
* **Tujuan**: Menyediakan pustaka perhitungan matematika dasar secara terpusat untuk menghindari kesalahan komputasi desimal pada transaksi kasir.
* **Konsep OOP**: Menggunakan metode Static (add, subtract, multiply, divide, modulo), sehingga kelas ini tidak perlu dibuat objeknya menggunakan kata kunci new. Cukup panggil langsung dengan sintaksis `CalculatorTools.add(a, b)`.
