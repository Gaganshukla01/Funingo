// import React, { useEffect, useState } from 'react';
// import moment from 'moment';
// import {
//   Grid,
//   IconButton,
//   Typography,
//   Box,
//   Button,
//   TextField,
//   Dialog
// } from '@mui/material';
// import { apiUrl } from '../../../constants';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// const GetQRTickets = () => {
//   const [query, setQuery] = useState('');
//   const [phoneNo, setPhoneNo] = useState('');
//   const [allTickets, setAllTickets] = useState([]);
//   const [qrTickets, setQrTickets] = useState([]);
//   const [error, setError] = useState(null);
//   const [error1, setError1] = useState(null);
//   const { token } = useSelector(state => state.userSlice);
//   const [current, setCurrent] = useState(0);

//   const { search } = useLocation();
//   const params = new URLSearchParams(search);

//   const handleGenerateQR = async query => {
//     try {
//       setError(null);
//       setAllTickets([]);
//       let data = query.toUpperCase();
//       if (query?.length === 10) data = '+91-' + query;
//       const resp = await axios.get(`${apiUrl}/ticket/get-qr-tickets`, {
//         params: {
//           query: data
//         },
//         headers: {
//           token
//         }
//       });
//       setQrTickets(resp.data.data);
//     } catch (err) {
//       setError(err.response.data);
//     }
//   };

//   const getAllTickets = async phone => {
//     try {
//       setError1(null);
//       const resp = await axios.get(`${apiUrl}/ticket/get-all-tickets`, {
//         params: {
//           phone_no: encodeURI('+91-' + phone)
//         },
//         headers: {
//           token
//         }
//       });
//       setAllTickets(resp.data.tickets);
//     } catch (err) {
//       setError1(err.response.data);
//     }
//   };

//   const onNext = () => {
//     setCurrent(curr => Math.min(qrTickets.length - 1, curr + 1));
//   };

//   const onPrev = () => {
//     setCurrent(curr => Math.max(0, curr - 1));
//   };

//   useEffect(() => {
//     setQuery(params.get('tid') || '');
//   }, []);

