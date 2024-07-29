from flask import Blueprint, jsonify, request
from flask_login import login_required
from queries import CompQueries

# Entities
from models.entities.Client import Client

# Models
from models.ClientModel import ClientModel

main = Blueprint('clients_blueprint',__name__)

@main.route('/', methods=['GET'])
@login_required
def get_clients():
    query = request.args.get('query')
    if query:
        clients = CompQueries.get_clients_matching(query)
    else:
        clients = ClientModel.get_clients()
    return jsonify(clients)

@main.route('/<id>', methods=['GET'])
@login_required
def get_client(id):
    try:
        client = ClientModel.get_client(id)
        if client is None:
            return jsonify({'message': 'Client not found'}), 404
        return jsonify(client)
    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    
@main.route('/register', methods=['POST'])
@login_required
def register_client():
    try:
        client_data = request.json
        client = Client('', client_data['full_name'], client_data['address'], client_data['phone_number'])
        ClientModel.add_client(client)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500