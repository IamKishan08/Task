from flask import Blueprint, jsonify, request  # type: ignore
from .models import Schedule, Master
from . import db
from datetime import datetime

schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/add_schedule', methods=['POST'])
def add_schedule():
    data = request.get_json()
    
    # Fetch all masters that match the customer_name, group, and location
    masters = Master.query.filter_by(
        customer_name=data['customer_name'],
        group=data['group'],
        location=data['location']
    ).all()

    # Debugging: Check how many masters were found
    if not masters:
        return jsonify({"message": "No matching servers found."}), 404

    schedules_created = []

    # Create schedules for all matching masters
    for master in masters:
        new_schedule = Schedule(
            customer_name=data['customer_name'],
            group=data['group'],
            location=data['location'],
            schedule_date=data['schedule_date'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            status=data['status'],
            master_id=master.id  # Assign the master_id for each matching master
        )
        db.session.add(new_schedule)
        schedules_created.append(new_schedule.id)  # Keep track of created schedule IDs

    db.session.commit()

    return jsonify({
        "message": "Schedules added successfully!",
        "schedules_created": schedules_created
    }), 201


# Get all schedule records
@schedule_bp.route('/get_schedules', methods=['GET'])
def get_schedules():
    owner_name = request.args.get('owner_name')
    location = request.args.get('location')
    group = request.args.get('group')

    # Base query to retrieve schedules
    query = db.session.query(Schedule).join(Master, Schedule.master_id == Master.id)

    # Filter by owner_name if provided
    if owner_name:
        query = query.filter(Master.customer_name == owner_name)

    # Filter by location if provided
    if location:
        query = query.filter(Master.location == location)

    # Filter by group if provided
    if group:
        query = query.filter(Master.group == group)

    # Execute the query and get results
    schedules = query.all()

    # Format the response data
    results = []
    for schedule in schedules:
        master = schedule.master  # get the related master record
        results.append({
            "schedule_id": schedule.id,
            "schedule_date": schedule.schedule_date.isoformat(),  # Convert to string
            "start_time": schedule.start_time.strftime('%H:%M:%S'),  # Convert to string
            "end_time": schedule.end_time.strftime('%H:%M:%S'),      # Convert to string
            "status": schedule.status,
            "owner_name": master.customer_name,
            "server_details": {
                "host_name": master.host_name,
                "public_ip_address": master.public_ip_address,
                "private_ip_address": master.private_ip_address,
                "operating_system": master.operating_system,
                "location": master.location,
                "group": master.group
            }
        })

    return jsonify(schedules=results), 200

# Update only the status of a schedule record by ID
@schedule_bp.route('/update_status/<int:id>', methods=['PUT'])
def update_schedule_status(id):
    schedule = Schedule.query.get_or_404(id)
    data = request.get_json()

    # Only allow updating the status field
    if 'status' in data:
        schedule.status = data['status']
    else:
        return jsonify({"error": "Status field is required."}), 400

    db.session.commit()
    return jsonify({"message": "Schedule status updated successfully!"})

# Delete a schedule record by ID
@schedule_bp.route('/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted successfully!"})