//   return (
//     <Grid
//       minHeight={'50vh'}
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column'
//       }}
//     >
//       <Grid
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center'
//         }}
//         p='20px'
//       >
//         <Typography
//           fontWeight={'600'}
//           fontSize={'24px'}
//           sx={{ color: '#2c5cc4' }}
//         >
//           Ticket Id or Phone Number
//         </Typography>
//         <TextField
//           value={query}
//           onChange={e => {
//             setQuery(e.target.value);
//             setQrTickets([]);
//           }}
//           sx={{
//             mb: '20px'
//           }}
//           placeholder='Enter ticket id or phone number'
//         />
//         {error?.error && (
//           <Typography sx={{ color: 'red' }} mb='5px'>
//             {error?.error}
//           </Typography>
//         )}
//         <Button variant='contained' onClick={() => handleGenerateQR(query)}>
//           Get QR Ticket
//         </Button>
//       </Grid>
//       <Grid
//         mb='20px'
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center'
//         }}
//         p='20px'
//       >
//         <Typography
//           fontWeight={'600'}
//           fontSize={'24px'}
//           sx={{ color: '#2c5cc4' }}
//         >
//           Phone Number
//         </Typography>
//         <TextField
//           value={phoneNo}
//           onChange={e => {
//             setPhoneNo(e.target.value);
//             setAllTickets([]);
//           }}
//           sx={{
//             mb: '20px'
//           }}
//           placeholder='Enter phone number'
//         />
//         {error1?.error && (
//           <Typography sx={{ color: 'red' }} mb='5px'>
//             {error1?.error}
//           </Typography>
//         )}
//         <Button variant='contained' onClick={() => getAllTickets(phoneNo)}>
//           Get All Tickets
//         </Button>
//       </Grid>
//       <Dialog
//         open={qrTickets.length}
//         onClose={() => setQrTickets([])}
//         PaperProps={{
//           sx: {
//             margin: { xs: '10px', md: '20px' },
//             width: { xs: 'calc(100vw - 30px)', sm: 'auto' }
//           }
//         }}
//       >
//         <Grid p='20px' width={'100%'}>
//           <Grid
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '30px'
//             }}
//           >
//             <Grid display={'flex'} gap='20px' alignItems={'center'}>
//               <img
//                 src={qrTickets?.[current]?.qr}
//                 alt='qr-code'
//                 width='150px'
//                 height='150px'
//               />
//               <Grid>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px'
//                   }}
//                 >
//                   <Typography>Ticket Id:</Typography>
//                   <Typography fontWeight={'600'} fontSize={'16px'}>
//                     {qrTickets?.[current]?.ticketDetails.short_id}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px'
//                   }}
//                 >
//                   <Typography>Name:</Typography>
//                   <Typography fontWeight={'600'} fontSize={'16px'}>
//                     {qrTickets?.[current]?.ticketDetails.person_name}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexDirection: 'column'
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       textDecoration: 'underline'
//                     }}
//                   >
//                     Flags
//                   </Typography>
//                   <Typography fontWeight={'600'} fontSize={'16px'}>
//                     Red:&nbsp;{qrTickets?.[current]?.ticketDetails.red}
//                   </Typography>
//                   <Typography fontWeight={'600'} fontSize={'16px'}>
//                     Green:&nbsp;{qrTickets?.[current]?.ticketDetails.green}
//                   </Typography>
//                   <Typography fontWeight={'600'} fontSize={'16px'}>
//                     Yellow:&nbsp;{qrTickets?.[current]?.ticketDetails.yellow}
//                   </Typography>
//                   <Typography fontWeight={'600'} fontSize={'16px'}>
//                     Golden:&nbsp;{qrTickets?.[current]?.ticketDetails.golden}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//             <Grid
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center'
//               }}
//             >
//               <IconButton onClick={onPrev}>
//                 <NavigateBeforeIcon />
//               </IconButton>
//               <Grid
//                 sx={{
//                   display: 'flex',
//                   gap: '2px',
//                   alignItems: 'flex-end'
//                 }}
//               >
//                 <Typography fontWeight={'600'} fontSize={'18px'}>
//                   {current + 1}
//                 </Typography>
//                 <Typography>/{qrTickets?.length ?? 0}</Typography>
//               </Grid>
//               <IconButton onClick={onNext}>
//                 <NavigateNextIcon />
//               </IconButton>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Dialog>
//       <Dialog open={allTickets.length} onClose={() => setAllTickets([])}>
//         <Grid
//           p='20px'
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '20px',
//             width: '300px'
//           }}
//         >
//           {allTickets.map(ticket => (
//             <Grid key={ticket.short_id}>
//               <Typography>Ticket id: {ticket.short_id}</Typography>
//               <Typography>
//                 Payment Status:{' '}
//                 {ticket.payment_verified ? 'Done' : 'Incomplete'}
//               </Typography>
//               <Typography>
//                 Date: {moment(ticket.fun_date).format('DD-MM-YYYY')}
//               </Typography>
//               <Typography>Total amount: {ticket.total_amount}</Typography>
//               <Typography>Person list:</Typography>
//               <Grid
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: '5px',
//                   mb: '10px'
//                 }}
//               >
//                 {ticket.details.map(person => (
//                   <Grid key={person._id}>
//                     <Typography>Name: {person.person_name}</Typography>
//                     <Typography>Age: {person.age}</Typography>
//                   </Grid>
//                 ))}
//               </Grid>
//               <Button
//                 onClick={() => handleGenerateQR(ticket.short_id)}
//                 variant='contained'
//               >
//                 Get QR Ticket
//               </Button>
//             </Grid>
//           ))}
//         </Grid>
//       </Dialog>
//     </Grid>
//   );
// };

// export default GetQRTickets;

