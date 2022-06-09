import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


export default function Table() {

    const navigate = useNavigate()

    var allTransaction = []
    React.useEffect(() => {
        allTransaction = JSON.parse(localStorage.getItem('allTransaction'))

        if (Sample === true) {
            setTimeout(() => {
                window.location.reload()
                alert('ok bruh')
                setSample(false)
            }, 3000);
        }
    })
    const [Sample, setSample] = React.useState(false)
    const [transactionId, setTransactionId] = React.useState(null)

    const [Searchid, setSearchId] = React.useState(0)


    function searchHandler() {
        let filter = document.getElementById("my_search").value.toLowerCase()
        let myTable = document.getElementById("transactionTable")
        let tr = myTable.getElementsByTagName("tr")

        for (var i = 1; i <= tr.length; i++) {
            console.log(Searchid)
            let td = tr[i].getElementsByTagName("td")[Searchid]
            if (td) {
                let textValue = td.innerHTML || td.textContent
                textValue.toLowerCase()
                if (textValue.indexOf(filter) > -1) {
                    tr[i].style.display = ""
                }
                else {
                    tr[i].style.display = "none"
                }
            }
        }
    }
    console.log(Searchid)

    function TransType(e) {
        setSearchId((e.target.value))
    }


    if (transactionId) {
        setTimeout(() => {
            window.open("http://127.0.0.1:3000/get_transactions", "_self")
        }, 1000)
    }


    function tablePages(){

    }

    async function getTransactionId(e) {
        if (e.target.previousElementSibling.previousElementSibling.textContent == "lend") {
            setTransactionId(parseInt(e.target.previousElementSibling.innerHTML))
            axios.patch(`auth/mark_paid/${parseInt(e.target.previousElementSibling.innerHTML)}/`, "lend",
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/x-www-form-urlencoded" } })
                .then(function (response) {
                    axios.get(`auth/get_transactions/`,
                        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/x-www-form-urlencoded" } })
                        .then(function (response) {
                            localStorage.setItem("allTransaction", JSON.stringify(response.data.data))
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
        else if (e.target.previousElementSibling.previousElementSibling.textContent == "borrow") {
            alert("You can not change the Transaction Status")
        }

    }

    React.useEffect(() => {
        axios.get(`auth/get_transactions/`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/x-www-form-urlencoded" } })
            .then(function (response) {
                localStorage.setItem("allTransaction", JSON.stringify(response.data.data))
            })
            .catch(function (error) {
                console.log(error);
            });
    })

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div id="search-box" style={{ textAlign: "end" }}>
                        <div className='d-flex justify-content-end mt-3'>
                            <select class="form-select" onChange={TransType} style={{ width: "300px", height: "40px" }} id="selected" aria-label="Default select example">
                                <option style={{ width: "300px", textAlign: "start" }} selected>Search By</option>
                                <option style={{ width: "300px", textAlign: "start" }} value={1}>Transaction Type</option>
                                <option style={{ width: "300px", textAlign: "start" }} value={5}>Transaction Date</option>
                                <option style={{ width: "300px", textAlign: "start" }} value={7}>Transaction Reasn</option>
                            </select>
                        </div>
                        <input placeholder="Search..." type="text" id="my_search" onKeyUp={searchHandler} />
                    </div>

                    <div style={{ marginTop: "-50px" }}>
                        <p className="text-dark display-6">All Transaction</p>
                        <table id="transactionTable" className="table table table-striped mt-5" style={{ width: "100%" }}>

                            <thead  >
                                <tr>
                                    <th >#</th>
                                    <th >Amount</th>
                                    <th >Transaction Type</th>
                                    <th style={{ display: "none" }}>t-Id</th>
                                    <th >Status</th>
                                    <th >Transaction With</th>
                                    <th >Transaction Date</th>
                                    <th >Transaction id</th>
                                    <th >Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {




                                    JSON.parse(localStorage.getItem('allTransaction')).length == 0 ? <p className="display-6" style={{ fontSize: "32px" }}>No records found!</p>
                                        : JSON.parse(localStorage.getItem('allTransaction')).reverse().map((item, index) => {
                                            let t_status = ''
                                            if (item.transaction_status == true) {
                                                t_status = "Paid"
                                            }
                                            else {
                                                t_status = "Unpaid"
                                            }

                                            let date = new Date(item.transaction_date).toLocaleDateString()
                                            return (
                                                <tr>
                                                    <th scope="row" >{index + 1}</th>
                                                    <td  >{item.amount}</td>
                                                    <td  >{item.transaction_type}</td>
                                                    <td style={{ display: "none" }}>{item.id}</td>
                                                    {
                                                        t_status === "Paid" ? <td  >{t_status}</td> : <td style={{ color: "red", cursor: "pointer ", }} onClick={getTransactionId}>{t_status}</td>
                                                    }
                                                    <td >{item.transaction_with}</td>
                                                    <td >{date}</td>
                                                    <td  >{item.transaction_id}</td>
                                                    <td >{item.reason}</td>
                                                </tr>
                                            )
                                        })
                                }


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    )
}