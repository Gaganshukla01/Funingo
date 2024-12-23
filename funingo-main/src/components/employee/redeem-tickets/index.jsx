// import React, { useEffect, useState,useRef  } from 'react';
// import {
//   Grid,
//   IconButton,
//   Typography,
//   Box,
//   Button,
//   TextField,
//   Dialog
// } from '@mui/material';
// import axios from 'axios';
// import { apiUrl } from '../../../constants';
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';

// const RedeemTicket = () => {
//   const [ticketId, setTicketId] = useState('');
//   const { token } = useSelector(state => state.userSlice);
//   const [ticket, setTicket] = useState({});
//   const [flag, setFlag] = useState({
//     red: 0,
//     yellow: 0,
//     green: 0,
//     golden: 0
//   });

//   const [inputValue, setInputValue] = useState(0);

//   const handleInputChange = (event) => {
//      setInputValue(event.target.value);
//   };

//   useEffect(() => {
//     console.log("Updated inputValue:", inputValue);
//   }, [inputValue]);

//   // const handleSubmit = () => {
//   //   console.log('Value entered by the user:', inputValue);
//   //   // You can use the value entered by the user for any further processing
//   // };
//   const { search } = useLocation();
//   const params = new URLSearchParams(search);

//   const [error1, setError1] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleFind = async ticketId => {
//     try {
//       const res = await axios.get(`${apiUrl}/qr/${ticketId}`, {
//         headers: {
//           token
//         }
//       });
//       setTicket(res.data.ticket);
//     } catch (err) {
//       setError1(err.response.data);
//     }
//   };

//   const redeemTicket = async () => {
//     try {
//       console.log("entering here");
//       await setFlag({ red: 0, green: 0, yellow: inputValue, golden: 0 });
//       setError('');
//       setSuccess(false);
//       const res = await axios.post(
//         `${apiUrl}/qr/${ticketId}/redeem`,
//         {
//           ...flag
//         },
//         {
//           headers: {
//             token
//           }
//         }
//       );

//       setSuccess(res.data?.success);
//       handleFind(ticketId);
//     }
//      catch (err) {
//       console.log("ticketId",ticketId);
//       console.log("errorrorrr",err);
//       setError(err.response.data);
//     }
//   };

//   useEffect(() => {
//     console.log("params.get('tid')",params.get('tid'));
//     setTicketId(params.get('tid') || '');
//   }, []);

//   return (
//     <Grid
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '60vh'
//       }}
//     >
//       <Grid
//         mb='20px'
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}
//       >
//         <Typography
//           fontWeight={'600'}
//           fontSize={'24px'}
//           sx={{ color: '#2c5cc4' }}
//         >
//           Ticket Id
//         </Typography>
//         <TextField
//           value={ticketId}
//           onChange={e => {
//             setTicketId(e.target.value);
//             setTicket({});
//           }}
//           sx={{
//             mb: '20px'
//           }}
//           placeholder='Enter ticket id'
//         />
//         {error1.error && (
//           <Typography sx={{ color: 'red' }}>{error1.error}</Typography>
//         )}
//         <Button
//           variant='contained'
//           // sx={{ color: '#25507B' }}
//           onClick={() => handleFind(ticketId)}
//         >
//           Get Ticket Details
//         </Button>
//       </Grid>
//       <Dialog
//         open={ticket._id}
//         onClose={() => {
//           setTicket({});
//           setTicketId('');
//         }}
//       >
//         <Grid
//           p='20px'
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexDirection: 'column'
//           }}
//         >
//           <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             <Typography
//               fontWeight={'600'}
//               fontSize={'24px'}
//               sx={{ color: '#2c5cc4' }}
//               mt='10px'
//             >
//               Available Coins
//             </Typography>
//             {/* <Typography fontSize={'18px'} fontWeight={'600'}>
//               Red:&nbsp;{ticket?.red}
//             </Typography> */}
//             <Typography fontSize={'18px'} fontWeight={'600'}>
//               Coins:&nbsp;{ticket?.yellow}
//             </Typography>
//             {/* <Typography fontSize={'18px'} fontWeight={'600'}>
//               Green:&nbsp;{ticket?.green}
//             </Typography>
//             <Typography fontSize={'18px'} fontWeight={'600'}>
//               Golden:&nbsp;{ticket?.golden} */}
//             {/* </Typography> */}
//           </Grid>
//           <Typography
//             fontWeight={'600'}
//             fontSize={'28px'}
//             sx={{ color: '#2c5cc4' }}
//             mb='20px'
//             px='10px'
//             textAlign={'center'}
//             mt='10px'
//           >
//             {`Redeem a coin for ${ticket?.person_name ?? 'User'}`}
//           </Typography>
//           <Grid
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '20px',
//               mb: '20px',
//               alignItems: 'flex-start',
//               width: '250px'
//             }}
//           >
//             {/* <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '5px'
//               }}
//               onClick={() =>
//                 setFlag({ red: 1, green: 0, yellow: 0, golden: 0 })
//               }
//             >
//               <input type='radio' name='flag' id='red-flag' />
//               <Box
//                 component={'label'}
//                 htmlFor='red-flag'
//                 sx={{ fontSize: '20px' }}
//               >
//                 Red
//               </Box>
//             </Box> */}
//             <Box
//       sx={{
//         display: 'flex',
//         // background:'black',
//         alignItems: 'center',
//         gap: '5px'
//       }}
//       onClick={() =>
//         {
//           console.log("inputValue from onclick",inputValue);
//           setFlag({ red: 0, green: 0, yellow: inputValue, golden: 0 })
//         }
//       }
//     >
//       <input
//         value={inputValue}
//         type='number'
//         name='flag'
//         id='yellow-flag'
//         onChange={handleInputChange}
//       />

