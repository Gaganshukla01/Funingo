// import { useMemo, useState } from 'react';
// import axios from 'axios';
// import ShortUniqueId from 'short-unique-id';
// import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   apiUrl,
//   keysToGenerateUnqiueString,
//   razorpayKey
// } from '../../constants';
// import { Typography } from '@mui/material';
// import { openAuthModal } from '../../utils/store/slice/appSlice';
// import ConfirmationModal from '../windowPurchase/modal';
// import AddMoreModal from './addMore';

// const addScript = src => {
//   const script = document.createElement('script');
//   script.src = src;
//   document.querySelector('body').appendChild(script);
// };

// const PaymentButton = ({
//   values,
//   persons,
//   setPersons,
//   discount,
//   usedFuningoMoney,
//   setShowTicket,
//   handleResetBookForm
// }) => {
//   const userData = useSelector(store => store.userSlice.userData);
//   const isLoggedIn = useSelector(store => store.userSlice.isLoggedIn);
//   const dispatch = useDispatch();
//   const [consentFormOpen, setConsentFormOpen] = useState(false);
//   const [addMoreModalOpen, setAddMoreModalOpen] = useState(false);
//   // const [total, setTotal] = useState(0);

//   const openModalAuth = () => {
//     dispatch(openAuthModal());
//   };

//   const uid = new ShortUniqueId({
//     length: 6,
//     dictionary: keysToGenerateUnqiueString
//   });

//   const { details, total } = useMemo(() => {
//     let total = 0;
//     let details = persons.map(item => {
//       total = total + parseInt(item.price || 0);
//       if (item.selectedPremium?.premium_type === '50%') {
//         total -= Math.floor(parseInt(item.price || 0) / 2);
//       }

//       const personTicket = {
//         person_name: item.name,
//         age: item.age,
//         gender: item.gender,
//         package: item?.package || null,
//         freebie: item.freebies,
//         amount: parseInt(item.price) || 0,
//         extra_red:
//           item.selectedPremium?.premium_type === '100%' ? 100 : item.extra_red,
//         extra_yellow:
//           item.selectedPremium?.premium_type === '100%'
//             ? 100
//             : item.extra_yellow,
//         extra_green:
//           item.selectedPremium?.premium_type === '100%'
//             ? 100
//             : item.extra_green,
//         golden_flag:
//           item.selectedPremiu?.premium_type === '100%' ? 20 : item?.golden_flag,
//         premium_discount: item.selectedPremium?.premium_type,
//         premium_duration: item.selectedPremium?.premium_duration
//       };
//       return personTicket;
//     });

//     total -= discount?.discount || 0;
//     total -= usedFuningoMoney || 0;
//     total += Math.ceil(0.18 * total);
//     total = Math.round((total + Number.EPSILON) * 100) / 100;

//     // console.log(total, usedFuningoMoney);

//     return { details, total };
//   }, [persons]);

//   const deleteTicketAPI = async shortId => {
//     const token = localStorage.getItem('token');
//     await axios.delete(`${apiUrl}/ticket/${shortId}`, { headers: { token } });
//   };

//   const handlePayment = async callback => {
//     try {
//       const ticket_id = uid();

//       const requestData = {
//         preferred_slot: values.time,
//         total_amount: Math.max(total, 0),
//         details: details,
//         fun_date: new Date(values.date),
//         short_id: ticket_id,
//         phone_no: '+91-' + values.phone,
//         used_funingo_money: usedFuningoMoney,
//         coupon: discount?.code
//       };
//       const token = localStorage.getItem('token');
//       addScript('https://checkout.razorpay.com/v1/checkout.js');

//       let response = await axios.post(
//         `${apiUrl}/ticket/create-order`,
//         requestData,
//         {
//           headers: {
//             token: token
//           }
//         }
//       );
//       response = response.data;

//       // If total is zero, razorpay is now needed!
//       if (response.success === true && total === 0) {
//         handleResetBookForm();
//         callback?.(ticket_id);
//         setPersons([]);
//         setShowTicket({
//           show: true,
//           data: response.ticket
//         });
//         return;
//       }

//       const options = {
//         key: razorpayKey,
//         name: 'Funingo Adventure Park',
//         amount: total,
//         currency: 'INR',
//         description: 'Test Transaction',
//         order_id: response.id,
//         handler: async res => {
//           try {
//             let resp = await axios.post(
//               `${apiUrl}/ticket/verify-payment`,
//               {
//                 ...res,
//                 order_id: response.id,
//                 short_id: ticket_id
//               },
//               {
//                 headers: {
//                   token: token
//                 }
//               }
//             );

