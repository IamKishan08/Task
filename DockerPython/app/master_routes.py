from flask import Blueprint, jsonify, request  # type: ignore
from .models import Master, db
from datetime import datetime

master_bp = Blueprint('master', __name__)

# Create a new master record
@master_bp.route('/add_master', methods=['POST'])
def add_master():
    data = request.get_json()

    # Convert schedule_date, start_time, and end_time to proper types
    schedule_date = datetime.strptime(data['schedule_date'], '%Y-%m-%d').date()
    start_time = datetime.strptime(data['start_time'], '%H:%M:%S').time()
    end_time = datetime.strptime(data['end_time'], '%H:%M:%S').time()

    new_master = Master(
        host_name=data['host_name'],
        operating_system=data['operating_system'],
        public_ip_address=data['public_ip_address'],
        private_ip_address=data['private_ip_address'],
        schedule_type=data['schedule_type'],
        schedule_date=schedule_date,
        start_time=start_time,  # Changed schedule_time to start_time
        end_time=end_time,  # Added end_time
        group=data['group'],
        customer_name=data['customer_name'],
        location=data['location']
    )
    db.session.add(new_master)
    db.session.commit()
    return jsonify({"message": "Master data added successfully!"}), 201

# Get all master records
@master_bp.route('/get_masters', methods=['GET'])
def get_masters():
    masters = Master.query.all()
    return jsonify([{
        'id': master.id,
        'host_name': master.host_name,
        'operating_system': master.operating_system,
        'public_ip_address': master.public_ip_address,
        'private_ip_address': master.private_ip_address,
        'schedule_type': master.schedule_type,
        'schedule_date': master.schedule_date.isoformat(),
        'start_time': master.start_time.strftime('%H:%M:%S'),  # Changed schedule_time to start_time
        'end_time': master.end_time.strftime('%H:%M:%S'),  # Added end_time
        'group': master.group,
        'customer_name': master.customer_name,
        'location': master.location
    } for master in masters])

# Get a specific master record by ID
@master_bp.route('/get_master/<int:id>', methods=['GET'])
def get_master(id):
    master = Master.query.get_or_404(id)
    return jsonify({
        'id': master.id,
        'host_name': master.host_name,
        'operating_system': master.operating_system,
        'public_ip_address': master.public_ip_address,
        'private_ip_address': master.private_ip_address,
        'schedule_type': master.schedule_type,
        'schedule_date': master.schedule_date.isoformat(),
        'start_time': master.start_time.strftime('%H:%M:%S'),  # Changed schedule_time to start_time
        'end_time': master.end_time.strftime('%H:%M:%S'),  # Added end_time
        'group': master.group,
        'customer_name': master.customer_name,
        'location': master.location
    })

# Update a master record by ID
@master_bp.route('/update_master/<int:id>', methods=['PUT'])
def update_master(id):
    master = Master.query.get_or_404(id)
    data = request.get_json()

    # Convert schedule_date, start_time, and end_time to proper types
    schedule_date = datetime.strptime(data['schedule_date'], '%Y-%m-%d').date()
    start_time = datetime.strptime(data['start_time'], '%H:%M:%S').time()
    end_time = datetime.strptime(data['end_time'], '%H:%M:%S').time()

    master.host_name = data['host_name']
    master.operating_system = data['operating_system']
    master.public_ip_address = data['public_ip_address']
    master.private_ip_address = data['private_ip_address']
    master.schedule_type = data['schedule_type']
    master.schedule_date = schedule_date
    master.start_time = start_time  # Changed schedule_time to start_time
    master.end_time = end_time  # Added end_time
    master.group = data['group']
    master.customer_name = data['customer_name']
    master.location = data['location']

    db.session.commit()
    return jsonify({"message": "Master data updated successfully!"})

# Delete a master record by ID
@master_bp.route('/delete_master/<int:id>', methods=['DELETE'])
def delete_master(id):
    master = Master.query.get_or_404(id)
    db.session.delete(master)
    db.session.commit()
    return jsonify({"message": "Master data deleted successfully!"})