//       <Box
//         component={'label'}
//         htmlFor='yellow-flag'
//         sx={{ fontSize: '20px' }}
//       >
//         Coins
//       </Box>
//     </Box>
//             {/* <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '5px'
//               }}
//               onClick={() =>
//                 setFlag({ red: 0, green: 1, yellow: 0, golden: 0 })
//               }
//             >
//               <input type='radio' name='flag' id='greem-flag' />
//               <Box
//                 component={'label'}
//                 htmlFor='greem-flag'
//                 sx={{ fontSize: '20px' }}
//               >
//                 Green
//               </Box>
//             </Box> */}
//             {/* <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '5px'
//               }}
//               onClick={() =>
//                 setFlag({ red: 0, green: 0, yellow: 0, golden: 1 })
//               }
//             >
//               <input type='radio' name='flag' id='golden-flag' />
//               <Box
//                 component={'label'}
//                 htmlFor='golden-flag'
//                 sx={{ fontSize: '20px' }}
//               >
//                 Golden
//               </Box>
//             </Box> */}
//             {error.error && (
//               <Typography sx={{ color: 'red' }}>{error.error}</Typography>
//             )}
//             {success && (
//               <Typography sx={{ color: 'green' }}>
//                 You have successfully redeemed a coin
//               </Typography>
//             )}
//             <Button variant='contained' onClick={redeemTicket} fullWidth>
//               Redeem
//             </Button>
//           </Grid>
//         </Grid>
//       </Dialog>
//     </Grid>
//   );
// };

// export default RedeemTicket;

import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
} from "@mui/material";
import axios from "axios";
import { apiUrl } from "../../../constants";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { yellow } from "@mui/material/colors";
import "./stylees.css";
import Coin from "../../admin/Coin";

