from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models.ClientModel import ClientModel
from models.UserModel import UserModel
from models.ItemModel import ItemModel
from models.OrderModel import OrderModel
from models.ServiceModel import ServiceModel
from models.ColorModel import ColorModel
from models.SizeModel import SizeModel
from models.PatternModel import PatternModel
from models.entities.User import User
from models.entities.Client import Client
from models.entities.Order import Order
from queries import CompQueries
from config import config

# Routes
from routes import Order, Client

app = Flask(__name__)
csrf = CSRFProtect()
login_manager_app = LoginManager(app)

@login_manager_app.user_loader
def load_user(user_id):
    return UserModel.get_by_id(user_id)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User(0, request.form['password'], request.form['username'])
        logged_user = UserModel.login(user)
        if ((logged_user and logged_user.password)):
            login_user(logged_user)
            return redirect(url_for('home'))
        else:
            flash("Invalid credentials.")
            return render_template('auth/login.html')
    return render_template('auth/login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/home')
@login_required
def home():
    return render_template('home.html')

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


@app.route('/get_items', methods=['GET'])
@login_required
def get_items():
    items = ItemModel.get_items()
    return jsonify(items)

@app.route('/get_services', methods=['GET'])
@login_required
def get_services():
    services = ServiceModel.get_services()
    return jsonify(services)

@app.route('/get_colors', methods=['GET'])
@login_required
def get_colors():
    colors = ColorModel.get_colors()
    return jsonify(colors)

@app.route('/get_patterns', methods=['GET'])
@login_required
def get_patterns():
    patterns = PatternModel.get_patterns()
    return jsonify(patterns)

@app.route('/get_sizes', methods=['GET'])
@login_required
def get_sizes():
    sizes = SizeModel.get_sizes()
    return jsonify(sizes)


def page_not_found(error):
    return "<h1>Not found</h1>", 404

def status_401(error):
    return redirect(url_for('login'))

def status_404(error):
    return "<h1>Página no encontrada</h1>", 404

if __name__ == '__main__':
    app.config.from_object(config['development'])

    # Blueprints
    app.register_blueprint(Order.main, url_prefix='/api/orders')
    app.register_blueprint(Client.main, url_prefix='/api/clients')

    csrf.init_app(app)
    app.register_error_handler(401, status_401)
    app.register_error_handler(404, status_404)

    # Error handlers
    app.register_error_handler(404, page_not_found)

    app.run(debug=True)
