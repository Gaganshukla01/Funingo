import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActivityUsage,
  getCoinsPerPerson,
  getRevenueTransactionSplit,
  getUserFrequency,
} from "../../../actions/new-stats";
import { Box, Grid, Typography } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { backgroundColors, options } from ".";
import moment from "moment";

const NewStats = () => {
  const dispatch = useDispatch();
  const { activityUsage = [], revenueTransactionSplit = [] } = useSelector(
    (state) => state.statsSlice
  );

  const [startDate, setStartDate] = useState(() =>
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const revenueTransactionSplitData = useMemo(() => {
    let labels = revenueTransactionSplit.map((data) => data._id);

    let datasets = [];

    const dataset = {
      data: revenueTransactionSplit.map((data) => ({
        value: data.total_amount,
        key: data._id,
      })),
      label: `Revenue Transaction Split`,
      backgroundColor: backgroundColors.slice(0, labels.length),
      parsing: {
        yAxisKey: "value",
        xAxisKey: "key",
      },
    };

    datasets.push(dataset);

    return {
      labels,
      datasets,
    };
  }, [revenueTransactionSplit]);

  const activityUsageData = useMemo(() => {
    let labels = activityUsage.map((data) => data.activity_name);

    let datasets = [];

    const dataset = {
      data: activityUsage.map((data) => ({
        value: data.count,
        key: data.activity_name,
      })),
      label: `Activity Usage`,
      backgroundColor: backgroundColors.slice(0, labels.length),
      parsing: {
        yAxisKey: "value",
        xAxisKey: "key",
      },
    };

    datasets.push(dataset);

    return {
      labels,
      datasets,
    };
  }, [activityUsage]);

  useEffect(() => {
    dispatch(getActivityUsage({ startDate, endDate }));
    dispatch(getRevenueTransactionSplit({ startDate, endDate }));
  }, [dispatch, startDate, endDate]);

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
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          width: "100%",
        }}
      >
        <Box width="300px" maxHeight="500px">
          <Typography textAlign="center">Revenue Transaction Split</Typography>
          <Pie data={revenueTransactionSplitData} options={options} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              mt: 2,
            }}
          >
            {revenueTransactionSplit.map((data) => (
              <Typography key={data._id} textTransform="capitalize">
                {data._id}: Rs. {data.total_amount}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box width="300px" maxHeight="500px" flexGrow={1}>
          <Typography textAlign="center">Activity Usage</Typography>
          <Bar data={activityUsageData} options={options} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default NewStats;
