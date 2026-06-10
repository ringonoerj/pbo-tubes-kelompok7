# PANDUAN REPLIKASI PROYEK SMARTCASHIER DARI NOL

Panduan ini berisi petunjuk langkah-demi-langkah (step-by-step) yang komprehensif dan mendetail untuk mereplikasi dan membangun ulang proyek **SMARTCASHIER** dari awal. Diasumsikan bahwa JDK 17, Node.js (v18+), NPM, dan PostgreSQL sudah terinstal pada komputer Anda.

---

## 📁 STRUKTUR LAYOUT PROYEK
Buat struktur direktori proyek seperti di bawah ini:
```text
pbo-tubes-kelompok7/
├── schema.sql
├── README.md
├── REPLICATION_GUIDE.md
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/smartcashier/
│           │   ├── SmartcashierApplication.java
│           │   ├── config/
│           │   │   └── CorsConfig.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── MemberController.java
│           │   │   ├── ProductController.java
│           │   │   └── TransactionController.java
│           │   ├── dto/
│           │   │   ├── LoginRequest.java
│           │   │   ├── LoginResponse.java
│           │   │   ├── ReceiptResponse.java
│           │   │   └── TransactionRequest.java
│           │   ├── entity/
│           │   │   ├── User.java
│           │   │   ├── Karyawan.java
│           │   │   ├── Member.java
│           │   │   ├── Product.java
│           │   │   ├── Transaction.java
│           │   │   └── TransactionItem.java
│           │   ├── repository/
│           │   │   ├── KaryawanRepository.java
│           │   │   ├── MemberRepository.java
│           │   │   ├── ProductRepository.java
│           │   │   └── TransactionRepository.java
│           │   └── service/
│           │       ├── CalculatorTools.java
│           │       ├── KaryawanService.java
│           │       ├── MemberService.java
│           │       ├── ProductService.java
│           │       └── TransactionService.java
│           └── resources/
│               └── application.properties
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── services/
        │   └── api.js
        └── components/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── ProductList.jsx
            ├── ProductManager.jsx
            ├── Cart.jsx
            ├── MemberForm.jsx
            └── Receipt.jsx
```

---

## 🗄️ LANGKAH 1: KONFIGURASI DATABASE
1. Masuk ke PostgreSQL Anda (via pgAdmin atau psql CLI).
2. Jalankan perintah SQL berikut untuk membuat database:
   ```sql
   CREATE DATABASE smartcashier_db;
   ```
3. Hubungkan ke database `smartcashier_db` dan jalankan script SQL berikut untuk membuat tabel & mengisi data awal (simpan sebagai `schema.sql` di root proyek):

```sql
-- schema.sql
CREATE TABLE karyawan (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    kpi_score DOUBLE PRECISION DEFAULT 0
);

CREATE TABLE member (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    join_date VARCHAR(50),
    discount_rate DOUBLE PRECISION DEFAULT 0.05
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity INT NOT NULL DEFAULT 0,
    price DOUBLE PRECISION NOT NULL
);

CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    karyawan_id VARCHAR(50) NOT NULL,
    member_id VARCHAR(50),
    total_amount DOUBLE PRECISION NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (karyawan_id) REFERENCES karyawan(id),
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE transaction_item (
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transaction(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Data Seeding
INSERT INTO karyawan (id, employee_id, name, phone_number, password, kpi_score) VALUES 
('KAR001', 'EMP001', 'Ringo Noer', '08123456789', 'rahasia123', 0),
('KAR002', 'EMP002', 'Farel Gusviransyah', '08123456780', 'rahasia123', 0);

INSERT INTO member (id, name, phone_number, join_date, discount_rate) VALUES 
('MEM001', 'Budi Santoso', '08567890123', '2026-01-15', 0.05);

INSERT INTO product (product_name, category, quantity, price) VALUES 
('Indomie Goreng', 'Makanan', 50, 3500),
('Aqua 600ml', 'Minuman', 30, 3000),
('Pensil 2B', 'Alat Tulis', 100, 2000);
```

---

## 💻 LANGKAH 2: MEMBANGUN BACKEND (JAVA SPRING BOOT)

