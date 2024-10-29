import React from 'react';
import './assests/css/popupForm.css';

const PopupForm = ({ isOpen, onClose, formFields, onSubmit }) => {
  if (!isOpen) return null;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {};
    formFields.fields.forEach((field) => {
      let value = e.target[field.name].value;
      
      // Add ':00' for start_time and end_time if the time format is 'HH:MM'
      if (field.name === 'start_time' || field.name === 'end_time') {
        if (value.length === 5) { // If format is 'HH:MM'
          value += ':00';
        }
      }
      
      formData[field.name] = value;
    });
  
    onSubmit(formData);
  };
  

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{formFields.title}</h2>
        <form onSubmit={handleSubmit} className="scrollable-form">
          {formFields.fields.map((field, index) => (
            <div key={index} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === 'select' ? (
                <select name={field.name} id={field.name} defaultValue={field.defaultValue} required>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  defaultValue={field.defaultValue}
                  required
                />
              )}
            </div>
          ))}
          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default PopupForm;
