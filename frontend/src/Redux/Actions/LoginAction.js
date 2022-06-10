import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL
} from "../Constants.js"

import axios from "axios"
import { useNavigate } from "react-router-dom"


const loginAction = (postdata) => async (dispatch) => {
   
    try {
        dispatch({ type: USER_LOGIN_REQUEST })
        const res = await axios.post("auth/login/", postdata)
        window.localStorage.setItem('accessToken', res.data.access)
        // axios.get('auth/all_users/', { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`, "Content-Type": "application/x-www-form-urlencoded" } }).then((res) => {
        //     //return res.data.data.map((item)=>{ window.localStorage.setItem('allUser',res.data.data)})
        //     return window.localStorage.setItem('allUser', JSON.stringify(res.data.data))
        // })
      window.location.pathname='/Home'

      


        dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data })
    } catch (error) {
        dispatch(
            {
                type: USER_LOGIN_FAIL,
                payload: error.data && error.response.data.message ? error.response.data.message : error.message,
            })
    }

}

export default loginAction;
