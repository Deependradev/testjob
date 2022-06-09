import React from 'react'
import "../App.css"
import Table from './Table'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Home() {

    const navigate = useNavigate()

    function handleLogout() {
        localStorage.clear()
        navigate('/login')
    }

    return (

        <div class="tabs-to-dropdown">
            <div class="bg-dark nav-wrapper d-flex align-items-center justify-content-between" >
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
                <Table />

            </div>

        </div>
    )
}