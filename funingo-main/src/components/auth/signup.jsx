import {
  Dialog,
  Typography,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Select from "react-select";

import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./style.scss";
import Logo from "../../assets/logo.png";
import { useFormik } from "formik";
import player from "../../utils/images/player.png";
import {
  addToken,
  addUser,
  removeUser,
  setLoggedIn,
  setVerified,
} from "../../utils/store/slice/userSlice";
import Snackbarcomponent from "../snackbar/snackbar";
import {
  validateEmail,
  validatePhoneNumber,
  validatePhoneNumberLength,
  validateConfirmPassword,
  validatePassword,
} from "../../utils/validators/validate";

import statesData, { localityData } from "./states";

import { apiUrl } from "../../constants";
import ChooseProfile from "./choose-profile";
import { closeAuthModal } from "../../utils/store/slice/appSlice";
import PasswordInput from "./password-input";
import { genderOptions } from "../booknow/booknow";
import { useNavigate } from "react-router-dom";
const initialValues = {
  name: "",
  lname: "",
  phone: "",
  email: "",
  pass: "",
  cpass: "",
  number: "",
};
const initialValidationError = {
  name: "",
  lname: "",
  phone: "",
  email: "",
  pass: "",
  cpass: "",
  number: "",
  login: "",
  forgetPass: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((store) => store.userSlice);
  const { isAuthModalOpen } = useSelector((state) => state.appSlice);

  const [isSignstate, setIsSignstate] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [isForgetPass, setIsForgetPass] = useState(false);
  const [isAddressState, setIsAddressState] = useState(false);
  const [isProfileState, setIsProfileState] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isSnack, setIsSnack] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    msg: "",
    severity: "",
  });
  const [validationsError, setValidationsError] = useState(
    initialValidationError
  );
  const [doResetForm, setdoResetForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    state: "",
    city: "",
    locality: "",
  });
  const [gender, setGender] = useState(null);
  const [dob, setdob] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState("m1");
  const navigate = useNavigate();

  const handleSelect = (selected) => setSelectedPicture(selected);

  //  for otp input

  const states = Object.keys(statesData).map((state) => ({
    label: state,
    value: state,
  }));
  const localities = localityData.map((locality) => ({
    label: locality,
    value: locality,
  }));
  const [cities, setCities] = useState([]);

  const onClose = () => dispatch(closeAuthModal());

  useEffect(() => {
    if (address.state)
      setCities(
        statesData[address.state].map((city) => ({
          label: city,
          value: city,
        }))
      );
  }, [address.city, address.state]);

  const [otp, setOtp] = React.useState("");

  const handleChang = (newValue) => {
    setOtp(newValue);
  };

  const handlerForSnack = () => {
    setIsSnack(false);
  };

  const handlerSetIsForgetPass = () => {
    setIsForgetPass(true);
  };

  const handlerShowLogout = () => {
    dispatch(removeUser());
    localStorage.removeItem("token");
    dispatch(setLoggedIn(false));
    navigate("/");
  };

  const { values, resetForm, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      onSubmit: async (values, { resetForm }) => {
        const data = {
          first_name: values?.name,
          last_name: values?.lname,
          phone_no: "+91-" + values?.phone,
          password: values?.pass,
          email: values?.email,
        };

        setValidationsError(initialValidationError);
        if (doResetForm) {
          resetForm({ values: initialValues });
          setdoResetForm(false);
        } else if (isResetPassword) {
          try {
            setIsLoading(true);
            const requestData = {
              phone_no: "+91-" + values.phone,
              otp: values.number,
              new_password: values.pass,
            };

            if (
              !validatePhoneNumberLength(values.phone) ||
              !validatePhoneNumber(values.phone)
            ) {
              setValidationsError({
                ...setValidationsError,
                phone: "Invalid Phone Number",
              });
              throw new Error("Invalid Phone Number");
            }

            if (!validatePassword(values.pass)) {
              setValidationsError({
                ...setValidationsError,
                pass: "Min length 8 Char",
              });
              throw new Error("Password should have alteast 8 chars");
            }

            const response = await axios.post(
              `${apiUrl}/user/validate-and-update-password`,
              requestData
            );
            const verifyResponse = response.data.success;
            if (verifyResponse) {
              setIsResetPassword(false);
              setIsSnack(true);
              setSnackDetails({
                msg: "Password Reset Successfully",
                severity: "success",
              });
              onClose();
            } else {
              setIsSnack(true);
              setSnackDetails({
                msg: "Password Reset Unsuccessfull",
                severity: "error",
              });
              throw new Error("Cannot Reset Password");
            }
          } catch (error) {
            console.error(error);
          } finally {
            resetForm({
              values: {
                ...values,
                number: "",
                pass: "",
              },
            });
            setIsLoading(false);
          }
        } else if (isForgetPass) {
          try {
            setIsLoading(true);
            const requestData = {
              phone_no: "+91-" + values.phone,
            };

            if (
              !validatePhoneNumberLength(values.phone) ||
              !validatePhoneNumber(values.phone)
            ) {
              setValidationsError({
                ...setValidationsError,
                phone: "Invalid Phone Number",
              });
              throw new Error("Invalid Phone Number");
            }

            const response = await axios.post(
              `${apiUrl}/user/forget-password`,
              requestData
            );

            const verifyResponse = response.data.success;
            if (verifyResponse) {
              setIsResetPassword(true);
              setIsSnack(true);
              setSnackDetails({
                msg: "OTP Sent Successfully",
                severity: "info",
              });
              setIsForgetPass(false);
            } else {
              setIsSnack(true);
              setSnackDetails({
                msg: "Phone Number Doesn't Match",
                severity: "warning",
              });

              setValidationsError({
                ...setValidationsError,
                phone: "Invalid Phone Number",
              });
              throw new Error("Invalid Phone Number");
            }
          } catch (error) {
            setValidationsError({
              ...setValidationsError,
              forgetPass: "Invalid Credentials",
            });
            console.error(error);
          } finally {
            setIsLoading(false);
            resetForm({
              values: {
                ...values,
              },
            });
          }
        } else if (
          !openOtp &&
          !isSignstate &&
          !isAddressState &&
          !isProfileState
        ) {
          try {
            //Registration
            setIsLoading(true);
            if (
              !validatePhoneNumberLength(values.phone) ||
              !validatePhoneNumber(values.phone)
            ) {
              setValidationsError({
                ...setValidationsError,
                phone: "Invalid Phone Number",
              });
              throw new Error("Invalid Phone Number");
            }
            if (!validateEmail(values.email)) {
              setValidationsError({
                ...setValidationsError,
                email: "Email Address is invalid",
              });
              throw new Error("Email Address is invalid");
            }
            if (!validatePassword(values.pass)) {
              setValidationsError({
                ...setValidationsError,
                pass: "Min length 8 Char",
              });
              throw new Error("Password should have alteast 8 chars");
            }

            if (!validateConfirmPassword(values.pass, values.cpass)) {
              setValidationsError({
                ...setValidationsError,
                cpass: "Password & Confirm Password doesn't Match",
              });
              resetForm({
                values: {
                  ...values,
                  cpass: "",
                },
              });
              throw new Error("Password & Confirm Password doesn't Match");
            }

            const response = await axios.post(`${apiUrl}/user`, data);
            if (!response.data.success) {
              throw new Error("Registration Failed!!");
            }
            const token = response.data.token;
            dispatch(addUser({ ...response.data.user, email: values.email }));
            dispatch(addToken(token));
            localStorage.setItem("token", token);
            setIsAddressState(true);
          } catch (error) {
            setIsSnack(true);

            if (error?.response?.data?.error === "password_not_set") {
              setIsForgetPass(true);
              setIsResetPassword(false);
              setIsSignstate(true);

              setSnackDetails({
                msg: "Password not set",
                severity: "warning",
              });
              return;
            }

            setSnackDetails({
              msg: !!error?.response?.data?.error
                ? error?.response?.data?.error
                : "Server Busy 🙇",
              severity: "warning",
            });
            console.error("Registration failed:", error);
          } finally {
            setIsLoading(false);
          }
        } else if (isAddressState) {
          try {
            //Updating User
            setIsLoading(true);

            const response = await axios.put(
              `${apiUrl}/user`,
              { ...address, gender, dob },
              {
                headers: {
                  token,
                },
              }
            );
            if (!response.data.success) {
              throw new Error("Registration Failed!!");
            }
            dispatch(addUser({ ...response.data.user, email: values.email }));
            // setOpenOtp(true);
            setIsProfileState(true);
            setIsAddressState(false);
          } catch (error) {
            setIsSnack(true);
            setSnackDetails({
              msg: !!error?.response?.data?.error
                ? error?.response?.data?.error
                : "Server Busy 🙇",
              severity: "warning",
            });
            console.error("Registration failed:", error);
          } finally {
            setIsLoading(false);
          }
        } else if (isProfileState) {
          // Profile selection state

          try {
            setIsLoading(true);

            const response = await axios.put(
              `${apiUrl}/user`,
              { profile_picture: selectedPicture },
              {
                headers: {
                  token,
                },
              }
            );
            if (!response.data.success) {
              throw new Error("Registration Failed!!");
            }
            dispatch(addUser({ ...response.data.user, email: values.email }));

            setOpenOtp(true);
            setIsProfileState(false);
          } catch (error) {
            setIsSnack(true);
            setSnackDetails({
              msg: !!error?.response?.data?.error
                ? error?.response?.data?.error
                : "Server Busy 🙇",
              severity: "warning",
            });
            console.error("Registration failed:", error);
          } finally {
            setIsLoading(false);
          }
        } else if (isSignstate) {
          //login
          setIsLoading(true);
          try {
            const requestData = {
              phone_no: "+91-" + values.phone,
              password: values.pass,
            };

            if (!validatePassword(values.pass)) {
              setValidationsError({
                ...setValidationsError,
                pass: "Min length 8 Char",
              });
              throw new Error("Password should have alteast 8 chars");
            }
            if (
              !validatePhoneNumberLength(values.phone) ||
              !validatePhoneNumber(values.phone)
            ) {
              setValidationsError({
                ...setValidationsError,
                phone: "Invalid Phone Number",
              });
              throw new Error("Invalid Phone Number");
            }
            const response = await axios.post(
              `${apiUrl}/user/login`,
              requestData
            );

            if (!response.data.success) {
              throw new Error("Login Failed!!");
            }
            const token = response.data.token;
            dispatch(addUser(response.data.user));
            dispatch(addToken(token));
            localStorage.setItem("token", token);
            setIsSnack(true);
            setSnackDetails({
              msg: "Login Successful!!",
              severity: "success",
            });
            dispatch(setLoggedIn(true));

            onClose();
            if (response.data.user.user_type === "admin") {
              navigate("/admin");
              return;
            } else navigate("/zone");
          } catch (error) {
            setIsSnack(true);
            setSnackDetails({
              msg: !!error?.response?.data?.error
                ? error?.response?.data?.error
                : "Server Busy 🙇",
              severity: "error",
            });
            setValidationsError({
              ...setValidationsError,
              login: "Invalid Credentials",
            });
            console.error("Login failed:", error.message);
          } finally {
            resetForm({
              values: {
                ...values,
                email: "",
                pass: "",
              },
            });
            setIsLoading(false);
          }
        } else if (openOtp) {
          setIsLoading(true);
          try {
            const requestData = {
              otp: values.number,
            };
            const token = localStorage.getItem("token");
            const headers = {
              token: token,
              "Content-Type": "application/json",
            };

            const response = await axios.post(
              `${apiUrl}/otp/verify`,
              requestData,
              {
                headers: headers,
              }
            );
            const verify = response.data.success;

            setIsSnack(true);
            if (verify) {
              setSnackDetails({
                msg: "Phone Number Verifed",
                severity: "success",
              });
              dispatch(setLoggedIn(true));
              dispatch(setVerified(true));
              navigate("/zone");
            } else {
              setSnackDetails({
                msg: "OTP is Wrong",
                severity: "warning",
              });

              throw new Error("OTP verification failed");
            }
            setOpenOtp(false);
            onClose();
          } catch (error) {
            setIsSnack(true);
            setSnackDetails({
              msg: "OTP Verification failed 🤔",
              severity: "error",
            });
            console.error("OTP Verification failed:", error);
          } finally {
            resetForm({
              values: initialValues,
            });
            setIsLoading(false);
          }
        }
      },
    });

  // signup div right side
  var signUpComp = (
    <div className="right-side">
      <div className="main active">
        <div className="moblogo">
          {" "}
          <img src={Logo} alt={"logo"}></img>
        </div>
        <div className="text">
          <h2>Sign up </h2>
          <p>Provide your details</p>
        </div>
        <div className="input-text">
          <div className="input-div">
            <input
              type="text"
              name="name"
              required
              require
              id="user_name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>First Name</span>
          </div>

          <div className="input-div">
            <input
              type="text"
              name="lname"
              required
              require
              value={values.lname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>Last Name </span>
          </div>
        </div>
        <div className="input-text">
          <div className="input-div">
            <input
              type="text"
              name="phone"
              required
              require
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>Mobile Number (Whatsapp)</span>
            {validationsError &&
              validationsError.phone &&
              validationsError.phone.length !== 0 && (
                <Typography sx={{ color: "red", fontSize: "13px" }}>
                  {validationsError.phone}
                </Typography>
              )}
          </div>
          <div className="input-div">
            <input
              type="text"
              name="email"
              required
              require
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>E-mail</span>
            {validationsError &&
              validationsError?.email &&
              validationsError.email.length !== 0 && (
                <Typography sx={{ color: "red", fontSize: "13px" }}>
                  {validationsError.email}
                </Typography>
              )}
          </div>
        </div>

        <div className="input-text">
          <div className="input-div">
            <PasswordInput
              type="text"
              name="pass"
              required
              require
              value={values.pass}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>Password</span>
            {validationsError &&
              validationsError?.pass &&
              validationsError.pass.length !== 0 && (
                <Typography sx={{ color: "red", fontSize: "13px" }}>
                  {validationsError.pass}
                </Typography>
              )}
          </div>
          <div className="input-div">
            <PasswordInput
              type="text"
              name="cpass"
              required
              require
              value={values.cpass}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>Confirm-Password</span>
            {validationsError &&
              validationsError?.cpass &&
              validationsError.cpass.length !== 0 && (
                <Typography sx={{ color: "red", fontSize: "9px" }}>
                  {validationsError.cpass}
                </Typography>
              )}
          </div>
        </div>

        <div className="buttons">
          <button className="input-button  next_button" type="submit">
            Register
          </button>
        </div>
      </div>

      <div className="already">
        <p style={{ pointerEvents: "none" }}>Already have an Account ? </p>
        <Typography
          sx={{
            color: "green !important",
            fontWeight: "600",
            lineHeight: "1.2",
            fontSize: "16px",
          }}
          onClick={() => {
            setIsSignstate(true);
          }}
        >
          Sign in
        </Typography>
      </div>
    </div>
  );

  // Login page right div
  var Logincom = (
    <div className="right-side">
      <div className="main active">
        <div className="moblogo">
          {" "}
          <img src={Logo}></img>
        </div>
        <div className="text">
          <h2>Login Here</h2>
          {validationsError &&
            validationsError?.login &&
            validationsError.login.length !== 0 && (
              <Typography sx={{ color: "red !important", fontSize: "13px" }}>
                {validationsError.login}
              </Typography>
            )}
          <p>Provide your details</p>
        </div>
        <div className="input-text">
          <div className="input-div">
            <input
              type="text"
              name="phone"
              required
              require
              id="number"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>Mobile Number</span>
            {validationsError &&
              validationsError?.phone &&
              validationsError.phone.length !== 0 && (
                <Typography sx={{ color: "red", fontSize: "13px" }}>
                  {validationsError.phone}
                </Typography>
              )}
          </div>
        </div>
        <div className="input-text">
          <div className="input-div">
            <Typography
              onClick={handlerSetIsForgetPass}
              sx={{
                cursor: "pointer",
                position: "absolute",
                right: "5px",
                top: "-23px",
              }}
            >
              Forgot Password?
            </Typography>
            <PasswordInput
              type="text"
              name="pass"
              required
              value={values.pass}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>Password</span>
            {validationsError &&
              validationsError?.pass &&
              validationsError.pass.length !== 0 && (
                <Typography sx={{ color: "red", fontSize: "13px" }}>
                  {validationsError.pass}
                </Typography>
              )}
          </div>
        </div>

        <div className="buttons">
          <button className="input-button  next_button" type="submit">
            Login
          </button>
        </div>
      </div>

      <div className="already">
        <p style={{ pointerEvents: "none" }}>New Customer? </p>
        <Typography
          sx={{
            color: "green !important",
            fontWeight: "600",
            lineHeight: "1.2",
            fontSize: "16px",
          }}
          onClick={() => {
            setIsSignstate(false);
          }}
        >
          Register Here
        </Typography>
      </div>
    </div>
  );

  // Forget Password Form
  var forgetPasswordForm = (
    <div className="right-side">
      <div className="main active">
        <div className="moblogo">
          {" "}
          <img src={Logo}></img>
        </div>
        <div className="text">
          <h2>Forgot Password </h2>
          {validationsError &&
            validationsError?.forgetPass &&
            validationsError.forgetPass.length !== 0 && (
              <Typography sx={{ color: "red !important", fontSize: "13px" }}>
                {validationsError.forgetPass}
              </Typography>
            )}
          <p>Provide your Registered Phone Number</p>
        </div>
        <div className="input-text">
          <div className="input-div">
            <input
              type="text"
              name="phone"
              required
              require
              id="number"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>Registered Mobile Number</span>
          </div>
        </div>

        <div className="buttons">
          <button
            className="input-button  next_button"
            type="submit"
            onClick={() => {}}
          >
            Send OTP
          </button>
        </div>
      </div>

      <div className="already">
        <p>Back to</p>
        <Typography
          sx={{
            fontWeight: "600",
            lineHeight: "1.2",
            color: "green !important",
          }}
          onClick={() => {
            setIsForgetPass(false);
            setIsSignstate(true);
          }}
        >
          Login
        </Typography>
      </div>
    </div>
  );

  var resetPasswordForm = (
    <div className="right-side">
      <div className="main active">
        <div className="text">
          <h2>Reset Password Form</h2>
          <p>Provide your details</p>
        </div>
        <Grid className="input-text" flexDirection={"column"} gap={"5px"}>
          <Grid fontSize={"13px"}>Registered Mobile Number</Grid>
          <div className="input-div">
            <input
              type="text"
              name="phone"
              required
              require
              id="number"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={true}
              style={{
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                padding: "8px",
                color: "#888",
                cursor: "not-allowed",
              }}
            />
          </div>
        </Grid>

        <div className="input-text">
          <div className="input-div">
            <input
              type="text"
              name="number"
              required
              require
              id="number"
              value={values.number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>OTP</span>
          </div>

          {/* <MuiOtpInput value={otp} onChange={handleChang} /> */}
        </div>

        <div className="input-text">
          <div className="input-div">
            <input
              type="text"
              name="pass"
              required
              require
              value={values.pass}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>New Password</span>
            {validationsError &&
              validationsError?.pass &&
              validationsError.pass.length !== 0 && (
                <Typography sx={{ color: "red !important", fontSize: "13px" }}>
                  {validationsError.pass}
                </Typography>
              )}
          </div>
        </div>
        <Grid
          className="buttons"
          display={"flex"}
          gap="20px"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={{ md: "space-between" }}
          alignItems={{ xs: "center", md: "flex-start" }}
        >
          <button
            className="input-button  next_button"
            type="submit"
            style={{
              backgroundColor: "#213d81",
              border: "1px solid #213d81",
              cursor: "pointer",
              fontWeight: "500",
              padding: "5px 10px",
            }}
          >
            Set Password
          </button>
          <button
            className="input-button  next_button"
            type="submit"
            onClick={() => {
              setIsResetPassword(false);
              setIsSignstate(false);
              resetForm();
            }}
            style={{
              backgroundColor: "white",
              border: "1px solid #213d81",
              cursor: "pointer",
              color: "#213d81",
            }}
          >
            Cancel
          </button>
          {/* <Button variant='contained'>Set Password</Button>
          <Button variant='outlined'>Cancel</Button> */}
        </Grid>
      </div>
    </div>
  );

  // otp page right div
  var Otpcom = (
    <div className="right-side">
      <div className="main active">
        <div className="moblogo">
          {" "}
          <img src={Logo}></img>
        </div>
        <div className="text">
          <h2>OTP Verification </h2>
          <p>Provide details</p>
        </div>
        <div className="input-text">
          <div className="input-div">
            <input
              type="text"
              name="number"
              required
              require
              id="number"
              value={values.number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>OTP</span>
          </div>
        </div>

        <div className="buttons">
          <button className="input-button  next_button" type="submit">
            Sumbit
          </button>
        </div>
      </div>
    </div>
  );

  const addressPage = (
    <div className="right-side">
      <div className="main active">
        <div className="moblogo">
          {" "}
          <img src={Logo} alt={"logo"}></img>
        </div>
        <div className="text">
          <h2>Your Details</h2>
          <p>Provide your Location details</p>
        </div>

        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            mt: "10px",
          }}
        >
          <Select
            value={
              states.find((state) => state.value === address.state) ?? null
            }
            onChange={(e) => setAddress((add) => ({ ...add, state: e?.value }))}
            placeholder="Select your state"
            styles={{
              control: (provided) => ({
                ...provided,
                background: "white",
              }),
              input: (provided) => ({
                ...provided,
                color: "black",

                "& input": {
                  height: "30px",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "white" : "black",
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "200px",
              }),
            }}
            getOptionLabel={(opt) => opt.label}
            getOptionValue={(opt) => opt.value}
            required={true}
            isSearchable={true}
            isClearable
            options={states}
          />

          <Select
            value={
              cities.find((option) => option?.value === address.city) ?? null
            }
            onChange={(e) => setAddress((add) => ({ ...add, city: e?.value }))}
            placeholder="Select your city"
            styles={{
              control: (provided) => ({
                ...provided,
                background: "white",
              }),
              input: (provided) => ({
                ...provided,
                color: "black",

                "& input": {
                  height: "30px",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "white" : "black",
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "200px",
              }),
            }}
            required={true}
            isSearchable={true}
            options={cities}
            isClearable
            noOptionsMessage={() => "Please select your state first"}
          />

          {address.state === "Madhya Pradesh" &&
            address.city === "Jabalpur" && (
              <Select
                value={
                  localities.find(
                    (option) => option?.value === address.locality
                  ) ?? null
                }
                onChange={(e) =>
                  setAddress((add) => ({ ...add, locality: e?.value }))
                }
                placeholder="Select your locality"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    background: "white",
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: "black",

                    "& input": {
                      height: "30px",
                    },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isSelected ? "white" : "black",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: "150px",
                  }),
                }}
                required={true}
                isSearchable={true}
                isClearable
                options={localities}
              />
            )}
        </Grid>

        <div className="text">
          <p>Provide your Gender & Date of Birth</p>
        </div>

        <Grid mt="10px">
          <Select
            id="gender"
            name="gender"
            value={
              genderOptions.find((option) => option?.value === gender) ?? null
            }
            onChange={(e) => {
              setGender(e.value);
              // handleChange(e?.value);
            }}
            placeholder="Select Gender"
            styles={{
              control: (provided) => ({
                ...provided,
                background: "white",
              }),
              input: (provided) => ({
                ...provided,
                color: "black",

                "& input": {
                  height: "30px",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "white" : "black",
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "150px",
              }),
            }}
            required={true}
            isSearchable={true}
            options={genderOptions}
          />
          <TextField
            type="date"
            fullWidth
            value={dob}
            onChange={(e) => setdob(e.target.value)}
            sx={{
              mt: "10px",
              "& input": {
                p: "11px 15px",
              },
            }}
          />
        </Grid>

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: "20px",
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
  const userList = useSelector((store) => store.userSlice.userData);

  return (
    <div className="outer-div auth">
      {
        <Dialog open={isAuthModalOpen} onClose={onClose} maxWidth="50vw">
          {/* Loading overlay */}
          {isLoading && (
            <Grid className="loading-overlay">
              <CircularProgress />
            </Grid>
          )}
          <Grid>
            <form onSubmit={handleSubmit}>
              <div className="container">
                <div className="card">
                  <div className="form">
                    <div className="left-side">
                      <div className="left-heading">
                        <img className="logo" src={Logo} alt={"logo"} />
                      </div>

                      <div className="micro">
                        <img src={player} alt="not found"></img>
                      </div>
                    </div>
                    {/* right div */}
                    {isLoggedIn ? (
                      <Grid
                        sx={{
                          width: "40vw",
                          height: "20vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          endIcon={<LogoutIcon />}
                          onClick={handlerShowLogout}
                        >
                          Logout
                        </Button>
                      </Grid>
                    ) : isAddressState ? (
                      addressPage
                    ) : isProfileState ? (
                      <ChooseProfile
                        selectedPicture={selectedPicture}
                        handleSelect={handleSelect}
                      />
                    ) : openOtp ? (
                      Otpcom
                    ) : isSignstate ? (
                      !isForgetPass && !isResetPassword ? (
                        Logincom
                      ) : !isResetPassword ? (
                        forgetPasswordForm
                      ) : (
                        resetPasswordForm
                      )
                    ) : (
                      signUpComp
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Grid>
        </Dialog>
      }

      {isSnack && (
        <Snackbarcomponent
          open={isSnack}
          snackDetails={snackDetails}
          handlerForSnack={handlerForSnack}
        />
      )}
    </div>
  );
};

export default Register;
