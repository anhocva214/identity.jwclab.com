const initialState = {
    urlBackend: "http://identity.jwclab.com:32768"
}

const Api =  (state = initialState, action) => {
    switch (action.type) {

    case "CONNECT":
        console.log("connect API success")
        return { ...state}

    default:
        return state
    }
}

export default Api;