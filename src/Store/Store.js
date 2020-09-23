import Api from '../Reducer/Api'
import Users from '../Reducer/Users'
import Things from '../Reducer/Things'



import { createStore, combineReducers  } from 'redux'

const AllReducer = combineReducers({
    Api,
    Users,
    Things
})
const store = createStore(AllReducer);

export default store;