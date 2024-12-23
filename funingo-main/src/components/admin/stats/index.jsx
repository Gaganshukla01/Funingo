import React, { useEffect, useMemo, useState } from "react";
import "./style.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Box, Grid, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { scrollToTop } from "../../../utils";
import NewStats from "./new-stats";
import Activity from "./user-frequency";
import UserFrequency from "./user-frequency";
import { useSelector } from "react-redux";
import CachedIcon from "@mui/icons-material/Cached";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        title: function (tooltipItem) {
          const dataset = tooltipItem[0].dataset;
          const total = dataset.data.reduce(
            (previousValue, currentValue) =>
              previousValue + (currentValue.value ?? currentValue),
            0
          );
          const currentValue = tooltipItem[0].parsed.y ?? tooltipItem[0].parsed;
          const percentage = ((currentValue / total) * 100).toFixed(2);
          const location = tooltipItem[0].label ?? "Null";
          return `Label- ${location}: ${currentValue} (${percentage}%)`;
        },
      },
    },
    legend: {
      position: "top",
    },
    title: {
      display: !true,
    },
  },
};

export const backgroundColors = [
  "#cdb4db",
  "#ffc8dd",
  "#ffafcc",
  "#bde0fe",
  "#a2d2ffs",
  "#cda7db",
];

const Stats = () => {
  const { loading } = useSelector((state) => state.statsSlice);

  const [page, setPage] = useState(1);

  return (
    <Grid>
      <Grid
        sx={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          justifyContent: "center",
          mb: " 20px",
        }}
      >
        {/* <Switch
          checked={!isStatsPage}
          onChange={e => toggleStatsPage(!e.target.checked)}
        /> */}

        <Typography
          onClick={() => setPage(0)}
          sx={{
            fontSize: "18px",
            fontWeight: page === 0 ? "600" : "500",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Stats
        </Typography>
        <Typography
          onClick={() => setPage(1)}
          sx={{
            fontSize: "18px",
            fontWeight: page === 1 ? "600" : "500",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          User Frequency
        </Typography>
      </Grid>
      {page === 0 && <NewStats />}
      {page === 1 && <UserFrequency />}

      {loading && (
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CachedIcon className="animate-spin" />
        </Grid>
      )}
    </Grid>
  );
};

export default Stats;
