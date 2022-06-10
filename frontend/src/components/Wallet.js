import React from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Typography } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import axios from 'axios'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#032140',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const Addmoney = () => {

    const[balance, setBalance] = React.useState([])
    React.useEffect(() => {
        axios.get('auth/all_type_balance/',
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then((res) => {
                setBalance(res.data)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    },[])



    return (
        <>
            <Box sx={{ flexGrow: 1 }} className="mt-5">
                <Grid container justifyContent="center">
                    <Grid item xs={9} lg={12} md={6} sm={8} >
                        <Item>
                            <br />
                            <br />

                            <Typography variant='h6' className="text-light">
                                Available Amount :
                            </Typography>
                            <br />

                            <Typography variant='h4' className="text-light">
                                ₹ {
                                    balance['balance']!=undefined?balance['balance']:0.00
                                }
                            </Typography>
                            <br />
                            <br />
                        </Item>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ flexGrow: 1 }} className="mt-3">
                <Grid container justifyContent="center">
                    <Grid item xs={9} lg={12} md={6} sm={8} >
                        <Item>
                            <br />
                            <br />

                            <Typography variant='h6' className="text-light">
                            Lend Balance :
                            </Typography>
                            <br />

                            <Typography variant='h4' className="text-light">
                                ₹ {
                                    balance['lend_balance']!=undefined?balance['lend_balance']:0.00
                                }
                            </Typography>
                            <br />
                            <br />
                        </Item>
                    </Grid>
                </Grid>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} className="mt-3">
                <Grid container justifyContent="center">
                    <Grid item xs={9} lg={12} md={6} sm={8} >
                        <Item>
                            <br />
                            <br />

                            <Typography variant='h6' className="text-light">
                                Borrow Balance :
                            </Typography>
                            <br />

                            <Typography variant='h4' className="text-light">
                                ₹ {
                                    balance['borrow_balance']!=undefined?balance['borrow_balance']:0.00
                                }
                            </Typography>
                            <br />
                            <br />
                        </Item>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}
export default Addmoney