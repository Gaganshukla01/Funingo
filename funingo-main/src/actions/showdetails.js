// import axios from 'axios';
// import { apiUrl } from '../constants';
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { useEffect, useState } from 'react';


// const Showdetails = () => {
// const [Ticket,setTicket]=useState([]);

// useEffect(()=>{
//    axios.get(`${apiUrl}/getDetails`)
//    .then(Ticket=>{console.log("success fetching ticket");setTicket(Ticket.data)})
//    .catch(err=>console.log("error fetching ticket details",err))
// },[])

// return (
//     <div>
//         <div>
//         <table>
//             <thead>
//                 <tr>
//                     <th>payment_mode</th>
//                     <th>total_amount</th>
//                 </tr>
//             </thead>
//               <tbody>
//                 {
//                     Ticket.map(ticket=>{
//                         return <tr>
//                             <td>{ticket.payment_mode}</td>
//                             <td>{ticket.total_amount}</td>
//                         </tr>
//                     })
//                 }
//               </tbody>
//         </table>
//         </div>
//     </div>
// )
// }

// export default Showdetails;



// import axios from 'axios';
// import { apiUrl } from '../constants';
// import { useEffect, useState } from 'react';
// import './style.css'; // Import the CSS file

// const Showdetails = () => {
//   const [tickets, setTickets] = useState({
//     cash: [],
//     online: [],
//     card: [],
//     razorpay: []
//   });
//   const [totals, setTotals] = useState({
//     cash: 0,
//     online: 0,
//     card: 0,
//     razorpay: 0
//   });
//   const [token,Settoken]=useState([])

//   const gettoken=(receivedtoken)=>{
//    Settoken(receivedtoken);
//   }
  
//   useEffect(() => {
//     axios.get(`${apiUrl}/admin/getDetails`,
//     { headers: { token } })
//       .then(response => {
//         // console.log("success fetching ticket");
//         const tickets = {
//           cash: [],
//           online: [],
//           card: [],
//           razorpay: []
//         };
//         const totals = {
//           cash: 0,
//           online: 0,
//           card: 0,
//           razorpay: 0
//         };

//         response.data.forEach(ticket => {
//           tickets[ticket.payment_mode].push(ticket);
//           totals[ticket.payment_mode] += ticket.total_amount;
//         });

//         setTickets(tickets);
//         setTotals(totals);
//       })
//       .catch(err => console.log("error fetching ticket details", err));
//   }, []);

//   return (
//     <div className="container">
//       <div className="column">
//         <h3>Cash</h3>
//         {tickets.cash.map((ticket, index) => (
//           <div key={index} className="ticket">{ticket.total_amount}</div>
//         ))}
//         <div className="total">Total: {totals.cash}</div>
//       </div>
//       <div className="column">
//         <h3>Online</h3>
//         {tickets.online.map((ticket, index) => (
//           <div key={index} className="ticket">{ticket.total_amount}</div>
//         ))}
//         <div className="total">Total: {totals.online}</div>
//       </div>
//       <div className="column">
//         <h3>Card</h3>
//         {tickets.card.map((ticket, index) => (
//           <div key={index} className="ticket">{ticket.total_amount}</div>
//         ))}
//         <div className="total">Total: {totals.card}</div>
//       </div>
//       <div className="column">
//         <h3>Razorpay</h3>
//         {tickets.razorpay.map((ticket, index) => (
//           <div key={index} className="ticket">{ticket.total_amount}</div>
//         ))}
//         <div className="total">Total: {totals.razorpay}</div>
//       </div>
//     </div>
//   );
// }

// export default Showdetails;



import axios from 'axios';
import { apiUrl } from '../constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.css'; // Import the CSS file

const Showdetails = () => {
  const [tickets, setTickets] = useState({
    cash: [],
    online: [],
    card: [],
    razorpay: []
  });
  const [totals, setTotals] = useState({
    cash: 0,
    online: 0,
    card: 0,
    razorpay: 0
  });

  const token = useSelector((state) => state.userSlice.token);

  useEffect(() => {
    if (token) {
      axios.get(`${apiUrl}/admin/getDetails`, { headers: { token } })
        .then(response => {
          // console.log("success fetching ticket");
          const tickets = {
            cash: [],
            online: [],
            card: [],
            razorpay: []
          };
          const totals = {
            cash: 0,
            online: 0,
            card: 0,
            razorpay: 0
          };

          response.data.forEach(ticket => {
            tickets[ticket.payment_mode].push(ticket);
            totals[ticket.payment_mode] += ticket.total_amount;
          });

          setTickets(tickets);
          setTotals(totals);
        })
        .catch(err => console.log("error fetching ticket details", err));
    }
  }, [token]); // Add token as a dependency to re-fetch data when token changes

  return (
    <div className="container">
      <div className="column">
        <h3>Cash(₹)</h3>
        {tickets.cash.map((ticket, index) => (
          <div key={index} className="ticket">{ticket.total_amount}</div>
        ))}
        <div className="total">Total (₹): {totals.cash}</div>
      </div>
      <div className="column">
        <h3>Online(₹)</h3>
        {tickets.online.map((ticket, index) => (
          <div key={index} className="ticket">{ticket.total_amount}</div>
        ))}
        <div className="total">Total (₹): {totals.online}</div>
      </div>
      <div className="column">
        <h3>Card(₹)</h3>
        {tickets.card.map((ticket, index) => (
          <div key={index} className="ticket">{ticket.total_amount}</div>
        ))}
        <div className="total">Total (₹): {totals.card}</div>
      </div>
      <div className="column">
        <h3>Razorpay(₹)</h3>
        {tickets.razorpay.map((ticket, index) => (
          <div key={index} className="ticket">{ticket.total_amount}</div>
        ))}
        <div className="total">Total (₹): {totals.razorpay}</div>
      </div>
    </div>
  );
}

export default Showdetails;


