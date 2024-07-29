# Laundry Manager Flask

## Description

Laundry Manager is a web application developed with Flask that serves as a dashboard for managing orders and clients in a laundry business. Admin users can log in, register new clients or orders, view pending orders, and finalize completed ones.

The web application connects to a Flask API that performs CRUD operations on a PostgreSQL database.

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/giulianoh92/laundry_manager_flask.git
    cd laundry_manager_flask
    ```

2. Create and activate a virtual environment (optional but recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install the necessary dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Set up the PostgreSQL database. Run the provided SQL scripts in the `sql` folder to create the tables and populate the database.

5. Configure the `config.py` file with your PostgreSQL database details.

## Usage

1. Run the Flask application:

    ```bash
    python src/app.py
    ```

2. Open your browser and navigate to `http://127.0.0.1:5000` to access the dashboard.