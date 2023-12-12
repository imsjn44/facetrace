import React from "react";
import { useState } from "react";
import { Container, Box, Grid, Typography, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Input, InputLabel, InputAdornment, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const Form = () => {
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_details: {
            firstnameuser: user.firstnameuser,
            lastnameuser: user.lastnameuser,
            addressuser: user.addressuser,
            numberuser: user.numberuser,
          },
          person_details: {
            firstname: user.firstname,
            lastname: user.lastname,
            age: user.age,
            height: user.height,
            address: user.address,
            resident: user.resident,
            citizenshipnumber: user.citizenshipnumber,
            number: user.number,
            moredetails: user.moredetails,
          },
        }),
      });

      if (response.ok) {
        console.log("Form submitted successfully!");
      } else {
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const [user, setUser] = useState({
    firstnameuser: "",
    lastnameuser: "",
    addressuser: "",
    numberuser: "",
    firstname: "",
    lastname: "",
    citizenshipnumber: "",
    address: "",
    resident: "",
    moredetails: "",
    number: "",
    height: "",
    age: "",
    image: "",
  });
  const handeleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  return (
    <>
      <React.Fragment>
        <Container>
          <Box
            sx={{
              justifyContent: "center",
              mt: 5,
              border: "2px solid #3f51b5",
              borderRadius: "15px",
              maxWidth: 700,
              padding: 5,
              boxShadow: 24,
              mx: "auto",
            }}
          >
            <Typography
              sx={{ textAlign: "center", fontSize: 18, fontWeight: "700" }}
            >
              Details of User
            </Typography>
            <Grid spacing={2} container>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  onChange={handeleChange}
                  value={user.firstnameuser}
                  name="firstnameuser"
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  onChange={handeleChange}
                  value={user.lastnameuser}
                  name="lastnameuser"
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  id="outlined-basic"
                  label="Last name*"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              onChange={handeleChange}
              value={user.numberuser}
              name="numberuser"
              sx={{
                mt: 2,

                mb: 2,
              }}
              id="outlined-basic"
              label="Mobile Number"
              variant="outlined"
              fullWidth
            />

            <TextField
              onChange={handeleChange}
              value={user.addressuser}
              name="addressuser"
              sx={{
                mt: 2,

                mb: 2,
              }}
              id="outlined-basic"
              label="Address"
              variant="outlined"
              fullWidth
            />
            <Typography
              sx={{ textAlign: "center", fontSize: 18, fontWeight: "700" }}
            >
              Details to Find a Person
            </Typography>
            <Grid spacing={2} container>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  onChange={handeleChange}
                  value={user.firstname}
                  name="firstname"
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  onChange={handeleChange}
                  value={user.lastname}
                  name="lastname"
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  id="outlined-basic"
                  label="Last name*"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid spacing={2} container>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  onChange={handeleChange}
                  value={user.age}
                  name="age"
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  id="outlined-basic"
                  label="Age"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  onChange={handeleChange}
                  value={user.height}
                  type="number"
                  name="height"
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  id="outlined-basic"
                  label="Height"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Ft</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              onChange={handeleChange}
              value={user.address}
              name="address"
              sx={{
                mt: 2,

                mb: 2,
              }}
              id="outlined-basic"
              label=" Permanent Address"
              variant="outlined"
              fullWidth
            />
            <TextField
              onChange={handeleChange}
              value={user.resident}
              name="resident"
              sx={{
                mt: 2,

                mb: 2,
              }}
              id="outlined-basic"
              label=" Resident"
              variant="outlined"
              fullWidth
            />
            <TextField
              onChange={handeleChange}
              value={user.citizenshipnumber}
              name="citizenshipnumber"
              sx={{
                mt: 2,

                mb: 2,
              }}
              id="outlined-basic"
              label="Citizenship Number (only if nepali)"
              variant="outlined"
              fullWidth
            />
            <TextField
              onChange={handeleChange}
              value={user.number}
              name="number"
              sx={{
                mt: 2,

                mb: 2,
              }}
              id="outlined-basic"
              label="Mobile Number"
              variant="outlined"
              fullWidth
            />
            <TextField
              onChange={handeleChange}
              value={user.moredetails}
              name="moredetails"
              sx={{
                mt: 2,

                mb: 2,
              }}
              id="outlined-basic"
              label="More about the Person"
              variant="outlined"
              fullWidth
              multiline
            />
            <InputLabel htmlFor="image-upload">Upload Image</InputLabel>
            <Input
              id="image-upload"
              type="file"
              onChange={handleImageChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    component="label"
                    htmlFor="image-upload"
                    edge="end"
                    color="primary"
                  >
                    <PhotoCamera />
                  </IconButton>
                </InputAdornment>
              }
            />

            {selectedImage && (
              <div>
                <p>Your Selected Image:</p>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  width="150px"
                />
              </div>
            )}
            <Button
              onClick={handleSubmit}
              sx={{
                mx: "auto",
                display: "flex",
                borderRadius: "15px",
                bgcolor: "#3f51b5",
                color: "white",
                mt: 5,
                paddingTop: "15px",
                paddingBottom: "15px",
                minWidth: 285,
                boxShadow: 24,

                ":hover": {
                  mx: "auto",
                  display: "flex",
                  borderRadius: "15px",
                  bgcolor: "#3f51b5",
                  color: "white",
                  mt: 5,
                  // padding: "15px 200px 15px 200px",
                  transform: "scale(1.05)",
                  transition: "0.3s",
                },
              }}
            >
              Post
            </Button>
          </Box>
        </Container>
      </React.Fragment>
    </>
  );
};

export default Form;
