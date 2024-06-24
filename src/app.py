from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models.OrderModel import OrderModel
from models.ClientModel import ClientModel
from models.UserModel import UserModel
from models.entities.User import User
from queries import CompQueries
from config import config

# Routes
from routes import Order

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
        if logged_user and logged_user.password:
            login_user(logged_user)
            return redirect(url_for('home'))
        else:
            flash("Invalid credentials.")
            return render_template('auth/login.html')
    return render_template('auth/login.html')

@app.route('/logout')
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

@app.route('/details/<id>', methods=['GET'])
@login_required
def order_details(id):
    details = CompQueries.get_order_details(id)
    return details

@app.route('/finish/<int:id>', methods=['POST'])
@login_required
def finish(id):
    print('py',id)
    try:
        result = CompQueries.finish(id)
        print(result)
        return jsonify({'success': True, 'finish_date': result}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


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
    csrf.init_app(app)
    app.register_error_handler(401, status_401)
    app.register_error_handler(404, status_404)

    # Error handlers
    app.register_error_handler(404, page_not_found)

    app.run(debug=True)
