import React, { useState, useEffect } from 'react';
import axios from '../api'; // Use the Axios instance
import PopupForm from './popupForm';
import './assests/css/master.css';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Master() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // To track the row being edited
  const [tableData, setTableData] = useState([]);

  // Fetch all master records when the component loads
  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      const response = await axios.get('/master/get_masters');
      setTableData(response.data); // Assuming the API returns an array of master records
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const openPopup = (row) => {
    setEditingRow(row); // Set row to edit
    setPopupOpen(true);
  };

  const closePopup = () => {
    setEditingRow(null); // Clear editing state
    setPopupOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingRow) {
        // Update existing master
        await axios.put(`/master/update_master/${editingRow.id}`, formData);
      } else {
        // Add a new master
        await axios.post('/master/add_master', formData);
      }
      fetchMasters(); // Refresh the table data
      closePopup();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/master/delete_master/${id}`);
      fetchMasters(); // Refresh the table data
    } catch (error) {
      console.error('Error deleting master data:', error);
    }
  };

  const formFields = {
    title: editingRow ? 'Edit Server' : 'Add Server',
    fields: [
      { label: 'Customer Name', name: 'customer_name', type: 'text' },
      { label: 'Host Name', name: 'host_name', type: 'text' },
      { label: 'Operating System', name: 'operating_system', type: 'text' },
      { label: 'Public IP Address', name: 'public_ip_address', type: 'text' },
      { label: 'Private IP Address', name: 'private_ip_address', type: 'text' },
      { label: 'Schedule Type', name: 'schedule_type', type: 'text' },
      { label: 'Schedule Date', name: 'schedule_date', type: 'date' },
      { label: 'Start Time', name: 'start_time', type: 'time' },
      { label: 'End Time', name: 'end_time', type: 'time' },
      { label: 'Group', name: 'group', type: 'text' },
      { label: 'Location', name: 'location', type: 'text' }, // Add missing Location field
    ],
    defaultValues: editingRow, // Pre-fill form with selected row data if editing
  };

  return (
    <div className="master-content">
      <button className="add-server-btn" onClick={() => openPopup(null)}>
        Add Server
      </button>

      <table className="server-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Host Name</th>
            <th>Operating System</th>
            <th>Public IP Address</th>
            <th>Private IP Address</th>
            <th>Schedule Type</th>
            <th>Schedule Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Group</th>
            <th>Location</th> {/* Add Location column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>{row.customer_name}</td>
              <td>{row.host_name}</td>
              <td>{row.operating_system}</td>
              <td>{row.public_ip_address}</td>
              <td>{row.private_ip_address}</td>
              <td>{row.schedule_type}</td>
              <td>{row.schedule_date}</td>
              <td>{row.start_time}</td>
              <td>{row.end_time}</td>
              <td>{row.group}</td>
              <td>{row.location}</td> {/* Display location */}
              <td>
                <IconButton onClick={() => openPopup(row)} aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.id)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Form */}
      <PopupForm
        isOpen={isPopupOpen}
        onClose={closePopup}
        formFields={formFields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Master;
