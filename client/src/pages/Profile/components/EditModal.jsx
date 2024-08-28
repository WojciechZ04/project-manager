import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import "../../../components/Modal.css";

export default function EditModal({ isOpen, onClose, editType, editValue, onSave }) {
	const [value, setValue] = useState('');

	const handleSave = () => {
		onSave(editType, value);
    setValue('');
		onClose();
	  };

  return (
	<Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-name"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal">
        <h2>Edit {editType}</h2>
        <TextField
          value={editValue}
          type={editType === 'password' ? 'password' : 'text'}
          onChange={(e) => setValue(e.target.value)}
        />
        <br />
        <div className="modal-buttons">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Box>
    </Modal>
  );
}