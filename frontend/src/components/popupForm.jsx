// src/components/popupForm.jsx
import React from 'react';
import './assests/css/popupForm.css';

const PopupForm = ({ isOpen, onClose, formFields, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{formFields.title}</h2>
        <form onSubmit={onSubmit} className="scrollable-form">
          {formFields.fields.map((field, index) => (
            <div key={index} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                defaultValue={formFields.defaultValues ? formFields.defaultValues[field.name] : ''}
                required
              />
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
