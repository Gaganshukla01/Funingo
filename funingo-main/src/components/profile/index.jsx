import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import Select from "react-select";

import { Heading, Label, Value } from "./styles";
import { getAllTickets } from "../../actions/ticket";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../utils";
import TicketModal from "../booknow/ticket";
import SliderImage from "./images/slider.png";
import { openPremiumSubscriptionModal } from "../../utils/store/slice/appSlice";
import { getTransactions } from "../../actions/user";

const Profile = () => {
  const {
    userData: user,
    token,
    isLoggedIn,
    isPremium,
    transactions,
  } = useSelector((state) => state.userSlice);
  const [tickets, setTickets] = useState([]);
  const [active, setActive] = useState(0);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [sliderValue, setSliderValue] = useState(12);
  const dispatch = useDispatch();

  const options = [
    { label: "Transaction History", value: 0 },
    { label: "Upcoming Trips", value: 1 },
    { label: "Previous Bookings", value: 2 },
  ];

  useEffect(() => {
    (async () => {
      if (isLoggedIn && token) {
        const resp = await getAllTickets({
          phone_no: user?.phone_no,
          token: token,
        });
        setTickets(resp?.tickets);
        console.log(tickets);
      }
    })();
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (sliderValue >= 78) {
      dispatch(openPremiumSubscriptionModal());
      setSliderValue(12);
    }
  }, [sliderValue]);

  useEffect(() => {
    dispatch(getTransactions());
  }, []);

  return (
    <Grid
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <TicketModal
        open={expandedTicket !== null}
        onClose={() => {
          // console.log("cliclked here beta");
          setExpandedTicket(null);
        }}
        ticket={expandedTicket}
        downloadable={active === 1}
      />
      <Grid
        sx={{
          flexBasis: {
            xs: "100%",
            sm: "20%",
          },
          borderRight: "1px solid #7c7c7c2a",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "fit-content",
          minHeight: { xs: "fit-content", sm: "100vh" },
        }}
      >
        <Avatar
          src={getProfile(user?.profile_picture)}
          sx={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: isPremium ? "2px solid #0580e2" : "none",
            padding: "2px",
          }}
          imgProps={{
            sx: {
              borderRadius: "50%",
            },
          }}
        />
        <Grid
          width={"100%"}
          mt="30px"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flexShrink: 1,
          }}
        >
          <Box>
            <Label>Name</Label>
            <Value>{`${user?.first_name} ${user?.last_name}`}</Value>
          </Box>
          <Box>
            <Label>Phone Number</Label>
            <Value>{user?.phone_no}</Value>
          </Box>
          <Typography
            sx={{
              textDecoration: "underline",
              fontWeight: "600",
              fontSize: "14px",
              mt: "20px",
            }}
          >
            Location Details
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {user?.locality && (
              <Box>
                <Label>Locality</Label>
                <Value>{user?.locality}</Value>
              </Box>
            )}
            <Box>
              <Label>City</Label>
              <Value>{user?.city}</Value>
            </Box>
            <Box>
              <Label>State</Label>
              <Value>{user?.state}</Value>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Grid
        sx={{
          flexBasis: {
            xs: "100%",
            md: "80%",
          },
          padding: "10px 30px",
        }}
      >
        {isMobile ? (
          <Grid>
            <Select
              options={options}
              value={options.filter((opt) => active === opt.value)}
              onChange={(val) => setActive(val.value)}
            />
          </Grid>
        ) : (
          <Grid
            sx={{
              display: "flex",
              gap: "20px",
            }}
          >
            {/* <Heading active={active === 0} onClick={() => setActive(0)}>
              Premium Packages
            </Heading> */}
            <Heading active={active === 0} onClick={() => setActive(0)}>
              Transaction History
            </Heading>
            <Heading active={active === 1} onClick={() => setActive(1)}>
              Upcoming Trips
            </Heading>
            <Heading active={active === 2} onClick={() => setActive(2)}>
              Previous Bookings
            </Heading>
          </Grid>
        )}
        {(active === 2 || active === 1) && (
          <Grid>
            <TableContainer component={Grid}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>S. No.</TableCell>
                    <TableCell>Ticket Id</TableCell>
                    <TableCell align="right">PAX</TableCell>
                    <TableCell align="right">Credited Funingo Money</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                    <TableCell align="right">Preferred Slots</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets
                    .filter((ticket) =>
                      active === 1
                        ? new Date(
                            new Date(ticket.fun_date).setHours(23, 59, 59, 0)
                          ) >= new Date()
                        : new Date(
                            new Date(ticket.fun_date).setHours(23, 59, 59, 0)
                          ) < new Date()
                    )

                    .map((ticket, ind) => (
                      <TableRow
                        key={ticket.short_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                        }}
                        onClick={() => setExpandedTicket(ticket)}
                      >
                        <TableCell component="th" scope="row">
                          {ind + 1}.
                        </TableCell>
                        <TableCell>{ticket.short_id}</TableCell>
                        <TableCell align="right">
                          {ticket.details?.length}
                        </TableCell>
                        <TableCell align="right">
                          {ticket.added_funingo_money}
                        </TableCell>
                        <TableCell align="right">
                          {new Date(ticket.fun_date).toDateString()}
                        </TableCell>
                        <TableCell align="right">
                          Rs. {ticket.total_amount}
                        </TableCell>
                        <TableCell align="right">
                          {ticket.preferred_slot}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid>
              {tickets?.filter((ticket) =>
                active === 1
                  ? new Date(
                      new Date(ticket.fun_date).setHours(23, 59, 59, 0)
                    ) >= new Date()
                  : new Date(
                      new Date(ticket.fun_date).setHours(23, 59, 59, 0)
                    ) < new Date()
              )?.length === 0 && (
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "100%",
                    textAlign: "center",
                    height: "400px",
                  }}
                >
                  <Typography fontWeight={"600"} fontSize={"16px"}>
                    You don't have a ticket yet.
                  </Typography>
                  <Typography fontWeight={"600"} fontSize={"16px"}>
                    Go get a Funingo ticket and enjoy with your family and
                    friends.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
        {active === 0 && (
          <Grid>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>S. No.</TableCell>
                    <TableCell>Coins</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions?.map((transaction, ind) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{ind + 1}.</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {transaction.type === "credit"
                          ? `+ ${transaction.coins}`
                          : `- ${transaction.coins}`}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {transaction.type}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {transaction.description}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {new Date(transaction.createdAt).toDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        {/* {active === 0 && (
          <Grid>
            <Grid my="10px">
              {user?.premium?.filter(
                (prem) => new Date(prem.expires_on) >= new Date()
              )?.length > 0 && (
                <Typography fontSize={"16px"} mb="10px" fontWeight={"600"}>
                  Active Premium Packages
                </Typography>
              )}
              {user?.premium
                ?.filter((prem) => new Date(prem.expires_on) >= new Date())
                ?.map((prem) => (
                  <Grid
                    key={prem._id}
                    sx={{
                      border: "1px solid black",
                      borderRadius: "10px",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <Box display={"flex"}>
                      <Typography>Premium type:&nbsp;</Typography>
                      <Typography fontWeight={"600"}>
                        {prem.premium_type} off
                      </Typography>
                    </Box>
                    <Box display={"flex"}>
                      <Typography>Expires on:&nbsp;</Typography>
                      <Typography fontWeight={"600"}>
                        {new Date(prem.expires_on).toDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
            <Grid>
              {user?.premium?.filter(
                (prem) => new Date(prem.expires_on) < new Date()
              ).length > 0 && (
                <Typography fontSize={"16px"} mb="10px" fontWeight={"600"}>
                  Expired Premium Packages
                </Typography>
              )}
              {user?.premium
                ?.filter((prem) => new Date(prem.expires_on) < new Date())
                ?.map((prem) => (
                  <Grid
                    key={prem._id}
                    sx={{
                      border: "1px solid black",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <Box display={"flex"}>
                      <Typography>Premium type:&nbsp;</Typography>
                      <Typography fontWeight={"600"}>
                        {prem.premium_type} off
                      </Typography>
                    </Box>
                    <Box display={"flex"}>
                      <Typography>Expired on:&nbsp;</Typography>
                      <Typography fontWeight={"600"}>
                        {new Date(prem.expires_on).toDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
            <Grid>
              {!user?.premium?.length && (
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "100%",
                    textAlign: "center",
                    height: "500px",
                  }}
                >
                  <Grid
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Box
                      type="range"
                      component={"input"}
                      min={12}
                      max={85}
                      onChange={(e) => setSliderValue(e.target.value)}
                      value={sliderValue}
                      sx={{
                        opacity: 0,
                        zIndex: "10",
                        position: "relative",
                        height: "50px",
                        width: "250px",
                        cursor: "pointer",
                      }}
                    />
                    <Grid
                      sx={{
                        height: "50px",
                        width: "250px",
                      }}
                    >
                      <Box
                        component="img"
                        src={SliderImage}
                        sx={{
                          position: "absolute",
                          left: `calc(${sliderValue}% - 30px)`,
                          top: "0px",
                          height: "50px",
                          zIndex: "5",
                        }}
                      />
                      <Box
                        sx={{
                          height: "50px",
                          width: "250px",
                          background: "#03034f",
                          position: "absolute",
                          top: "0px",
                          borderRadius: "40px",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: "18px",
                            width: "200px",
                            float: "right",
                            lineHeight: "22px",
                            padding: "3px 0px",
                          }}
                        >
                          Swipe Right To Go Platinum
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        )} */}
      </Grid>
    </Grid>
  );
};

export default Profile;
