import Alert from 'react-s-alert';


const initialState = {

}

const AlertReducer = (state = initialState, action) => {
    switch (action.type) {

        case "CONNECT":
            console.log("connect Alert success")
            return { ...state }
        case "ALERT_SUCCESS":
            Alert.success(action.msg, {
                position: 'top-right',
                effect: 'slide',
                timeout: 3000,
                offset: 0
            });
            return { ...state }
        case "ALERT_ERROR":
            Alert.error(action.msg, {
                position: 'top-right',
                effect: 'slide',
                timeout: 3000,
                offset: 0
            });
            return { ...state }

        default:
            return state
    }
}

export default AlertReducer;