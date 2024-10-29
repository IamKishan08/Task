import React, { useState, useEffect } from 'react';
import PopupForm from './popupForm';
import './assests/css/scheduleTask.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../api'; 

function ScheduleTask() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('schedule/get_schedules');
        const schedules = response.data.schedules;

        if (Array.isArray(schedules)) {
          const formattedTasks = schedules.map((task) => ({
            id: task.schedule_id,
            customer_name: task.owner_name,
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

  const closePopup = () => {
    setEditTask(null);
    setPopupOpen(false);
  };

  const handleSubmit = async (formData) => {
    const newTask = {
      customer_name: formData.customer_name,
      group: formData.group,
      location: formData.location,
      schedule_date: formData.schedule_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status,
    };

    try {
      if (editTask) {
       
        await axios.put(`schedule/update_status/${editTask.id}`, newTask);
        setTasks(tasks.map((task) => (task.id === editTask.id ? { ...task, ...newTask, id: editTask.id } : task)));
      } else {
        const response = await axios.post('schedule/add_schedule', newTask);
        setTasks([...tasks, { ...newTask, id: response.data.id }]);
      }
    } catch (error) {
     
       if (error.response && error.response.status === 404) {
            alert("The provided data does not match existing master data. Please ensure the master data is correct.");
        } else {
     
              console.error('Error saving task:', error.response ? error.response.data : error.message);
              alert("An error occurred while saving the task. Please try again.");
    }
    } finally {
      closePopup();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`schedule/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formFields = {
    title: editTask ? 'Edit Task' : 'Add Task',
    fields: editTask
      ? [
          
          {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: ['Scheduled', 'Not patched', 'Completed'],
            defaultValue: editTask?.status || 'Scheduled',
          },
        ]
      : [
          
          { label: 'Customer Name', name: 'customer_name', type: 'text', defaultValue: '' },
          { label: 'Group', name: 'group', type: 'text', defaultValue: '' },
          { label: 'Location', name: 'location', type: 'text', defaultValue: '' },
          { label: 'Schedule Date', name: 'schedule_date', type: 'date', defaultValue: '' },
          { label: 'Start Time', name: 'start_time', type: 'time', defaultValue: '' },
          { label: 'End Time', name: 'end_time', type: 'time', defaultValue: '' },
          {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: ['Scheduled', 'Not patched', 'Completed'],
            defaultValue: 'Scheduled',
          },
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
