const initialState = {
    navPage: "login",
    navAdmin: "listUsers",
    navClient: "myInfo"
}

const Navigation = (state = initialState, action) => {
    switch (action.type) {

        case "CONNECT":
            console.log("connect Navigation success")
            return { ...state }
        case "NAVIGATE_PAGE":
            return { ...state, navPage: action.navPage }
        case "NAVIGATE_ADMIN":
            return { ...state, navAdmin: action.navAdmin }
        case "NAVIGATE_CLIENT":
            return { ...state, navClient: action.navClient }
        default:
            return state
    }
}

export default Navigation;