import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadSalesData,
  downloadUserData,
  getActivityUsage,
  getCoinsPerPerson,
  getRevenueTransactionSplit,
  getUserFrequency,
} from "../../../actions/new-stats";
import {
  Box,
  Button,
  Grid,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { backgroundColors, options } from ".";
import moment from "moment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const LIMIT = 10;

const UserFrequency = () => {
  const dispatch = useDispatch();
  const {
    coinsPerPerson = {},
    userFrequency = {},
    downloadUrl = "",
  } = useSelector((state) => state.statsSlice);

  const [startDate, setStartDate] = useState(() =>
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [sort, setSort] = useState("desc"); // "asc" or "desc"
  const [offset, setOffset] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);

  const handleGetUserFrequency = () => {
    dispatch(
      getUserFrequency({
        startDate,
        endDate,
        sort,
        offset,
        phoneNumber: phoneNumber ? phoneNumber : "",
        minAge: minAge ? minAge : 0,
        maxAge: maxAge ? maxAge : 100,
      })
    );
  };

  const handleDownloadUserData = async () => {
    const data = await dispatch(downloadUserData({ startDate, endDate }));
    if (data.type.endsWith("/fulfilled")) {
      if (data.payload.url) {
        const link = document.createElement("a");
        link.href = data.payload.url;
        link.download = "user_data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Download URL is not available");
      }
    }
  };

  const handleDownloadSalesData = async () => {
    const data = await dispatch(downloadSalesData({ startDate, endDate }));
    if (data.type.endsWith("/fulfilled")) {
      if (data.payload.url) {
        const link = document.createElement("a");
        link.href = data.payload.url;
        link.download = "user_data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Download URL is not available");
      }
    }
  };

  useEffect(() => {
    dispatch(getCoinsPerPerson({ startDate, endDate }));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    handleGetUserFrequency();
  }, [dispatch, startDate, endDate, sort, offset]);

  return (
    <Grid container spacing={2} px={10}>
      <Grid
        sx={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
          my: 3,
          width: "100%",
        }}
      >
        <Box
          component={"input"}
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
          max={endDate}
        />
        <Box
          component={"input"}
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
          min={startDate}
        />
      </Grid>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          border: "1px solid #000",
          p: 2,
          borderRadius: "10px",
        }}
      >
        <Grid
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{ fontSize: "18px", fontWeight: "600", lineHeight: 1 }}
          >
            Download User Data:
          </Typography>
          <Button variant="contained" onClick={handleDownloadUserData}>
            Download
          </Button>
        </Grid>

        <Grid
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{ fontSize: "18px", fontWeight: "600", lineHeight: 1 }}
          >
            Download Sales Data:
          </Typography>
          <Button variant="contained" onClick={handleDownloadSalesData}>
            Download
          </Button>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          width: "100%",
          my: 3,
          border: "1px solid #000",
          p: 2,
          borderRadius: "10px",
        }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
          Coins Per Purchase:
        </Typography>
        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
          {coinsPerPerson?.coins_per_user || 0}
        </Typography>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{ width: "100%", justifyContent: "center", my: 3, gap: 5 }}
      >
        <Box>
          <Typography>Min Age</Typography>
          <TextField
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            type="number"
            placeholder="Enter min age"
          />
        </Box>

        <Box>
          <Typography>Max Age</Typography>
          <TextField
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            type="number"
            placeholder="Enter max age"
          />
        </Box>

        <Box>
          <Typography>Phone Number</Typography>
          <TextField
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
        </Box>

        <Button
          variant="contained"
          sx={{ height: "40px", alignSelf: "flex-end" }}
          onClick={handleGetUserFrequency}
        >
          Search
        </Button>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          width: "100%",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell
                  onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
                  sx={{ cursor: "pointer" }}
                >
                  Frequency{" "}
                  {sort === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </TableCell>
                <TableCell>Coins</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userFrequency?.result?.map((data) => (
                <TableRow>
                  <TableCell>{data.first_name}</TableCell>
                  <TableCell>{data.last_name}</TableCell>
                  <TableCell>{data.phone_no}</TableCell>
                  <TableCell>{moment(data.dob).format("DD-MM-YYYY")}</TableCell>
                  <TableCell>{data.count}</TableCell>
                  <TableCell>{data.funingo_money}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid
        sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 3 }}
      >
        <Pagination
          count={userFrequency?.totalPages || 1}
          page={offset / LIMIT + 1}
          onChange={(e, page) => setOffset((page - 1) * LIMIT)}
        />
      </Grid>
    </Grid>
  );
};

export default UserFrequency;
