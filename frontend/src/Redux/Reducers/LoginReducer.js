import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL
    } from "../Constants.js"
    

    const initData = {
        items: []
    }
    
    export const loginReducer = (state=initData, action) =>{
        switch(action.type){
            case USER_LOGIN_REQUEST:
                return {loading: true, ...state}

                break
            
            case USER_LOGIN_SUCCESS:
                return {loading: false, items: action.payload}
               
                break
            
            case USER_LOGIN_FAIL:
                return {loading: false,  error:action.payload}
                break
            
            default:
                return state
        }
    }