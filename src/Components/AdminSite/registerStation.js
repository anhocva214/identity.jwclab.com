import {useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import cookie from 'react-cookies'
import axios from 'axios'
import { PulseLoader} from 'react-spinners'
import { css } from "@emotion/core";


const cssLoading = css`
text-align: center;
`

const RegisterStation = () => {

    const dispatch = useDispatch();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    const [_id, set_id] = useState("");
    const [_name, set_name] = useState("");
    const [_phone, set_phone] = useState("");
    const [_coordinate, set_coordinate] = useState("");
    const [_manager, set_manager] = useState("");
    const [_address, set_address] = useState("");

    const btnResetForm = useRef();

    const [_loadingRegisterStation, set_loadingRegisterStation] = useState(false);


    const registerStation = (event)=>{
        event.preventDefault();
        set_loadingRegisterStation(true);
        if (_id.length == 0 || _phone.length == 0 || _coordinate.length == 0 || _manager.length == 0 || _name.length == 0 || _address.length == 0 ){
            dispatch({ type: "ALERT_ERROR", msg: "Register failed. Please check your form"});
            set_loadingRegisterStation(false);
        }
        else{
            var dataStation = {
                "id": _id,
                "name": _name,
                "manager": _manager,
                "phone": _phone,
                "location": _coordinate,
                "address": _address
            }
            var headers = {
                'x-access-token': cookie.load('token').accessToken
            }
            axios({
                method: 'post',
                url: urlBackend + "/addstation",
                headers: headers,
                data: dataStation
            })
                .then(({data})=>{
                    set_loadingRegisterStation(false);
                    dispatch({ type: "ALERT_SUCCESS", msg: data.response});
                    dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listThings"});
                    btnResetForm.current.click();
                })
                .catch(error=>{
                    set_loadingRegisterStation(false);
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
                        <img onClick={()=>dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listThings"})} src="/img/icon-2.png" alt="Icon2" />
                        <span>Register New Station</span>
                    </div>
                    <div className="col-right" />
                </div>
                <div className="register-box">
                    <form onSubmit={(event)=>registerStation(event)}>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Id (*) :</label>
                                <input onChange={(event)=>{set_id(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter id for account" />
                            </div>
                            <div className="form-group">
                                <label>Name (*) :</label>
                                <input onChange={(event)=>{set_name(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter name" />
                            </div>
                        </div>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Manager :</label>
                                <input onChange={(event)=>{set_manager(event.target.value.trim())}}  className="form-control" placeholder="Enter manager" />
                            </div>
                            <div className="form-group">
                                <label>Phone :</label>
                                <input onChange={(event)=>{set_phone(event.target.value.trim())}}  className="form-control" placeholder="Enter phone" />
                            </div>
                        </div>
                        <div className="jwc-row">
                            <div className="form-group">
                                <label>Location :</label>
                                <input onChange={(event)=>{set_coordinate(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter Position" />
                            </div>
                            <div className="form-group">
                                <label>Address :</label>
                                <input onChange={(event)=>{set_address(event.target.value.trim())}} type="text" className="form-control" placeholder="Enter source" />
                            </div>
                        </div>
                        <div className="btn-form text-right mt-3">
                            <button type="submit" className="btn btn-primary btn-save">
                                {_loadingRegisterStation==true?<PulseLoader size={15} color={"#fff"} />:"Save"}
                                
                            </button>
                            <button ref={btnResetForm} type="reset" className="btn d-none"></button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default RegisterStation;