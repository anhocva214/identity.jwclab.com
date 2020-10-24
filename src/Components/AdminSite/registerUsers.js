import {useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import cookie from 'react-cookies'
import axios from 'axios'
import { PulseLoader} from 'react-spinners'
import { css } from "@emotion/core";


const cssLoading = css`
text-align: center;
`


const RegisterUser = () => {

    const dispatch = useDispatch();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    const [_id, set_id] = useState("");
    const [_password, set_password] = useState("");
    const [_rePassword, set_rePassword] = useState("");
    const [_role, set_role] = useState("client");
    const [_fullname, set_fullname] = useState("");
    const [_email, set_email] = useState("");
    const [_phone, set_phone] = useState("");
    const [_source, set_source] = useState("");
    const [_position, set_position] = useState("");
    const [_address, set_address] = useState("");

    const btnResetForm = useRef();

    const [_loadingRegisterUser, set_loadingRegisterUser] = useState(false);

    
    const registerUser = (event)=>{
        set_loadingRegisterUser(true)
        event.preventDefault();
        if (_id.length == 0 || _password.length == 0 || _rePassword.length == 0 || _role.length == 0 || _fullname.length == 0  ){
            dispatch({ type: "ALERT_ERROR", msg: "Register failed. Please check your form"});
            set_loadingRegisterUser(false);
        }
        else if (_password != _rePassword){
            dispatch({ type: "ALERT_ERROR", msg: "Confirm password not match"});
            set_loadingRegisterUser(false);
        }
        else{
            var dataUser = {
                "admin": "admin_api",
                "id": _id,
                "password": _password,
                "role": _role,
                "fullname": _fullname,
                "email": _email,
                "phone": _phone,
                "source": _source,
                "position": _position,
                "address": _address
            }
            var headers = {
                'x-access-token': cookie.load('token').accessToken
            }
            axios({
                method: 'post',
                url: urlBackend + "/register",
                headers: headers,
                data: dataUser
            })
                .then(({data})=>{
                    set_loadingRegisterUser(false);
                    dispatch({ type: "ALERT_SUCCESS", msg: data.response});
                    dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listUsers"});
                    btnResetForm.current.click();
                })
                .catch(error=>{
                    set_loadingRegisterUser(false);
                    // console.log(error);
                    if (error.response)
                    dispatch({ type: "ALERT_ERROR", msg: error.response.data.response});
                })
        }
    }

    return (
        <>
            <div className="accounnt-register-box">
                <div className="nav-bar">
                    <div className="col-left">
                        <img onClick={()=>dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listUsers"})} src="/img/icon-2.png" alt="Icon2" />
                        <span>Register New User</span>
                    </div>
                    <div className="col-right" />
                </div>
                <div className="register-box">
                    <form onSubmit={(event)=>registerUser(event)}>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Id (*) :</label>
                                <input onChange={(event)=>{set_id(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter id for account" />
                            </div>
                            <div className="form-group">
                                <label>Fullname (*) :</label>
                                <input onChange={(event)=>{set_fullname(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter fullname" />
                            </div>
                        </div>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Password (*) :</label>
                                <input onChange={(event)=>{set_password(event.target.value.trim())}} type="password" className="form-control" placeholder="Enter password" />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password (*) :</label>
                                <input onChange={(event)=>{set_rePassword(event.target.value.trim())}} type="password" className="form-control" placeholder="Enter confirm password" />
                            </div>
                        </div>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Email :</label>
                                <input onChange={(event)=>{set_email(event.target.value.trim())}} type="email" className="form-control" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label>Role (*) :</label>
                                <select className="form-control" onChange={(event)=> set_role(event.target.value.trim())}>
                                    <option value="client">Client</option>
                                    <option value="admin">Admin</option>
                                    <option value="stationn">Station</option>
                                </select>
                            </div>
                        </div>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Position :</label>
                                <input onChange={(event)=>{set_position(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter Position" />
                            </div>
                            <div className="form-group">
                                <label>Source :</label>
                                <input onChange={(event)=>{set_source(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter source" />
                            </div>
                        </div>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Phone :</label>
                                <input onChange={(event)=>{set_phone(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter phone" />
                            </div>
                            <div className="form-group">
                                <label>Address :</label>
                                <input onChange={(event)=>{set_address(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter address" />
                            </div>
                        </div>
                        <div className="btn-form text-right mt-3">
                            <button type="submit" className="btn btn-primary btn-save">
                                {_loadingRegisterUser==true?<PulseLoader size={15} color={"#fff"} />:"Save"}
                            </button>
                            <button ref={btnResetForm} type="reset" className="btn d-none"></button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default RegisterUser;