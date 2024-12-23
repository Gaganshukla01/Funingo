import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import { Dialog, DialogContentText } from "@mui/material";
import React, { useState } from "react";
import { addComplementaryCoins } from "../../actions/exployee";
import { useDispatch } from "react-redux";

const ComplimentaryDialog = ({ phoneNumber, open, onClose }) => {
  const dispatch = useDispatch();

  const [complementaryCoins, setComplementaryCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleAddComplementaryCoins = async (coins) => {
    setLoading(true);
    const resp = await dispatch(
      addComplementaryCoins({
        phone_no: "+91-" + phoneNumber,
        coins,
      })
    );
    console.log("resp from complimentary", resp);
    if (resp.type === "add/complementary/coins/fulfilled") {
      setComplementaryCoins(0);
      setSuccess(true);
    } else {
      setSuccess(false);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
            disabled={loading}
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
