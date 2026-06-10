# PANDUAN LENGKAP REPLIKASI SMARTCASHIER DARI NOL MENGGUNAKAN APACHE NETBEANS

Panduan ini berisi instruksi langkah-demi-langkah (step-by-step) untuk membangun ulang seluruh proyek **SMARTCASHIER** dari nol dengan fokus pengembangan backend menggunakan **Apache NetBeans IDE** (versi 12+).

---

## 📁 STRUKTUR FOLDER AKHIR PROYEK
Setelah seluruh langkah diikuti, struktur folder proyek akan terlihat sebagai berikut:
```text
smartcashier-project/
├── schema.sql
├── REPLICATION_GUIDE_NETBEANS_FROM_SCRATCH.pdf
├── backend/                  <-- Project Java Maven (NetBeans)
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
└── frontend/                 <-- Project React.js
```

---

## 🗄️ LANGKAH 1: PERSIAPAN DATABASE (POSTGRESQL)
1. Jalankan PostgreSQL Server Anda.
2. Buat database baru bernama `smartcashier_db`:
   ```sql
   CREATE DATABASE smartcashier_db;
   ```
3. Simpan script SQL berikut dengan nama `schema.sql` di folder utama proyek, lalu jalankan di database `smartcashier_db` untuk membuat tabel dan mengisi data awal:

```sql
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

-- Seeding Data
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

## 💻 LANGKAH 2: MEMBUAT PROYEK BACKEND DI NETBEANS

### 1. Inisialisasi Proyek Maven Baru
1. Buka **Apache NetBeans**.
2. Klik **File** -> **New Project...** (atau tekan `Ctrl + Shift + N`).
3. Pada dialog New Project:
   * Pilih Category: **Java with Maven**
   * Pilih Projects: **Java Application** (bukan *Web Application*)
   * Klik **Next**.
   
   > [!IMPORTANT]
   > **Mengapa memilih "Java Application", bukan "Web Application"?**
   > Proyek Java web tradisional (Servlet/JSP) di NetBeans dikemas sebagai `.war` dan membutuhkan web server eksternal (seperti Apache Tomcat mandiri atau GlassFish) untuk dijalankan.
   > Namun, **Spring Boot** menggunakan konsep **Embedded Server** (Tomcat sudah terintegrasi di dalam library-nya). Kita membuat proyek ini sebagai **Java Application** biasa (dihasilkan sebagai file `.jar`), dan saat program dijalankan, Spring Boot akan langsung menyalakan server web-nya sendiri di port `8080`. Ini adalah standar modern pengembangan backend Java.

4. Isi rincian proyek:
   * **Project Name**: `backend`
   * **Project Location**: Arahkan ke folder utama proyek Anda.
   * **Group Id**: `com.smartcashier`
   * **Version**: `0.0.1-SNAPSHOT`
   * **Package**: `com.smartcashier`
   * Klik **Finish**.

### 2. Konfigurasi `pom.xml`
1. Di panel **Projects** sebelah kiri, buka folder proyek `backend` -> double-click file **pom.xml**.
2. Hapus seluruh isi default `pom.xml` dan ganti dengan script Spring Boot dependencies berikut:

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
            </plugin>
        </plugins>
    </build>
</project>
```

3. Simpan file (`Ctrl + S`).
4. Klik kanan nama proyek `backend` -> pilih **Clean and Build**. Langkah ini wajib untuk mengunduh seluruh library Spring Boot ke komputer Anda melalui Maven.

### 3. Membuat Application Properties
1. Masuk to tab **Files** (sebelah tab Projects) atau ekspansi **Other Sources** -> **src/main/resources**.
2. Jika file `application.properties` belum ada, klik kanan folder `resources` -> **New** -> **Other...** -> **Properties File** -> Name: `application`.
3. Tulis parameter database PostgreSQL berikut:
   ```properties
   spring.application.name=smartcashier
   server.port=8080

   spring.datasource.url=jdbc:postgresql://localhost:5432/smartcashier_db
   spring.datasource.username=postgres
   spring.datasource.password=PASSWORD_POSTGRES_ANDA
   spring.datasource.driver-class-name=org.postgresql.Driver

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

   spring.jackson.time-zone=Asia/Jakarta
   spring.jackson.serialization.write-dates-as-timestamps=false
   ```

### 4. Membuat Packages Program
Di bawah folder **Source Packages** -> `com.smartcashier`, buat beberapa sub-package dengan cara: klik kanan `com.smartcashier` -> **New** -> **Java Package**.
Buat package berikut:
* `com.smartcashier.config`
* `com.smartcashier.controller`
* `com.smartcashier.dto`
* `com.smartcashier.entity`
* `com.smartcashier.repository`
* `com.smartcashier.service`

---

## 📝 LANGKAH 3: MENULIS KODE PROGRAM JAVA (BACKEND)
Buat class Java di package masing-masing dengan cara: klik kanan package -> **New** -> **Java Class**.

