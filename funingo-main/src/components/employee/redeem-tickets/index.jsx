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
import { ToastContainer, toast } from "react-toastify";

const RedeemTicket = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const { token } = useSelector((state) => state.userSlice);
  const [ticket, setTicket] = useState({});
  const [activities, setActivities] = useState([]);
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
    setIsDropdownVisible(false);
    await fetchActivityBookings(name);
    setLoading(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    // console.log("Updated inputValue:", inputValue);
  }, [inputValue]);

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

  async function fetchActivities() {
    try {
      const resActivity = await axios.get(`${apiUrl}/activity/activityfetch`);
      setActivities(resActivity.data);
    } catch (error) {
      toast.error(error.message, error);
    }
  }

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
      toast.error(error.message, error);
    } finally {
    }
  }
  const redeemTicket = async () => {
    try {
      console.log(inputValue);
      if (existingFuningoMoney - inputValue >= 0) {
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

        const employeeUser = await axios.get(`${apiUrl}/user/`, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });
        const redeemByEmp = employeeUser.data.user.emp_id;
        const redeemByEmpPhone = employeeUser.data.user.phone_no;

        const resCusHistoryAdd = await axios.put(
          `${apiUrl}/user/addhistory`,
          {
            phone_no: phoneNo.length !== 4 ? "+91-" + phoneNo : phoneNo,
            redeemBy: redeemByEmp,
            redeemOff: phoneNo.length !== 4 ? "+91-" + phoneNo : phoneNo,
            coins: inputValue,
            activity: activityname,
          },
          {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          }
        );

         const resEmpHistoryAdd = await axios.put(
          `${apiUrl}/user/addhistory`,
          {
            phone_no: redeemByEmpPhone,
            redeemBy: redeemByEmp,
            redeemOff: phoneNo.length !== 4 ? "+91-" + phoneNo : phoneNo,
            coins: inputValue,
            activity: activityname,
          },
          {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          }
        );

    

        const getCurrentDateYYYYMMDD = () => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          return `${year}/${month}/${day}`;
        };

        const insightActivityRes = await axios.post(
          `${apiUrl}/insights/activityadd`,
          {
            name: activityname,
            date: getCurrentDateYYYYMMDD(),
          }
        );
        const employeeinsightres=await axios.put(
          `${apiUrl}/insights/employeeactivityupdate`,{
            empid:redeemByEmp,
            activityName:activityname,
            count:1
          }
        )

        setSuccess(res.data?.success);
        fetchFuningoMoney(phoneNo);
        setActivityBookings(res.data?.bookings);
        toast.success("Coin Redeem Sucessfully");
      } else {
        toast.warning("Insufficient Funingo Coins");
        return;
      }
    } catch (err) {
      if (existingFuningoMoney - inputValue < 0) {
        toast.warning("Insufficient Funingo Coins");
        return;
      }
      toast.error("Couldn't redeem coins, please try again!!");
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
          onClick={() => {
            fetchFuningoMoney(phoneNo);
            fetchActivities();
          }}
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
                    {activities.map((activity) => (
                      <div
                        key={activity.id || activity.name}
                        className="option"
                        onClick={() =>
                          handleSelection(
                            activity.coins_required,
                            activity.name
                          )
                        }
                      >
                        <span>{activity.name}</span>
                        <div className="funingo-icon-container">
                          <span>{activity.coins_required}</span>
                          <Coin />
                        </div>
                      </div>
                    ))}
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
