
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import loginAction from '../Redux/Actions/LoginAction';


export default function Loginpage() {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [token, setToken] = React.useState('')
    const [money, setMoney] = React.useState('')
    const [allTransaction, setAllTransaction] = React.useState([])

    const navigate = useNavigate()
    function usernameHandler(e) {
        setUsername(e.target.value)
    }
    function passwordHandler(e) {
        setPassword(e.target.value)
    }

    let form = new FormData();
    form.append('username', username)
    form.append('password', password)

    const dispatch = useDispatch()

    async function LoginHandler(e) {
            dispatch(loginAction({'username': username, 'password': password}))
        // await axios.post(`auth/login/`, form)
        //     .then(function (response) {
        //         localStorage.setItem("accessToken", response.data.access)
        //         setToken(response.data.access)
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

        // await axios.get(`auth/get_transactions/`,
        //     { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/x-www-form-urlencoded" } })
        //     .then(function (response) {
        //         setAllTransaction(response.data.data)
        //         localStorage.setItem("allTransaction", JSON.stringify(response.data.data))
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        // await axios.get(`auth/all_users/`,
        //     { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/x-www-form-urlencoded" } })
        //     .then(function (response) {
        //         localStorage.setItem("allUser", JSON.stringify(response.data.data))
        //         window.open("http://127.0.0.1:3000/Home", "_self")

        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });



    }

    let allt = { "data": JSON.parse(localStorage.getItem('allTransaction')) }
    console.log(allt)




    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, },
            }}
            noValidate
            autoComplete="off"
        >
            <div style={{ textAlign: 'center' }}>
                <p className="display-6">User Login</p>
                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={usernameHandler} style={{ width: "600px", textAlign: "start", marginTop: "10px" }} /><br />
                <TextField id="" label="Password" type="password" variant="outlined" onChange={passwordHandler} style={{ width: "600px", textAlign: "start", marginTop: "10px" }} /><br />
                <Button variant="contained" style={{ width: "600px", marginTop: "10px" }} onClick={LoginHandler}>Login</Button>
            </div>

        </Box>
    );
}