### 1. Main Application Class
Buat class `SmartcashierApplication.java` di dalam package `com.smartcashier`:
```java
package com.smartcashier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartcashierApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartcashierApplication.class, args);
    }
}
```

### 2. Entity Classes (`com.smartcashier.entity`)

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
    @Id
    private String id; // Berperan sebagai primary key (KAR001, dll)
    private String employeeId; // Kode login kasir (EMP001, dll)
    private String password;
    private double kpiScore;

    public Karyawan() {}
    public Karyawan(String id, String name, String phoneNumber, String password) {
        super(id, name, phoneNumber);
        this.id = id;
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
        System.out.println("ID Karyawan : " + this.employeeId);
        System.out.println("Nama        : " + this.name);
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
    @Id
    private String id;
    private String joinDate;
    private double discountRate;

    public Member() {}

    @Override
    public void displayProfile() {
        System.out.println("ID Member   : " + this.id);
        System.out.println("Nama        : " + this.name);
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

### 3. Jpa Repositories (`com.smartcashier.repository`)
* **KaryawanRepository.java**
```java
package com.smartcashier.repository;

import com.smartcashier.entity.Karyawan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KaryawanRepository extends JpaRepository<Karyawan, String> {
    Optional<Karyawan> findByEmployeeId(String employeeId);
}
```
* **MemberRepository.java**
```java
package com.smartcashier.repository;

import com.smartcashier.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByPhoneNumber(String phoneNumber);
}
```
* Buat file serupa `ProductRepository.java` dan `TransactionRepository.java` dengan ekstensi `JpaRepository<Entity, Type>` standar.

### 4. Service Classes (`com.smartcashier.service`)

* **CalculatorTools.java**
```java
package com.smartcashier.service;

public class CalculatorTools {
    public static double add(double a, double b) { return a + b; }
    public static double subtract(double a, double b) { return a - b; }
    public static double multiply(double a, double b) { return a * b; }
    public static double divide(double a, double b) { 
        if (b == 0) throw new IllegalArgumentException("Tidak bisa membagi dengan nol");
        return a / b; 
    }
    public static double modulo(double a, double b) { return a % b; }
}
```

* **ProductService.java**
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
                .orElseThrow(() -> new RuntimeException("Produk tidak ditemukan"));
        if (p.getQuantity() < quantity) {
            throw new RuntimeException("Stok " + p.getProductName() + " tidak cukup!");
        }
        p.setQuantity(p.getQuantity() - quantity);
        productRepository.save(p);
    }
}
```

* Buat service lainnya (`TransactionService.java`, `KaryawanService.java`, `MemberService.java`) untuk melayani transaksi belanja kasir dan penyimpanan data member ke database.

### 5. DTO & Controller Classes (`com.smartcashier.dto` & `controller`)
Buat format *Request* dan *Response* data pada DTO, lalu hubungkan ke REST Controller:
* **AuthController**: Menerima request POST login kasir.
* **ProductController**: Menyediakan endpoint CRUD data barang.
* **MemberController**: Pendaftaran member baru dan pencarian member.
* **TransactionController**: Penanganan checkout transaksi baru serta data struk belanja.

---

## 🎨 LANGKAH 4: MEMBANGUN FRONTEND REACT.JS (MENGGUNAKAN VITE SEBAGAI BUNDLER)

> [!NOTE]
> **Vite** adalah build tool & bundler modern yang digunakan untuk menyusun dan menjalankan aplikasi **React.js**. Seluruh kode program antarmuka kasir tetap murni menggunakan library **React.js** (berbasis Component dan JSX).

1. Buka Terminal CMD atau PowerShell di luar NetBeans.
2. Buat proyek React di folder proyek:
   ```bash
   npm create vite@latest frontend -- --template react
   ```
3. Masuk ke folder frontend dan install library:
   ```bash
   cd frontend
   npm install axios lucide-react
   ```
4. Tambahkan styling bernuansa dark modern pada `frontend/src/index.css` dan interseptor login pada `frontend/src/services/api.js`.
5. Tulis halaman antarmuka kasir pada folder `frontend/src/components/` (`Login.jsx`, `Dashboard.jsx`, `Cart.jsx`, `ProductManager.jsx`, `Receipt.jsx`).

---

## 🚀 LANGKAH 5: RUN & DEBUG APLIKASI DI NETBEANS
1. **Menjalankan Program**:
   * Klik kanan proyek `backend` -> **Run Maven** -> **Goals...**.
   * Ketik `spring-boot:run` pada kotak dialog Goals, lalu klik **OK**.
2. **Melakukan Debugging**:
   * Klik kanan proyek `backend` -> **Debug Maven** -> **Debug Goals...**.
   * Ketik `spring-boot:run` lalu klik **OK**. Letakkan *break point* (klik merah di kiri baris kode Java) untuk melacak jalannya data.
3. **Menjalankan Frontend**:
   * Jalankan via Terminal Windows:
     ```bash
     cd frontend
     npm run dev
     ```
   * Akses alamat aplikasi di browser: `http://localhost:5173`.
