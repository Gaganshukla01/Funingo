import React, { useState } from "react";
import { memo } from "react";
import { Grid, Typography } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// import IconButton from "@mui/material/IconButton";
// import CancelIcon from "@mui/icons-material/Cancel";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Snackbarcomponent = memo(({ open, snackDetails, handlerForSnack }) => {
  const { msg, severity } = snackDetails;
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    handlerForSnack();
  };

  return (
    <Grid zIndex={1}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert
          onClose={handleCloseSnack}
          severity={severity}
          sx={{ width: "100%", color: "white" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </Grid>
  );
});

export default Snackbarcomponent;
