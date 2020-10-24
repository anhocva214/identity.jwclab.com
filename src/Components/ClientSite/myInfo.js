import axios from 'axios';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cookie from 'react-cookies';
import { PulseLoader} from 'react-spinners'
import { css } from "@emotion/core";


const cssLoading = css`
text-align: center;
`

const MyInfo = () => {

    const dispatch = useDispatch();
    const urlBackend = useSelector(state => state.Api.urlBackend);
    const myInfo = useSelector(state => state.MyInfo.myInfo);

    const [_inputFullname, set_inputFullname] = useState(myInfo.fullname);
    const [_inputEmail, set_inputEmail] = useState(myInfo.email);
    const [_inputPhone, set_inputPhone] = useState(myInfo.phone);
    const [_inputPosition, set_inputPosition] = useState(myInfo.position);
    const [_inputAddress, set_inputAddress] = useState(myInfo.address);
    const [_inputSource, set_inputSource] = useState(myInfo.source);

    const [_statusEdit, set_statusEdit] = useState(false);

    // loading post user
    const [_loadingPostUser, set_loadingPostUser] = useState(false);


    const useComponentWillMount = func => { const willMount = useRef(true); if (willMount.current) {func();} willMount.current = false;};

    const postUserInfo = (event)=>{
        // console.log('click');
        set_loadingPostUser(true);
        event.preventDefault();
        var user = {
            "id": myInfo.id,
            "fullname": _inputFullname,
            "email": _inputEmail,
            "phone": _inputPhone,
            "source": _inputSource,
            "position": _inputPosition,
            "address": _inputAddress,
        }
        axios({
            method: 'post',
            url: urlBackend + "/modifyme",
            headers: {
                'x-access-token': cookie.load('token').accessToken
            },
            data: user
        })
            .then(({data})=>{
                // console.log(data);
                set_loadingPostUser(false);
                dispatch({ type:'ALERT_SUCCESS', msg: data.response});
                set_statusEdit(false);
                dispatch({ type: "SET_MY_INFO", myInfo: user});
            })
            .catch(error=>{
                // console.log(error);
                set_loadingPostUser(false);
                dispatch({ type:'ALERT_ERROR', msg: "ERROR SYSTEM"});

            })
    }

    const displayForm = () => {
        if (_statusEdit == false) {
            return (
                <form onSubmit={(event)=> {event.preventDefault(); set_statusEdit(true)}}>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Id (*) :</label>
                            <input disabled type="text" className="form-control" value={myInfo.id} />
                        </div>
                        <div className="form-group">
                            <label>Fullname (*) :</label>
                            <input disabled type="text" className="form-control" value={myInfo.fullname} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group w-100">
                            <label>Email :</label>
                            <input disabled type="email" className="form-control" value={myInfo.email} />
                        </div>
                       
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Position :</label>
                            <input disabled type="text" className="form-control" value={myInfo.position} />
                        </div>
                        <div className="form-group">
                            <label>Source :</label>
                            <input disabled type="text" className="form-control" value={myInfo.source} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Phone :</label>
                            <input disabled type="text" className="form-control" value={myInfo.phone} />
                        </div>
                        <div className="form-group">
                            <label>Address :</label>
                            <input disabled type="text" className="form-control" value={myInfo.address} />
                        </div>
                    </div>
                    <div className="btn-form  d-flex justify-content-between mt-3">
                        <button type="submit" className="btn btn-primary btn-save btn-myinfo">Edit</button>
                    </div>
                </form>
            )
        }
        else {
            return (
                <form onSubmit={(event)=> postUserInfo(event)}>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Id (*) :</label>
                            <input disabled type="text" className="form-control" defaultValue={myInfo.id} />
                        </div>
                        <div className="form-group">
                            <label>Fullname (*) :</label>
                            <input onChange={(event)=>set_inputFullname(event.target.value.trim())} type="text" className="form-control" defaultValue={myInfo.fullname} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group w-100">
                            <label>Email :</label>
                            <input onChange={(event)=>set_inputEmail(event.target.value.trim())} type="email" className="form-control" defaultValue={myInfo.email} />
                        </div>
                       
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Position :</label>
                            <input onChange={(event)=>set_inputPosition(event.target.value.trim())} type="text" className="form-control" defaultValue={myInfo.position} />
                        </div>
                        <div className="form-group">
                            <label>Source :</label>
                            <input onChange={(event)=>set_inputSource(event.target.value.trim())} type="text" className="form-control" defaultValue={myInfo.source} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Phone :</label>
                            <input onChange={(event)=>set_inputPhone(event.target.value.trim())} type="text" className="form-control" defaultValue={myInfo.phone} />
                        </div>
                        <div className="form-group">
                            <label>Address :</label>
                            <input onChange={(event)=>set_inputAddress(event.target.value.trim())} type="text" className="form-control" defaultValue={myInfo.address} />
                        </div>
                    </div>
                    <div className="btn-form  d-flex justify-content-between mt-3">
                        <button type="submit" className="btn btn-primary btn-save btn-myinfo">
                            {_loadingPostUser==true?<PulseLoader size={15} color={"#fff"} />:"Save"}
                        </button>
                    </div>
                </form>
            )
        }
    }


    return (
        <>
            <div className="accounnt-register-box ">
                <div className="nav-bar">
                    <div className="col-left">
                        {/* <img onClick={() => dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listUsers" })} src="/img/icon-2.png" alt="Icon2" /> */}
                        {/* <span>Detail User</span> */}
                    </div>
                    <div className="col-right" />
                </div>
                <div className="register-box">
                    {displayForm()}
                </div>
            </div>
        </>
    )
}

export default MyInfo;