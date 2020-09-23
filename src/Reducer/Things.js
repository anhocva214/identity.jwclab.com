import Alert from 'react-s-alert';


const initialState = {
    connect: "Connect Success!",
    showLoginPage: true,
    dataUsersList: [],
    role: "null",
    userDetail: {},
    showDetailPage: false,
    optionsManager: [],
    selectedPage: 0,
}

const Things = (state = initialState, action) => {
    switch (action.type) {
        case "CONNECT":
            console.log("Connect Success!");
            return state
        case "SHOW_LOGIN_PAGE":
            return { ...state, showLoginPage: action.showLoginPage }
        case "SET_DATA_USERS_LIST":
            var tempData = action.dataUsersList;
            var between = tempData.length / 2;
            if (between % 2 != 0) {
                between = between - 1;
            }
            for (var i = 0; i <= between; i++) {
                var temp = tempData[tempData.length - i - 1];
                tempData[tempData.length - i - 1] = tempData[i];
                tempData[i] = temp;
            }
            return { ...state, dataUsersList: tempData }
        case "SET_ROLE":
            return { ...state, role: action.role }
        case "SET_USER_DETAIL":
            // console.log("Store: ", action.userDetail);
            return { ...state, userDetail: action.userDetail }
        case "SHOW_DETAIL_PAGE":
            return { ...state, showDetailPage: action.showDetailPage }
        case "FILTER_MANAGER":
            const isManagerExist = (data, item) => {
                var manager = data.filter(value => value == item);
                if (manager.length > 0) return true
                return false
            }
            var tempManager = [];
            action.dataUsersList.map((value) => {
                if (isManagerExist(tempManager, value.manager) == false) tempManager.push(value.manager)
            })
            return { ...state, optionsManager: tempManager }
        case "SET_SELECTED_PAGE":
            return { ...state, selectedPage: action.selectedPage }
        default:
            return state
    }
}

export default Things;