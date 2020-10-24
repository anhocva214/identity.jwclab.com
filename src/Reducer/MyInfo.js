const initialState = {
    myInfo: {},
    detailUser: {},
    detailStation: {},
}

const MyInfo = (state = initialState, action) => {
    switch (action.type) {

        case "CONNECT":
            console.log("connect MyInfo success")
            return { ...state }
        case "SET_MY_INFO":
            return { ...state, myInfo: action.myInfo }
        case "SET_DETAIL_USER":
            return { ...state, detailUser: action.detailUser }
        case "SET_DETAIL_STATION":
            return { ...state, detailStation: action.detailStation }
        default:
            return state
    }
}

export default MyInfo;