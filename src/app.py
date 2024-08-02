from flask import Flask, render_template, request, redirect, url_for, flash
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required
from models.ClientModel import ClientModel
from models.UserModel import UserModel
from models.entities.User import User
from queries import CompQueries
from config import config
import logging
from logging.handlers import RotatingFileHandler

# Routes
from routes import Order, Client, Item, Service, Color, Pattern, Size

app = Flask(__name__)
csrf = CSRFProtect()
login_manager_app = LoginManager(app)

# Configure session security
app.config.update(
    SESSION_COOKIE_SECURE=True,  # Ensures cookies are sent over HTTPS only
    SESSION_COOKIE_HTTPONLY=True, # Prevents JavaScript from accessing cookies
    SESSION_COOKIE_SAMESITE='Strict'  # Helps prevent CSRF attacks
)

# Set up logging
handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

# Flask-Login configuration
@login_manager_app.user_loader
def load_user(user_id):
    return UserModel.get_by_id(user_id)

# Routes
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User(0, request.form['password'], request.form['username'])
        logged_user = UserModel.login(user)
        if logged_user and logged_user.password:
            login_user(logged_user)
            return redirect(url_for('orders'))
        else:
            flash("Invalid credentials.")
            return render_template('auth/login.html')
    return render_template('auth/login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register')
@login_required
def register():
    return render_template('register.html')

@app.route('/orders')
@login_required
def orders():
    orders = CompQueries.get_orders_wnames()
    return render_template('orders.html', orders=orders)

@app.route('/clients')
@login_required
def clients():
    clients = ClientModel.get_clients()
    return render_template('clients.html', clients=clients)

# Error Handlers
@app.errorhandler(401)
def unauthorized(error):
    """Redirect to login page for unauthorized access"""
    return redirect(url_for('login'))

@app.errorhandler(404)
def page_not_found(error):
    """Render a 404 error page for non-existent routes"""
    return "<h1>Page not found</h1>", 404

if __name__ == '__main__':
    # Load configuration
    app.config.from_object(config['development'])

    # Register Blueprints
    app.register_blueprint(Order.main, url_prefix='/api/orders')
    app.register_blueprint(Client.main, url_prefix='/api/clients')
    app.register_blueprint(Item.main, url_prefix='/api/items')
    app.register_blueprint(Service.main, url_prefix='/api/services')
    app.register_blueprint(Color.main, url_prefix='/api/colors')
    app.register_blueprint(Pattern.main, url_prefix='/api/patterns')
    app.register_blueprint(Size.main, url_prefix='/api/sizes')

    # Initialize CSRF protection
    csrf.init_app(app)

    # Run the application
    app.run(debug=False)  # Set debug to False in production
