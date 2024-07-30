from flask import Blueprint, jsonify
from flask_login import login_required

# Models
from models.ItemModel import ItemModel

main = Blueprint('items_blueprint',__name__)

@main.route('/', methods=['GET'])
@login_required
def get_items():
    items = ItemModel.get_items()
    return jsonify(items)