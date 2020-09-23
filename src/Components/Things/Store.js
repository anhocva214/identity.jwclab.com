import { createStore } from 'redux';
import Alert from 'react-s-alert';

const allState = {
    connect: "Connect Success!",
    showLoginPage: true,
    urlBackend: "http://identity.jwclab.com:32768",
    dataUsersList: [],
    role: "",
    userDetail: {},
    showDetailPage: false,
    optionsSource: [],
    selectedPage: 0,
}

const allReducer = (state = allState, action) => {
    switch (action.type) {
        case "CONNECT":
            console.log("Connect Success!");
            return state
        case "SHOW_LOGIN_PAGE":
            return { ...state, showLoginPage: action.showLoginPage }
        case "MSG_ALERT":
            // console.log("msg alert");
            switch (action.mode) {
                case 'warning':
                    Alert.warning(action.msg, {
                        position: 'top-right',
                        effect: 'slide',
                    });
                    break;
                case 'success':
                    Alert.success(action.msg, {
                        position: 'top-right',
                        effect: 'slide',
                    });
                    break;
                case 'error':
                    Alert.error(action.msg, {
                        position: 'top-right',
                        effect: 'slide',
                    });
                    break;
                case 'info':
                    Alert.info(action.msg, {
                        position: 'top-right',
                        effect: 'slide',
                    });
                    break;
                default:
                    break;
            }
            return state
        case "SET_DATA_USERS_LIST":
            var tempData = action.dataUsersList;
            var between = tempData.length/2;
            if (between%2 != 0){
                between = between - 1;
            }
            for (var i=0; i<= between; i++){
                var temp = tempData[tempData.length-i-1];
                tempData[tempData.length-i-1] = tempData[i];
                tempData[i] = temp;
            }
            return {...state, dataUsersList: tempData}
        case "SET_ROLE":
            return {...state, role: action.role}
        case "SET_USER_DETAIL":
            // console.log("Store: ", action.userDetail);
            return {...state, userDetail: action.userDetail}
        case "SHOW_DETAIL_PAGE":
            return {...state, showDetailPage: action.showDetailPage}
        case "FILTER_SOURCE":
            const isSourceExist = (data, item)=>{
                var source = data.filter(value => value == item);
                if (source.length>0) return true
                return false
            }
            var tempSource = [];
            action.dataUsersList.map((value)=>{
                if (isSourceExist(tempSource ,value.manager) == false) tempSource.push(value.manager)
            })
            return {...state, optionsSource: tempSource}
        case "SET_SELECTED_PAGE":
            return {...state, selectedPage: action.selectedPage}
        default:
            return state
    }
}

const store = createStore(allReducer);

export default store;


