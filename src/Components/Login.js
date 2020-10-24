import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cookie from 'react-cookies';
import { useRouter } from 'next/router'
import { PulseLoader} from 'react-spinners'




const LoginPage = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    const [_id, set_id] = useState("");
    const [_password, set_password] = useState("");
    const [_loadingLogin, set_loadingLogin] = useState(false);

    const useComponentWillMount = func => { const willMount = useRef(true); if (willMount.current) {func();} willMount.current = false;};

    const login = (event) => {
        set_loadingLogin(true);
        event.preventDefault();;
        if (_id.length == 0 && _password.length == 0) {
            dispatch({ type: "MSG_ALERT", mode: 'warning', msg: "Login failed. Please check your id and password" });
            set_loadingLogin(false);
        }
        else {
            axios({
                method: 'post',
                url: urlBackend + "/login",
                data: {
                    id: _id,
                    password: _password
                }
            })
                .then(({ data }) => {
                    // console.log(data);
                    cookie.save('token', data, { maxAge: 24 * 60 * 60 });
                    success_login(data.accessToken);
                })
                .catch(({ response }) => {
                    set_loadingLogin(false);
                    if (response) {
                        var data = response.data;
                        dispatch({ type: "ALERT_ERROR", msg: data.message });
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

    const success_login = (accessToken) => {
        var headers = {
            'x-access-token': accessToken
        }
        axios({
            method: 'get',
            url: urlBackend + "/myinfo",
            headers: headers
        })
            .then(({ data }) => {
                set_loadingLogin(false);
                dispatch({type:"SET_MY_INFO", myInfo: data.response});
                if (data.response.role == "admin"){
                    dispatch({ type: "NAVIGATE_PAGE", navPage: "adminSite"});
                    dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listUsers"}); 
                }
                else{
                    dispatch({ type: "NAVIGATE_PAGE", navPage: "clientSite"});
                    dispatch({ type: "NAVIGATE_CLIENT", navClient: "myInfo"}); 
                }
            })
            .catch((error) => {
                set_loadingLogin(false);
                // console.log(error);
            })
    }

    useComponentWillMount(() => {
        refreshToken();
    })

    return (
        <>
            <main className="home-page">
                <div className="container">
                    {/* <div class="spinner spinner6" ></div> */}
                    <div className="box-body">
                        <div className="logo">
                            <img className="w-100" src="/img/logo.png" alt="logo" />
                        </div>
                        <h1>WELCOME TO JWCLAB IDENTITY SERVICE</h1>
                        <hr />
                        <h3>This service will issue one X.509 certificate per user/device for their identification on JWCLab eco system!</h3>
                        <div className="wrap-login100 mt-4">
                            <form className="login100-form validate-form" onSubmit={(event)=>login(event)}>
                                <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                    <input onChange={(event)=>set_id(event.target.value.trim())} className="input100" type="text" name="email" placeholder="ID" />
                                    <span className="focus-input100" />
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="wrap-input100 validate-input" data-validate="Password is required">
                                    <input onChange={(event)=>set_password(event.target.value.trim())} className="input100" type="password" name="pass" placeholder="Password" />
                                    <span className="focus-input100" />
                                    <span className="symbol-input100">
                                        <i className="fa fa-lock" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="container-login100-form-btn">
                                    <button className="login100-form-btn">
                                        {_loadingLogin==false?"Login":<PulseLoader size={15} color={"#fff"} />}
                                        
                                        {/* Login */}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="contact mt-4">
                            <ul className="socail-list">
                                <li className="item">
                                    <a href="#">
                                        <svg id="email-mask" viewBox="0 0 64 64">
                                            <g className="svg-mask">
                                                <path d="M41.1,25H22.9l9.1,7.1L41.1,25z M44,26.6l-12,9.3l-12-9.3V39h24V26.6z M0,0v64h64V0H0z M47,42H17V22h30V42z">
                                                </path>
                                            </g>
                                        </svg>
                                    </a>
                                </li>
                                <li className="item">
                                    <a href="#">
                                        <svg id="facebook-unauth-mask" viewBox="0 0 64 64">
                                            <g className="svg-mask">
                                                <path d="M0,0v64h64V0H0z M39.6,22l-2.8,0c-2.2,0-2.6,1.1-2.6,2.6V28h5.3l-0.7,5.3h-4.6V47h-5.5V33.3H24V28h4.6V24 c0-4.6,2.8-7,6.9-7c2,0,3.6,0.1,4.1,0.2V22z">
                                                </path>
                                            </g>
                                        </svg>
                                    </a>
                                </li>
                                <li className="item">
                                    <a href="#">
                                        <svg id="instagram-mask" viewBox="0 0 64 64">
                                            <g className="svg-mask">
                                                <path d="M43.693,23.153c-0.272-0.7-0.597-1.2-1.122-1.725c-0.525-0.525-1.025-0.85-1.725-1.122c-0.529-0.205-1.323-0.45-2.785-0.517c-1.582-0.072-2.056-0.087-6.061-0.087s-4.48,0.015-6.061,0.087c-1.462,0.067-2.257,0.311-2.785,0.517c-0.7,0.272-1.2,0.597-1.725,1.122c-0.525,0.525-0.85,1.025-1.122,1.725c-0.205,0.529-0.45,1.323-0.516,2.785c-0.072,1.582-0.087,2.056-0.087,6.061s0.015,4.48,0.087,6.061c0.067,1.462,0.311,2.257,0.516,2.785c0.272,0.7,0.597,1.2,1.122,1.725s1.025,0.85,1.725,1.122c0.529,0.205,1.323,0.45,2.785,0.516c1.581,0.072,2.056,0.087,6.061,0.087s4.48-0.015,6.061-0.087c1.462-0.067,2.257-0.311,2.785-0.516c0.7-0.272,1.2-0.597,1.725-1.122s0.85-1.025,1.122-1.725c0.205-0.529,0.45-1.323,0.516-2.785c0.072-1.582,0.087-2.056,0.087-6.061s-0.015-4.48-0.087-6.061C44.143,24.476,43.899,23.682,43.693,23.153z M32,39.703c-4.254,0-7.703-3.449-7.703-7.703s3.449-7.703,7.703-7.703s7.703,3.449,7.703,7.703S36.254,39.703,32,39.703z M40.007,25.793c-0.994,0-1.8-0.806-1.8-1.8c0-0.994,0.806-1.8,1.8-1.8c0.994,0,1.8,0.806,1.8,1.8C41.807,24.987,41.001,25.793,40.007,25.793z M0,0v64h64V0H0z M46.91,38.184c-0.073,1.597-0.326,2.687-0.697,3.641c-0.383,0.986-0.896,1.823-1.73,2.657c-0.834,0.834-1.67,1.347-2.657,1.73c-0.954,0.371-2.044,0.624-3.641,0.697C36.585,46.983,36.074,47,32,47s-4.585-0.017-6.184-0.09c-1.597-0.073-2.687-0.326-3.641-0.697c-0.986-0.383-1.823-0.896-2.657-1.73c-0.834-0.834-1.347-1.67-1.73-2.657c-0.371-0.954-0.624-2.044-0.697-3.641C17.017,36.585,17,36.074,17,32c0-4.074,0.017-4.585,0.09-6.185c0.073-1.597,0.326-2.687,0.697-3.641c0.383-0.986,0.896-1.823,1.73-2.657c0.834-0.834,1.67-1.347,2.657-1.73c0.954-0.371,2.045-0.624,3.641-0.697C27.415,17.017,27.926,17,32,17s4.585,0.017,6.184,0.09c1.597,0.073,2.687,0.326,3.641,0.697c0.986,0.383,1.823,0.896,2.657,1.73c0.834,0.834,1.347,1.67,1.73,2.657c0.371,0.954,0.624,2.044,0.697,3.641C46.983,27.415,47,27.926,47,32C47,36.074,46.983,36.585,46.91,38.184z M32,27c-2.761,0-5,2.239-5,5s2.239,5,5,5s5-2.239,5-5S34.761,27,32,27z">
                                                </path>
                                            </g>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>


        </>
    )
}

export default LoginPage;