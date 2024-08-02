-- Drop views if they exist
DROP VIEW IF EXISTS order_wnames_view;
DROP VIEW IF EXISTS order_details_view;

-- Drop tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS order_services CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS patterns CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE
);

CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    phone_number VARCHAR(20)
);

CREATE TABLE statuses (
    status_id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);

CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE patterns (
    pattern_id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE sizes (
    size_id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    cost_multiplier FLOAT NOT NULL
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    cost FLOAT NOT NULL
);

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost FLOAT NOT NULL
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    status_id INT NOT NULL,
    creation_date DATE NOT NULL,
    finish_date DATE,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (status_id) REFERENCES statuses(status_id)
);

CREATE TABLE order_services (
    os_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    service_id INT NOT NULL,
    item_id INT NOT NULL,
    main_color_id INT,
    other_color_id INT,
    pattern_id INT,
    size_id INT,
    softener BOOLEAN,
    indications TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY (main_color_id) REFERENCES colors(color_id),
    FOREIGN KEY (other_color_id) REFERENCES colors(color_id),
    FOREIGN KEY (pattern_id) REFERENCES patterns(pattern_id),
    FOREIGN KEY (size_id) REFERENCES sizes(size_id)
);

-- Create views
CREATE VIEW order_details_view AS
SELECT
    i.description AS item_name,
    c1.name AS color1_name,
    c2.name AS color2_name,
    p.name AS pattern_name,
    si.name AS size_name,
    s.name AS service_name,
    os.softener AS softener,
    ROUND(((i.cost + s.cost) * si.cost_multiplier)::numeric, 2) AS cost,
    os.order_id AS order_id
FROM
    order_services os
INNER JOIN
    items i ON i.item_id = os.item_id
LEFT JOIN
    colors AS c1 ON c1.color_id = os.main_color_id
LEFT JOIN
    colors AS c2 ON c2.color_id = os.other_color_id
LEFT JOIN
    patterns p ON p.pattern_id = os.pattern_id
INNER JOIN
    sizes si ON si.size_id = os.size_id
INNER JOIN
    services s ON s.service_id = os.service_id;

CREATE VIEW order_wnames_view AS
SELECT 
    o.order_id AS id, 
    c.full_name AS client_name, 
    st.description AS status, 
    c.address AS address, 
    ROUND(SUM((it.cost + s.cost) * si.cost_multiplier)::numeric, 2) AS total_cost,
    TO_CHAR(o.creation_date, 'DD/MM/YYYY') AS c_date, 
    TO_CHAR(o.finish_date, 'DD/MM/YYYY') AS f_date
FROM 
    orders o
INNER JOIN 
    clients c ON o.client_id = c.client_id
INNER JOIN 
    statuses st ON o.status_id = st.status_id
INNER JOIN 
    order_services os ON o.order_id = os.order_id
INNER JOIN 
    items it ON os.item_id = it.item_id
INNER JOIN 
    services s ON os.service_id = s.service_id
INNER JOIN 
    sizes si ON os.size_id = si.size_id
GROUP BY 
    id, 
    client_name, 
    status, 
    address, 
    c_date, 
    f_date,
    st.status_id
ORDER BY
    st.status_id, id DESC;

-- Grant permissions
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

-- Grant sequence permissions
GRANT USAGE, SELECT ON SEQUENCE order_services_os_id_seq TO laundry_admin;
GRANT USAGE, SELECT ON SEQUENCE orders_order_id_seq TO laundry_admin;
GRANT USAGE, SELECT ON SEQUENCE clients_client_id_seq TO laundry_admin;

-- Grant view permissions
GRANT SELECT ON order_wnames_view TO laundry_admin;
GRANT SELECT ON order_details_view TO laundry_admin;
