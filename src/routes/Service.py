from flask import Blueprint, jsonify
from flask_login import login_required

# Models
from models.ServiceModel import ServiceModel

main = Blueprint('services_blueprint',__name__)

@main.route('/', methods=['GET'])
@login_required
def get_services():
    services = ServiceModel.get_services()
    return jsonify(services)