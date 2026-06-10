-- Database Schema for SMARTCASHIER
-- Database Name: smartcashier_db

-- Drop tables if they exist to start fresh (optional, caution in production)
-- DROP TABLE IF EXISTS transaction_item;
-- DROP TABLE IF EXISTS transaction;
-- DROP TABLE IF EXISTS product;
-- DROP TABLE IF EXISTS member;
-- DROP TABLE IF EXISTS karyawan;

-- 1. Table: Karyawan
CREATE TABLE karyawan (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    kpi_score DOUBLE PRECISION DEFAULT 0
);

-- 2. Table: Member
CREATE TABLE member (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    join_date VARCHAR(50),
    discount_rate DOUBLE PRECISION DEFAULT 0.05
);

-- 3. Table: Product
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity INT NOT NULL DEFAULT 0,
    price DOUBLE PRECISION NOT NULL
);

-- 4. Table: Transaction
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

-- 5. Table: Transaction Item
CREATE TABLE transaction_item (
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transaction(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- --- SEEDING DATA ---

-- 2 Accounts Karyawan for testing
INSERT INTO karyawan (id, employee_id, name, phone_number, password, kpi_score) VALUES 
('KAR001', 'EMP001', 'Ringo Noer', '08123456789', 'rahasia123', 0),
('KAR002', 'EMP002', 'Farel Gusviransyah', '08123456780', 'rahasia123', 0)
ON CONFLICT (id) DO NOTHING;

-- 1 Example Member
INSERT INTO member (id, name, phone_number, join_date, discount_rate) VALUES 
('MEM001', 'Budi Santoso', '08567890123', '2026-01-15', 0.05)
ON CONFLICT (id) DO NOTHING;

-- 3 Initial Products
INSERT INTO product (product_name, category, quantity, price) VALUES 
('Indomie Goreng', 'Makanan', 50, 3500),
('Aqua 600ml', 'Minuman', 30, 3000),
('Pensil 2B', 'Alat Tulis', 100, 2000);
