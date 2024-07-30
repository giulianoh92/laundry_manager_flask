from flask import Blueprint, jsonify
from flask_login import login_required

# Models
from models.ColorModel import ColorModel

main = Blueprint('colors_blueprint',__name__)

@main.route('/', methods=['GET'])
@login_required
def get_colors():
    colors = ColorModel.get_colors()
    return jsonify(colors)