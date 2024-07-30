# Laundry Manager Flask

## Description

Laundry Manager is a web application developed with Flask that serves as a control panel for managing orders and clients in a laundry business. Admin users can log in, register new clients and orders, view pending orders, finalize completed ones, and maintain a comprehensive order history. The application interfaces with a Flask API, which performs CRUD operations on a PostgreSQL database.

## Features

- Register new clients
- Register new orders
- View and manage pending orders
- Finalize completed orders
- Maintain a comprehensive history of orders

## Technologies

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Flask (Python)
- **Database:** PostgreSQL

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/giulianoh92/laundry_manager_flask.git
    cd laundry_manager_flask
    ```

2. **Create and activate a virtual environment (optional but recommended):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. **Install the necessary dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Set up the PostgreSQL database:**

    Run the provided SQL scripts in the `sql` folder to create the tables and populate the database:

    ```bash
    psql -U your_postgres_user -d your_database -f sql/laundry_ddl.sql
    psql -U your_postgres_user -d your_database -f sql/laundry_dml.sql
    ```

5. **Configure the `.env` file:**

    Create a `.env` file in the root directory and add your PostgreSQL database details:

    ```plaintext
    SECRET_KEY=your_secret_key
    PGSQL_HOST=localhost
    PGSQL_USER=your_user
    PGSQL_PASSWORD=your_password
    PGSQL_DATABASE=your_database
    ```

## Usage

1. **Run the Flask application:**

    ```bash
    python src/app.py
    ```

2. **Access the dashboard:**

    Open your browser and navigate to `http://127.0.0.1:5000` to access the web application.

## API Documentation

### Endpoints

#### Clients

- `GET /api/clients`
  - **Description:** Retrieve a list of all clients.
  - **Query Parameters:** Optional filters.
  
- `GET /api/clients/<id>`
  - **Description:** Retrieve a specific client by their ID.
  
- `POST /api/clients/register`
  - **Description:** Register a new client.
  - **Request Body:** JSON with client details.

#### Orders

- `GET /api/orders`
  - **Description:** Retrieve a list of all orders.
  
- `GET /api/orders/<id>`
  - **Description:** Retrieve a specific order by its ID.
  
- `DELETE /api/orders/delete/<id>`
  - **Description:** Delete a specific order by its ID.
  
- `POST /api/orders/finish/<id>`
  - **Description:** Mark an order as finished.
  
- `GET /api/orders/details/<id>`
  - **Description:** Retrieve details of a specific order by its ID.
  
- `POST /api/orders/register_order`
  - **Description:** Register a new order.
  - **Request Body:** JSON with order details.

#### Lookup Tables

- `GET /api/items`
  - **Description:** Retrieve a list of all items.
  
- `GET /api/services`
  - **Description:** Retrieve a list of all services.
  
- `GET /api/colors`
  - **Description:** Retrieve a list of all colors.
  
- `GET /api/patterns`
  - **Description:** Retrieve a list of all patterns.
  
- `GET /api/sizes`
  - **Description:** Retrieve a list of all sizes.

## Database Schema

The database schema is defined in the `sql/laundry_ddl.sql` file. It includes the following tables:

- **Clients:** Stores client information.
- **Orders:** Stores order information.
- **Items, Services, Colors, Patterns, Sizes:** Lookup tables for various attributes.

Refer to the `sql/laundry_ddl.sql` file for detailed table definitions and relationships.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.
