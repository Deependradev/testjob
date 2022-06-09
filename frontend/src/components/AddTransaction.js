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

    const navigate = useNavigate()

    const [ok, setOk] = React.useState(null)
    const [amount, setAmount] = React.useState(null)
    const [reason, setReason] = React.useState("")
    const [transactionType, setTransactionType] = React.useState("")
    const [transactionWith, setTransactionWith] = React.useState("")
    const [paid, setPaid] = React.useState(false)
    const [allTransaction, setAllTransaction] = React.useState('')

    function amountHandler(e) {
        setAmount(e.target.value)
    }
    function reasonHandler(e) {
        setReason(e.target.value)
    }
    function transactionTypeHandler(e) {
        setTransactionType(e.target.value)
    }
    function transactionWithHandler(e) {
        setTransactionWith(e.target.value)
    }
    function paidHandler(e) {
        setPaid(e.target.checked)
    }


    let form = new FormData()
    async function submitHandler(e) {
        form.append('transaction_type', transactionType)
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
    }

    return (
        <>
<div class="tabs-to-dropdown">
            <div class="bg-dark nav-wrapper d-flex align-items-center justify-content-between">
                <ul class="nav nav-pills d-none d-md-flex" id="pills-tab" role="tablist">
                    <li class="nav-item " role="presentation">
                        <Link to="/get_transactions" class="nav-link text-white" id="top-menu" data-toggle="pill" role="tab"
                            aria-controls="pills-product" aria-selected="false">All Transactions</Link>
                    </li>
                    <li class="nav-item" role="presentation">
                        <Link to="/add_transaction" class="nav-link text-white" id="top-menu" data-toggle="pill" role="tab"
                            aria-controls="pills-product" aria-selected="false">Add Transactions</Link>
                    </li>
                    <li onClick={handleLogout} class="nav-item" role="presentation">
                        <a class="nav-link text-white" id="logout" data-toggle="pill" role="tab"
                            aria-controls="pills-news" aria-selected="false">Logout</a>
                    </li>
                </ul>
            </div>

            <div class="container-fluid">
            <div className="container mt-4">
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div style={{ textAlign: 'center' }}>
                        <p className="text-dark display-6">Add New Transaction</p>
                        <TextField id="outlined-basic" type="number" label="Amount" variant="outlined" style={{ width: "700px" }} className="my-2" onChange={amountHandler} /><br />
                        <TextareaAutosize
                            style={{ width: "700px", padding: "0 10px" }}
                            onChange={reasonHandler}
                            className="my-2"
                            aria-label="minimum height"
                            minRows={5}
                            placeholder="Reason"
                        />
                        <br />

                        <FormControl style={{ width: "700px", textAlign: "start" }} className="my-2">
                            <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={transactionType}
                                label="Transaction Type"
                                onChange={transactionTypeHandler}
                            >
                                <MenuItem style={{ width: "700px", textAlign: "start" }} value="borrow">Borrow</MenuItem>
                                <MenuItem style={{ width: "700px", textAlign: "start" }} value="lend">Lend</MenuItem>
                            </Select>
                        </FormControl>
                        <br />

                        <FormControl style={{ width: "700px", textAlign: "start" }} className="my-2">
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
                                                <MenuItem style={{ width: "700px", textAlign: "start" }} value={user.id}>{user.username}</MenuItem>
                                            )
                                        })
                                }
                            </Select>
                        </FormControl>
                        <br />
                        <div class="row">
                            <div class="col-md" style={{ marginLeft: "1%" }}>
                                <div >
                                    <Checkbox
                                        onClick={paidHandler}
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                    /><span className="text-dark" style={{ fontSize: "22px" }}>Paid</span>
                                </div>
                            </div>
                            <div class="col-md"></div>
                        </div>
                        <br /><Button variant="contained" style={{ width: "700px" }} onClick={submitHandler}>Submit</Button>
                    </div>

                </Box>
            </div>
            </div>
        </div>
        </>
    );
}
