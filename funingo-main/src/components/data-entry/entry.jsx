import "./entry.css"
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { apiUrl } from '../../constants';
import { Box, Button, Typography } from '@mui/material';
import Snackbarcomponent from "../snackbar/snackbar";


const Restaurant = ({ onSubmit }) => {
  const [totalSales, setTotalSales] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState('');
  const [numberOfOrders, setNumberOfOrders] = useState('');
  const [averageOrderValue, setAverageOrderValue] = useState('');
  const [totalDiscounts, setTotalDiscounts] = useState('');
  const [totalRefunds, setTotalRefunds] = useState('');
  const [mostPopularItem, setMostPopularItem] = useState('');
  const [customerFeedbackCount, setCustomerFeedbackCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      totalSales,
      totalAmountReceived,
      numberOfOrders,
      averageOrderValue,
      totalDiscounts,
      totalRefunds,
      mostPopularItem,
      customerFeedbackCount,
    });
  };

  return (
    <form id="res" onSubmit={handleSubmit}>
      <Typography variant="h6">Restaurant Form</Typography>
      <input
        type="number"
        placeholder="Total Sales Per Day"
        value={totalSales}
        onChange={(e) => setTotalSales(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Amount Received"
        value={totalAmountReceived}
        onChange={(e) => setTotalAmountReceived(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Orders"
        value={numberOfOrders}
        onChange={(e) => setNumberOfOrders(e.target.value)}
      />
      <input
        type="number"
        placeholder="Average Order Value"
        value={averageOrderValue}
        onChange={(e) => setAverageOrderValue(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Discounts Given"
        value={totalDiscounts}
        onChange={(e) => setTotalDiscounts(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Refunds Processed"
        value={totalRefunds}
        onChange={(e) => setTotalRefunds(e.target.value)}
      />
      <input
        type="text"
        placeholder="Most Popular Item"
        value={mostPopularItem}
        onChange={(e) => setMostPopularItem(e.target.value)}
      />
      <input
        type="number"
        placeholder="Customer Feedback Count"
        value={customerFeedbackCount}
        onChange={(e) => setCustomerFeedbackCount(e.target.value)}
      />
      <Button id="Btn" type="submit">Submit</Button>
    </form>
  );
};

const Party = ({ onSubmit }) => {
  const [totalPartyPackagesSold, setTotalPartyPackagesSold] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState('');
  const [numberOfPartiesHeld, setNumberOfPartiesHeld] = useState('');
  const [averagePackagePrice, setAveragePackagePrice] = useState('');
  const [totalDiscounts, setTotalDiscounts] = useState('');
  const [totalRefunds, setTotalRefunds] = useState('');
  const [mostPopularPackage, setMostPopularPackage] = useState('');
  const [customerFeedbackCount, setCustomerFeedbackCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      totalPartyPackagesSold,
      totalAmountReceived,
      numberOfPartiesHeld,
      averagePackagePrice,
      totalDiscounts,
      totalRefunds,
      mostPopularPackage,
      customerFeedbackCount,
    });
  };


  return (
    <form id="party" onSubmit={handleSubmit}>
      <Typography variant="h6">Party Form</Typography>
      <input
        type="number"
        placeholder="Total Party Packages Sold"
        value={totalPartyPackagesSold}
        onChange={(e) => setTotalPartyPackagesSold(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Amount Received"
        value={totalAmountReceived}
        onChange={(e) => setTotalAmountReceived(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Parties Held"
        value={numberOfPartiesHeld}
        onChange={(e) => setNumberOfPartiesHeld(e.target.value)}
      />
       <input
        type="number"
        placeholder="Average Package Price"
        value={averagePackagePrice}
        onChange={(e) => setAveragePackagePrice(e.target.value)}
      />
        <input
        type="number"
        placeholder="Total Discounts"
        value={totalDiscounts}
        onChange={(e) => setTotalDiscounts(e.target.value)}
      />
        <input
        type="number"
        placeholder="Total Refunds"
        value={totalRefunds}
        onChange={(e) => setTotalRefunds(e.target.value)}
      />
        <input
        type="text"
        placeholder="Most Popular Package"
        value={mostPopularPackage}
        onChange={(e) => setMostPopularPackage(e.target.value)}
      />
        <input
        type="number"
        placeholder="Total Refunds"
        value={customerFeedbackCount}
        onChange={(e) => setCustomerFeedbackCount(e.target.value)}
      />
      <Button id="Btn" type="submit">Submit</Button>
    </form>
  );
};

const Trampoline = ({ onSubmit }) => {
  const [totalTicketsSold, setTotalTicketsSold] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState('');
  const [numberOfSessionsHeld, setNumberOfSessionsHeld] = useState('');
  const [averageTicketPrice, setAverageTicketPrice] = useState('');
  const [totalDiscounts, setTotalDiscounts] = useState('');
  const [totalRefunds, setTotalRefunds] = useState('');
  const [mostPopularSession, setMostPopularSession] = useState('');
  const [customerFeedbackCount, setCustomerFeedbackCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      totalTicketsSold,
      totalAmountReceived,
      numberOfSessionsHeld,
      averageTicketPrice,
      totalDiscounts,
      totalRefunds,
      mostPopularSession,
      customerFeedbackCount,
    });
  };

  return (
    <form id="temp" onSubmit={handleSubmit}>
      <Typography variant="h6">Trampoline Form</Typography>
      <input
        type="number"
        placeholder="Total Tickets Sold"
        value={totalTicketsSold}
        onChange={(e) => setTotalTicketsSold(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Amount Received"
        value={totalAmountReceived}
        onChange={(e) => setTotalAmountReceived(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Sessions Held"
        value={numberOfSessionsHeld}
        onChange={(e) => setNumberOfSessionsHeld(e.target.value)}
      />
      <input
        type="number"
        placeholder="Average Ticket Price"
        value={averageTicketPrice}
        onChange={(e) => setAverageTicketPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Discounts Given"
        value={totalDiscounts}
        onChange={(e) => setTotalDiscounts(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Refunds Processed"
        value={totalRefunds}
        onChange={(e) => setTotalRefunds(e.target.value)}
      />
      <input
        type="text"
        placeholder="Most Popular Session"
        value={mostPopularSession}
        onChange={(e) => setMostPopularSession(e.target.value)}
      />
      <input
        type="number"
        placeholder="Customer Feedback Count"
        value={customerFeedbackCount}
        onChange={(e) => setCustomerFeedbackCount(e.target.value)}
      />
      <Button id="Btn" type="submit">Submit</Button>
    </form>
  );
};

const Toys = ({ onSubmit }) => {
  const [totalToysSold, setTotalToysSold] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState('');
  const [numberOfToysAvailable, setNumberOfToysAvailable] = useState('');
  const [averageToyPrice, setAverageToyPrice] = useState('');
  const [totalDiscounts, setTotalDiscounts] = useState('');
  const [totalRefunds, setTotalRefunds] = useState('');
  const [mostPopularToy, setMostPopularToy] = useState('');
  const [customerFeedbackCount, setCustomerFeedbackCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      totalToysSold,
      totalAmountReceived,
      numberOfToysAvailable,
      averageToyPrice,
      totalDiscounts,
      totalRefunds,
      mostPopularToy,
      customerFeedbackCount,
    });
  };

  return (
    <form id="toys" onSubmit={handleSubmit}>
      <Typography variant="h6">Toys Form</Typography>
      <input
        type="number"
        placeholder="Total Toys Sold"
        value={totalToysSold}
        onChange={(e) => setTotalToysSold(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Amount Received"
        value={totalAmountReceived}
        onChange={(e) => setTotalAmountReceived(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Toys Available"
        value={numberOfToysAvailable}
        onChange={(e) => setNumberOfToysAvailable(e.target.value)}
      />
      <input
        type="number"
        placeholder="Average Toy Price"
        value={averageToyPrice}
        onChange={(e) => setAverageToyPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Discounts Given"
        value={totalDiscounts}
        onChange={(e) => setTotalDiscounts(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Refunds Processed"
        value={totalRefunds}
        onChange={(e) => setTotalRefunds(e.target.value)}
      />
      <input
        type="text"
        placeholder="Most Popular Toy"
        value={mostPopularToy}
        onChange={(e) => setMostPopularToy(e.target.value)}
      />
      <input
        type="number"
        placeholder="Customer Feedback Count"
        value={customerFeedbackCount}
        onChange={(e) => setCustomerFeedbackCount(e.target.value)}
      />
      <Button id="Btn" type="submit">Submit</Button>
    </form>
  );
};

const DataForms = () => 
{
  const [activeForm, setActiveForm] = useState(1);
   const handleFormSubmit = async (data) => {   
    try {
      let endpoint = '';
  
      switch (activeForm) {
        case 1: 
          endpoint = '/data/restaurant';
          break;
        case 2: 
          endpoint = '/data/party'; 
          document.getElementById("party").reset()
          break;
        case 3: 
          endpoint = '/data/trampoline'; 
          document.getElementById("temp").reset()
          break;
        case 4: 
          endpoint = '/data/toys';
          document.getElementById("toys").reset() 
          break;
        default:
          throw new Error('Invalid form selection');
      }
  
      const response = await axios.post(`${apiUrl}${endpoint}`, data);
      alert("Data Sumbitted")
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