### 1. File Konfigurasi Maven (`pom.xml`)
Buat file `backend/pom.xml` dengan isi berikut:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>

    <groupId>com.smartcashier</groupId>
    <artifactId>smartcashier</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>smartcashier</name>
    <description>SMARTCASHIER Backend</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2. Properties Aplikasi (`application.properties`)
Buat file `backend/src/main/resources/application.properties`:
```properties
spring.application.name=smartcashier
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/smartcashier_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

spring.jackson.time-zone=Asia/Jakarta
spring.jackson.serialization.write-dates-as-timestamps=false
```

### 3. Implementasi Classes Entity (com.smartcashier.entity)

* **User.java (Abstract Class)**
```java
package com.smartcashier.entity;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class User {
    protected String id;
    protected String name;
    protected String phoneNumber;

    public User() {}

    public User(String id, String name, String phoneNumber) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    public abstract void displayProfile();
}
```

* **Karyawan.java**
```java
package com.smartcashier.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "karyawan")
@Getter
@Setter
public class Karyawan extends User {
    private String employeeId;
    private String password;
    private double kpiScore;

    public Karyawan() {}

    public Karyawan(String id, String name, String phoneNumber, String password) {
        super(id, name, phoneNumber);
        this.employeeId = id;
        this.password = password;
        this.kpiScore = 0.0;
    }

    public boolean login(String inputId, String inputPassword) {
        return this.employeeId.equals(inputId) && this.password.equals(inputPassword);
    }

    public void addKpi(double score) {
        this.kpiScore += score;
    }

    @Override
    public void displayProfile() {
        System.out.println("=== Profil Karyawan ===");
        System.out.println("ID Karyawan : " + this.employeeId);
        System.out.println("Nama        : " + this.name);
        System.out.println("No HP       : " + this.phoneNumber);
        System.out.println("KPI         : " + this.kpiScore);
    }
}
```

* **Member.java**
```java
package com.smartcashier.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "member")
@Getter
@Setter
public class Member extends User {
    private String joinDate;
    private double discountRate;

    public Member() {}

    public Member(String id, String name, String phoneNumber, String joinDate, double discountRate) {
        super(id, name, phoneNumber);
        this.joinDate = joinDate;
        this.discountRate = discountRate;
    }

    public double applyDiscount(double subtotal) {
        return subtotal * (1.0 - this.discountRate);
    }

    @Override
    public void displayProfile() {
        System.out.println("=== Profil Member ===");
        System.out.println("ID Member   : " + this.id);
        System.out.println("Nama        : " + this.name);
        System.out.println("Diskon Rate : " + this.discountRate);
    }
}
```

* **Product.java**
```java
package com.smartcashier.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product")
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String productName;
    private String category;
    private Integer quantity;
    private Double price;
}
```

* **Transaction.java**
```java
package com.smartcashier.entity;

import com.smartcashier.service.CalculatorTools;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transaction")
@Getter
@Setter
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "karyawan_id")
    private Karyawan karyawan;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private Double totalAmount;
    private LocalDateTime transactionDate;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionItem> items = new ArrayList<>();

    public void calculateTotal() {
        double subtotal = 0.0;
        for (TransactionItem item : items) {
            subtotal = CalculatorTools.add(subtotal, item.getSubtotal());
        }

        if (member != null) {
            double discount = CalculatorTools.multiply(subtotal, member.getDiscountRate());
            this.totalAmount = CalculatorTools.subtract(subtotal, discount);
        } else {
            this.totalAmount = subtotal;
        }
    }
}
```

* **TransactionItem.java**
```java
package com.smartcashier.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "transaction_item")
@Getter
@Setter
public class TransactionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    @JsonIgnore
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private Double subtotal;
}
```

### 4. Implementasi Jpa Repositories (com.smartcashier.repository)
Buat interface JPA Repository standar untuk masing-masing Entity:
* `KaryawanRepository.java` (mencari berdasarkan `employeeId`)
* `MemberRepository.java` (mencari berdasarkan `phoneNumber`)
* `ProductRepository.java`
* `TransactionRepository.java` (mencari berdasarkan `transactionId`)

