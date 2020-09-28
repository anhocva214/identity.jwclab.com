import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cookie from 'react-cookies';
import Link from 'next/link'

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
        if (_id.length == 0 && _password.length == 0) {
            dispatch({ type: "MSG_ALERT", mode: 'warning', msg: "Login failed. Please check your id and password" });
        }
        else {
            axios({
                method: 'post',
                url: urlBackend + "/loginstation",
                data: {
                    id: _id,
                    password: _password
                }
            })
                .then(({ data }) => {
                    // console.log(data);
                    // localStorage.setItem('token', data);
                    cookie.save('token', data, { maxAge: 24 * 60 * 60 });
                    success_login(data.accessToken);
                })
                .catch(({ response }) => {
                    if (response) {
                        var data = response.data;
                        dispatch({ type: "MSG_ALERT", mode: "error", msg: data.message });
                    }
                })
        }
    }

    const refreshToken = () => {
        var token = cookie.load('token');
        // if (token != undefined && token != null) token = {accessToken: '', refreshToken: ''};
        if (token != undefined && token != null) {
            var headers = {
                'x-refresh-token': token.refreshToken,
                'Conent-Type': 'application/json'
            }
            axios({
                method: 'post',
                url: urlBackend + "/refresh-token",
                headers: headers,
                data: {
                    'accessToken': token.accessToken
                }
            })
                .then(({ data }) => {
                    // console.log(data);
                    // console.log(cookie.load('token').accessToken);
                    token.accessToken = data.accessToken;
                    // console.log(token);
                    cookie.save('token', token);
                    success_login(data.accessToken);
                })
                .catch(({ response }) => {
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
                dispatch({ type: "SET_DATA_USERS_LIST", dataUsersList: data.response });
                dispatch({ type: "FILTER_MANAGER", dataUsersList: data.response });
            })
            .catch(error => {
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
            <main className="login-new-page">
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100">
                            <div className="logo">
                                <Link href="/">
                                    <img className="w-100" src="/img/logo-home.png" alt="logo" />
                                </Link>
                            </div>
                            <form className="login100-form validate-form" onSubmit={(event) => login(event)}>
                                <span className="login100-form-title">
                                    Member Login
                                </span>
                                <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                    <input onChange={(event) => set_id(event.target.value.trim())} className="input100" type="text" name="email" placeholder="ID" />
                                    <span className="focus-input100" />
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="wrap-input100 validate-input" data-validate="Password is required">
                                    <input onChange={(event) => set_password(event.target.value.trim())} className="input100" type="password" name="pass" placeholder="Password" />
                                    <span className="focus-input100" />
                                    <span className="symbol-input100">
                                        <i className="fa fa-lock" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="container-login100-form-btn">
                                    <button type="submit" className="login100-form-btn">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}

export default Login;