from flask import Blueprint, jsonify, request, render_template

# Entities
from models.entities.Order import Order

# Models
from models.OrderModel import OrderModel

main = Blueprint('orders_blueprint',__name__)

@main.route('/')
def get_orders():
    try:
        orders = OrderModel.get_orders()
        return jsonify(orders)
    except Exception as ex:
        return jsonify({'message': str(ex)}), 500

@main.route('/<id>')
def get_order(id):
    try:
        order = OrderModel.get_order(id)
        if order is None:
            return jsonify({'message': 'Order not found'}), 404
        return jsonify(order)
    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    

@main.route('/add', methods=['POST'])
def add_order():
    try:
        client_id = request.json['client_id']
        status_id = request.json['status_id']
        total_cost = request.json['total_cost']
        creation_date = request.json['creation_date']
        finish_date = request.json['finish_date']

        order = Order("", client_id, status_id, total_cost, creation_date, finish_date)

        affected_rows = OrderModel.add_order(order)

        if affected_rows == 1:
            return jsonify({'message': 'Order added successfully', 'order_id': order.id}), 201
        else:
            return jsonify({'message': 'Error adding order'}), 500

    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    
@main.route('/delete/<id>', methods=['DELETE'])
def delete_order(id):
    try:
        order = Order(id, "", "")

        affected_rows = OrderModel.delete_order(order)

        if affected_rows == 1:
            return jsonify({'message': 'Order added successfully'}), 201
        else:
            return jsonify({'message': 'Error adding order'}), 500

    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    

@main.route('/update/<id>', methods=['PUT'])
def update_order(id):
    try:
        client_id = request.json['client_id']
        status_id = request.json['status_id']
        total_cost = request.json['total_cost']
        creation_date = request.json['creation_date']
        finish_date = request.json['finish_date']

        order = Order(id, client_id, status_id, total_cost, creation_date, finish_date)

        affected_rows = OrderModel.update_order(order)

        if affected_rows == 1:
            return jsonify({'message': 'Order added successfully', 'order_id': order.id}), 201
        else:
            return jsonify({'message': 'Error adding order'}), 404

    except Exception as ex:
        return jsonify({'message': str(ex)}), 500

