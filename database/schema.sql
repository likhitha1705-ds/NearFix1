-- ========================================================
-- NearFix – Local Service Finder for Mumbai
-- Database Schema for MySQL / MySQL Workbench
-- Database Name: nearfix
-- ========================================================

CREATE DATABASE IF NOT EXISTS nearfix;
USE nearfix;

-- Drop existing tables in correct order if re-initializing
DROP TABLE IF EXISTS service_requests;
DROP TABLE IF EXISTS providers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Admin, Customer, Provider)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'customer', 'provider') NOT NULL,
    locality VARCHAR(100) NOT NULL DEFAULT 'Andheri West, Mumbai',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Service Categories Table (Strictly 3 fixed services)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Service Provider Profiles Table (Strictly 3 demo providers)
CREATE TABLE providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    service_category VARCHAR(50) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL DEFAULT 'Mumbai, Maharashtra',
    experience_years INT NOT NULL,
    description TEXT NOT NULL,
    availability_status ENUM('Available', 'Busy', 'On Leave') NOT NULL DEFAULT 'Available',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    demo_phone VARCHAR(50) NOT NULL,
    demo_email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Service Requests Table (Customer bookings & activity)
CREATE TABLE service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    provider_id INT NOT NULL,
    service_category VARCHAR(50) NOT NULL,
    preferred_date DATE NOT NULL,
    locality VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
