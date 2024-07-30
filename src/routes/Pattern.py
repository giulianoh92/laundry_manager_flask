from flask import Blueprint, jsonify
from flask_login import login_required

# Models
from models.PatternModel import PatternModel

main = Blueprint('patterns_blueprint',__name__)

@main.route('/', methods=['GET'])
@login_required
def get_patterns():
    patterns = PatternModel.get_patterns()
    return jsonify(patterns)