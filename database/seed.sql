-- ========================================================
-- NearFix – Local Service Finder
-- Database Seed Data (3 Providers for each of the 3 services = 9 Providers total)
-- ========================================================

USE nearfix;

-- Clear previous data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE service_requests;
TRUNCATE TABLE providers;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Categories (3 fixed services)
INSERT INTO categories (id, name, slug, description, icon) VALUES
(1, 'Electrician', 'electrician', 'Electrical installation and repair.', '⚡'),
(2, 'Plumber', 'plumber', 'Water leaks, taps, and pipe repairs.', '🔧'),
(3, 'AC Repair', 'ac-repair', 'Air-conditioner servicing and repair.', '❄️');

-- 2. Insert Users
-- Password for Admin: 'Admin@123'
-- Password for all Providers: 'Provider@123'
-- Password for Customer: 'Customer@123'
INSERT INTO users (id, full_name, email, password_hash, phone, role, locality) VALUES
-- Administrator
(1, 'System Administrator', 'admin@nearfix.in', '$2a$10$UTzSNxFHPbObPEhGQ9abY.FnwhoXzUIophGKTr3BtDva9KPXRXbom', '+91 98200 00001', 'admin', 'Mumbai, Maharashtra'),

-- Electricians (Category 1)
(2, 'Rahul Sharma', 'rahul.sharma@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 11001', 'provider', 'Andheri West, Mumbai'),
(3, 'Kiran Verma', 'kiran.verma@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 11002', 'provider', 'Bandra West, Mumbai'),
(4, 'Sanjay Rao', 'sanjay.rao@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 11003', 'provider', 'Dadar, Mumbai'),

-- Plumbers (Category 2)
(5, 'Amit Patil', 'amit.patil@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 22001', 'provider', 'Dadar, Mumbai'),
(6, 'Ganesh Shinde', 'ganesh.shinde@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 22002', 'provider', 'Andheri West, Mumbai'),
(7, 'Prashant More', 'prashant.more@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 22003', 'provider', 'Bandra West, Mumbai'),

-- AC Repair (Category 3)
(8, 'Neha Deshmukh', 'neha.deshmukh@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 33001', 'provider', 'Bandra West, Mumbai'),
(9, 'Sameer Khan', 'sameer.khan@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 33002', 'provider', 'Andheri West, Mumbai'),
(10, 'Vikram Joshi', 'vikram.joshi@nearfix.in', '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', '+91 98200 33003', 'provider', 'Dadar, Mumbai'),

-- Customer Account
(11, 'Pooja Kulkarni', 'customer@demo.in', '$2a$10$KCoqU1ma2oKkSDd.P0HAXugHSfkOvw4zho2aiWYqEAet6eKY7pTf6', '+91 98200 44004', 'customer', 'Andheri West, Mumbai');

-- 3. Insert Provider Profiles (3 providers for each service)
INSERT INTO providers (id, user_id, category_id, name, service_category, locality, city, experience_years, description, availability_status, is_active, demo_phone, demo_email) VALUES
-- Electrician Profiles (3)
(1, 2, 1, 'Rahul Sharma', 'Electrician', 'Andheri West, Mumbai', 'Mumbai, Maharashtra', 3, 'Electrical installation, wiring checks, and minor electrical repairs.', 'Available', TRUE, '+91 98200 11001', 'rahul.sharma@nearfix.in'),
(2, 3, 1, 'Kiran Verma', 'Electrician', 'Bandra West, Mumbai', 'Mumbai, Maharashtra', 5, 'Residential and commercial wiring diagnostics, MCB replacement, and fixture setups.', 'Available', TRUE, '+91 98200 11002', 'kiran.verma@nearfix.in'),
(3, 4, 1, 'Sanjay Rao', 'Electrician', 'Dadar, Mumbai', 'Mumbai, Maharashtra', 4, 'Home inverter installations, circuit breaker troubleshooting, and lighting maintenance.', 'Available', TRUE, '+91 98200 11003', 'sanjay.rao@nearfix.in'),

-- Plumber Profiles (3)
(4, 5, 2, 'Amit Patil', 'Plumber', 'Dadar, Mumbai', 'Mumbai, Maharashtra', 4, 'Tap repairs, water leakage, and basic pipe maintenance.', 'Available', TRUE, '+91 98200 22001', 'amit.patil@nearfix.in'),
(5, 6, 2, 'Ganesh Shinde', 'Plumber', 'Andheri West, Mumbai', 'Mumbai, Maharashtra', 6, 'Bathroom fittings, pipeline leakage inspection, and water pressure motor maintenance.', 'Available', TRUE, '+91 98200 22002', 'ganesh.shinde@nearfix.in'),
(6, 7, 2, 'Prashant More', 'Plumber', 'Bandra West, Mumbai', 'Mumbai, Maharashtra', 3, 'Kitchen sink drainage unclogging, geyser pipeline connections, and valve repairs.', 'Available', TRUE, '+91 98200 22003', 'prashant.more@nearfix.in'),

-- AC Repair Profiles (3)
(7, 8, 3, 'Neha Deshmukh', 'AC Repair', 'Bandra West, Mumbai', 'Mumbai, Maharashtra', 3, 'AC cleaning, routine servicing, and basic cooling issue checks.', 'Available', TRUE, '+91 98200 33001', 'neha.deshmukh@nearfix.in'),
(8, 9, 3, 'Sameer Khan', 'AC Repair', 'Andheri West, Mumbai', 'Mumbai, Maharashtra', 5, 'Split and window AC gas refilling, compressor diagnostics, and filter sanitization.', 'Available', TRUE, '+91 98200 33002', 'sameer.khan@nearfix.in'),
(9, 10, 3, 'Vikram Joshi', 'AC Repair', 'Dadar, Mumbai', 'Mumbai, Maharashtra', 4, 'Copper piping repair, PCB board troubleshooting, and seasonal preventive maintenance.', 'Available', TRUE, '+91 98200 33003', 'vikram.joshi@nearfix.in');

-- 4. Sample Service Request
INSERT INTO service_requests (id, customer_id, provider_id, service_category, preferred_date, locality, description, status) VALUES
(1, 11, 1, 'Electrician', '2026-10-18', 'Andheri West, Mumbai', 'MCB tripping issue and inspection of living room switchboard.', 'Pending');
