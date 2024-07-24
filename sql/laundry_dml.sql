-- Insertar datos de prueba en la tabla users
INSERT INTO users (password, username, email) VALUES
    ('scrypt:32768:8:1$nPVHTKrmQKQ9OBXv$d051618daf956ea6d27675172ab229b83935c99c39afa15b4e78ea71f0fbfdfb03d92fb756c302a53a261a2b6731e211b2a07bb115c38c225b9b28e415fc4283',
	'Estela Mabel', 'estelamabelhillebrand@gmail.com'),
    ('','dev','');

-- Insertar datos de prueba en la tabla clients
INSERT INTO clients (full_name, address, phone_number) VALUES
    ('Juan Pérez', 'Calle Principal 123', '123456789'),
    ('María Gómez', 'Avenida Central 456', '987654321');

-- Insertar datos de prueba en la tabla statuses
INSERT INTO statuses (description) VALUES
    ('En proceso'),
    ('Completado'),
    ('Cancelado');

-- Insertar datos de prueba en la tabla colors
INSERT INTO colors (name) VALUES
    ('Rojo'),
    ('Verde'),
    ('Azul'),
    ('Amarillo'),
    ('Negro'),
    ('Blanco');
-- Insertar datos de prueba en la tabla patterns
INSERT INTO patterns (name) VALUES
    ('Cuadros'),
    ('Rayas'),
    ('Floreado'),
	('Figuras'),
    ('Liso');

-- Insertar datos de prueba en la tabla sizes
INSERT INTO sizes (name, cost_multiplier) VALUES
    ('Pequeño', 1.0),
    ('Mediano', 1.2),
    ('Grande', 1.5);

-- Insertar datos de prueba en la tabla items
INSERT INTO items (description, cost) VALUES
    ('Acolchado', 30.0),
    ('Frazada', 25.0),
    ('Alfombra', 50.0),
    ('x24 Ropa', 40.0),
    ('x48 Ropa', 65.0),
    ('Toalla', 15.0),
    ('Fundas de Almohada', 10.0),
    ('Mantel de Mesa', 20.0);

-- Insertar datos de prueba en la tabla services
INSERT INTO services (name, description, cost) VALUES
    ('Lavado Normal', 'Lavado estándar para prendas de uso diario.', 15.0),
    ('Lavado Doble', 'Lavado intensivo para prendas con suciedad moderada.', 25.0),
    ('Lavado Antimanchas', 'Lavado con tratamiento especial para manchas difíciles.', 35.0),
    ('Lavado Especial', 'Lavado personalizado según indicaciones específicas del cliente.', 40.0),
    ('Secado Rápido', 'Secado rápido para prendas que necesitan ser utilizadas rápidamente.', 10.0),
    ('Planchado', 'Servicio de planchado para prendas que requieren un acabado perfecto.', 20.0),
    ('Doblado', 'Doblado profesional para prendas que necesitan ser guardadas de forma organizada.', 15.0),
    ('Planchado a Vapor', 'Planchado con vapor para prendas delicadas y arrugas difíciles.', 25.0);

-- Insertar datos de prueba en la tabla orders
INSERT INTO orders (client_id, status_id, creation_date, finish_date) VALUES
    (1, 1, '2024-06-15', '2024-06-17'),
    (2, 2, '2024-06-16', NULL),
    (1, 1, '2024-06-16', '2024-06-18'),
    (1, 2, '2024-06-17', '2024-06-19'),
    (2, 1, '2024-06-18', NULL);

-- Insertar datos de prueba en la tabla order_services
INSERT INTO order_services (order_id, service_id, item_id, main_color_id, other_color_id, pattern_id, size_id, softener, indications) VALUES
    (1, 1, 1, 1, 2, 1, 1, TRUE, 'Sin instrucciones especiales'),
    (1, 2, 2, 2, 3, 2, 2, FALSE, 'Doblar como indica'),
    (2, 3, 3, 3, 4, 3, 3, TRUE, 'Planchar cuidadosamente'),
    (3, 1, 1, 1, 2, 1, 1, FALSE, 'Lavar en agua fría'),
    (4, 2, 4, 2, 3, 3, 2, TRUE, 'Secado urgente'),
    (5, 3, 2, 1, 4, 2, 3, FALSE, 'Planchado adicional'),
    (1, 4, 5, 3, 5, 4, 1, TRUE, 'Secado a baja temperatura'),
    (2, 5, 6, 4, 6, 1, 2, FALSE, 'Doblar cuidadosamente'),
    (3, 3, 7, 1, 2, 2, 3, TRUE, 'Lavar a mano'),
    (4, 1, 8, 2, 3, 5, 1, FALSE, 'Secado en secadora'),
    (5, 4, 1, 4, 5, 1, 2, TRUE, 'Planchar con vapor');