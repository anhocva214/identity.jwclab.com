import { useState, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import cookie from 'react-cookies';

const Login = () => {

    const dispatch = useDispatch();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    const [_id, set_id] = useState("");
    const [_password, set_password] = useState("");

    const useComponentWillMount = func => {
        const willMount = useRef(true);
      
        if (willMount.current) {
          func();
        }
      
        willMount.current = false;
    };

    const login = (event) => {
        event.preventDefault();
        if (_id.length == 0 && _password.length == 0){
            dispatch({type: "MSG_ALERT", mode: 'warning', msg: "Login failed. Please check your id and password"});
        }
        else{
            axios({
                method: 'post',
                url: urlBackend + "/loginstation",
                data:{
                    id: _id,
                    password: _password
                }
            })
            .then(({data})=>{
                // console.log(data);
                // localStorage.setItem('token', data);
                cookie.save('token', data, {maxAge: 24*60*60});
                success_login(data.accessToken);
            })
            .catch(({response})=>{
                if (response){
                    var data = response.data;
                    dispatch({type: "MSG_ALERT", mode: "error", msg: data.message});
                }
            })
        }
    }

    const refreshToken = () => {
        var token = cookie.load('token');
        // if (token != undefined && token != null) token = {accessToken: '', refreshToken: ''};
        if (token != undefined && token != null){
            var headers = {
                'x-refresh-token': token.refreshToken,
                'Conent-Type': 'application/json'
            }
            axios({
                method: 'post',
                url: urlBackend + "/refresh-token",
                headers: headers,
                data:{
                    'accessToken': token.accessToken
                }
            })
            .then(({data})=>{
                // console.log(data);
                // console.log(cookie.load('token').accessToken);
                token.accessToken = data.accessToken;
                // console.log(token);
                cookie.save('token', token);
                success_login(data.accessToken);
            })
            .catch(({response})=>{
                // console.log(response);
            })
        }
       
    }

    const getUsersList = (accessToken) => {
        var headers = {
            'x-access-token': accessToken
        }
        axios({
            method: 'get',
            url: urlBackend + "/liststation",
            headers: headers
        })
            .then(({ data }) => {
                console.log(data.response);
                dispatch({ type: "SET_DATA_USERS_LIST", dataUsersList: data.response});
                dispatch({ type: "FILTER_MANAGER", dataUsersList:data.response});
            })
            .catch(error=>{
                // console.log('getUsersList: ',error);
            })
    }

    const success_login = (accessToken) => {
        dispatch({ type: "SHOW_LOGIN_PAGE", showLoginPage: false });
        dispatch({ type: "MSG_ALERT", mode: 'success', msg: 'Login Success' });
        getUsersList(accessToken);
    }

    useComponentWillMount(() => {
        refreshToken();
    })

    return (
        <>
            <main className="login-page">
                <div className="container d-flex justify-content-center align-items-center h-100">
                    <form method="post" onSubmit={(event)=>login(event)}>
                        <img className="mb-3" src="/img/logo.png" alt="logo" />
                        <div className="form-group">
                            <input onChange={(event)=>set_id(event.target.value.trim())} type="text"  className="form-control" placeholder="Enter ID or Phone Number" />
                        </div>
                        <div className="form-group">
                            <input onChange={(event)=>set_password(event.target.value.trim())} type="password" className="form-control" placeholder="Enter Password" />
                        </div>
                        <button type="submit" className="btn btn-success pt-1 pb-1 btn-lg btn-block">LOGIN</button>
                    </form>
                </div>
            </main>

            <style jsx>{`
                .login-page form img {
                    left: 50%;
                    transform: translate(-50%);
                }
            
            `}</style>

        </>
    )
}

export default Login;