### 5. Implementasi Services (com.smartcashier.service)

* **CalculatorTools.java (Utility Perhitungan Matématika)**
```java
package com.smartcashier.service;

public class CalculatorTools {
    public static double add(double a, double b) { return a + b; }
    public static double subtract(double a, double b) { return a - b; }
    public static double multiply(double a, double b) { return a * b; }
    public static double divide(double a, double b) { 
        if (b == 0) throw new IllegalArgumentException("Tidak dapat dibagi dengan 0");
        return a / b; 
    }
    public static double modulo(double a, double b) { return a % b; }
}
```

* **TransactionService.java (Pusat Logika Transaksi)**
```java
package com.smartcashier.service;

import com.smartcashier.dto.ReceiptResponse;
import com.smartcashier.dto.TransactionRequest;
import com.smartcashier.entity.*;
import com.smartcashier.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private KaryawanRepository karyawanRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductService productService;

    @Transactional
    public ReceiptResponse createTransaction(TransactionRequest request, String karyawanId) {
        Karyawan karyawan = karyawanRepository.findById(karyawanId)
                .orElseThrow(() -> new RuntimeException("Karyawan tidak teridentifikasi"));

        Transaction transaction = new Transaction();
        transaction.setTransactionId("TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        transaction.setKaryawan(karyawan);
        transaction.setTransactionDate(LocalDateTime.now());

        if (request.getMemberPhone() != null && !request.getMemberPhone().trim().isEmpty()) {
            Member member = memberRepository.findByPhoneNumber(request.getMemberPhone())
                    .orElse(null);
            transaction.setMember(member);
        }

        for (TransactionRequest.ItemRequest ir : request.getItems()) {
            Product product = productRepository.findById(ir.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produk tidak ditemukan"));

            productService.decreaseStock(product.getId(), ir.getQuantity());

            TransactionItem item = new TransactionItem();
            item.setTransaction(transaction);
            item.setProduct(product);
            item.setQuantity(ir.getQuantity());
            item.setSubtotal(CalculatorTools.multiply(product.getPrice(), ir.getQuantity()));

            transaction.getItems().add(item);
        }

        transaction.calculateTotal();
        karyawan.addKpi(5.0); // Berikan poin KPI 5.0 setiap checkout
        karyawanRepository.save(karyawan);

        Transaction saved = transactionRepository.save(transaction);
        return mapToReceipt(saved);
    }

    public ReceiptResponse getReceipt(String transactionId) {
        Transaction tx = transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
        return mapToReceipt(tx);
    }

    private ReceiptResponse mapToReceipt(Transaction tx) {
        ReceiptResponse response = new ReceiptResponse();
        response.setTransactionId(tx.getTransactionId());
        response.setKaryawanName(tx.getKaryawan().getName());
        response.setMemberName(tx.getMember() != null ? tx.getMember().getName() : "-");
        response.setDiscountRate(tx.getMember() != null ? tx.getMember().getDiscountRate() : 0.0);
        response.setTotalAmount(tx.getTotalAmount());
        response.setTransactionDate(tx.getTransactionDate());
        response.setItems(tx.getItems().stream().map(i -> {
            ReceiptResponse.ReceiptItem ri = new ReceiptResponse.ReceiptItem();
            ri.setProductName(i.getProduct().getProductName());
            ri.setPrice(i.getProduct().getPrice());
            ri.setQuantity(i.getQuantity());
            ri.setSubtotal(i.getSubtotal());
            return ri;
        }).collect(Collectors.toList()));
        return response;
    }
}
```

* **ProductService.java (Stock Safe Update)**
```java
package com.smartcashier.service;

import com.smartcashier.entity.Product;
import com.smartcashier.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    @Autowired private ProductRepository productRepository;

    public synchronized void decreaseStock(Integer productId, int quantity) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produk tidak ada"));
        if (p.getQuantity() < quantity) {
            throw new RuntimeException("Stok " + p.getProductName() + " tidak mencukupi!");
        }
        p.setQuantity(p.getQuantity() - quantity);
        productRepository.save(p);
    }
}
```