//             if (resp) {
//               handleResetBookForm();
//               callback?.(ticket_id);
//               setPersons([]);
//               setShowTicket({
//                 show: true,
//                 data: resp.data.ticket
//               });
//             }
//           } catch (error) {
//             alert('Payment is unsuccessful');
//             console.log(error.message, error);
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             // 'Checkout form closed'
//             deleteTicketAPI(ticket_id);
//           }
//         },
//         prefill: {
//           name: userData?.name ? userData.name : '',
//           email: userData?.email ? userData.email : '',
//           contact: userData?.phone_no ? userData.phone_no : ''
//         },
//         theme: {
//           color: '#3399cc'
//         }
//       };
//       const razorpay = window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error('Payment Error!!', error.message, error);
//     }
//   };
//   return (
//     <>
//       {consentFormOpen && (
//         <ConfirmationModal
//           open={consentFormOpen}
//           onClose={() => setConsentFormOpen(false)}
//           handlePurchase={handlePayment}
//         />
//       )}
//       {addMoreModalOpen && (
//         <AddMoreModal
//           open={addMoreModalOpen}
//           onClose={() => setAddMoreModalOpen(false)}
//           onContinue={() => setConsentFormOpen(true)}
//           amount={1000 - total}
//         />
//       )}

//       <Button
//         endIcon={<SendIcon />}
//         variant='contained'
//         sx={{
//           background: '#2CC248',
//           boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
//           borderRadius: '50px',
//           padding: '10px 30px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',

//           '&:hover': {
//             background: '#1e8e33'
//           },

//           '&.Mui-disabled': {
//             background: '#2CC248',
//             boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
//             borderRadius: '50px',
//             padding: '10px 30px',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }
//         }}
//         onClick={() => {
//           if (isLoggedIn) {
//             // handlePayment();
//             if (total >= 1000) setConsentFormOpen(true);
//             else setAddMoreModalOpen(true);
//           } else {
//             openModalAuth();
//           }
//         }}
//         disabled={persons?.length === 0}
//       >
//         <Typography
//           sx={{
//             fontFamily: 'Luckiest Guy',
//             fontSize: '24px',
//             position: 'relative',
//             textAlign: 'center',
//             color: 'white'
//           }}
//         >
//           Buy Now
//         </Typography>
//       </Button>
//     </>
//   );
// };

// export default PaymentButton;

import { useMemo, useState } from "react";
import axios from "axios";
import ShortUniqueId from "short-unique-id";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import {
  apiUrl,
  keysToGenerateUnqiueString,
  razorpayKey,
} from "../../constants";
import { FormHelperText, Grid, Typography } from "@mui/material";
import { openAuthModal } from "../../utils/store/slice/appSlice";
import ConfirmationModal from "../windowPurchase/modal";
import AddMoreModal from "./addMore";
import { fetchSelf } from "../../actions/user";

const addScript = (src) => {
  const script = document.createElement("script");
  script.src = src;
  document.querySelector("body").appendChild(script);
};
let funingocoinsfrombooknow = 0;

export const handleFuningocoinsFromBooknow = (value) => {
  // console.log("value received"+value);
  funingocoinsfrombooknow = value;
};

