from flask import Blueprint, jsonify, request
from flask_login import login_required
from queries import CompQueries

# Entities
from models.entities.Order import Order

# Models
from models.OrderModel import OrderModel

main = Blueprint('orders_blueprint',__name__)

@main.route('/')
@login_required
def get_orders():
    try:
        orders = OrderModel.get_orders()
        return jsonify(orders)
    except Exception as ex:
        return jsonify({'message': str(ex)}), 500

@main.route('/<id>')
@login_required
def get_order(id):
    try:
        order = OrderModel.get_order(id)
        if order is None:
            return jsonify({'message': 'Order not found'}), 404
        return jsonify(order)
    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    
    
@main.route('/delete/<id>', methods=['DELETE'])
@login_required
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
    
@main.route('/finish/<int:id>', methods=['POST'])
@login_required
def finish(id):
    try:
        result = OrderModel.finish(id)
        return jsonify({'success': True, 'finish_date': result}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    
@main.route('/details/<id>', methods=['GET'])
@login_required
def order_details(id):
    details = CompQueries.get_order_details(id)
    return details
    
@main.route('/register_order', methods=['POST'])
@login_required
def register_order():
    try:
        order = request.json
        client_id = order['client_id']
        items = []
        for item in order['items']:
            items.append({
                'item_id':item['item_id'],
                'service_id':item['service_id'],
                'maincolor_id':item['maincolor_id'],
                'othercolor_id':item['othercolor_id'],
                'pattern_id':item['pattern_id'],
                'size_id':item['size_id'],
                'softener':item['softener'],
                'indications':item['indications']
            })
        CompQueries.register_order(client_id, items)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500