* Tambahkan juga `KaryawanService.java` & `MemberService.java` untuk melayani pengambilan data profil karyawan dan pendaftaran member baru.

### 6. Implementasi REST Controllers (com.smartcashier.controller)
Buat Controller dengan mapping REST API standar:
* **AuthController.java**: Endpoint `/api/auth/login` menerima `LoginRequest` -> mencocokkan `employeeId` dan `password` di DB -> return `LoginResponse`.
* **ProductController.java**: Endpoint `/api/products` (CRUD standard mapping).
* **MemberController.java**: Endpoint `/api/member/register` dan `/api/member/{phone}`.
* **TransactionController.java**: Endpoint `/api/transactions` (POST untuk checkout) dan `/api/transactions/{id}/receipt` (GET struk). Controller ini menerima `@RequestHeader("X-Karyawan-Id")` dari frontend.

---

## 🎨 LANGKAH 3: MEMBANGUN FRONTEND (REACT.JS + VITE)

### 1. package.json & vite.config.js
* Inisialisasi Vite menggunakan shell command:
  ```bash
  npm create vite@latest frontend -- --template react
  ```
* Ganti `package.json` dependencies dengan menyertakan `axios` dan `lucide-react` untuk ikon.
* Konfigurasikan proxy API di `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### 2. Styling Global (`src/index.css`)
Tambahkan utility UI bernuansa Dark Modern & Glassmorphism di `index.css`:
```css
:root {
  --primary: #6366f1;
  --primary-light: rgba(99, 102, 241, 0.15);
  --secondary: #06b6d4;
  --background: #0f172a;
  --card-bg: rgba(30, 41, 59, 0.4);
  --border-color: rgba(255, 255, 255, 0.08);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --danger: #ef4444;
  --success: #10b981;
}

body {
  margin: 0;
  background-color: var(--background);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
}

.glass-panel {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 12px;
}

/* Button & Form styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary {
  background: var(--primary);
  color: white;
}
.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.05);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: white;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-light);
}

/* Print Layout rules */
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
  .glass-panel {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
}
```

### 3. Setup Axios Client (`src/services/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const karyawan = localStorage.getItem('karyawan');
  if (karyawan) {
    config.headers['X-Karyawan-Id'] = JSON.parse(karyawan).id;
  }
  return config;
});

export default api;
```

### 4. Implementasi Halaman Dashboard & Cart (`src/components/`)
* **Login.jsx**: Form autentikasi. Menghubungi POST `/api/auth/login`. Simpan data respon (`id`, `name`, `kpiScore`) ke `localStorage.setItem('karyawan', ...)` dan panggil callback masuk.
* **Dashboard.jsx**: Manajemen state shopping cart (`cartItems: [{product, quantity}]`). Bagian kiri merender daftar katalog (`ProductList`), bagian kanan merender sidebar transaksi (`Cart`).
* **Cart.jsx**:
  * Mengatur kuantitas item (tombol `+` / `-`).
  * Input pencarian member: Panggil GET `/api/member/{phone}` untuk mendeteksi database member & menerapkan diskon 5%.
  * Tombol checkout: POST `/api/transactions` -> lempar state sukses dan set Receipt ID ke view struk.
  * Modal Register Member Baru: Merender `MemberForm.jsx` jika dicari tidak ada.
* **Receipt.jsx**: Mengambil data struk dari `/api/transactions/{id}/receipt` dan menampilkannya dalam format cetak struk termal. Sediakan tombol cetak struk (`window.print()`).
* **ProductManager.jsx**: Berisi form input penambahan produk baru serta tabel list barang dagangan (CRUD) lengkap dengan tombol hapus & edit.

---

## 🚀 LANGKAH 4: PROSES MENJALANKAN APLIKASI
1. **Jalankan Database**: Pastikan PostgreSQL Service aktif dan port 5432 terbuka.
2. **Jalankan Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. **Jalankan Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Buka browser pada alamat `http://localhost:5173`. Gunakan akun demo **`EMP001`** dengan password **`rahasia123`** untuk menguji sistem kasir.
