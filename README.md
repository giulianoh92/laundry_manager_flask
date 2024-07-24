# Laundry Manager Flask

## Descripción

Laundry Manager es una aplicación web desarrollada con Flask que sirve como un panel de control (dashboard) para la gestión de pedidos y clientes en un negocio de lavandería. Los usuarios administradores pueden iniciar sesión en la página, registrar nuevos clientes o pedidos, visualizar pedidos pendientes y finalizar aquellos que ya han sido completados.

La aplicación web se conecta a una API desarrollada con Flask que realiza operaciones CRUD en una base de datos PostgreSQL.


## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/giulianoh92/laundry_manager_flask.git
    cd laundry_manager_flask
    ```

2. Crea y activa un entorno virtual (opcional pero recomendado):

    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3. Instala las dependencias necesarias:

    ```bash
    pip install -r requirements.txt
    ```

4. Configura la base de datos PostgreSQL. Ejecuta los scripts SQL proporcionados en la carpeta `sql` para crear las tablas y poblar la base de datos.

5. Configura el archivo `config.py` con los detalles de tu base de datos PostgreSQL.

## Uso

1. Ejecuta la aplicación Flask:

    ```bash
    python src/app.py
    ```

2. Abre tu navegador y accede a `http://127.0.0.1:5000` para usar el panel de control.