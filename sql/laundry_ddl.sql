-- Drop tables if they exist
DROP TABLE IF EXISTS order_services;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS sizes;
DROP TABLE IF EXISTS patterns;
DROP TABLE IF EXISTS colors;
DROP TABLE IF EXISTS statuses;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;

-- Create tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50)
);

CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    full_name VARCHAR(50),
    address VARCHAR(255),
    phone_number VARCHAR(20)
);

CREATE TABLE statuses (
    status_id SERIAL PRIMARY KEY,
    description VARCHAR(50)
);

CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    name VARCHAR(20)
);

CREATE TABLE patterns (
    pattern_id SERIAL PRIMARY KEY,
    name VARCHAR(20)
);

CREATE TABLE sizes (
    size_id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    cost_multiplier FLOAT
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    description VARCHAR(100),
    cost FLOAT
);

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    cost FLOAT
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    client_id INT,
    status_id INT,
    creation_date DATE,
    finish_date DATE,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (status_id) REFERENCES statuses(status_id)
);

CREATE TABLE order_services (
    os_id SERIAL,
    order_id INT,
    service_id INT,
    item_id INT,
    main_color_id INT,
    other_color_id INT,
    pattern_id INT,
    size_id INT,
    softener BOOLEAN,
    indications TEXT,
    PRIMARY KEY (os_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY (main_color_id) REFERENCES colors(color_id),
    FOREIGN KEY (other_color_id) REFERENCES colors(color_id),
    FOREIGN KEY (pattern_id) REFERENCES patterns(pattern_id),
    FOREIGN KEY (size_id) REFERENCES sizes(size_id)
);

DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.' || tbl.tablename || ' TO laundry_admin';
    END LOOP;
END $$;

GRANT USAGE, SELECT ON SEQUENCE order_services_os_id_seq TO laundry_admin;

GRANT USAGE, SELECT ON SEQUENCE orders_order_id_seq TO laundry_admin;

GRANT USAGE, SELECT ON SEQUENCE clients_client_id_seq TO laundry_admin;