const PaymentButton = ({
  code,
  values,
  persons,
  setPersonsData,
  discount,
  usedFuningoMoney,
  setShowTicket,
  handleResetBookForm,
  premiumDiscount,
  onClick,
}) => {
  const userData = useSelector((store) => store.userSlice.userData);
  const isLoggedIn = useSelector((store) => store.userSlice.isLoggedIn);
  const dispatch = useDispatch();
  const [consentFormOpen, setConsentFormOpen] = useState(false);
  const [addMoreModalOpen, setAddMoreModalOpen] = useState(false);
  const [payment, setpayment] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const openModalAuth = () => {
    dispatch(openAuthModal());
  };

  const uid = new ShortUniqueId({
    length: 6,
    dictionary: keysToGenerateUnqiueString,
  });

  const { details } = useMemo(() => {
    let summation = 0;
    console.log("persons", persons);
    let details = persons.map((item) => {
      summation = summation + parseInt(item.price || 0);

      const personTicket = {
        person_name: item.name,
        age: item.age,
        gender: item.gender,
        package: item?.package || null,
        amount: parseInt(item.price) || 0,
      };
      return personTicket;
    });
    console.log(
      "summation at begin and discount ",
      summation,
      discount?.discount,
      premiumDiscount
    );
    summation -= (discount?.discount || 0) + premiumDiscount;
    // summation -= funingocoinsfrombooknow || 0;
    // summation += Math.ceil(0.18 * summation);
    // summation = Math.round((summation + Number.EPSILON) * 100) / 100;
    console.log("summation" + summation);
    setTotal(summation);

    return { details, total };
  }, [persons, premiumDiscount]);

  const deleteTicketAPI = async (shortId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${apiUrl}/ticket/${shortId}`, { headers: { token } });
  };

  const handlePayment = async (callback) => {
    try {
      const ticket_id = uid();

      const requestData = {
        preferred_slot: values.time,
        total_amount: Math.max(total, 0),
        details: details,
        fun_date: new Date(values.date),
        short_id: ticket_id,
        phone_no: "+91-" + values.phone,
        used_funingo_money: usedFuningoMoney,
        coupon: discount?.code,
        count: values.count,
      };
      const token = localStorage.getItem("token");
      addScript("https://checkout.razorpay.com/v1/checkout.js");

      let response = await axios.post(
        `${apiUrl}/ticket/create-order`,
        requestData,
        {
          headers: {
            token: token,
          },
        }
      );
      response = response.data;

      // If total is zero, razorpay is now needed!
      if (response.success === true && total === 0) {
        handleResetBookForm();
        callback?.(ticket_id);
        setPersonsData({});
        setShowTicket({
          show: true,
          data: response.ticket,
        });
        setpayment(true);
        // await updateCouponCount(code);
        return;
      }

      const options = {
        key: razorpayKey,
        name: "Funingo Adventure Park",
        amount: total,
        currency: "INR",
        description: "Test Transaction",
        order_id: response.id,
        handler: async (res) => {
          try {
            let resp = await axios.post(
              `${apiUrl}/ticket/verify-payment`,
              {
                ...res,
                order_id: response.id,
                short_id: ticket_id,
              },
              {
                headers: {
                  token: token,
                },
              }
            );
            await dispatch(fetchSelf());

            if (resp) {
              handleResetBookForm();
              callback?.(ticket_id);
              setPersonsData({});
              setShowTicket({
                show: true,
                data: resp.data.ticket,
              });
            }
          } catch (error) {
            alert("Payment is unsuccessful");
            console.log(error.message, error);
          }
        },
        modal: {
          ondismiss: function () {
            // 'Checkout form closed'
            deleteTicketAPI(ticket_id);
          },
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
      {consentFormOpen && (
        <ConfirmationModal
          open={consentFormOpen}
          onClose={() => setConsentFormOpen(false)}
          handlePurchase={handlePayment}
        />
      )}
      {addMoreModalOpen && (
        <AddMoreModal
          open={addMoreModalOpen}
          onClose={() => setAddMoreModalOpen(false)}
          onContinue={() => setConsentFormOpen(true)}
          amount={1000 - total}
        />
      )}
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <FormHelperText error>{error}</FormHelperText>
        <Button
          endIcon={<SendIcon />}
          variant="contained"
          sx={{
            background: "#2CC248",
            boxShadow: "0px 2.5 9 0px rgba(0, 0, 0, 0.25)",
            borderRadius: "50px",
            padding: "10px 30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            "&:hover": {
              background: "#1e8e33",
            },

            "&.Mui-disabled": {
              background: "#2CC248",
              boxShadow: "0px 2.5 9 0px rgba(0, 0, 0, 0.25)",
              borderRadius: "50px",
              padding: "10px 30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          onClick={async () => {
            await onClick();
            if (!isLoggedIn) {
              dispatch(openAuthModal());
              return;
            }
            if (persons?.length === 0) {
              setError("Save atleast one person before continuing");
              return;
            }
            // console.log("discount"+discount?.discount+"total"+total);
            if (isLoggedIn) {
              // handlePayment();
              setConsentFormOpen(true);
            } else {
              dispatch(openModalAuth());
            }
          }}
          // disabled={persons?.length === 0}
        >
          <Typography
            sx={{
              fontFamily: "Luckiest Guy",
              fontSize: "24px",
              position: "relative",
              textAlign: "center",
              color: "white",
            }}
          >
            Buy Now
          </Typography>
        </Button>
      </Grid>
    </>
  );
};

export default PaymentButton;
