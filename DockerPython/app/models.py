from . import db
from datetime import date, time

class Master(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_name = db.Column(db.String(100), nullable=False)
    operating_system = db.Column(db.String(100), nullable=False)
    public_ip_address = db.Column(db.String(45), nullable=False)
    private_ip_address = db.Column(db.String(45), nullable=False)
    schedule_type = db.Column(db.String(50), nullable=False)
    schedule_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)  # Changed schedule_time to start_time
    end_time = db.Column(db.Time, nullable=False)  # Added end_time
    group = db.Column(db.String(100), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    schedules = db.relationship('Schedule', backref='master', lazy=True, cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'host_name': self.host_name,
            'operating_system': self.operating_system,
            'public_ip_address': self.public_ip_address,
            'private_ip_address': self.private_ip_address,
            'schedule_type': self.schedule_type,
            'schedule_date': self.schedule_date.isoformat(),  # Serialize date
            'start_time': self.start_time.strftime('%H:%M:%S'),  # Serialize start_time
            'end_time': self.end_time.strftime('%H:%M:%S'),  # Serialize end_time
            'group': self.group,
            'customer_name': self.customer_name,
            'location': self.location
        }

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    group = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    schedule_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)  # Changed time_from to start_time
    end_time = db.Column(db.Time, nullable=False)  # Changed time_to to end_time
    status = db.Column(db.Enum('Scheduled', 'Completed', 'Not Patched', name="status_enum"), default='Scheduled')
    master_id = db.Column(db.Integer, db.ForeignKey('master.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'group': self.group,
            'location': self.location,
            'schedule_date': self.schedule_date.isoformat(),  # Serialize date
            'start_time': self.start_time.strftime('%H:%M:%S'),  # Serialize start_time
            'end_time': self.end_time.strftime('%H:%M:%S'),  # Serialize end_time
            'status': self.status,
            'master_id': self.master_id
        }
