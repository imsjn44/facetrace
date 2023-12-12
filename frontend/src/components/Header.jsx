import React from "react";
import { Box, Typography, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

// Now you can use the useNavigation hook in your component

const Header = () => {
  const navigate = useNavigate();
  return (
    <div id="About Me">
      <React.Fragment>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 0,
            padding: 1.5,

            background: "radial-gradient(circle,#5c6bc0,#5c6bc0,#3f51b5)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginRight: 5,
              color: "white",
              cursor: "pointer",
              ":hover": {
                transition: "0.3s",
                transform: "scale(1.1)",
              },
            }}
            onClick={() => navigate("/form")}
          >
            Find Your Person
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              cursor: "pointer",
              ":hover": {
                transition: "0.3s",
                transform: "scale(1.1)",
              },
            }}
            onClick={() => navigate("/posts")}
          >
            Posts
          </Typography>
        </Box>
      </React.Fragment>
    </div>
  );
};

export default Header;
