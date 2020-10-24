import Api from '../Reducer/Api'
import Navigation from '../Reducer/Navigation'
import AlertReducer from '../Reducer/Alert'
import MyInfo from '../Reducer/MyInfo'




import { createStore, combineReducers  } from 'redux'

const AllReducer = combineReducers({
    Api,
    Navigation,
    AlertReducer,
    MyInfo
})
const store = createStore(AllReducer);

export default store;