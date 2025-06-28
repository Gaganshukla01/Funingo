import React, { useEffect, useState } from "react";
import { validatePhoneNumber } from "../../utils/validators/validate";
import shortid from "shortid";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { apiUrl, flag_prices, payment_modes } from "../../constants";
import Coin from "../admin/Coin";
import Invoice from "../invoice";
import UnlimitedPackageModal from "./UnlimitedPackageModal";
import { getDiscount } from "../../actions/ticket";
import { toast } from "react-toastify";
import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Button,
  Grid,
  Typography,
  FormHelperText,
  CircularProgress,
  Box,
} from "@mui/material";
import { Tour } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ListedOptionLayout from "./ListedOptionLayout";
import { addComplementaryCoins, windowPurchase } from "../../actions/exployee";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "../../utils/store/slice/userSlice";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import ConfirmationModal from "./modal";
import IndividualFlag from "../booknow/individualFlags";
import { set, useForm } from "react-hook-form";
import { InputAdornment } from "@mui/material";
import { scrollToTop } from "../../utils";
import statesData, { localityData } from "../auth/states";
import ComplimentaryDialog from "./ComplimentaryDialog";
import moment from "moment";
import { amber } from "@mui/material/colors";
const WindowPurchase = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);

  const [selectedSlots, setSelectedSlots] = useState([
    {
      package: "",
      person_name: "",
      age: "",
      gender: "",
    },
  ]);

  const [couponDiscount, setCouponDiscount] = useState({});
  const [code, setCode] = useState("");
  const [count, setCount] = useState(1);
  const [personCount, setPersonCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [gstPrice, setGstPrice] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [activitiesData, setActivities] = useState();
  const { token } = useSelector((state) => state.userSlice);
  const [shortId, setShortId] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const [showExtraField, setExtraField] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [cashAmount, setcashAmount] = useState(null);
  const [onlineAmount, setonlineAmount] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [dummyFreebiesData, setDummyFreebiesData] = useState([]);
  const [existingFuningoMoney, setExistingFuningoMoney] = useState(0);
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [fetchUserError, setFetchUserError] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [premiumDiscount, setPremiumDiscount] = useState(0);
  const [customDiscount, setCustomDiscount] = useState(0);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isUnlimtedPackageClicked, setIsUnlimtedPackageClicked] =
    useState(true);
  const [complementaryCoinsModalOpen, setComplementaryCoinsModalOpen] =
    useState(false);
  const [unlimitedPackageModalOpen, setUnlimitedPackageModalOpen] =
    useState(false);
  const [unlimitedPackageData, setUnlimitedPackageData] = useState(null);

  const [address, setAddress] = useState({
    state: "Madhya Pradesh",
    city: "Jabalpur",
    locality: "",
  });

  const states = Object.keys(statesData).map((state) => ({
    label: state,
    value: state,
  }));
  const localities = localityData.map((locality) => ({
    label: locality,
    value: locality,
  }));
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (address.state)
      setCities(
        statesData[address.state].map((city) => ({
          label: city,
          value: city,
        }))
      );
  }, [address.city, address.state]);

  const paymentModes = payment_modes.map((paymentMode) => ({
    label: paymentMode[0].toUpperCase() + paymentMode.slice(1),
    value: paymentMode,
  }));

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "others", label: "Others" },
  ];

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setIsValid(true);
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
  };

  // setting data to update in user section
  const updateUnlimitedPackage = async (phoneNumber, unlimitedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Login or SignUp First");
      }

      const headers = {
        token: token,
        "Content-Type": "application/json",
      };

      const activitiesObj = {};
      unlimitedData.activities.forEach((activity) => {
        activitiesObj[activity.name] = activity.count || activity.quantity || 1;
      });

      const payload = {
        phone: phoneNumber,
        unlimited: true,
        activities: activitiesObj,
      };

      const response = await axios.put(
        `${apiUrl}/user/unlimitedupdate`,
        payload,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating unlimited package:", error);
      throw error;
    }
  };

  const handleUnlimitedPackageSubmit = async (selectedActivities) => {
    console.log("Selected Activities:", selectedActivities);

    try {
      if (phoneNumber) {
        await updateUnlimitedPackage(phoneNumber, selectedActivities);
        console.log("Unlimited package updated successfully");
      }

      setUnlimitedPackageData(selectedActivities);

      setSelectedSlots((prevSlots) =>
        prevSlots.map((slot, index) =>
          index === currentSlotIndex
            ? {
                ...slot,
                package: {
                  _id: "UNLIMITED_PACKAGE",
                  name: "UNLIMITED PACKAGE",
                  price:
                    selectedActivities.packageAmount ||
                    selectedActivities.totalPrice,
                  activities: selectedActivities.activities,
                  isUnlimited: true,
                },
              }
            : slot
        )
      );

      setUnlimitedPackageModalOpen(false);
    } catch (error) {
      console.error("Error submitting unlimited package:", error);
      setError("Failed to update unlimited package. Please try again.");
    }
  };

  const handleCheckClick = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setHelperText("Invalid phone number");
      setIsValid(false);
    } else {
      setHelperText("");
      setIsValid(true);
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        setExistingFuningoMoney(0);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Login or SignUp First");
        }

        const headers = {
          token: token,
          "Content-Type": "application/json",
        };
        const response = await axios.get(
          `${apiUrl}/user/coins/+91-${phoneNumber}`,
          {
            headers: headers,
          }
        );
        setExistingFuningoMoney(response.data.funingo_money);
        setName(response.data?.name || "");
        if (response.data.address) {
          setAddress(response.data.address);
        }
        if (response.data.premium) {
          for (let data of response.data.premium) {
            if (new Date(data.expires_on) > Date.now()) {
              setIsPremium(true);
              break;
            }
          }
        }
        if (response.data.dob) {
          setDob(moment(response.data.dob).format("YYYY-MM-DD"));
        } else {
          setDob("");
        }
      } catch (error) {
        console.log(error.message, error);
        setFetchUserError(error?.response?.data?.error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  };

  const handleCountChange = (event) => {
    const newCount = parseInt(event.target.value, 10);
    if (newCount < 0 || newCount > 10) {
      return;
    }
    setCount(newCount);
    setSelectedSlots((prevSelectedSlots) => {
      const updatedSelectedSlots = [...prevSelectedSlots];
      if (newCount < updatedSelectedSlots.length) {
        return updatedSelectedSlots.slice(0, newCount);
      } else {
        for (let i = updatedSelectedSlots.length; i < newCount; i++) {
          updatedSelectedSlots.push({
            package: "",
            person_name: "",
            age: "",
            gender: "",
          });
        }
        return updatedSelectedSlots;
      }
    });
  };
  const getDiscountUsingCoupon = async (event) => {
    const resp = await getDiscount({
      token,
      code,
      total_amount: totalPrice - premiumDiscount,
    });
    console.log("resp.discount", resp.discount);
    setCouponDiscount({ discount: resp.discount, message: resp.msg, code });
  };

  const handleChange = (index, newSelectedSlot) => {
    setSelectedSlots((prev) =>
      prev.map((selectedSlot, ind) => {
        if (ind === index) return newSelectedSlot;
        return selectedSlot;
      })
    );
  };

  const handlePackageSelectChange = (event, index) => {
    const selectedValue = event.target.value;
    setSelectedSlots((prevSelectedSlots) => {
      const updatedSelectedSlots = [...prevSelectedSlots];
      updatedSelectedSlots[index].package = selectedValue;
      return updatedSelectedSlots;
    });
  };

  const handleFreebiesSelectChange = (event, index) => {
    const selectedValue = event.target.value;
    setSelectedSlots((prevSelectedSlots) => {
      const updatedSelectedSlots = [...prevSelectedSlots];
      updatedSelectedSlots[index].freebies = selectedValue;
      return updatedSelectedSlots;
    });
  };

  const handleDeleteSelect = (index) => {
    setSelectedSlots((prevSelectedSlots) => {
      const updatedSelectedSlots = [...prevSelectedSlots];
      updatedSelectedSlots.splice(index, 1);
      setCount(count - 1);
      return updatedSelectedSlots;
    });
    let totalPrice = 0;
    selectedSlots.forEach((selectedSlot) => {
      const packagePrice = selectedSlot.package?.price || 0;
      totalPrice += packagePrice;
    });

    if (premiumDiscount) setPremiumDiscount(totalPrice / 2);
    setTotalPrice(totalPrice);
  };

  const getAvailablePackageOptions = () => {
    const availableOptions = packageData;
    return availableOptions;
  };

  const getAvailableFreebiesOptions = (index) => {
    const selectedValues = selectedSlots.slice();
    const availableOptions = dummyFreebiesData.filter(
      (option) =>
        !selectedValues.some(
          (selected) =>
            selected.freebies === option.id &&
            selected.freebies !== "" &&
            selected.freebies !== selectedValues[index].freebies
        ) ||
        option.id === selectedValues[index].freebies ||
        option.id === ""
    );
    return availableOptions;
  };

  // split payment logic
  const handleCashAmountChange = (e) => {
    const value = e.target.value || 0;
    setcashAmount(value);
    if (totalPrice - value > 0) {
      setonlineAmount(totalPrice - value);
    } else {
      setonlineAmount(onlineAmount);
    }
  };

  const handleOnlineAmountChange = (e) => {
    const value = e.target.value || 0;
    setonlineAmount(value);
    if (totalPrice - value > 0) {
      setcashAmount(totalPrice - value);
    } else {
      setcashAmount(cashAmount);
    }
  };

  const handlePackageDataResponse = (data) => {
    setPackageData(
      data
        .filter((item) => {
          return userType == "admin" || item.name !== "UNLIMITED";
        })
        .map((item) => ({
          ...item,
          id: item?._id,
        }))
    );
  };

  // reset values

  const resetForm = () => {
    setSelectedSlots([
      {
        package: "",
        person_name: "",
        age: "",
        gender: "",
      },
    ]);
    setCount(1);
    setPersonCount(1);
    setTotalPrice(0);
    setPhoneNumber("");
    setName("");
    setDob("");
    setCode("");
    setCouponDiscount({});
    setPaymentMode(null);
    setExtraField(false);
    setcashAmount(null);
    setonlineAmount(null);
    setCustomDiscount(0);
    setPremiumDiscount(0);
    setIsPremium(false);
    setExistingFuningoMoney(0);
    setError("");
    setFetchUserError("");
    setUnlimitedPackageData(null);
    setAddress({
      state: "Madhya Pradesh",
      city: "Jabalpur",
      locality: "",
    });
  };

  const handlePurchase = async (callback) => {
    const details = selectedSlots.map((data) => ({
      ...data,
      package: data.package.isUnlimited ? null : data.package._id,
      packageType: data.package.isUnlimited ? "unlimited" : "regular",
      unlimitedPackageData: data.package.isUnlimited
        ? {
            activities: data.package.activities,
            price: data.package.price,
            name: data.package.name,
          }
        : null,
    }));

    const calculateCoins = () => {
      let totalCoins = 0;

      selectedSlots.forEach((slot) => {
        if (slot.package.isUnlimited) {
          totalCoins += 0;
        } else {
    
          totalCoins += slot.package?.coins || 0;
        }
      });

      return totalCoins;
    };

    const coinsToSend = calculateCoins();

    const hasUnlimitedPackage = selectedSlots.some(
      (slot) => slot.package.isUnlimited
    );

    try {
      const response = await windowPurchase({
        count: personCount,
        total_amount:
          totalPrice -
          premiumDiscount -
          (couponDiscount.discount || 0) -
          customDiscount,
        cash_amount: cashAmount,
        online_amount: onlineAmount,
        details,
        token,
        phone_no: phoneNumber ? "+91-" + phoneNumber : undefined,
        payment_mode: paymentMode.value,
        coupon: code,
        dob,
        name,
        custom_discount: customDiscount,
      });

      if (response.success) {
        const newInvoiceData = {
          invoiceNumber: response.short_id,
          invoiceDate: new Date().toLocaleDateString(),
          cashAmount: cashAmount,
          onlineAmount: onlineAmount,
          paymentMethod: paymentMode.label,
          totalAmount: totalPrice,
        };

        setInvoiceData(newInvoiceData);
        console.log(response.short_id, "ticketId");
        setShortId(response.short_id);

        // get current user
        const employeeUser = await axios.get(`${apiUrl}/user/`, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });

        const redeemByEmp = employeeUser.data.user.emp_id;
        const redeemByEmpPhone = employeeUser.data.user.phone_no;
        console.log(redeemByEmp, redeemByEmpPhone);
        console.log(phoneNumber);

        const resCusHistoryAdd = await axios.put(
          `${apiUrl}/user/addhistory`,
          {
            phone_no:
              phoneNumber.length !== 4 ? "+91-" + phoneNumber : phoneNumber,
            redeemBy: redeemByEmp,
            redeemOff:
              phoneNumber.length !== 4 ? "+91-" + phoneNumber : phoneNumber,
            coins: coinsToSend,
            activity: hasUnlimitedPackage
              ? "Window Recharge Unlimited"
              : "Window Recharge",
          },
          {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success(
          `🎉 Ticket booked successfully! Ticket ID: ${response.short_id}`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        setTimeout(() => {
          resetForm();
        }, 2000);

        callback?.(response.short_id);
      }
    } catch (error) {
      toast.error("Please fill all the fields", error);
      setError(error?.response?.data?.error);

      toast.error(
        `❌ ${
          error?.response?.data?.error || "Booking failed. Please try again."
        }`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCustomDiscountChange = (e) => {
    const val = parseInt(e.target.value || 0);
    if (val < 0) return;
    setCustomDiscount(val);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const activitiesRes = await axios.get(
          `${apiUrl}/activity/activityfetch`
        );
        setActivities(activitiesRes.data);
        const response = await axios.get(`${apiUrl}/package`);
        if (!response.data.success) {
          throw new Error("Couldn't Fetch Packages");
        }

        // logic to handle unlimted package
        let rawData = response.data.packages;

        handlePackageDataResponse(rawData);

        setIsLoading(false);
      } catch (error) {
        console.error(error.message, error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let totalPrice = 0,
      premiumDiscount = 0;
    selectedSlots.forEach((selectedSlot) => {
      const packagePrice = parseInt(selectedSlot.package?.price || 0);
      totalPrice += packagePrice;
    });
    if (isPremium) {
      premiumDiscount = totalPrice / 2;
      setPremiumDiscount(premiumDiscount);
    }
    setTotalPrice(totalPrice);
    console.log("Total Price Calculated:", totalPrice);
  }, [selectedSlots, isPremium]);
  console.log("checking", invoiceData);

  return (
    <Grid
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <ComplimentaryDialog
        phoneNumber={phoneNumber}
        open={complementaryCoinsModalOpen}
        onClose={() => setComplementaryCoinsModalOpen(false)}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        handlePurchase={handlePurchase}
      />
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
          width: { xs: "100%", lg: "60%" },
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Grid
          display={"flex"}
          width={"100%"}
          sx={{
            gap: "15px",
            marginBottom: "25px",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          <FormControl sx={{ width: { xs: "100%", lg: "50%" } }}>
            <p style={{ fontSize: "14px", fontWeight: "500" }}>Phone Number</p>
            <TextField
              type="number"
              value={phoneNumber}
              placeholder="Enter valid Phone Number"
              onChange={handlePhoneNumberChange}
              InputProps={{
                sx: {
                  "& input": {
                    border: "0px !important",
                    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                  },
                },
              }}
            />
            <Box>
              <Typography>
                Available funingo money: {existingFuningoMoney}
              </Typography>
            </Box>
            {fetchUserError && (
              <Typography color={"red"}>{fetchUserError}</Typography>
            )}

            <FormHelperText error={!isValid}>
              {!isValid && helperText}
            </FormHelperText>
          </FormControl>

          <Button
            sx={{
              background: "#257ac4",
              color: "white",
              maxHeight: "40px",
              marginBottom: "4px",
              fontSize: "12px",
              "&:hover": {
                backgroundColor: "#257ac4",
                color: "white",
              },
              border: "none",
              outline: "none",
            }}
            onClick={handleCheckClick}
          >
            Check
          </Button>
          <Button
            sx={{
              background: "#257ac4",
              color: "white",
              maxHeight: "40px",
              marginBottom: "4px",
              fontSize: "12px",
              "&:hover": {
                backgroundColor: "#257ac4",
                color: "white",
              },
              border: "none",
              outline: "none",
            }}
            onClick={() => {
              if (!phoneNumber) {
                setFetchUserError("Please enter a valid phone number");
                return;
              }
              setComplementaryCoinsModalOpen(true);
            }}
          >
            Add Complementary Coins
          </Button>
        </Grid>

        <Grid display={"flex"} gap={"20px"}>
          <FormControl sx={{ width: { xs: "100%", lg: "45%" } }}>
            <p style={{ fontSize: "14px", fontWeight: "500" }}>Name</p>
            <TextField
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter customer name"
              InputProps={{
                sx: {
                  height: "40px",
                  "& input": {
                    border: "0px !important",
                    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                  },
                },
              }}
            />
          </FormControl>

          <FormControl sx={{ width: { xs: "100%", lg: "50%" } }}>
            <p style={{ fontSize: "14px", fontWeight: "500" }}>Date of Birth</p>
            <TextField
              type="date"
              value={dob}
              onChange={handleDobChange}
              InputProps={{
                sx: {
                  height: "40px",
                  "& input": {
                    border: "0px !important",
                    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                  },
                },
              }}
            />
          </FormControl>
        </Grid>

        {count > 0 &&
          selectedSlots.map((selectedSlot, index) => (
            <Grid
              key={index}
              sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginBottom: "15px",
              }}
            >
              <hr width={"100%"} />
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: { xs: "15px", lg: "20px" },
                    letterSpacing: "2px",
                  }}
                >
                  {`Price -> Rs ${
                    selectedSlot?.package?.price
                      ? parseInt(selectedSlot.package.price)
                      : 0
                  }`}
                </Typography>
              </Grid>

              {!selectedSlot?.package?.isUnlimited && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setCurrentSlotIndex(index);
                    setUnlimitedPackageModalOpen(true);
                    setIsUnlimtedPackageClicked(false);
                  }}
                  sx={{
                    background:
                      "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    color: "white",
                    py: 1.5,
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  📦 Book Unlimited Package
                </Button>
              )}
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: "15px", md: "10px" },
                }}
              >
                <Grid
                  sx={{
                    width: { xs: "100%", lg: "50%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {/* for unlimted package booking */}
                  {unlimitedPackageModalOpen ? (
                    <UnlimitedPackageModal
                      open={unlimitedPackageModalOpen}
                      onClose={() => setUnlimitedPackageModalOpen(false)}
                      onSubmit={handleUnlimitedPackageSubmit}
                      packageData={activitiesData}
                    />
                  ) : selectedSlot?.package?.isUnlimited ? (
                    // Show selected activities for unlimited package
                    <Grid
                      sx={{
                        width: "100%",
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "bold", color: "#667eea" }}
                      >
                        Selected Activities - {selectedSlot.package.name}
                      </Typography>
                      <Grid sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedSlot.package.activities?.map(
                          (activity, actIndex) => (
                            <Box
                              key={actIndex}
                              sx={{
                                backgroundColor: "#667eea",
                                color: "white",
                                px: 2,
                                py: 1,
                                borderRadius: "16px",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              {activity.name} (₹{activity.price})
                            </Box>
                          )
                        )}
                      </Grid>
                      <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                        Total Package Price: ₹{selectedSlot.package.price}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => {
                          setCurrentSlotIndex(index);
                          setUnlimitedPackageModalOpen(true);
                        }}
                      >
                        Edit Activities
                      </Button>
                    </Grid>
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel>Select Package</InputLabel>
                      <Select
                        label="Select Package"
                        value={
                          selectedSlot?.package === ""
                            ? ""
                            : selectedSlot.package
                        }
                        onChange={(e) => handlePackageSelectChange(e, index)}
                      >
                        <MenuItem value="">
                          <em>
                            {getAvailablePackageOptions &&
                            getAvailablePackageOptions.length === 0
                              ? "Deselect packages"
                              : "None"}
                          </em>
                        </MenuItem>
                        {getAvailablePackageOptions(index).map((option, i) => (
                          <MenuItem key={i} value={option}>
                            <ListedOptionLayout data={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                <Grid
                  sx={{
                    width: { xs: "100%", lg: "50%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                ></Grid>
              </Grid>

              <Grid width={"100%"}>
                <Typography mb="5px">Optional Fields</Typography>
                <Grid
                  display={"flex"}
                  justifyContent={"flex-start"}
                  mb={"15px"}
                  flexDirection={"row"}
                  width={"100%"}
                  gap="20px"
                >
                  <Grid>
                    <TextField
                      name="age"
                      type="text"
                      placeholder="Age"
                      value={selectedSlot.age}
                      onChange={(e) => {
                        handleChange(index, {
                          ...selectedSlot,
                          age: e.target.value,
                        });
                      }}
                      required={true}
                      fullWidth
                    />
                  </Grid>

                  <Grid>
                    <ReactSelect
                      id="gender"
                      name="gender"
                      value={genderOptions.find(
                        (option) => option?.value === selectedSlot.gender
                      )}
                      onChange={(e) => {
                        handleChange(index, {
                          ...selectedSlot,
                          gender: e?.value,
                        });
                      }}
                      placeholder="Gender"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          background: "white",
                          height: "40px",
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: "black",
                          "& input": {
                            height: "30px",
                          },
                        }),
                        ValueContainer: (provided) => ({
                          ...provided,
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          color: state.isSelected ? "white" : "black",
                        }),
                      }}
                      required={true}
                      isSearchable={false}
                      options={genderOptions}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        <Grid
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Grid>
            <Typography>Add Custom discount</Typography>
            <TextField
              type="number"
              value={customDiscount}
              onChange={handleCustomDiscountChange}
              min={0}
            />
          </Grid>
          <Grid>
            <Typography>Add Person count</Typography>
            <TextField
              type="number"
              value={personCount}
              onChange={(e) => setPersonCount(parseInt(e.target.value))}
              min={0}
            />
          </Grid>
        </Grid>

        <Grid
          sx={{
            width: "100%",
            height: "150px",
            backgroundColor: "beige",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            color: "black",
            padding: "15px 30px",
            marginBottom: "25px",
            borderRadius: "5px",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "22px", lg: "15px" },
              fontWeight: "600",
              letterSpacing: "3px",
            }}
          >
            PAYMENT SUMMARY
          </Typography>
          <Grid
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Typography>Subtotal </Typography>
            <Typography>Rs {totalPrice - gstPrice} </Typography>
          </Grid>

          <Grid
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Typography>Discount </Typography>
            <Typography>
              Rs{" "}
              {(couponDiscount.discount || 0) +
                (premiumDiscount || 0) +
                customDiscount}
            </Typography>
          </Grid>

          <hr width={"100%"} />

          <Grid
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            paddingTop={"5px"}
          >
            <Typography>Total </Typography>
            <Typography>
              Rs{" "}
              {Math.max(
                totalPrice -
                  ((couponDiscount.discount || 0) +
                    (premiumDiscount || 0) +
                    customDiscount),
                0
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid width={"100%"}>
          <TextField
            fullWidth
            sx={{
              background: "white",
              borderRadius: "5px",
              mt: "0px",
              zIndex: 0,
              "&:hover": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
              },
            }}
            placeholder="Have a promo code?"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={() => getDiscountUsingCoupon()}>
                    Apply
                  </Button>
                </InputAdornment>
              ),
            }}
            inputProps={{
              sx: {
                border: "none !important",
                zIndex: "0 !important",
              },
            }}
          />
          {!!couponDiscount.message && (
            <Typography
              sx={{
                color: "red",
                fontSize: "12px",
                mt: "5px",
              }}
            >
              {couponDiscount.message}
            </Typography>
          )}
          {!!couponDiscount.discount && (
            <Typography
              sx={{
                color: "green",
                fontSize: "12px",
                mt: "5px",
              }}
            >
              Promo code applied!!
            </Typography>
          )}
        </Grid>
        <Grid>
          <Grid mb="20px">
            <ReactSelect
              options={paymentModes}
              onChange={(e) => {
                setPaymentMode(e);
                // for enable Field of cash And Online
                if (e.value && e.value === " Cash Online") {
                  setExtraField(true);
                } else {
                  setExtraField(false);
                }
              }}
              placeholder="Payment mode"
              value={paymentMode}
              styles={{
                container: (styles) => ({
                  ...styles,
                  flexBasis: "300px",
                }),
              }}
              isClearable={false}
            />
          </Grid>

          {/* for cash and online amount */}
          {showExtraField && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Grid>
                <Typography>Enter Cash Amount</Typography>
                <TextField
                  type="number"
                  value={cashAmount}
                  onChange={handleCashAmountChange}
                  min={0}
                />
              </Grid>

              <Grid>
                <Typography>Enter Online Amount</Typography>
                <TextField
                  type="number"
                  value={onlineAmount}
                  onChange={handleOnlineAmountChange}
                  min={0}
                />
              </Grid>
            </div>
          )}

          {shortId ? (
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                mb: "10px",
              }}
            >
              <Typography>
                Your ticket is booked. <b>TicketId: {shortId}</b>
              </Typography>
              <Button
                onClick={() => {
                  navigate(`/we/get-qr-tickets?tid=${shortId}`);
                  scrollToTop();
                }}
              >
                Generate QR Tickets
              </Button>
            </Box>
          ) : (
            <>
              <Button
                onClick={() => handlePurchase()}
                variant="contained"
                fullWidth
                disabled={!paymentMode || count === 0 || phoneNumber === ""}
              >
                Buy Now
              </Button>

              <FormHelperText error>{error}</FormHelperText>
            </>
          )}
        </Grid>
      </Grid>
      {invoiceData && <Invoice invoiceData={invoiceData} />}
    </Grid>
  );
};

export default WindowPurchase;
