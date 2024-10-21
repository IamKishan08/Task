import React, { useState, useEffect } from 'react';
import PopupForm from './popupForm';
import './assests/css/scheduleTask.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../api'; // Import Axios instance to make API calls

function ScheduleTask() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('schedule/get_schedules');
        const schedules = response.data.schedules; // Accessing the 'schedules' array

        // Check if schedules is an array
        if (Array.isArray(schedules)) {
          const formattedTasks = schedules.map((task) => ({
            id: task.schedule_id, // Use schedule_id as the unique id
            customer_name: task.owner_name, // Map the properties accordingly
            group: task.server_details.group,
            location: task.server_details.location,
            schedule_date: task.schedule_date,
            start_time: task.start_time,
            end_time: task.end_time,
            status: task.status,
          }));
          setTasks(formattedTasks);
        } else {
          console.error('Expected an array from API, but got:', schedules);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const openPopup = (task = null) => {
    setEditTask(task);
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = {
      customer_name: formData.get('customer_name'), // Always get from formData for new task
      group: formData.get('group'),
      location: formData.get('location'),
      schedule_date: formData.get('schedule_date'),
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time'),
      status: formData.get('status'),
    };
  
    try {
      if (editTask) {
        // Update existing task
        await axios.put(`schedule/update_status/${editTask.id}`, newTask);
        setTasks(tasks.map((task) => (task.id === editTask.id ? { ...task, ...newTask } : task)));
      } else {
        // Create new task
        const response = await axios.post('schedule/add_schedule', newTask);
        setTasks([...tasks, { ...newTask, id: response.data.id }]);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      closePopup();
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`schedule/${id}`); // Adjust API endpoint
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formFields = {
    title: editTask ? 'Edit Task' : 'Add Task',
    fields: editTask
      ? [
          // Only show the status field when editing
          { label: 'Status', name: 'status', type: 'select', options: ['Scheduled', 'Not patched', 'Completed'], defaultValue: editTask?.status || 'Scheduled' },
        ]
      : [
          // Show all fields when adding a new task
          { label: 'Customer Name', name: 'customer_name', type: 'text', defaultValue: '' },
          { label: 'Group', name: 'group', type: 'text', defaultValue: '' },
          { label: 'Location', name: 'location', type: 'text', defaultValue: '' },
          { label: 'Schedule Date', name: 'schedule_date', type: 'date', defaultValue: '' },
          { label: 'Start Time', name: 'start_time', type: 'time', defaultValue: '' },
          { label: 'End Time', name: 'end_time', type: 'time', defaultValue: '' },
          { label: 'Status', name: 'status', type: 'select', options: ['Scheduled', 'Not patched', 'Completed'], defaultValue: 'Scheduled' },
        ],
  };
  

  return (
    <div className="schedule-task-content">
      <button className="add-task-btn" onClick={() => openPopup()}>
        Add Task
      </button>
      <table className="task-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Group</th>
            <th>Location</th>
            <th>Schedule Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.customer_name}</td>
              <td>{task.group}</td>
              <td>{task.location}</td>
              <td>{task.schedule_date}</td>
              <td>{task.start_time}</td>
              <td>{task.end_time}</td>
              <td>{task.status}</td>
              <td>
                <EditIcon
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  onClick={() => openPopup(task)}
                />
                <DeleteIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(task.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PopupForm
        isOpen={isPopupOpen}
        onClose={closePopup}
        formFields={formFields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default ScheduleTask;
