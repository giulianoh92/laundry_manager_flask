from flask import Blueprint, jsonify
from flask_login import login_required

# Models
from models.SizeModel import SizeModel

main = Blueprint('sizes_blueprint',__name__)

@main.route('/', methods=['GET'])
@login_required
def get_sizes():
    sizes = SizeModel.get_sizes()
    return jsonify(sizes)