import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Dialog, Grid, Typography, styled } from "@mui/material";
import BasicTicketBg from "./images/Basic-final-ticket-bg.png";
import PremiumTicketBg from "./images/platinum-ticket-bg2.png";
import { useNavigate } from "react-router-dom";
import { downloadImage } from "../../utils";
import { scrollToTop } from "../../utils/index";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const Label = ({ children, sx, isPremium = false }) => (
  <Box
    sx={{
      background: "#35A745",
      position: "relative",
      overflow: "hidden",
      minWidth: "85px",
      ...sx,
    }}
  >
    <Box
      sx={{
        background: isPremium
          ? "linear-gradient(237deg, #f7f7f7, #686b6d)"
          : "#EDD040",
        position: "absolute",
        width: "20px",
        height: "20px",
        transform: "rotate(45deg)",
        top: "-10px",
        left: "-10px",
      }}
    />
    <Typography
      sx={{
        color: "white",
        padding: "1px 10px 1px 15px",
        fontSize: "11px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  </Box>
);

const Container = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const Value = styled(Typography)({
  fontSize: "11px",
  padding: "1px 15px",
  color: "black",
  background: "white",
  flexGrow: 2,
  maxHeight: "16.5px",
});

const firstCapital = (str) => str[0].toUpperCase() + str.slice(1);

export const Ticket = ({
  isPremium = false,
  ticket = {},
  downloadable = true,
}) => {
  const ticketRef = useRef(null);
  const navigate = useNavigate();
  const downloadTicket = () => {
    if (ticketRef?.current && downloadable) {
      console.log("entering here bro for ticket download");
      downloadImage(ticketRef.current, "funingo-ticket.png");
    }
    navigate("/profile");
    setTimeout(() => {
      window.location.reload();
    }, 800);
    scrollToTop();
  };

  const totalFuningoCoins = useMemo(() => {
    return (
      ticket?.details?.reduce((total, curr) => total + curr.package.coins, 0) ||
      0
    );
  }, [ticket, ticket?._id]);

  const extraFlagValue = useMemo(() => {
    console.log("ticket", ticket);
    const extraFlags = ticket?.details?.reduce(
      (flags, person) => ({
        red: flags.red + person.extra_red,
        green: flags.green + person.extra_green,
        yellow: flags.yellow + person.extra_yellow,
        golden: flags.golden + person.golden_flag,
      }),
      {
        red: 0,
        green: 0,
        yellow: 0,
        golden: 0,
      }
    );
    let extraFlagValue = Object.keys(extraFlags || {}).reduce(
      (final, extraFlag) => {
        if (extraFlags[extraFlag]) return final + `${extraFlags[extraFlag]}, `;
        return final;
      },
      ""
    );
    return extraFlagValue.slice(0, extraFlagValue.length - 2);
  }, [ticket]);

  const packageValue = useMemo(() => {
    const packages = ticket?.details?.reduce(
      (packages, person) => ({
        ...packages,
        [person.package?.name]: (packages[person.package?.name] || 0) + 1,
      }),
      {}
    );

    let packVal = Object.keys(packages || {}).reduce(
      (final, pack) =>
        pack !== "undefined"
          ? final + `${firstCapital(pack)} x ${packages[pack]}, `
          : "",
      ""
    );
    // -2 for removing last comma(',') and space(' ')
    return packVal ? packVal.slice(0, packVal.length - 2) : "No Package";
  }, [ticket]);

  return (
    <Grid>
      <Grid
        sx={{
          position: "relative",
          height: "250px",
          overflowY: "hidden",
        }}
        ref={ticketRef}
      >
        <Box
          component={"img"}
          src={isPremium ? PremiumTicketBg : BasicTicketBg}
          sx={{
            height: "250px",
          }}
        />
        <Grid
          sx={{
            position: "absolute",
            top: "110px",
            left: "50px",
            display: "flex",
            gap: "5px",
            flexDirection: "column",
          }}
        >
          <Grid display="flex">
            <Container width="170px">
              <Label isPremium={isPremium}>Ticket id</Label>
              <Value>{ticket?.short_id}</Value>
            </Container>
            {/* <Container width='230px'>
              <Label isPremium={isPremium} sx={{ width: '150px' }}>
                Freebies Available
              </Label>
              <Value>2</Value>
            </Container> */}
          </Grid>
          <Grid display="flex">
            {/* <Container width='170px'>
              <Label isPremium={isPremium}>PAX</Label>
              <Value>{ticket?.details?.length}</Value>
            </Container> */}
            <Container width="230px">
              <Label isPremium={isPremium} sx={{ width: "150px" }}>
                Funingo Coins
              </Label>
              <Value>{totalFuningoCoins}</Value>
            </Container>
          </Grid>
          <Grid display="flex">
            <Container width="170px">
              <Label isPremium={isPremium}>Amount</Label>
              <Value>₹{ticket?.total_amount}</Value>
            </Container>
            {/* <Container width='230px'>
              <Label isPremium={isPremium} sx={{ width: '150px' }}>
                GST
              </Label>
              <Value>
                ₹
                {Math.round(
                  ((ticket?.total_amount * 18) / 118 + Number.EPSILON) * 100
                ) / 100}
              </Value>
            </Container> */}
          </Grid>
          <Container>
            <Label isPremium={isPremium} sx={{ width: "150px" }}>
              Total Packages
            </Label>
            <Value
              sx={{
                overflow: "hidden",
                maxWidth: "220px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {packageValue}
            </Value>
          </Container>
          <Container>
            <Label isPremium={isPremium} sx={{ width: "150px" }}>
              Added Funingo Coins
            </Label>
            <Value
              sx={{
                overflow: "hidden",
                maxWidth: "220px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {extraFlagValue || "No Extra coins"}
            </Value>
          </Container>
        </Grid>
      </Grid>
      {downloadable && (
        <Grid mt="20px" textAlign={"center"}>
          <Button
            variant="contained"
            sx={{
              background: "#35A745",
              "&:hover": {
                background: "#35A74599",
              },
            }}
            onClick={downloadTicket}
          >
            Download Ticket
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

const TicketModal = ({ open, onClose, ticket = {}, downloadable = true }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="lg"
    sx={{
      background: "#000000b3",
    }}
    PaperProps={{
      sx: {
        background: "transparent",
      },
    }}
  >
    <Ticket
      isPremium={ticket?.is_premium}
      ticket={ticket}
      downloadable={downloadable}
    />
  </Dialog>
);

export default TicketModal;
