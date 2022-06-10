import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from "redux-thunk"
import { composeWithDevTools } from 'redux-devtools-extension'
import {loginReducer} from '../Redux/Reducers/LoginReducer.js'

const rootReducer = combineReducers({
    loginReducer:loginReducer
})

const initialState = {}

const middleware = [thunk]

const Store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default Store;