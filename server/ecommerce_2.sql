DROP DATABASE IF EXISTS ecommerce_2;
CREATE DATABASE ecommerce_2;

\c ecommerce_2;

CREATE TYPE status_enum AS ENUM ('active', 'inactive');
CREATE TYPE role_enum AS ENUM ('user', 'admin', 'superadmin');
CREATE TYPE activity_type_enum AS ENUM ('create', 'read', 'update', 'delete', 'other');
CREATE TYPE model_enum AS ENUM ('free', 'paid');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(15),
    address TEXT,
    password VARCHAR(255),
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jwt_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    label status_enum NOT NULL,
    title VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_inactive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER 
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    label role_enum NOT NULL,
    title VARCHAR(255),
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE user_role(
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL
)

CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    client_side_url VARCHAR(255),
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
    type activity_type_enum NOT NULL,
    code VARCHAR(255) UNIQUE,
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE activity_role (
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (activity_id, role_id)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    description TEXT,
    stock_availability INTEGER
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE user_product (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    label model_enum NOT NULL,
    title VARCHAR(255),
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES models(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO statuses (label, title, is_active, is_inactive, created_at, updated_at) VALUES
    ('active', 'Active Status', TRUE, FALSE, DEFAULT, DEFAULT),
    ('inactive', 'Inactive Status', FALSE, TRUE, DEFAULT, DEFAULT);

INSERT INTO roles (label, title, status_id, created_at, updated_at) VALUES
    ('user', 'User', 1, DEFAULT, DEFAULT),  
    ('admin', 'Administrator', 1, DEFAULT, DEFAULT),
    ('superadmin', 'Super Administrator', 1, DEFAULT, DEFAULT);

INSERT INTO models (label, title, status_id, created_at, updated_at) VALUES
    ('free', 'Free Model', 1, DEFAULT, DEFAULT),
    ('paid', 'Paid Model', 1, DEFAULT, DEFAULT);

INSERT INTO modules (label, title, client_side_url, status_id, created_by)
VALUES 
    ('auth', 'Authentication Module', '/auth', 1, 1),
    ('products', 'Products Module', '/products', 1, 1),
    ('role', 'Role Module', '/roles', 1, 1),
    ('purchase', 'Purchase Module', '/purchases', 1, 1);

INSERT INTO activities (module_id, type, code, status_id, created_by) 
VALUES
    (1, 'create', 'signup', 1, 1),
    (1, 'read', 'login', 1, 1),
    (1, 'delete', 'logout', 1, 1);
    (2, 'read', 'get-products', 1, 1),
    (2, 'read', 'get-single-product', 1, 1),
    (2, 'create', 'save-product', 1, 1),
    (2, 'update', 'update-product', 1, 1),
    (2, 'delete', 'delete-product', 1, 1);
    (3, 'read', 'get-roles', 1, 1),
    (3, 'update', 'assign-role', 1, 1);
    (4, 'read', 'get-purchases', 1, 1),
    (4, 'read', 'get-single-purchase', 1, 1),
    (4, 'create', 'save-purchase', 1, 1);



INSERT INTO activity_role (activity_id, role_id) VALUES
    (134, 3),  -- 'get-roles'
    (135, 3),  -- 'assign-role'
    (129, 3), -- 'save-purchase'
    (130, 3), -- 'save-purchase'
    (138, 3); -- 'save-purchase'

INSERT INTO activity_role (activity_id, role_id) VALUES
    (131, 2),  -- 'save-product'
    (132, 2),  -- 'update-product'
    (133, 2),  -- 'delete-product'
    (136, 2), -- 'get-purchases'
    (137, 2), -- 'get-single-purchase'
    (129, 2), -- 'save-purchase'
    (130, 2), -- 'save-purchase'
    (138, 2); -- 'save-purchase'

-- Assign remaining activity to the User role
INSERT INTO activity_role (activity_id, role_id) VALUES
    (129, 1), -- 'save-purchase'
    (130, 1), -- 'save-purchase'
    (138, 1); -- 'save-purchase'