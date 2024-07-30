-- Insert test data into the users table
INSERT INTO users (password, username) VALUES
    ('scrypt:32768:8:1$KdiBA5P300GTYHNW$c1d005e6b436b79d8c03961824207c668fae670c57d7b9db811ed8c31b037f72a66f205f232abd2542005b545b5021dce8726665593632ab087df79d0418fb13',
    'admin'); -- password is currently 'admin', so as the user

-- Insert test data into the clients table
INSERT INTO clients (full_name, address, phone_number) VALUES
    ('Carlos López', 'Main St 789', '555123456'),
    ('Maria Fernandez', 'Oak Ave 456', '555654321'),
    ('Juan Pérez', 'Elm St 123', '555789012'),
    ('Ana Gómez', 'Pine Rd 234', '555345678'),
    ('Luis Martínez', 'Maple Dr 345', '555876543'),
    ('Isabel Rodríguez', 'Cedar Blvd 567', '555987654'),
    ('Roberto Díaz', 'Spruce St 678', '555234567'),
    ('Sofia Morales', 'Birch Ln 789', '555678901'),
    ('Jorge Sánchez', 'Cherry St 890', '555456789'),
    ('Laura Jiménez', 'Willow Rd 901', '555321654'),
    ('Emma Johnson', 'King St 101', '555246810'),
    ('Liam O’Connor', 'Queen St 202', '555135792'),
    ('Hiroshi Tanaka', 'Shinjuku 303', '555246813'),
    ('Yuki Nakamura', 'Shibuya 404', '555357924'),
    ('Ananya Sharma', 'MG Road 505', '555468135'),
    ('Raj Patel', 'Connaught Place 606', '555579246'),
    ('Chen Wei', 'Wangfujing 707', '555680357'),
    ('Li Mei', 'Nanjing Rd 808', '555791468'),
    ('Omar Al-Farsi', 'Al-Madina 909', '555802579'),
    ('Fatima Al-Sheikh', 'Al-Riyadh 1010', '555913680'),
    ('Elena Rossi', 'Via Roma 111', '555024691'),
    ('Giuseppe Bianchi', 'Piazza Navona 121', '555135680');

-- Insert test data into the statuses table
INSERT INTO statuses (description) VALUES
    ('Pending'),
    ('Finished'),
    ('Canceled');

-- Insert test data into the colors table
INSERT INTO colors (name) VALUES
    ('Red'),
    ('Green'),
    ('Blue'),
    ('Yellow'),
    ('Orange'),
    ('Purple'),
    ('Pink'),
    ('Brown'),
    ('Black'),
    ('White'),
    ('Gray'),
    ('Cyan'),
    ('Magenta'),
    ('Lime'),
    ('Indigo'),
    ('Violet'),
    ('Teal'),
    ('Olive'),
    ('Maroon'),
    ('Navy'),
    ('Silver');


-- Insert test data into the patterns table
INSERT INTO patterns (name) VALUES
    ('Solid'),
    ('Stripes'),
    ('Plaid'),
    ('Checkered'),
    ('Polka Dot'),
    ('Houndstooth'),
    ('Chevron'),
    ('Paisley'),
    ('Floral'),
    ('Geometric'),
    ('Animal Print'),
    ('Camouflage'),
    ('Tie-Dye'),
    ('Argyle'),
    ('Abstract'),
    ('Dotted'),
    ('Horizontal Stripes'),
    ('Vertical Stripes'),
    ('Brocade'),
    ('Gingham');

-- Insert test data into the sizes table
INSERT INTO sizes (name, cost_multiplier) VALUES
    ('Extra Small', 0.8),
    ('Small', 0.9),
    ('Medium', 1.0),
    ('Large', 1.3),
    ('Extra Large', 1.6),
    ('XXL', 2.0);

-- Insert test data into the items table
INSERT INTO items (description, cost) VALUES
    ('Sheet Set', 40.0),
    ('Pillow', 12.0),
    ('Curtains', 35.0),
    ('Table Runner', 18.0),
    ('Bedspread', 60.0),
    ('Blanket Set', 45.0),
    ('Shower Curtain', 22.0),
    ('Laundry Bag', 8.0),
    ('Towel Set', 25.0),
    ('Rug', 30.0),
    ('Tablecloth', 15.0),
    ('Comforter', 70.0),
    ('Bed Skirt', 20.0),
    ('Duvet Cover', 50.0),
    ('Throw Pillow', 10.0),
    ('Bed Pillow', 15.0),
    ('Napkins', 12.0),
    ('Dish Towel', 5.0),
    ('Washcloth', 4.0),
    ('Apron', 15.0);

