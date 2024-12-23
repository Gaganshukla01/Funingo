import { useState } from "react";
import axios from "axios";
import ShortUniqueId from "short-unique-id";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import {
  apiUrl,
  keysToGenerateUnqiueString,
  premium_prices,
  razorpayKey,
} from "../../constants";
import Login from "../auth/signup";
import { Typography } from "@mui/material";
import { openAuthModal } from "../../utils/store/slice/appSlice";
import { autoLogin } from "../../utils";

const addScript = (src) => {
  const script = document.createElement("script");
  script.src = src;
  document.querySelector("body").appendChild(script);
};

const PaymentButton = ({
  premium_data = [],
  disabled = false,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.userSlice.userData);
  const isLoggedIn = useSelector((store) => store.userSlice.isLoggedIn);

  const uid = new ShortUniqueId({
    length: 6,
    dictionary: keysToGenerateUnqiueString,
  });

  const handlePayment = async () => {
    try {
      const short_id = uid();
      let total_amount = 0;

      if (premium_data.premium_type === "50%") {
        if (premium_data.expiry === "6_months") {
          total_amount += premium_prices.premium_50_price_for_6_months;
        } else if (premium_data.expiry === "1_year") {
          total_amount += premium_prices.premium_50_price_for_1_year;
        } else if (premium_data.expiry === "100_years") {
          total_amount += premium_prices.premium_50_price_for_100_years;
        }
      } else {
        if (premium_data.expiry === "6_months") {
          total_amount += premium_prices.premium_100_price_for_6_months;
        } else if (premium_data.expiry === "1_year") {
          total_amount += premium_prices.premium_100_price_for_1_year;
        } else if (premium_data.expiry === "100_years") {
          total_amount += premium_prices.premium_100_price_for_100_years;
        }
      }
      total_amount = total_amount * premium_data.quantity;

      const premiumData = [...Array(premium_data.quantity)].map((_) => ({
        premium_type: premium_data.premium_type,
        expiry: premium_data.expiry,
      }));

      const requestData = {
        short_id,
        total_amount,
      };
      const token = localStorage.getItem("token");
      addScript("https://checkout.razorpay.com/v1/checkout.js");

      let response = await axios.post(
        `${apiUrl}/user/premium/create-order`,
        requestData,
        {
          headers: {
            token: token,
          },
        }
      );
      response = response.data;

      const options = {
        key: razorpayKey,
        name: "Funingo Adventure Park",
        amount: total_amount,
        currency: "INR",
        description: "Test Transaction",
        order_id: response.id,
        handler: async (res) => {
          try {
            let resp = await axios.post(
              `${apiUrl}/user/premium/verify-payment`,
              {
                ...res,
                order_id: response.id,
                short_id,
                premium_data: premiumData,
                total_amount,
              },
              {
                headers: {
                  token: token,
                },
              }
            );

            handleClose();
            alert(resp ? "Payment is successful" : "Payment is unsuccessful");
            if (resp.data.success) {
              dispatch(autoLogin());
            }
          } catch (error) {
            console.log(error.message, error);
          }
        },
        prefill: {
          name: userData?.name ? userData.name : "",
          email: userData?.email ? userData.email : "",
          contact: userData?.phone_no ? userData.phone_no : "",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error!!", error.message, error);
    }
  };
  return (
    <>
      <Button
        sx={{
          color: "white",
          background: "linear-gradient(54deg,#ff0000 40%, #ff0000, #AE8625)",
          fontWeight: "700",
          borderRadius: "50px",
          padding: "5px 20px",
          boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.9)",
        }}
        disabled={disabled}
        onClick={() => {
          if (isLoggedIn) {
            handlePayment();
          } else {
            dispatch(openAuthModal());
          }
        }}
      >
        Subscribe
      </Button>
      {/* <Button
        endIcon={<SendIcon />}
        variant='contained'
        sx={{
          background: '#2CC248',
          boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
          borderRadius: '50px',
          padding: '10px 30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          '&:hover': {
            background: '#1e8e33'
          }
        }}
        onClick={() => {
          if (isLoggedIn) {
            handlePayment();
          } else {
            dispatch(openAuthModal());
          }
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Luckiest Guy',
            fontSize: '24px',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          Buy Now
        </Typography>
      </Button> */}
    </>
  );
};

export default PaymentButton;