import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Grid,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
} from "@mui/material";
import { apiUrl } from "../../../constants";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const GetQRTickets = () => {
  const [ticketId, setTicketId] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [ticketCount, setTicketCount] = useState(0);
  const [allTickets, setAllTickets] = useState([]);
  const [qrTicketsData, setQrTicketsData] = useState({
    tickets: [],
    total_coins: 0,
  });
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.userSlice);
  const [current, setCurrent] = useState(0);

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const handleGenerateQR = async ({ phone_no, ticket_count, ticket_id }) => {
    try {
      setError(null);
      setAllTickets([]);
      const resp = await axios.get(`${apiUrl}/ticket/get-qr-tickets`, {
        params: {
          phone_no: phone_no ? "+91-" + phone_no : undefined,
          number_of_tickets: ticket_count,
          ticket_id,
        },
        headers: {
          token,
        },
      });
      console.log("response", resp);
      setQrTicketsData({
        total_coins: resp.data.total_coins,
        tickets: resp.data.tickets,
      });
    } catch (err) {
      setError(err.response.data);
    }
  };

  const onNext = () => {
    setCurrent((curr) => Math.min(qrTicketsData.tickets.length - 1, curr + 1));
  };

  const onPrev = () => {
    setCurrent((curr) => Math.max(0, curr - 1));
  };

  useEffect(() => {
    setTicketId(params.get("tid") || "");
  }, []);

  return (
    <Grid
      minHeight={"50vh"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        p="20px"
      >
        <Box>
          <Typography
            fontWeight={"600"}
            fontSize={"24px"}
            sx={{ color: "#2c5cc4" }}
          >
            Ticket Id
          </Typography>
          <TextField
            value={ticketId}
            onChange={(e) => {
              setTicketId(e.target.value);
              setQrTicketsData({ total_coins: 0, tickets: [] });
            }}
            sx={{
              mb: "20px",
            }}
            placeholder="Enter ticket id"
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => handleGenerateQR({ ticket_id: ticketId })}
        >
          Get QR Tickets
        </Button>
      </Grid>
      <Grid
        mb="20px"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        p="20px"
      >
        <Grid
          sx={{
            display: "flex",
            gap: "40px",
          }}
        >
          <Box>
            <Typography
              fontWeight={"600"}
              fontSize={"24px"}
              sx={{ color: "#2c5cc4" }}
            >
              Phone Number
            </Typography>
            <TextField
              value={phoneNo}
              onChange={(e) => {
                setPhoneNo(e.target.value);
                setAllTickets([]);
              }}
              sx={{
                mb: "20px",
              }}
              placeholder="Enter phone number"
            />
          </Box>
          <Box>
            <Typography
              fontWeight={"600"}
              fontSize={"24px"}
              sx={{ color: "#2c5cc4" }}
            >
              Number of tickets
            </Typography>
            <TextField
              value={ticketCount}
              type="number"
              onChange={(e) => {
                setTicketCount(e.target.value);
                setAllTickets([]);
              }}
              fullWidth
              sx={{
                mb: "20px",
              }}
              placeholder="Enter phone number"
            />
          </Box>
        </Grid>
        <Button
          variant="contained"
          onClick={() =>
            handleGenerateQR({ phone_no: phoneNo, ticket_count: ticketCount })
          }
        >
          Get QR Tickets
        </Button>

        {error?.error && (
          <Typography sx={{ color: "red" }} mb="5px">
            {error?.error}
          </Typography>
        )}
      </Grid>
      <Dialog
        open={qrTicketsData.tickets.length}
        onClose={() => setQrTicketsData({ total_coins: 0, tickets: [] })}
        PaperProps={{
          sx: {
            margin: { xs: "10px", md: "20px" },
            width: { xs: "calc(100vw - 30px)", sm: "auto" },
          },
        }}
      >
        <Grid p="20px" width={"100%"}>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <Grid
              display={"flex"}
              gap="20px"
              alignItems={"center"}
              justifyContent={"center"}
            >
              {/* <div> */}
              <Typography sx={{ textAlign: "center", fontWeight: "600" }}>
                {qrTicketsData.tickets?.[current]?.short_id}
              </Typography>
              {/* <img
                  src={qrTicketsData.tickets?.[current]?.qr}
                  alt="qr-code"
                  width="150px"
                  height="150px"
                /> */}
              {/* </div> */}
              {/* <Typography>Total Coins: {qrTicketsData.total_coins}</Typography> */}
            </Grid>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton onClick={onPrev}>
                <NavigateBeforeIcon />
              </IconButton>
              <Grid
                sx={{
                  display: "flex",
                  gap: "2px",
                  alignItems: "flex-end",
                }}
              >
                <Typography fontWeight={"600"} fontSize={"18px"}>
                  {current + 1}
                </Typography>
                <Typography>/{qrTicketsData.tickets?.length ?? 0}</Typography>
              </Grid>
              <IconButton onClick={onNext}>
                <NavigateNextIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
      {/* <Dialog open={allTickets.length} onClose={() => setAllTickets([])}>
        <Grid
          p="20px"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "300px",
          }}
        >
          {allTickets.map((ticket) => (
            <Grid key={ticket.short_id}>
              <Typography>Ticket id: {ticket.short_id}</Typography>
              <Typography>
                Payment Status:{" "}
                {ticket.payment_verified ? "Done" : "Incomplete"}
              </Typography>
              <Typography>
                Date: {moment(ticket.fun_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography>Total amount: {ticket.total_amount}</Typography>
              <Typography>Person list:</Typography>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  mb: "10px",
                }}
              >
                {ticket.details.map((person) => (
                  <Grid key={person._id}>
                    <Typography>Name: {person.person_name}</Typography>
                    <Typography>Age: {person.age}</Typography>
                  </Grid>
                ))}
              </Grid>
              <Button
                onClick={() => handleGenerateQR(ticket.user.phone_no)}
                variant="contained"
              >
                Get QR Ticket
              </Button>
            </Grid>
          ))}
        </Grid>
      </Dialog> */}
    </Grid>
  );
};

export default GetQRTickets;