-- Insert test data into the services table
INSERT INTO services (name, description, cost) VALUES
    ('Dry Cleaning', 'Specialized cleaning for delicate fabrics.', 50.0),
    ('Steam Cleaning', 'Deep cleaning using steam for heavy-duty stains.', 60.0),
    ('Delicate Wash', 'Gentle wash for delicate fabrics.', 20.0),
    ('Heavy Duty Wash', 'Intensive wash for heavily soiled items.', 30.0),
    ('Bleaching', 'Bleaching service for white items.', 12.0),
    ('Odor Removal', 'Service to remove unpleasant odors from clothes.', 15.0),
    ('Eco Wash', 'Environmentally friendly wash using eco-friendly detergents.', 25.0),
    ('Stain Treatment', 'Special treatment for stubborn stains.', 18.0),
    ('Pressing', 'Ironing and pressing to remove wrinkles.', 10.0),
    ('Waterproofing', 'Service to make items water-resistant.', 40.0),
    ('Mending', 'Repairs for small tears and damage.', 22.0),
    ('Fabric Refresh', 'Service to refresh fabric without washing.', 28.0),
    ('Size Adjustment', 'Adjusting the size of garments.', 35.0),
    ('Alterations', 'Alterations for fit and design changes.', 45.0),
    ('Laundry Pickup & Delivery', 'Convenient pickup and delivery service for laundry.', 15.0);

-- Insert test data into the orders table
INSERT INTO orders (client_id, status_id, creation_date, finish_date) VALUES
    (1, 1, '2024-06-19', NULL),
    (2, 2, '2024-06-20', '2024-06-21'),
    (3, 1, '2024-06-22', NULL),
    (4, 2, '2024-06-23', '2024-06-25'),
    (5, 2, '2024-06-24', '2024-06-26'),
    (6, 1, '2024-06-25', NULL),
    (7, 2, '2024-06-26', '2024-06-27'),
    (8, 3, '2024-06-27', '2024-06-29'),
    (9, 2, '2024-06-28', '2024-06-30'),
    (10, 1, '2024-06-29', NULL);


-- Insert test data into the order_services table
INSERT INTO order_services (order_id, service_id, item_id, main_color_id, other_color_id, pattern_id, size_id, softener, indications) VALUES
    (1, 1, 2, 1, 2, 3, 4, TRUE, 'Handle with care'),
    (1, 3, 3, 1, 2, 1, 2, FALSE, 'Check for colorfastness'),
    (2, 2, 3, 2, 3, 4, 1, FALSE, 'Remove stains before washing'),
    (3, 3, 4, 3, NULL, 5, 2, TRUE, 'Use gentle detergent'),
    (4, 1, 5, 1, 4, 2, 3, FALSE, 'Iron at medium heat'),
    (5, 2, 6, 2, NULL, 1, 4, TRUE, 'Do not bleach'),
    (6, 3, 7, 3, 2, 4, 1, FALSE, 'Dry clean only'),
    (7, 4, 8, 1, 3, 2, 2, TRUE, 'Use fabric softener'),
    (7, 1, 5, 1, NULL, 2, 3, FALSE, 'Iron at medium heat'),
    (8, 1, 1, 2, 4, 3, 3, FALSE, 'Wash with similar colors'),
    (9, 2, 2, 3, NULL, 4, 4, TRUE, 'Avoid direct sunlight'),
    (10, 3, 3, 1, 2, 1, 2, FALSE, 'Check for colorfastness'),
    (9, 1, 2, 1, 2, 3, 4, TRUE, 'Handle with care'),
    (8, 3, 3, 1, 2, 1, 2, FALSE, 'Check for colorfastness'),
    (8, 2, 3, 2, 3, 4, 1, FALSE, 'Remove stains before washing'),
    (7, 3, 4, 3, NULL, 5, 2, TRUE, 'Use gentle detergent'),
    (6, 1, 5, 1, 4, 2, 3, FALSE, 'Iron at medium heat'),
    (5, 2, 6, 2, NULL, 1, 4, TRUE, 'Do not bleach'),
    (6, 3, 7, 3, 2, 4, 1, FALSE, 'Dry clean only'),
    (8, 4, 8, 1, 3, 2, 2, TRUE, 'Use fabric softener'),
    (1, 1, 5, 1, NULL, 2, 3, FALSE, 'Iron at medium heat'),
    (3, 1, 1, 2, 4, 3, 3, FALSE, 'Wash with similar colors'),
    (2, 2, 2, 3, NULL, 4, 4, TRUE, 'Avoid direct sunlight'),
    (1, 3, 3, 1, 2, 1, 2, FALSE, 'Check for colorfastness');