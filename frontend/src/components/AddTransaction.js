import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function AddTransaction() {

    const [balance, setBalance] = React.useState([])
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
    }, [])


    const navigate = useNavigate()

    const [ok, setOk] = React.useState(null)
    const [amount, setAmount] = React.useState(null)
    const [reason, setReason] = React.useState("")
    const [transactionType, setTransactionType] = React.useState("")
    const [transactionWith, setTransactionWith] = React.useState("")
    const [paid, setPaid] = React.useState(false)
    const [allTransaction, setAllTransaction] = React.useState('')
    const [lender, setLender] = React.useState()

    function amountHandler(e) {
        setAmount(e.target.value)
    }
    function reasonHandler(e) {
        setReason(e.target.value)
    }
    function transactionTypeHandler(e) {
        setTransactionType(e.target.value)
        if (e.target.value == "lend") {
            setLender(true)
        }
    }
    function transactionWithHandler(e) {
        setTransactionWith(e.target.value)
    }
    function paidHandler(e) {
        setPaid(e.target.checked)
    }


    let form = new FormData()
    
    
        async function submitHandler(e) {
            if (balance.balance < amount && transactionType == "lend") {
                document.getElementById("errormsg").style.display ="block"
            }

            else {form.append('transaction_type', transactionType)
            form.append('transaction_with', transactionWith)
            form.append('amount', amount)
            form.append('reason', reason)
            form.append('transaction_status', paid)
            await axios.post(`auth/add_transaction/`, form,
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`, "Content-Type": "application/x-www-form-urlencoded" } })
                .then(function (response) {
                    setOk(true)
                })
                .catch(function (error) {
                    console.log(error);
                });

            await axios.get(`auth/get_transactions/`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`, "Content-Type": "application/x-www-form-urlencoded" } })
                .then(function (response) {
                    setAllTransaction(response.data.data)
                    localStorage.setItem("allTransaction", JSON.stringify(response.data.data))
                    navigate('/Home')
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        function handleLogout() {
            localStorage.clear()
            navigate('/login')
        }}
    


    return (
        <>
            <div className="container mt-4 col-6">
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="text-dark mt-5 mb-5">Add New Transaction</h2>
                        <p id="errormsg" style={{ color: "red", display: "none" }}>Insufficient balance!</p>
                        <TextField id="outlined-basic" type="number" label="Amount" variant="outlined" style={{ width: "100%" }} className="my-2" onChange={amountHandler} /><br />
                        <TextareaAutosize
                            style={{ width: "100%", padding: "0 10px" }}
                            onChange={reasonHandler}
                            className="my-2"
                            aria-label="minimum height"
                            minRows={5}
                            placeholder="Reason"
                        />
                        <br />

                        <FormControl style={{ width: "100%", textAlign: "start" }} className="my-2">
                            <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={transactionType}
                                label="Transaction Type"
                                onChange={transactionTypeHandler}
                            >
                                <MenuItem style={{ width: "100%", textAlign: "start" }} value="borrow">Borrow</MenuItem>
                                <MenuItem style={{ width: "100%", textAlign: "start" }} value="lend">Lend</MenuItem>
                            </Select>
                        </FormControl>
                        <br />

                        <FormControl style={{ width: "100%", textAlign: "start" }} className="my-2">
                            <InputLabel id="demo-simple-select-label">Transaction With</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={transactionWith}
                                label="Transaction Type"
                                onChange={transactionWithHandler}
                            >
                                {
                                    !localStorage.getItem('allUser') ? null :
                                        JSON.parse(localStorage.getItem('allUser')).map((user) => {
                                            return (

                                                <MenuItem style={{ width: "100%", textAlign: "start" }} value={user.id}>{user.username}</MenuItem>
                                                // <MenuItem style={{ width: "100%", textAlign: "start" }} value={user.id}>{user.username}</MenuItem>
                                            )
                                        })
                                }
                            </Select>
                        </FormControl>
                        <br />
                        <div class="row">
                            <div class="col-2" style={{ marginLeft: "-2.5%" }}>
                                {
                                    lender ?
                                        <div >
                                            <Checkbox
                                                onClick={paidHandler}
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                            /><span className="text-dark" style={{ fontSize: "20px", fontWeight: "400" }}>Paid</span>
                                        </div> :
                                        null
                                }
                            </div>
                            <div class="col-md"></div>
                        </div>
                        <br /><Button variant="contained" style={{ width: "100%" }} onClick={submitHandler}>Submit</Button>
                    </div>

                </Box>
            </div>
        </>
    );
}