const RedeemTicket = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const { token } = useSelector((state) => state.userSlice);
  const [ticket, setTicket] = useState({});
  const [existingFuningoMoney, setExistingFuningoMoney] = useState(0);
  const [flag, setFlag] = useState({
    red: 0,
    yellow: 0,
    green: 0,
    golden: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const [inputValue, setInputValue] = useState(0);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (price) => {
    setInputValue(price);
    setIsDropdownVisible(false);
  };
  const [activityname, setactivityname] = useState("");
  const handleSelection = async (price, name) => {
    setLoading(true);
    setInputValue(price);
    setSelectedColor(price);
    setactivityname(name);
    setIsDropdownVisible(false); // Hide the dropdown options
    await fetchActivityBookings(name);
    setLoading(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    // console.log("Updated inputValue:", inputValue);
  }, [inputValue]);

  // const handleSubmit = () => {
  //   console.log('Value entered by the user:', inputValue);
  //   // You can use the value entered by the user for any further processing
  // };
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [error1, setError1] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activityBookings, setActivityBookings] = useState(0);

  // const handleFind = async (phoneNo) => {
  //   try {
  //     const res = await axios.get(`${apiUrl}/qr/${phoneNo}`, {
  //       headers: {
  //         token,
  //       },
  //     });
  //     setTicket(res.data.ticket);
  //   } catch (err) {
  //     setError1(err.response.data);
  //   }
  // };

  async function fetchFuningoMoney(phoneNo) {
    try {
      const headers = {
        token: token,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${apiUrl}/user/coins/${phoneNo.length === 10 ? "+91-" : ""}${phoneNo}`,
        {
          headers: headers,
        }
      );

      if (!response.data.success) {
        throw new Error("Couldn't Fetch funingo money");
      }
      setExistingFuningoMoney(response.data.funingo_money);
      setDialogOpen(true);
    } catch (error) {
      console.log(error.message, error);
    } finally {
    }
  }

  async function fetchActivityBookings(activityName) {
    try {
      const headers = {
        token: token,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${apiUrl}/activity/${activityName}`, {
        headers: headers,
      });

      if (!response.data.success) {
        throw new Error("Couldn't Fetch activity bookings");
      }
      setActivityBookings(response.data.bookings);
    } catch (error) {
      console.log(error.message, error);
    } finally {
    }
  }

  const redeemTicket = async () => {
    try {
      // console.log("current yellow" , flag.yellow  + "input value coming" , inputValue)
      console.log(inputValue);
      if (existingFuningoMoney - inputValue >= 0) {
        // console.log("current yellow now" , flag.yellow  + "input value " , inputValue)
        setError("");
        setSuccess(false);
        const res = await axios.post(
          `${apiUrl}/ticket/redeem`,
          {
            phone_no: phoneNo.length !== 4 && "+91-" + phoneNo,
            short_id: phoneNo.length === 4 && phoneNo,
            coins: inputValue,
            activity_name: activityname,
          },
          {
            headers: {
              token,
            },
          }
        );

        setSuccess(res.data?.success);
        fetchFuningoMoney(phoneNo);
        setActivityBookings(res.data?.bookings);
      } else {
        alert("Insufficient Funingo Coins");
        return;
      }
    } catch (err) {
      if (existingFuningoMoney - inputValue < 0) {
        alert("Insufficient Funingo Coins");
        return;
      }
      alert("Couldn't redeem coins, please try again!!");
      console.log("phoneNo", phoneNo);
      console.log("errorrorrr", err);
      // setError(err.response.data);
    }
  };

  useEffect(() => {
    console.log("params.get('tid')", params.get("tid"));
    setPhoneNo(params.get("tid") || "");
  }, []);

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Grid
        mb="20px"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
            setTicket({});
          }}
          sx={{
            mb: "20px",
          }}
          placeholder="Enter phone number"
        />
        {error1.error && (
          <Typography sx={{ color: "red" }}>{error1.error}</Typography>
        )}
        <Button
          variant="contained"
          // sx={{ color: '#25507B' }}
          onClick={() => fetchFuningoMoney(phoneNo)}
        >
          Get Ticket Details
        </Button>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setPhoneNo("");
          setExistingFuningoMoney(0);
          setDialogOpen(false);
        }}
      >
        <Grid
          p="20px"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            // width:'30rem',
            height: "30rem",
          }}
        >
          <Grid sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography
              fontWeight={"600"}
              fontSize={"24px"}
              sx={{ color: "#2c5cc4" }}
              mt="10px"
            >
              Available Coins
            </Typography>
            {/* <Typography fontSize={'18px'} fontWeight={'600'}>
              Red:&nbsp;{ticket?.red}
            </Typography> */}
            <Typography fontSize={"18px"} fontWeight={"600"}>
              Coins:&nbsp;{existingFuningoMoney}
            </Typography>
            {/* <Typography fontSize={'18px'} fontWeight={'600'}>
              Green:&nbsp;{ticket?.green}
            </Typography>
            <Typography fontSize={'18px'} fontWeight={'600'}>
              Golden:&nbsp;{ticket?.golden} */}
            {/* </Typography> */}
          </Grid>
          <Typography
            fontWeight={"600"}
            fontSize={"28px"}
            sx={{ color: "#2c5cc4" }}
            mb="20px"
            px="10px"
            textAlign={"center"}
            mt="10px"
          >
            {`Redeem a coin for ${ticket?.person_name ?? "User"}`}
          </Typography>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              mb: "20px",
              alignItems: "flex-start",
              justifyContent: "center",
              width: "250px",
            }}
          >
            {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() =>
                setFlag({ red: 1, green: 0, yellow: 0, golden: 0 })
              }
            >
              <input type='radio' name='flag' id='red-flag' />
              <Box
                component={'label'}
                htmlFor='red-flag'
                sx={{ fontSize: '20px' }}
              >
                Red
              </Box>
            </Box> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
              onClick={() => {
                console.log("inputValue from onclick", inputValue);
                setFlag({ red: 0, green: 0, yellow: inputValue, golden: 0 });
              }}
            >
              {/* <input 
        value={inputValue} 
        type='number' 
        name='flag' 
        id='yellow-flag' 
        onChange={handleInputChange} 
      
      /> */}
              <div className="custom-select">
                <button className="select-button" onClick={toggleDropdown}>
                  {selectedColor ? (
                    <div className="selected-option">
                      <span>{activityname}</span>
                      <div className="funingo-icon-container">
                        <span>{inputValue}</span>
                      </div>
                      <Coin />
                    </div>
                  ) : (
                    <div className="default-option">
                      Select Activity
                      <span className="arrow">&#9662;</span>
                    </div>
                  )}
                </button>
                {isDropdownVisible && (
                  <div className="select-options">
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(2500, "Trampoline Treasure Island")
                      }
                    >
                      <span>Trampoline Treasure Island</span>
                      <div className="funingo-icon-container">
                        <span>2500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(500, "Jump up")}
                    >
                      <span>Jump up</span>
                      <div className="funingo-icon-container">
                        <span>500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(500, "Tunnel Game")}
                    >
                      <span>Tunnel Game</span>
                      <div className="funingo-icon-container">
                        <span>500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(3000, "Paintball Arena")}
                    >
                      <span>Paintball Arena</span>
                      <div className="funingo-icon-container">
                        <span>3000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(1500, "Gel Blast Arena")}
                    >
                      <span>Gel Blast Arena</span>
                      <div className="funingo-icon-container">
                        <span>1500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(2500, "Low Ropes Challenge")
                      }
                    >
                      <span>Low Ropes Challenge</span>
                      <div className="funingo-icon-container">
                        <span>2500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(1500, "High Ropes Haven")}
                    >
                      <span>High Ropes Haven</span>
                      <div className="funingo-icon-container">
                        <span>1500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(3000, "Giant Swing Skybound")
                      }
                    >
                      <span>Giant Swing Skybound</span>
                      <div className="funingo-icon-container">
                        <span>3000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(2500, "Sky Cyclist's Trail")
                      }
                    >
                      <span>Sky Cyclist's Trail</span>
                      <div className="funingo-icon-container">
                        <span>2500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(500, "Commando Climb Net")}
                    >
                      <span>Commando Climb Net</span>
                      <div className="funingo-icon-container">
                        <span>500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(2000, "Peak Rock Climb")}
                    >
                      <span>Peak Rock Climb</span>
                      <div className="funingo-icon-container">
                        <span>2000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(1000, "Meltdown Madness")}
                    >
                      <span>Meltdown Madness</span>
                      <div className="funingo-icon-container">
                        <span>1000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(1000, "Bucking Bull Arena")
                      }
                    >
                      <span>Bucking Bull Arena</span>
                      <div className="funingo-icon-container">
                        <span>1000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(500, "Kid's Obstacle Odyssey")
                      }
                    >
                      <span>Kid's Obstacle Odyssey</span>
                      <div className="funingo-icon-container">
                        <span>500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(500, "Sumo Showdown")}
                    >
                      <span>Sumo Showdown</span>
                      <div className="funingo-icon-container">
                        <span>500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(500, "Archery Alley")}
                    >
                      <span>Archery Alley</span>
                      <div className="funingo-icon-container">
                        <span>500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(2500, "ZipLine")}
                    >
                      <span>ZipLine</span>
                      <div className="funingo-icon-container">
                        <span>2500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(2500, "Wall rappelling")}
                    >
                      <span>Wall rappelling</span>
                      <div className="funingo-icon-container">
                        <span>2500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(1000, "Zorbie Fight")}
                    >
                      <span>Zorbie Fight</span>
                      <div className="funingo-icon-container">
                        <span>1000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(1000, "Shooter's Range")}
                    >
                      <span>Shooter's Range</span>
                      <div className="funingo-icon-container">
                        <span>1000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(1000, "Pedal Power Go Kart")
                      }
                    >
                      <span>Pedal Power Go Kart</span>
                      <div className="funingo-icon-container">
                        <span>1000</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() =>
                        handleSelection(2500, "Rocket Ejector Launch")
                      }
                    >
                      <span>Rocket Ejector Launch</span>
                      <div className="funingo-icon-container">
                        <span>2500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(1500, "Gyro Sphere 360")}
                    >
                      <span>Gyro Sphere 360</span>
                      <div className="funingo-icon-container">
                        <span>1500</span>
                        <Coin />
                      </div>
                    </div>
                    <div
                      className="option"
                      onClick={() => handleSelection(1000, "Cyclone Cycle 360")}
                    >
                      <span>Cyclone Cycle 360</span>
                      <div className="funingo-icon-container">
                        <span>1000</span>
                        <Coin />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* <Box
        component={'label'}
        htmlFor='yellow-flag'
        sx={{ fontSize: '20px' }}
      >
        Coins
      </Box> */}
            </Box>
            {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() =>
                setFlag({ red: 0, green: 1, yellow: 0, golden: 0 })
              }
            >
              <input type='radio' name='flag' id='greem-flag' />
              <Box
                component={'label'}
                htmlFor='greem-flag'
                sx={{ fontSize: '20px' }}
              >
                Green
              </Box>
            </Box> */}
            {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() =>
                setFlag({ red: 0, green: 0, yellow: 0, golden: 1 })
              }
            >
              <input type='radio' name='flag' id='golden-flag' />
              <Box
                component={'label'}
                htmlFor='golden-flag'
                sx={{ fontSize: '20px' }}
              >
                Golden
              </Box>
            </Box> */}
            {error.error && (
              <Typography sx={{ color: "red" }}>{error.error}</Typography>
            )}
            {success && (
              <Typography sx={{ color: "green" }}>
                You have successfully redeemed coins
              </Typography>
            )}
            <Typography>Current booking count: {activityBookings}</Typography>
            <Button variant="contained" onClick={redeemTicket} fullWidth>
              Redeem
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Grid>
  );
};

