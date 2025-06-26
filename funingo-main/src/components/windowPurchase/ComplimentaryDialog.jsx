import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Dialog, DialogContentText } from "@mui/material";
import React, { useState } from "react";
import { apiUrl} from "../../constants";
import axios from "axios"
import { addComplementaryCoins } from "../../actions/exployee";
import { useDispatch } from "react-redux";
const ComplimentaryDialog = ({ phoneNumber, open, onClose }) => {
  const dispatch = useDispatch();
  const [complementaryCoins, setComplementaryCoins] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const descriptionOptions = [
    { value: "DISPUTE", label: "DISPUTE" },
    { value: "PACKAGE", label: "PACKAGE" },
  ];

  const handleAddComplementaryhis = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Login or SignUp First");
    }
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
        phone_no: phoneNumber.length !== 4 ? "+91-" + phoneNumber : phoneNumber,
        redeemBy: redeemByEmp,
        redeemOff:
          phoneNumber.length !== 4 ? "+91-" + phoneNumber : phoneNumber,
        coins: complementaryCoins,
        activity: "Complementary Coins"
      },
      {
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const handleAddComplementaryCoins = async (coins) => {
    setLoading(true);

    const resp = await dispatch(
      addComplementaryCoins({
        phone_no: "+91-" + phoneNumber,
        coins,
        description,
      })
    );
    // add comp history
    handleAddComplementaryhis();
    console.log("resp from complimentary", resp);
    if (resp.type === "add/complementary/coins/fulfilled") {
      setComplementaryCoins(0);
      setDescription("");
      setSuccess(true);
    } else {
      setSuccess(false);
      setError(true);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setComplementaryCoins(0);
    setDescription("");
    setSuccess(false);
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Complementary Coins</DialogTitle>
      <DialogContent>
        <Grid display={"flex"} flexDirection={"column"} gap={"20px"}>
          <FormControl>
            <p style={{ fontSize: "14px", fontWeight: "500" }}>
              Add Complementary Coins
            </p>
            <TextField
              type="number"
              value={complementaryCoins}
              onChange={(e) => {
                const val = parseInt(e.target.value || "0");
                if (val < 0) return;
                setComplementaryCoins(val);
              }}
            />
          </FormControl>

          {/* Description Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Description</InputLabel>
            <Select
              value={description}
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
            >
              <MenuItem value="">
                <em>Select Description</em>
              </MenuItem>
              {descriptionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            onClick={() => handleAddComplementaryCoins(complementaryCoins)}
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
            disabled={loading || !description || complementaryCoins <= 0}
          >
            Add Complementary Coins
          </Button>
          {success && (
            <p style={{ color: "green" }}>Successfully added coins</p>
          )}
          {error && <p style={{ color: "red" }}>Failed to add coins</p>}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ComplimentaryDialog;
