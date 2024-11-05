CREATE TYPE status_enum AS ENUM ('active', 'inactive');
CREATE TYPE role_enum AS ENUM ('user', 'admin', 'superadmin');
CREATE TYPE activity_type_enum AS ENUM ('create', 'read', 'update', 'delete', 'other');
CREATE TYPE model_enum AS ENUM ('free', 'paid');
CREATE TYPE purchase_status_enum AS ENUM ('pending', 'success', 'fail');
CREATE TYPE purchase_type_enum AS ENUM ('payment', 'subscription');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(15),
    address TEXT,
    password VARCHAR(255),
    is_prime_user BOOLEAN DEFAULT FALSE,
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
);

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
    is_subscription_product BOOLEAN DEFAULT false,
    stock_availability INTEGER DEFAULT NULL,
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    purchase_type purchase_type_enum NOT NULL DEFAULT 'payment',
    unit_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2),
    stripe_session_id VARCHAR(255) DEFAULT NULL,
    purchase_status purchase_status_enum NOT NULL DEFAULT 'pending',
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

INSERT INTO modules (label, title, client_side_url, status_id)
VALUES 
    ('auth', 'Authentication Module', '/auth', 1),
    ('products', 'Products Module', '/products', 1),
    ('role', 'Role Module', '/roles', 1),
    ('purchase', 'Purchase Module', '/purchases', 1);

INSERT INTO activities (module_id, type, code, status_id) 
VALUES
    (1, 'create', 'signup', 1),
    (1, 'read', 'login', 1),
    (1, 'delete', 'logout', 1),
    (2, 'read', 'get-products', 1),
    (2, 'read', 'get-single-product', 1),
    (2, 'create', 'save-product', 1),
    (2, 'update', 'update-product', 1),
    (2, 'delete', 'delete-product', 1),
    (3, 'read', 'get-roles', 1),
    (3, 'update', 'assign-role', 1),
    (3,'create','purchase-product',1),
    (3,'create','purchase-product-success',1),
    (3,'create','purchase-product-failed',1),
    (3,'create','product-purchases',1),
    (3,'create','subscribe',1);

-- Role ID 3: All activities
INSERT INTO activity_role (activity_id, role_id) VALUES
    (4, 3),  -- 'get-products'
    (5, 3),  -- 'get-single-product'
    (6, 3),  -- 'save-product'
    (7, 3),  -- 'update-product'
    (8, 3),  -- 'delete-product'
    (9, 3),  -- 'get-roles'
    (10, 3), -- 'assign-role'
    (11, 3), -- 'purchase-product'
    (12, 3), -- 'purchase-product-success'
    (13, 3), -- 'purchase-product-failed'
    (14, 3), -- 'product-purchases'
    (15, 3); -- 'subscribe'

-- Role ID 2: Exclude 'get-roles' and 'assign-role'
INSERT INTO activity_role (activity_id, role_id) VALUES
    (4, 2),  -- 'get-products'
    (5, 2),  -- 'get-single-product'
    (6, 2),  -- 'save-product'
    (7, 2),  -- 'update-product'
    (8, 2),  -- 'delete-product'
    (11, 2), -- 'purchase-product'
    (12, 2), -- 'purchase-product-success'
    (13, 2),-- 'purchase-product-failed'
    (14, 2), -- 'product-purchases'
    (15, 2); -- 'subscribe'

-- Role ID 1: No role-related activities and no product create/update/delete activities
INSERT INTO activity_role (activity_id, role_id) VALUES
    (4, 1),  -- 'get-products'
    (5, 1),  -- 'get-single-product'
    (11, 1), -- 'purchase-product'
    (12, 1), -- 'purchase-product-success'
    (13, 1), -- 'purchase-product-failed'
    (14, 1), -- 'product-purchases'
    (15, 1); -- 'subscribe'


INSERT INTO products (
    name, 
    price, 
    description, 
    is_subscription_product, 
    stock_availability, 
    status_id
) VALUES (
    'App Subscription',
    10,
    'This is a default subscription product.',
    TRUE,
    NULL,
    1
);