export default RedeemTicket;

// import React from 'react';
// import './App.css';
// import Coin from '../../admin/Coin'; // Import the coin image
// import backgroundImage1 from './background1.jpg'; // Import the first background image
// import backgroundImage2 from './background2.jpg'; // Import the second background image

// // const Coin = () => (
// //     <img src={coinImage} alt="Coin" className="coin" />
// // );

// function App() {
//     return (
//         <div className="App">
//             <header className="header">
//                 <img src={backgroundImage1} alt="Header Background" className="header-background" />
//                 <h1>Packages</h1>
//             </header>
//             <main>
//                 <section className="packages">
//                     <p>
//                         Purchase fun coins for instant adventure at Funingo Adventure Arena! Redeemable anytime,
//                         these coins are your ticket to non-stop fun. Explore our exciting packages to buy fun coins
//                         and unlock thrilling experiences!
//                     </p>
//                     <div className="package-list">
//                         <div className="package">
//                             <Coin />
//                             <span className="coins">2000</span>
//                             <span className="price">200</span>
//                         </div>
//                         <div className="package">
//                             <Coin />
//                             <span className="coins">5000</span>
//                             <span className="price">480</span>
//                         </div>
//                         <div className="package">
//                             <Coin />
//                             <span className="coins">10000</span>
//                             <span className="price">940</span>
//                         </div>
//                         <div className="package">
//                             <Coin />
//                             <span className="coins">15000</span>
//                             <span className="price">1200</span>
//                         </div>
//                         <div className="package">
//                             <Coin />
//                             <span className="coins">20000</span>
//                             <span className="price">1500</span>
//                         </div>
//                         <div className="package">
//                             <Coin />
//                             <span className="coins">25000</span>
//                             <span className="price">1750</span>
//                         </div>
//                         <div className="package">
//                             <Coin />
//                             <span className="coins">50000</span>
//                             <span className="price">3250</span>
//                         </div>
//                     </div>
//                     <button className="book-now">Book Now</button>
//                 </section>
//             </main>
//             <footer>
//                 <img src={backgroundImage2} alt="Footer Background" className="footer-background" />
//             </footer>
//         </div>
//     );
// }

// export default App;
