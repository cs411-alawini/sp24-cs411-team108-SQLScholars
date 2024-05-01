// InputModal.jsx
import React, { useState } from "react";

const InputModal = ({ isOpen, onClose, fields, onSave }) => {
  // Initialize state dynamically based on fields provided
  const [inputData, setInputData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(inputData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={inputData[field.name]}
              onChange={handleChange}
              style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
          </div>
        ))}
        <div>
          <button type="submit" style={{ marginRight: "10px" }}>
            Save
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputModal;
