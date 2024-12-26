import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const Restaurant = ({ onSubmit }) => {
  const [field1, setField1] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ field1 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Restaurant Form</Typography>
      <input
        type="text"
        placeholder="Field 1"
        value={field1}
        onChange={(e) => setField1(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

const Party = ({ onSubmit }) => {
  const [field2, setField2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ field2 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Party Form</Typography>
      <input
        type="text"
        placeholder="Field 2"
        value={field2}
        onChange={(e) => setField2(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

const Trampoline = ({ onSubmit }) => {
  const [field3, setField3] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ field3 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Trampoline Form</Typography>
      <input
        type="text"
        placeholder="Field 3"
        value={field3}
        onChange={(e) => setField3(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

const Toys = ({ onSubmit }) => {
  const [field4, setField4] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ field4 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Toys Form</Typography>
      <input
        type="text"
        placeholder="Field 4"
        value={field4}
        onChange={(e) => setField4(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

const DataForms = () => {
  const [activeForm, setActiveForm] = useState(1);

  const handleFormSubmit = async (data) => {
    try {
      const response = await axios.post('endpoint', data);
      console.log('Data submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case 1:
        return <Restaurant onSubmit={handleFormSubmit} />;
      case 2:
        return <Party onSubmit={handleFormSubmit} />;
      case 3:
        return <Trampoline onSubmit={handleFormSubmit} />;
      case 4:
        return <Toys onSubmit={handleFormSubmit} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Button variant="contained" onClick={() => setActiveForm(1)}>Restaurant</Button>
        <Button variant="contained" onClick={() => setActiveForm(2)}>Party</Button>
        <Button variant="contained" onClick={() => setActiveForm(3)}>Trampoline</Button>
        <Button variant="contained" onClick={() => setActiveForm(4)}>Toys</Button>
      </Box>
      <Box sx={{ border: '1px solid #ccc', padding: 2 }}>
        <motion.div
          key={activeForm} 
          initial={{ x: 100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: -100, opacity: 0 }} 
          transition={{ duration: 0.5 }} 
        >
          {renderForm()}
        </motion.div>
      </Box>
    </Box>
  );
};

export default DataForms;