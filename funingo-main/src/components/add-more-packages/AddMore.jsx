import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, CircularProgress } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PurchaseBtn from "./PurchaseBtn";
import { Tour } from "@mui/icons-material";
import axios from "axios";
import { apiUrl, coinPrice, flag_prices } from "../../constants";
import Coin from "../admin/Coin";
import { useSelector } from "react-redux";

const AddMore = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [gstPrice, setGstPrice] = useState(0);
  const [phone, setPhone] = useState("");
  const [counters, setCounters] = useState({
    red: 0,
    green: 0,
    yellow: 0,
    golden: 0,
  });
  const [existingFuningoMoney, setExistingFuningoMoney] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  async function fetchFuningoMoney(phoneNo) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${apiUrl}/user/coins/+91-${phoneNo}`, {
        headers: headers,
      });

      if (!response.data.success) {
        throw new Error("Couldn't Fetch Freebies");
      }
      setExistingFuningoMoney(response.data.funingo_money);
      if (response.data.premium) {
        for (let data of response.data.premium) {
          if (new Date(data.expires_on) > Date.now()) {
            setIsPremium(true);
            break;
          }
        }
      }
    } catch (error) {
      console.log(error.message, error);
    } finally {
    }
  }

  const metaData = [
    // {
    //   bg: '#fa1942',
    //   type: 'red'
    // },
    // {
    //   bg: '#76de9a',
    //   type: 'green'
    // },
    {
      bg: "#e7e710",
      type: "yellow",
    },
    // {
    //   bg: '#FFD700',
    //   type: 'golden'
    // }
  ];

  const incrementCount = (type) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [type]: prevCounters[type] + 500,
    }));
  };

  const decrementCount = (type) => {
    if (counters[type] > 0) {
      setCounters((prevCounters) => ({
        ...prevCounters,
        [type]: prevCounters[type] - 500 >= 0 ? prevCounters[type] - 500 : 0,
      }));
    }
  };

  useEffect(() => {
    let price =
      // counters.red * flag_prices.red_flag_price +
      // counters.green * flag_prices.green_flag_price +
      counters.yellow * coinPrice;
    // counters.yellow * flag_prices.yellow_flag_price +
    // counters.golden * flag_prices.golden_flag_price;

    // setGstPrice(Math.round((0.18 * price + Number.EPSILON) * 100) / 100);
    // price += 0.18 * price;
    // price = Math.round((price + Number.EPSILON) * 100) / 100;
    if (isPremium) {
      setDiscount(price / 2);
    }
    setTotalPrice(price);
  }, [counters, isPremium]);

  useEffect(() => {
    fetchFuningoMoney(id);
  }, [id]);

  return (
    <Grid
      sx={{
        marginX: "auto",
        width: { xs: "98vw", md: "90vw", lg: "40vw" },
        // background: "#2474d2",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {isLoading && (
        <Grid
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
        </Grid>
      )}
      <Grid
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          padding: "10px",
        }}
      >
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Roboto Mono, monospace",
            flexDirection: "column",
            fontSize: { xs: "20px", lg: "25px" },
            letterSpacing: "2px",
            flexWrap: "wrap",
            textAlign: "center",
            paddingX: "20px",
            marginBottom: "5px",
          }}
        >
          Phone Number : {id}
        </Grid>

        <Grid
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "row", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            fontSize: { xs: "20px", lg: "25px" },
            fontFamily: "Roboto Mono, monospace",
            letterSpacing: "2px",
            flexWrap: "wrap",
            gap: { xs: "0px", lg: "20px" },
          }}
        >
          COINS :&nbsp;
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* <Typography
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{
                fontSize: { xs: '20px', lg: '25px' },
                fontFamily: 'Roboto Mono, monospace',
                letterSpacing: '2px'
              }}
            >
              {ticketData.red}
              <Tour
                sx={{
                  color: '#fa1942'
                }}
              />
            </Typography>
            <Typography
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{
                fontSize: { xs: '20px', lg: '25px' },
                fontFamily: 'Roboto Mono, monospace',
                letterSpacing: '2px'
              }}
            >
              {ticketData.green}
              <Tour
                sx={{
                  color: '#76de9a'
                }}
              />
            </Typography> */}
            <Typography
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                fontSize: { xs: "20px", lg: "25px" },
                fontFamily: "Roboto Mono, monospace",
                letterSpacing: "2px",
              }}
            >
              {existingFuningoMoney}
              <Coin size="5rem" />
            </Typography>
            {/* <Typography
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{
                fontSize: { xs: '20px', lg: '25px' },
                fontFamily: 'Roboto Mono, monospace',
                letterSpacing: '2px'
              }}
            >
              {ticketData.golden}
              <Tour
                sx={{
                  color: '#FFD700'
                }}
              />
            </Typography> */}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{
          width: { xs: "90%", lg: "70%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          fontFamily: "Roboto Mono, monospace",
          fontSize: { xs: "20px", lg: "30px" },
          letterSpacing: { xs: "1px", lg: "3px" },
          // boxShadow: "4px 3px 14px 6px rgb(216 115 115 / 20%)",
          background: "white",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        {metaData &&
          metaData.map((item, ind) => (
            <Grid
              key={item.type}
              sx={{
                width: "100%",
                height: "60px",
                bgcolor: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { xs: "4px 5px", lg: "4px 10px" },
              }}
            >
              <RemoveCircleOutlineIcon
                sx={{
                  height: "30px",
                  width: "30px",
                  transition: "transform 0.3s ease",
                }}
                onClick={() => decrementCount(item.type)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />

              <Grid
                sx={{
                  width: { xs: "75%", lg: "60%" },
                  height: "90%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "4px 15px",
                  borderRadius: "50px",
                  border: `2px solid ${item?.bg}`,
                  color: "black",
                  gap: "10px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Typography
                  sx={{
                    width: "60%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                    lineHeight: "15px",
                  }}
                >
                  Add More Coins
                  {/* <Tour
                    sx={{
                      color: item?.bg
                    }}
                  /> */}
                  <Coin size="20px" />
                </Typography>
                <Typography
                  sx={{
                    width: "30px",
                    height: "30px",
                    paddingX: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    fontWeight: "600",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                >
                  {counters[item.type]}
                </Typography>
              </Grid>
              <ControlPointIcon
                sx={{
                  height: "30px",
                  width: "30px",
                  transition: "transform 0.3s ease",
                }}
                onClick={() => incrementCount(item.type)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </Grid>
          ))}
      </Grid>
      <Grid
        sx={{
          width: { xs: "90%", lg: "70%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "10px 10px",
          gap: "2px",
          borderRadius: "10px",
          background: "beige",
          // boxShadow: "4px 3px 14px 6px rgb(216 115 115 / 20%)",
          marginBottom: "20px",
        }}
      >
        <Grid
          sx={{
            width: "100%",
            marginBottom: "3px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "16px", lg: "15px" },
              fontWeight: "600",
              letterSpacing: "3px",
            }}
          >
            PAYMENT SUMMARY
          </Typography>
        </Grid>
        {/* <Grid
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ fontSize: { xs: '16px', lg: '15px' } }}>
            Red Rides Price
          </Typography>
          <Typography sx={{ fontSize: { xs: '16px', lg: '15px' } }}>
            {counters?.red} x Rs. {flag_prices.red_flag_price}
          </Typography>
        </Grid>
        <Grid
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ fontSize: { xs: '16px', lg: '15px' } }}>
            Green Rides Price
          </Typography>
          <Typography sx={{ fontSize: { xs: '16px', lg: '15px' } }}>
            {counters?.green} x Rs. {flag_prices.green_flag_price}
          </Typography>
        </Grid> */}
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            Price
          </Typography>
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            {counters?.yellow} x Rs. {coinPrice}
          </Typography>
        </Grid>
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            Discount
          </Typography>
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            Rs. {discount}
          </Typography>
        </Grid>
        {/* <Grid
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px'
          }}
        >
          <Typography sx={{ fontSize: { xs: '16px', lg: '15px' } }}>
            Golden Rides Price
          </Typography>
          <Typography sx={{ fontSize: { xs: '16px', lg: '15px' } }}>
            {counters?.golden} x Rs. {flag_prices.golden_flag_price}
          </Typography>
        </Grid> */}
        <hr width={"100%"} />
        {/* <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            Gst@18%
          </Typography>
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            Rs. {gstPrice}
          </Typography>
        </Grid> */}
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            Total Price
          </Typography>
          <Typography sx={{ fontSize: { xs: "16px", lg: "15px" } }}>
            Rs. {totalPrice}
          </Typography>
        </Grid>
        <Grid>
          <PurchaseBtn
            counters={counters}
            setCounters={setCounters}
            total_amount={totalPrice - discount}
            phone_no={id}
            setExistingFuningoMoney={setExistingFuningoMoney}
            contact={id}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddMore;
