DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS product_questions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    level VARCHAR(50),
    category VARCHAR(120),
    description VARCHAR(700),
    price NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(512),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    details TEXT,
    stock_quantity INTEGER DEFAULT 0
);

CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_uid VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(2000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    user_uid VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_questions (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    user_uid VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    question_text TEXT NOT NULL,
    answer_text TEXT,
    answered_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_uid VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(2000),
    total_amount BIGINT NOT NULL,
    currency VARCHAR(20) NOT NULL,
    payment_intent_id VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    order_status VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit_price BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    line_total BIGINT NOT NULL
);
