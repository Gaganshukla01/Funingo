import React, { useEffect, useState } from "react";
import { validatePhoneNumber } from "../../utils/validators/validate";
import shortid from "shortid";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { apiUrl, flag_prices, payment_modes } from "../../constants";
import Coin from "../admin/Coin";
import Invoice from "../invoice";
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
  Card,
  CardContent,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import {
  Tour,
  Add,
  Remove,
  LocalOffer,
  Person,
  Phone,
  CalendarToday,
  AllInclusive,
  Group,
} from "@mui/icons-material";
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
      packageType: "regular", // 'regular' or 'unlimited'
      unlimitedPackage: "",
    },
  ]);

  const [couponDiscount, setCouponDiscount] = useState({});
  const [code, setCode] = useState("");
  const [count, setCount] = useState(1);
  const [personCount, setPersonCount] = useState(1);
  const [peopleCount, setPeopleCount] = useState(1); // For unlimited packages
  const [totalPrice, setTotalPrice] = useState(0);
  const [gstPrice, setGstPrice] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [unlimitedPackageData, setUnlimitedPackageData] = useState([]);
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
  const [complementaryCoinsModalOpen, setComplementaryCoinsModalOpen] =
    useState(false);
  const [selectedRegularPackages, setSelectedRegularPackages] = useState([]);
  const [selectedUnlimitedPackages, setSelectedUnlimitedPackages] = useState(
    []
  );
  const [regularPeopleCount, setRegularPeopleCount] = useState(1);
  const [unlimitedPeopleCount, setUnlimitedPeopleCount] = useState(1);
  const [selectAllUnlimited, setSelectAllUnlimited] = useState(false);

  const paymentModes = payment_modes.map((paymentMode) => ({
    label: paymentMode[0].toUpperCase() + paymentMode.slice(1),
    value: paymentMode,
  }));

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "others", label: "Others" },
  ];

  const packageTypeOptions = [
    { value: "regular", label: "Regular Package" },
    { value: "unlimited", label: "Unlimited Package" },
  ];

  // Convert packages to dropdown options
  const getRegularPackageOptions = () => {
    return packageData
      .filter(
        (pkg) =>
          !selectedRegularPackages.find(
            (selected) => selected.package._id === pkg._id
          )
      )
      .map((pkg) => ({
        value: pkg._id,
        label: `${pkg.name} - ₹${pkg.price} (${pkg.coins} coins)`,
        package: pkg,
      }));
  };

  const handleRegularPeopleCountChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value > 0 && value <= 50) {
      setRegularPeopleCount(value);
    }
  };

  // Filter unlimited packages for today
  const getTodayUnlimitedPackages = () => {
    const today = moment().format("dddd").toLowerCase(); // Get today's day (e.g., 'monday', 'tuesday')

    return unlimitedPackageData.filter((pkg) => {
      // Check if package is available today - use selectedDays instead of days
      return pkg.selectedDays && pkg.selectedDays.includes(today);
    });
  };

  const handleAddRegularPackage = (selectedOption) => {
    if (selectedOption) {
      const exists = selectedRegularPackages.find(
        (pkg) => pkg.package._id === selectedOption.package._id
      );
      if (!exists) {
        setSelectedRegularPackages((prev) => [
          ...prev,
          { package: selectedOption.package },
        ]);
      }
    }
  };

  const handleRemoveRegularPackage = (packageId) => {
    setSelectedRegularPackages((prev) =>
      prev.filter((item) => item.package._id !== packageId)
    );
  };

  // Handle unlimited package selection (only one can be selected)
  const handleSelectUnlimitedPackage = (pkg) => {
    setSelectedUnlimitedPackages((prev) => {
      const exists = prev.find((item) => item.package._id === pkg._id);
      if (exists) {
        return prev.filter((item) => item.package._id !== pkg._id);
      } else {
        return [...prev, { package: pkg, count: 1 }];
      }
    });
  };

  const handleSelectAllUnlimited = () => {
    const todayPackages = getTodayUnlimitedPackages();

    if (selectAllUnlimited) {
      // Deselect all
      setSelectedUnlimitedPackages([]);
      setSelectAllUnlimited(false);
    } else {
      // Select all with default count of 1
      const allPackages = todayPackages.map((pkg) => ({
        package: pkg,
        count: 1,
      }));
      setSelectedUnlimitedPackages(allPackages);
      setSelectAllUnlimited(true);
    }
  };

  const handleUnlimitedPackageCountChange = (packageId, direction) => {
    setSelectedUnlimitedPackages((prev) =>
      prev.map((item) => {
        if (item.package._id === packageId) {
          const newCount =
            direction === "increase"
              ? Math.min(item.count + 1, 20)
              : Math.max(item.count - 1, 1);
          return { ...item, count: newCount };
        }
        return item;
      })
    );
  };

  // Handle people count change
  const handlePeopleCountChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value > 0 && value <= 20) {
      setPeopleCount(value);
      setUnlimitedPeopleCount(value); // Keep them in sync
    }
  };

  // Get activity names and counts for display
  const getActivityDisplay = (activities) => {
    if (!activities || !Array.isArray(activities)) return "";

    return activities
      .map((activity) => {
        const count = activity.count === 999 ? "∞" : activity.count;
        return `${activity.name} (${count})`;
      })
      .join(", ");
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setIsValid(true);
    setFetchUserError(""); // Clear previous errors
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
  };

  const handleCheckClick = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setHelperText("Invalid phone number");
      setIsValid(false);
      return;
    } else {
      setHelperText("");
      setIsValid(true);
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        setExistingFuningoMoney(0);
        setFetchUserError(""); // Clear previous errors

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

        setExistingFuningoMoney(response.data.funingo_money || 0);
        setName(response.data?.name || "");

        if (response.data.premium) {
          let premiumFound = false;
          for (let data of response.data.premium) {
            if (new Date(data.expires_on) > Date.now()) {
              setIsPremium(true);
              premiumFound = true;
              break;
            }
          }
          if (!premiumFound) {
            setIsPremium(false);
          }
        } else {
          setIsPremium(false);
        }

        if (response.data.dob) {
          const formattedDate = moment(response.data.dob).format("YYYY-MM-DD");
          setDob(formattedDate);
        } else {
          setDob("");
        }

        toast.success("Customer data loaded successfully!");
      } catch (error) {
        console.log(error.message, error);
        const errorMessage =
          error?.response?.data?.error ||
          error.message ||
          "Failed to fetch customer data";
        setFetchUserError(errorMessage);
        toast.error(errorMessage);
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
  };

  const getDiscountUsingCoupon = async (event) => {
    try {
      const resp = await getDiscount({
        token,
        code,
        total_amount: totalPrice - premiumDiscount,
      });
      console.log("resp.discount", resp.discount);
      setCouponDiscount({ discount: resp.discount, message: resp.msg, code });
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error("Failed to apply coupon");
      setCouponDiscount({});
    }
  };

  // Handle payment mode change and set split payment visibility
  const handlePaymentModeChange = (selectedPaymentMode) => {
    setPaymentMode(selectedPaymentMode);

    console.log(selectedPaymentMode?.value, "chechimmg");
    setExtraField(selectedPaymentMode?.value === " Cash Online");

    // Reset split amounts when changing payment mode
    if (selectedPaymentMode?.value !== " Cash Online") {
      setcashAmount(null);
      setonlineAmount(null);
    }
  };

  // split payment logic
  const handleCashAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setcashAmount(value);
    const finalTotal = Math.max(
      0,
      totalPrice -
        premiumDiscount -
        (couponDiscount.discount || 0) -
        customDiscount
    );
    if (finalTotal - value >= 0) {
      setonlineAmount(finalTotal - value);
    } else {
      setonlineAmount(0);
      setcashAmount(finalTotal);
    }
  };

  const handleOnlineAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setonlineAmount(value);
    const finalTotal = Math.max(
      0,
      totalPrice -
        premiumDiscount -
        (couponDiscount.discount || 0) -
        customDiscount
    );
    if (finalTotal - value > 0) {
      setcashAmount(finalTotal - value);
    } else {
      setcashAmount(0);
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
        packageType: "regular",
        unlimitedPackage: "",
      },
    ]);
    setSelectedRegularPackages([]);
    setSelectedUnlimitedPackages([]);
    setSelectAllUnlimited(false);
    setCount(1);
    setPersonCount(1);
    setPeopleCount(1);
    setRegularPeopleCount(1);
    setUnlimitedPeopleCount(1);
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
  };

  const handlePurchase = async (callback) => {
    // Create details array from selected packages
    const regularDetails = selectedRegularPackages.flatMap((item) =>
      Array(regularPeopleCount)
        .fill()
        .map(() => ({
          package: item.package._id,
          packageType: "regular",
          person_name: "",
          age: "",
          gender: "",
          unlimitedPackageData: null,
        }))
    );

    // Updated unlimited details for multiple packages
    let unlimitedDetails = [];
    selectedUnlimitedPackages.forEach((item) => {
      const packageDetails = Array(item.count)
        .fill()
        .map(() => ({
          package: null,
          packageType: "unlimited",
          person_name: "",
          age: "",
          gender: "",
          unlimitedPackageData: {
            activities: item.package.activities,
            price: item.package.totalCost,
            name: item.package.packageName,
          },
        }));
      unlimitedDetails = [...unlimitedDetails, ...packageDetails];
    });

    const details = [...regularDetails, ...unlimitedDetails];

    const calculateCoins = () => {
      let totalCoins = 0;
      selectedRegularPackages.forEach((item) => {
        totalCoins += (item.package?.coins || 0) * regularPeopleCount;
      });
      return totalCoins;
    };

    const coinsToSend = calculateCoins();
    const hasUnlimitedPackage = selectedUnlimitedPackages.length > 0;

    try {
      const finalTotal = Math.max(
        0,
        totalPrice -
          premiumDiscount -
          (couponDiscount.discount || 0) -
          customDiscount
      );

      const response = await windowPurchase({
        count: personCount,
        total_amount: finalTotal,
        cash_amount: showExtraField ? cashAmount : finalTotal,
        online_amount: showExtraField ? onlineAmount : 0,
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
      const errorMessage =
        error?.response?.data?.error || "Booking failed. Please try again.";
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

        // Fetch unlimited packages from API
        const headers = {
          token: token,
          "Content-Type": "application/json",
        };

        try {
          const unlimitedResponse = await axios.get(
            `${apiUrl}/unlimitedPackage/packages`,
            { headers }
          );
          console.log("Unlimited packages response:", unlimitedResponse.data);
          // Handle the nested data structure from API response
          if (unlimitedResponse.data.success && unlimitedResponse.data.data) {
            setUnlimitedPackageData(unlimitedResponse.data.data);
          } else {
            setUnlimitedPackageData([]);
          }
        } catch (unlimitedError) {
          console.error("Error fetching unlimited packages:", unlimitedError);
          setUnlimitedPackageData([]);
        }

        let rawData = response.data.packages;
        handlePackageDataResponse(rawData);
      } catch (error) {
        console.error(error.message, error);
        toast.error("Failed to load packages");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    let totalPrice = 0;
    let totalCount = 0;

    // Calculate regular packages total
    if (selectedRegularPackages.length > 0) {
      const regularTotal = selectedRegularPackages.reduce((sum, item) => {
        return sum + (item.package?.price || 0);
      }, 0);
      totalPrice += regularTotal;
      totalCount += regularPeopleCount;
    }

    // Calculate unlimited packages total (updated for multiple packages)
    if (selectedUnlimitedPackages.length > 0) {
      const unlimitedTotal = selectedUnlimitedPackages.reduce((sum, item) => {
        return sum + item.package.totalCost * item.count;
      }, 0);
      totalPrice += unlimitedTotal;

      const unlimitedCount = selectedUnlimitedPackages.reduce((sum, item) => {
        return sum + item.count;
      }, 0);
      totalCount += unlimitedCount;
    }

    let premiumDiscount = 0;
    if (isPremium) {
      premiumDiscount = totalPrice / 2;
      setPremiumDiscount(premiumDiscount);
    } else {
      setPremiumDiscount(0);
    }

    setTotalPrice(totalPrice);
    setPersonCount(totalCount);
  }, [
    selectedRegularPackages,
    selectedUnlimitedPackages, // Changed from selectedUnlimitedPackage
    regularPeopleCount,
    isPremium,
  ]);

  // Custom styles for React Select
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "45px",
      borderRadius: "8px",
      borderColor: "#e0e0e0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      "&:hover": {
        borderColor: "#1976d2",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#1976d2"
        : state.isFocused
        ? "#f5f5f5"
        : "white",
      color: state.isSelected ? "white" : "#333",
      padding: "10px 16px",
    }),
  };

  // Check if form is valid for purchase
  const isFormValid = () => {
    const hasValidPackages =
      selectedRegularPackages.length > 0 ||
      selectedUnlimitedPackages.length > 0; // Updated
    const hasBasicInfo = phoneNumber && paymentMode && name;
    const hasValidTotal = totalPrice > 0;

    return hasValidPackages && hasBasicInfo && hasValidTotal;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: { xs: "16px", md: "24px" },
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "white", mb: 2 }} size={60} />
            <Typography sx={{ color: "white", fontSize: "18px" }}>
              Loading...
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Tour fontSize="large" />
            Window Purchase
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Book tickets and manage customer purchases
          </Typography>
        </Paper>

        {/* Customer Information Card */}
        <Card
          elevation={3}
          sx={{ mb: 4, borderRadius: "16px", overflow: "hidden" }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Customer Information
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {/* Phone Number Section */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    mb: 1,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Phone fontSize="small" color="primary" />
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={phoneNumber}
                  placeholder="Enter valid Phone Number"
                  onChange={handlePhoneNumberChange}
                  error={!isValid}
                  helperText={!isValid && helperText}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      "& input": {
                        "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                          {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                      },
                    },
                  }}
                />
                <Box
                  sx={{ mt: 2, p: 2, bgcolor: "#e8f5e8", borderRadius: "8px" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "600", color: "#2e7d32" }}
                  >
                    Available Funingo Money: ₹{existingFuningoMoney}
                  </Typography>
                  {isPremium && (
                    <Chip
                      label="Premium Member"
                      color="warning"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
                {fetchUserError && (
                  <Typography color="error" sx={{ mt: 1, fontSize: "14px" }}>
                    {fetchUserError}
                  </Typography>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleCheckClick}
                  disabled={isLoading || !phoneNumber}
                  sx={{
                    height: "56px",
                    px: 4,
                    borderRadius: "12px",
                    background: "linear-gradient(45deg, #42a5f5, #478ed1)",
                    boxShadow: "0 4px 12px rgba(66, 165, 245, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1e88e5, #1976d2)",
                      boxShadow: "0 6px 16px rgba(66, 165, 245, 0.6)",
                    },
                    "&:disabled": {
                      background: "#e0e0e0",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Check Customer"
                  )}
                </Button>
              </Grid>
            </Grid>

            {/* Name and DOB Section */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    mb: 1,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Person fontSize="small" color="primary" />
                  Customer Name
                </Typography>
                <TextField
                  fullWidth
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter customer name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    mb: 1,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CalendarToday fontSize="small" color="primary" />
                  Date of Birth
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Package Selection Card */}
        <Card
          elevation={3}
          sx={{ mb: 4, borderRadius: "16px", overflow: "hidden" }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #ff6b6b 0%, #ffa726 100%)",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Package Selection
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {/* Regular Packages Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocalOffer color="primary" />
                Regular Packages
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                  <ReactSelect
                    options={getRegularPackageOptions()}
                    onChange={handleAddRegularPackage}
                    placeholder="Select regular packages..."
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    isDisabled={isLoading}
                    value={null}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Tickets" // Changed from "People Count"
                    value={regularPeopleCount}
                    onChange={handleRegularPeopleCountChange}
                    inputProps={{ min: 1, max: 50 }}
                    helperText="How many tickets do you want?" // Added helper text
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Selected Regular Packages Display */}
              {selectedRegularPackages.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 3,
                      fontWeight: "700",
                      color: "#2e7d32",
                      fontSize: "1.1rem",
                    }}
                  >
                    🎫 Selected Regular Packages
                  </Typography>
                  {selectedRegularPackages.map((item, index) => (
                    <Paper
                      key={index}
                      elevation={6}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: "16px",
                        border: "2px solid #c8e6c9",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8fff8 100%)",
                        boxShadow:
                          "0 8px 32px rgba(46, 125, 50, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow:
                            "0 12px 40px rgba(46, 125, 50, 0.18), 0 4px 12px rgba(0, 0, 0, 0.12)",
                          transform: "translateY(-2px)",
                          border: "2px solid #a5d6a7",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "700",
                              color: "#1b5e20",
                              mb: 1,
                              fontSize: "1.2rem",
                            }}
                          >
                            {item.package.name}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1.5,
                              mb: 2,
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={`₹${item.package.price} per package`}
                              sx={{
                                bgcolor: "#e8f5e8",
                                color: "#2e7d32",
                                fontWeight: "600",
                                border: "1px solid #c8e6c9",
                              }}
                            />
                            <Chip
                              label={`${item.package.coins} coins per person`}
                              sx={{
                                bgcolor: "#fff3e0",
                                color: "#f57c00",
                                fontWeight: "600",
                                border: "1px solid #ffcc02",
                              }}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#388e3c",
                              mb: 2,
                              fontWeight: "500",
                              bgcolor: "#f1f8e9",
                              p: 1,
                              borderRadius: "8px",
                              border: "1px solid #c8e6c9",
                            }}
                          >
                            🎟️ Number of tickets: {regularPeopleCount}
                          </Typography>

                          <Box
                            sx={{
                              bgcolor: "#e8f5e8",
                              p: 2,
                              borderRadius: "12px",
                              border: "2px solid #c8e6c9",
                              boxShadow: "0 2px 8px rgba(46, 125, 50, 0.1)",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2e7d32",
                                fontWeight: "700",
                                fontSize: "1.1rem",
                                textAlign: "center",
                              }}
                            >
                              💰 Package Total: ₹{item.package.price}
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleRemoveRegularPackage(item.package._id)
                          }
                          sx={{
                            borderRadius: "12px",
                            p: 1.5,
                            minWidth: "auto",
                            border: "2px solid #f44336",
                            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                            "&:hover": {
                              bgcolor: "#ffebee",
                              border: "2px solid #d32f2f",
                              boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <DeleteForeverIcon sx={{ fontSize: "1.5rem" }} />
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                  <Paper
                    elevation={8}
                    sx={{
                      p: 3,
                      background:
                        "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
                      borderRadius: "16px",
                      border: "3px solid #1b5e20",
                      boxShadow:
                        "0 12px 40px rgba(56, 142, 60, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)",
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "700",
                          mb: 1,
                          textAlign: "center",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        🎫 Regular Packages Summary
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: "800",
                              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              color: "#ffeb3b",
                            }}
                          >
                            ₹
                            {selectedRegularPackages.reduce(
                              (sum, item) => sum + (item.package?.price || 0),
                              0
                            )}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "600",
                              opacity: 0.9,
                            }}
                          >
                            Total Amount
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: "800",
                              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              color: "#ffeb3b",
                            }}
                          >
                            {regularPeopleCount}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "600",
                              opacity: 0.9,
                            }}
                          >
                            Total Tickets
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
            {/* Unlimited Packages Section */}
            <Divider sx={{ my: 3 }} />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AllInclusive color="primary" />
                  Unlimited Packages (Today Available)
                </Typography>

                {getTodayUnlimitedPackages().length > 0 && (
                  <Button
                    variant={selectAllUnlimited ? "contained" : "outlined"}
                    onClick={handleSelectAllUnlimited}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                    }}
                  >
                    {selectAllUnlimited ? "Deselect All" : "Select All"}
                  </Button>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Available unlimited packages for today:
              </Typography>

              {getTodayUnlimitedPackages().length === 0 ? (
                <Paper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "#f5f5f5",
                    borderRadius: "12px",
                  }}
                >
                  <Typography color="text.secondary">
                    No unlimited packages available for today
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {getTodayUnlimitedPackages().map((pkg, index) => {
                    const selectedItem = selectedUnlimitedPackages.find(
                      (item) => item.package._id === pkg._id
                    );
                    const isSelected = !!selectedItem;

                    return (
                      <Grid item xs={12} key={index}>
                        <Paper
                          elevation={isSelected ? 4 : 1}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: isSelected
                              ? "2px solid #1976d2"
                              : "1px solid #e0e0e0",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              elevation: 3,
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={() => handleSelectUnlimitedPackage(pkg)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "600", mb: 1 }}
                              >
                                {pkg.packageName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                ₹{pkg.totalCost} per person
                              </Typography>
                              <Typography variant="body2" color="primary">
                                Activities: {getActivityDisplay(pkg.activities)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Available Days: {pkg.selectedDays?.join(", ")}
                              </Typography>
                            </Box>

                            {/* People Count Controls - Show when this package is selected */}
                            {isSelected && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  ml: 2,
                                  p: 1,
                                  bgcolor: "#f8f9fa",
                                  borderRadius: "8px",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnlimitedPackageCountChange(
                                      pkg._id,
                                      "decrease"
                                    );
                                  }}
                                  disabled={selectedItem.count <= 1}
                                  sx={{
                                    minWidth: "32px",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    p: 0,
                                  }}
                                >
                                  <Remove fontSize="small" />
                                </Button>

                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "bold",
                                    minWidth: "40px",
                                    textAlign: "center",
                                    color: "#1976d2",
                                  }}
                                >
                                  {selectedItem.count}
                                </Typography>

                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnlimitedPackageCountChange(
                                      pkg._id,
                                      "increase"
                                    );
                                  }}
                                  disabled={selectedItem.count >= 20}
                                  sx={{
                                    minWidth: "32px",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    p: 0,
                                  }}
                                >
                                  <Add fontSize="small" />
                                </Button>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ ml: 1 }}
                                >
                                  People
                                </Typography>
                              </Box>
                            )}

                            {isSelected && (
                              <Chip
                                label="Selected"
                                color="primary"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              )}

              {/* Selected Unlimited Packages Summary */}
              {selectedUnlimitedPackages.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 3,
                      fontWeight: "700",
                      color: "#2c5aa0",
                      fontSize: "1.1rem",
                    }}
                  >
                    🎯 Selected Unlimited Packages
                  </Typography>

                  {selectedUnlimitedPackages.map((item, index) => (
                    <Paper
                      key={index}
                      elevation={6}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: "16px",
                        border: "2px solid #e3f2fd",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
                        boxShadow:
                          "0 8px 32px rgba(44, 90, 160, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow:
                            "0 12px 40px rgba(44, 90, 160, 0.18), 0 4px 12px rgba(0, 0, 0, 0.12)",
                          transform: "translateY(-2px)",
                          border: "2px solid #bbdefb",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "700",
                              color: "#1565c0",
                              mb: 1,
                              fontSize: "1.2rem",
                            }}
                          >
                            {item.package.packageName}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1.5,
                              mb: 2,
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={`₹${item.package.totalCost} per person`}
                              sx={{
                                bgcolor: "#e8f5e8",
                                color: "#2e7d32",
                                fontWeight: "600",
                                border: "1px solid #c8e6c9",
                              }}
                            />
                            <Chip
                              label={`${item.count} people`}
                              sx={{
                                bgcolor: "#fff3e0",
                                color: "#f57c00",
                                fontWeight: "600",
                                border: "1px solid #ffcc02",
                              }}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1976d2",
                              mb: 2,
                              fontWeight: "500",
                              bgcolor: "#e3f2fd",
                              p: 1,
                              borderRadius: "8px",
                              border: "1px solid #bbdefb",
                            }}
                          >
                            🎮 Activities:{" "}
                            {getActivityDisplay(item.package.activities)}
                          </Typography>

                          <Box
                            sx={{
                              bgcolor: "#e8f5e8",
                              p: 2,
                              borderRadius: "12px",
                              border: "2px solid #c8e6c9",
                              boxShadow: "0 2px 8px rgba(46, 125, 50, 0.1)",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2e7d32",
                                fontWeight: "700",
                                fontSize: "1.1rem",
                                textAlign: "center",
                              }}
                            >
                              💰 Subtotal: ₹
                              {item.package.totalCost * item.count}
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleSelectUnlimitedPackage(item.package)
                          }
                          sx={{
                            borderRadius: "12px",
                            p: 1.5,
                            minWidth: "auto",
                            border: "2px solid #f44336",
                            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                            "&:hover": {
                              bgcolor: "#ffebee",
                              border: "2px solid #d32f2f",
                              boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <DeleteForeverIcon sx={{ fontSize: "1.5rem" }} />
                        </Button>
                      </Box>
                    </Paper>
                  ))}

                  <Paper
                    elevation={8}
                    sx={{
                      p: 3,
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      borderRadius: "16px",
                      border: "3px solid #0d47a1",
                      boxShadow:
                        "0 12px 40px rgba(25, 118, 210, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)",
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "700",
                          mb: 1,
                          textAlign: "center",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        🎯 Grand Total Summary
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: "800",
                              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              color: "#ffeb3b",
                            }}
                          >
                            ₹
                            {selectedUnlimitedPackages.reduce(
                              (sum, item) =>
                                sum + item.package.totalCost * item.count,
                              0
                            )}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "600",
                              opacity: 0.9,
                            }}
                          >
                            Total Amount
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: "800",
                              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              color: "#ffeb3b",
                            }}
                          >
                            {selectedUnlimitedPackages.reduce(
                              (sum, item) => sum + item.count,
                              0
                            )}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "600",
                              opacity: 0.9,
                            }}
                          >
                            Total People
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Pricing & Discounts Card */}
        <Card
          elevation={3}
          sx={{ mb: 4, borderRadius: "16px", overflow: "hidden" }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Pricing & Discounts
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Coupon Section */}
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    mb: 1,
                    color: "#333",
                  }}
                >
                  Coupon Code
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter coupon code"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={getDiscountUsingCoupon}
                    disabled={!code || totalPrice === 0}
                    sx={{
                      borderRadius: "12px",
                      px: 3,
                    }}
                  >
                    Apply
                  </Button>
                </Box>
                {couponDiscount.message && (
                  <Typography
                    color="success.main"
                    sx={{ mt: 1, fontSize: "14px" }}
                  >
                    {couponDiscount.message}
                  </Typography>
                )}
              </Grid>

              {/* Custom Discount */}
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    mb: 1,
                    color: "#333",
                  }}
                >
                  Custom Discount
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={customDiscount}
                  onChange={handleCustomDiscountChange}
                  placeholder="Enter custom discount amount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Price Summary */}
            <Paper
              elevation={1}
              sx={{
                mt: 3,
                p: 3,
                bgcolor: "#f8f9fa",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
                Price Summary
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal:</Typography>
                <Typography>₹{totalPrice}</Typography>
              </Box>
              {isPremium && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="warning.main">
                    Premium Discount (50%):
                  </Typography>
                  <Typography color="warning.main">
                    -₹{premiumDiscount}
                  </Typography>
                </Box>
              )}
              {couponDiscount.discount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="success.main">Coupon Discount:</Typography>
                  <Typography color="success.main">
                    -₹{couponDiscount.discount}
                  </Typography>
                </Box>
              )}
              {customDiscount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="info.main">Custom Discount:</Typography>
                  <Typography color="info.main">-₹{customDiscount}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Final Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  ₹
                  {Math.max(
                    0,
                    totalPrice -
                      premiumDiscount -
                      (couponDiscount.discount || 0) -
                      customDiscount
                  )}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total People:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {personCount}
                </Typography>
              </Box>
            </Paper>
          </CardContent>
        </Card>

        {/* Payment Information Card */}
        <Card
          elevation={3}
          sx={{ mb: 4, borderRadius: "16px", overflow: "hidden" }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Payment Information
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    mb: 1,
                    color: "#333",
                  }}
                >
                  Payment Mode
                </Typography>
                <ReactSelect
                  options={paymentModes}
                  value={paymentMode}
                  onChange={handlePaymentModeChange}
                  placeholder="Select payment mode..."
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </Grid>

              {showExtraField && (
                <>
                  <Grid item xs={12} md={3}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "600",
                        mb: 1,
                        color: "#333",
                      }}
                    >
                      Cash Amount
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={cashAmount || ""}
                      onChange={handleCashAmountChange}
                      placeholder="Enter cash amount"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "600",
                        mb: 1,
                        color: "#333",
                      }}
                    >
                      Online Amount
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={onlineAmount || ""}
                      onChange={handleOnlineAmountChange}
                      placeholder="Enter online amount"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handlePurchase}
            disabled={!isFormValid() || isLoading}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(45deg, #4caf50, #45a049)",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
              "&:hover": {
                background: "linear-gradient(45deg, #45a049, #3d8b40)",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.6)",
              },
              "&:disabled": {
                background: "#e0e0e0",
                boxShadow: "none",
              },
            }}
          >
            <Group sx={{ mr: 1 }} />
            Book Tickets
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={resetForm}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              borderColor: "#f44336",
              color: "#f44336",
              "&:hover": {
                borderColor: "#d32f2f",
                backgroundColor: "rgba(244, 67, 54, 0.04)",
              },
            }}
          >
            Reset Form
          </Button>

          {userType === "admin" && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => setComplementaryCoinsModalOpen(true)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                borderColor: "#ff9800",
                color: "#ff9800",
                "&:hover": {
                  borderColor: "#f57c00",
                  backgroundColor: "rgba(255, 152, 0, 0.04)",
                },
              }}
            >
              <Coin sx={{ mr: 1 }} />
              Add Complimentary Coins
            </Button>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 4,
              bgcolor: "#ffebee",
              borderRadius: "12px",
              border: "1px solid #f44336",
            }}
          >
            <Typography color="error" sx={{ textAlign: "center" }}>
              {error}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={(callback) => {
          setConfirmationModalOpen(false);
          handlePurchase(callback);
        }}
        data={{
          regularPackages: selectedRegularPackages,
          unlimitedPackage: selectedUnlimitedPackages,
          regularPeopleCount,
          unlimitedPeopleCount,
          totalPrice,
          premiumDiscount,
          couponDiscount: couponDiscount.discount || 0,
          customDiscount,
          finalTotal: Math.max(
            0,
            totalPrice -
              premiumDiscount -
              (couponDiscount.discount || 0) -
              customDiscount
          ),
          phoneNumber,
          name,
          paymentMode: paymentMode?.label,
          cashAmount: showExtraField ? cashAmount : 0,
          onlineAmount: showExtraField ? onlineAmount : 0,
        }}
      />

      {/* Complimentary Coins Modal */}
      <ComplimentaryDialog
        open={complementaryCoinsModalOpen}
        onClose={() => setComplementaryCoinsModalOpen(false)}
      />

      {/* Invoice Component */}
      {shortId && (
        // <Invoice shortId={shortId} onClose={() => setShortId(null)} />
        <span></span>
      )}
    </Box>
  );
};

export default WindowPurchase;
