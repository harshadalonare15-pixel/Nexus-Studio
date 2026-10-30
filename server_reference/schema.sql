-- ==========================================================
-- NEXUS STUDIO — Relational Database Schema (PostgreSQL v16)
-- Author: Harshada Dinesh Lonare (B.Tech IT - SVPCET, Nagpur)
-- ==========================================================

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. RESTAURANT MENU ITEMS TABLE (Project 1 - Dragon Pearl)
CREATE TABLE IF NOT EXISTS restaurant_menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_chef_special BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 1) DEFAULT 4.8
);

-- 3. RESTAURANT ORDERS TABLE
CREATE TABLE IF NOT EXISTS restaurant_orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_address TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    gst NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. RESTAURANT TABLE RESERVATIONS
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0),
    reservation_date DATE NOT NULL,
    reservation_time VARCHAR(20) NOT NULL,
    table_number INTEGER,
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LUXURY WATCH PRODUCTS (Project 2 - ChronoLux)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    collection VARCHAR(100),
    price NUMERIC(12, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 5,
    case_size VARCHAR(50),
    movement_type VARCHAR(100),
    water_resistance VARCHAR(50),
    description TEXT,
    image_url VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE
);

-- 6. CHRONOLUX ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Processing',
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CHRONOLUX WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, product_id)
);

-- 8. STUDENTS DIRECTORY TABLE (Project 6 - Student Hub)
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    university_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year VARCHAR(80) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact VARCHAR(30),
    gpa NUMERIC(3, 2) DEFAULT 8.80,
    academic_interest TEXT,
    avatar_url VARCHAR(255),
    enrollment_status VARCHAR(50) DEFAULT 'Currently Enrolled'
);

-- 9. EDITORIAL NEWS ARTICLES (Project 5 - The Daily Brief)
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(80) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publication_date DATE DEFAULT CURRENT_DATE,
    read_time VARCHAR(20) DEFAULT '4 min read',
    summary TEXT,
    content TEXT,
    image_url VARCHAR(255),
    is_breaking BOOLEAN DEFAULT FALSE,
    is_lead BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 1420
);

-- 10. NEWSLETTER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. PORTFOLIO CONTACT MESSAGES (Project 3 - Harshada's Portfolio)
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
