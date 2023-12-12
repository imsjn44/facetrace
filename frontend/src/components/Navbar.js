import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { AppBar, Button, Toolbar, Typography, useScrollTrigger, useMediaQuery, TextField, createTheme, Tabs, Tab, useState} from '@mui/material';
import { UseScrollTrigger, Slide } from '@mui/material';
import { BiSolidContact } from "react-icons/bi";
import { FaInstagram, FaPhone } from "react-icons/fa6";
import { HiOutlineSearch } from "react-icons/hi";
import {Link} from '@mui/material'
import ColorPalette from './Colorpalatte';
import { ThemeProvider } from '@mui/material';
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TfiInstagram } from "react-icons/tfi";
import { FaYoutube } from "react-icons/fa";
import PoliceLogo from './Images/nppolicelogo.png'
import { IoMenuOutline } from "react-icons/io5";






const Navbar = () => {
    const theme = useTheme()
    const NavTabs =['Home', 'About Us', 'Organisation Structure', 'CID Wings', 'Notices']
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue)}
    

    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    console.log(isExtraSmallScreen)


    const trigger = useScrollTrigger({
        threshold:'100px',
        disableHysteresis:true
    });
   


    
    
  return (
    <Box  sx={{direction:'vertical', position:'fixed', width:'100%'}}>
         
    <Grid container sx={{ position:'static', backgroundColor:'#004163'}} >
    {!isExtraSmallScreen && (
      <Grid item xs={12} sm={12} md={3} >
        <Box sx={{display:'flex', flexDirection:'row',alignItems: 'center'}}>
                          
        
        <BiSolidContact style ={{color:'white', paddingLeft:isMediumScreen ? 0 :  '12%', fontSize:'1.4rem', paddingTop:'1%'}}/>
        <Typography style={{fontFamily:'Arial', color:'white', fontSize:'.8rem', paddingLeft:'2%', paddingTop:'1%'}}>
          
           Emergency Contacts
          
        </Typography>
        </Box>
   
      </Grid>
    )}
      <Grid item xs ={12} sm={12} md={4}  >
      <Box sx={{display:'flex', flexDirection:'row',alignItems: 'center'}}>
                          
        
                          <FaPhone  style ={{color:'white', paddingTop:'1%'}}/>
                          <Typography  style={{fontFamily:'Arial', color:'white', fontSize:'0.8rem', paddingLeft:'2%', paddingTop:'1%'}}>
                          Police Control: 100, Toll Free No.: 16600141516
                          </Typography>
                          </Box>
       
      </Grid>
      <Grid item xs={12} sm={12} md={5}>
      <Box sx={{display:'flex', flexDirection:'row',alignItems: 'center', color:'white'}}>
                         
        
                        
                          <ThemeProvider theme ={ColorPalette}>

                          <TextField 
                          
                   required
                   className='Text-field'
                   id="standard-required"
                    color='primary'
                   variant="standard"
                   InputProps={{
                    startAdornment:(
                      <HiOutlineSearch style ={{color:'white', fontSize:'1.4rem'}}/>
                    )
                   }}
         
        />
        </ThemeProvider>
        <Link href="https://www.facebook.com/NepalPolicePHQ/" style={{paddingRight:"4%"}}>
          <FaFacebookF style={{color:'white', fontSize:'1.2rem', cursor:'pointer'}}/>
        </Link>
        <Link href="https://twitter.com/NepalPoliceHQ" style={{paddingRight:"4%"}}>
          <FaXTwitter style={{color:'white', fontSize:'1.2rem', cursor:'pointer'}}/>
          </Link>
          <Link href="https://www.instagram.com/nepalpolice/" style={{paddingRight:"4%"}}>
          <FaInstagram style={{color:'white', fontSize:'1.3rem', cursor:'pointer'}}/>
          </Link>
          <Link href="https://www.youtube.com/channel/UCMkrAY5yFo5eQ1SCj9aV28w" style={{paddingRight:"4%"}}>
          <FaYoutube style={{color:'white', fontSize:'1.2rem', cursor:'pointer'}}/>
          </Link>
      
                          </Box>
        
      </Grid>
      
      
    </Grid>
    <Slide appear = {false} direction='down' in ={!trigger}>
    <Grid container  sx={{ position:'static', backgroundColor:'rgb(30, 127, 178)', height: trigger? '50px':'70px'}} >
       

      
      <Grid item xs={3} >
    <Box  >
      <img src ={PoliceLogo} alt="PoliceLogo" style={{height:'70px', width:'75px'}}/>
    
    </Box >
      </Grid>
      <Grid item xs={7} >
       {!isMediumScreen && (
        <Box >
        <Tabs 
        value={value}
        TabIndicatorProps={{
          style:{
            top: 0, 
          backgroundColor: 'yellow', 
          height: '4%' 
          }
        }}
          
        
        onChange={handleChange}
        variant='scrollable'
        
        scrollButtons={false}
    
        >
       
            {NavTabs.map((navtab,index)=>(
                  <Tab style={{fontFamily:'Arial', color:'white', fontSize:'0.75rem'}} sx={{display:'flex', flexDirection:'row',alignContent: 'center',mt:"1%", '&.Mui-selected': {
                    backgroundColor: 'transparent', // Remove background color when selected
                    userSelect: 'none', // Disable text selection
                  }}} key={index} label={navtab}> 

                  </Tab>
            ))

            }
          
        </Tabs>
        </Box>
       )}
      </Grid>
      <Grid item xs={2} >
        
      </Grid>
      
      
    </Grid>
    </Slide>
    
  </Box>
  )}



export default Navbar;