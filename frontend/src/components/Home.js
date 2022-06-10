import React from 'react'
import "../App.css"
import Table from './Table'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Addmoney from './Wallet'

export default function Home() {

    const navigate = useNavigate()

    function handleLogout() {
        localStorage.clear()
        navigate('/login')
    }

    React.useEffect(()=>{
        axios.get('auth/all_users/', { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`, "Content-Type": "application/x-www-form-urlencoded" } }).then((res) => {
            //return res.data.data.map((item)=>{ window.localStorage.setItem('allUser',res.data.data)})
            return window.localStorage.setItem('allUser', JSON.stringify(res.data.data))
        })
    },[])

    return (
        <>

            <div class="container-fluid">
               
               <div className="row">
                   <div className="col-3">
                   <Addmoney />
                   </div>
                   <div className="col-9">
                   <Table />
                   </div>
               </div>
               
                
                

            </div>

        </>
    )
}