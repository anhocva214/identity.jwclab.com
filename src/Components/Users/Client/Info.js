import axios from 'axios';
import {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cookie from 'react-cookies';

const ClientInfo = () => {

    const dispatch = useDispatch();
    const urlBackend = useSelector(state => state.Api.urlBackend);

    const [userDetail, setUserDetail] = useState({});
    const [_isEditFullname, set_isEditFullname] = useState(false);
    const [_inputFullname, set_inputFullname] = useState("");
    const [_isEditEmail, set_isEditEmail] = useState(false);
    const [_inputEmail, set_inputEmail] = useState("");
    const [_isEditPhone, set_isEditPhone] = useState(false);
    const [_inputPhone, set_inputPhone] = useState("");
    const [_isEditPosition, set_isEditPosition] = useState(false);
    const [_inputPosition, set_inputPosition] = useState("");
    const [_isEditAddress, set_isEditAddress] = useState(false);
    const [_inputAddress, set_inputAddress] = useState("");
    const [_isEditSource, set_isEditSource] = useState(false);
    const [_inputSource, set_inputSource] = useState("");

    const [_isEditPassword, set_isEditPassword] = useState(false);
    const [_inputNewPassword, set_inputNewPassword] = useState("");
    const [_inputRePassword, set_inputRePassword] = useState("");
    const [_inputOldPassword, set_inputOldPassword] = useState("");

    const useComponentWillMount = func => {
        const willMount = useRef(true);
        if (willMount.current) {
          func();
        }
        willMount.current = false;
    };

    const setInputValue = (user)=>{
        set_inputFullname(user.fullname);
        set_inputEmail(user.email);
        set_inputPhone(user.phone);
        set_inputPosition(user.position);
        set_inputAddress(user.address);
        set_inputSource(user.source);
        
    }

    useComponentWillMount(() => {
        var headers = {
            'x-access-token': cookie.load('token').accessToken
        }
        axios({
            method: 'get',
            url: urlBackend + "/myinfo",
            headers: headers
        })
            .then(({ data }) => {
                setUserDetail(data.response);
                setInputValue(data.response);
               
            })
            .catch((error) => {
                // console.log(error);
            })
    })

    const postUserInfo = ()=>{
        var user = {
            "fullname": _inputFullname,
            "email": _inputEmail,
            "phone": _inputPhone,
            "source": _inputSource,
            "position": _inputPosition,
            "address": _inputAddress
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
                dispatch({ type:'MSG_ALERT', mode:'success', msg: data.response});
            })
            .catch(error=>{
                // console.log(error);
            })
    }

    const postUserNewPassoword = ()=>{
        if (_inputRePassword == _inputNewPassword){
            axios({
                method: "post",
                url: urlBackend + "/changepw",
                headers: {
                    'x-access-token': cookie.load('token').accessToken
                },
                data:{
                    oldpassword: _inputOldPassword,
                    newpassword: _inputNewPassword
                }
            })
                .then(({data})=>{
                    dispatch({ type: "MSG_ALERT", mode: 'success', msg: data.response});
                    set_isEditPassword(false);
                })
                .catch(error =>{
                    // console.log(error);
                })
        }
        else{
            dispatch({ type: "MSG_ALERT", mode: 'error', msg: "Confirm Password Fail"});
        }
    }

    const showInputFullname = ()=>{
        if (_isEditFullname == false){
            return (
                <div className="form-group">
                    <label htmlFor="fullname">Fullname</label>
                    <div className="btn-group d-flex">
                        <input disabled type="text" className="form-control" defaultValue={_inputFullname} />
                        <button onClick={()=>set_isEditFullname(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label htmlFor="fullname">Fullname</label>
                <form className="btn-group d-flex">
                    <input onChange={(event)=>set_inputFullname(event.target.value)} type="text" className="form-control" defaultValue={_inputFullname} />
                    <button onClick={()=>{postUserInfo(); set_isEditFullname(false)}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditFullname(false); set_inputFullname(userDetail.fullname)}} type="button" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )}

    const showInputEmail = ()=>{
        if (_isEditEmail == false){
            return (
                <div className="form-group">
                    <label htmlFor="fullname">Email</label>
                    <div className="btn-group d-flex">
                        <input disabled type="text" className="form-control" defaultValue={_inputEmail} />
                        <button onClick={()=>set_isEditEmail(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label htmlFor="fullname">Email</label>
                <form className="btn-group d-flex">
                    <input onChange={(event)=>set_inputEmail(event.target.value)} type="text" className="form-control" defaultValue={_inputEmail} />
                    <button onClick={()=>{postUserInfo(); set_isEditEmail(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditEmail(false); set_inputEmail(userDetail.email);}} type="button" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

    const showInputPhone = ()=>{
        if (_isEditPhone == false){
            return (
                <div className="form-group">
                    <label htmlFor="fullname">Phone</label>
                    <div className="btn-group d-flex">
                        <input disabled type="text" className="form-control" defaultValue={_inputPhone} />
                        <button onClick={()=>set_isEditPhone(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label htmlFor="fullname">Phone</label>
                <form className="btn-group d-flex">
                    <input onChange={(event)=>set_inputPhone(event.target.value)} type="text" className="form-control" defaultValue={_inputPhone} />
                    <button onClick={()=>{postUserInfo(); set_isEditPhone(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditPhone(false); set_inputPhone(userDetail.phone);}} type="button" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

    const showInputPosition = ()=>{
        if (_isEditPosition == false){
            return (
                <div className="form-group">
                    <label htmlFor="fullname">Position</label>
                    <div className="btn-group d-flex">
                        <input disabled type="text" className="form-control" defaultValue={_inputPosition} />
                        <button onClick={()=>set_isEditPosition(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label htmlFor="fullname">Position</label>
                <form className="btn-group d-flex">
                    <input onChange={(event)=>set_inputPosition(event.target.value)} type="text" className="form-control" defaultValue={_inputPosition} />
                    <button onClick={()=>{postUserInfo(); set_isEditPosition(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditPosition(false); set_inputPosition(userDetail.position)}} type="button" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

    const showInputAddress = ()=>{
        if (_isEditAddress == false){
            return (
                <div className="form-group">
                    <label htmlFor="fullname">Address</label>
                    <div className="btn-group d-flex">
                        <input disabled type="text" className="form-control" defaultValue={_inputAddress} />
                        <button onClick={()=>set_isEditAddress(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label htmlFor="fullname">Address</label>
                <form className="btn-group d-flex">
                    <input onChange={(event)=>set_inputAddress(event.target.value)} type="text" className="form-control" defaultValue={_inputAddress} />
                    <button onClick={()=>{postUserInfo(); set_isEditAddress(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditAddress(false); set_inputAddress(userDetail.address)}} type="button" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

    const showInputSource = ()=>{
        if (_isEditSource == false){
            return (
                <div className="form-group">
                    <label htmlFor="Source">Source</label>
                    <div className="btn-group d-flex">
                        <input disabled type="text" className="form-control" defaultValue={_inputSource} />
                        <button onClick={()=>set_isEditSource(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label htmlFor="Source">Source</label>
                <form className="btn-group d-flex">
                    <input onChange={(event)=>set_inputSource(event.target.value)} type="text" className="form-control" defaultValue={_inputSource} />
                    <button onClick={()=>{postUserInfo(); set_isEditSource(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditSource(false); set_inputSource(userDetail.source)}} type="button" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

    const showInputPassword = () => {
        if (_isEditPassword == true)
        return (
            <div className="form-reset-password">
                <div className="form-group">
                    <label htmlFor="password">Old Password:</label>
                    <div className="btn-group d-flex">
                        <input type="password" className="form-control none-input" />
                        <input onChange={(event) => set_inputOldPassword(event.target.value)} type="password" className="form-control" placeholder="Enter Old Password" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">New Password:</label>
                    <div className="btn-group d-flex">
                        <input onChange={(event) => set_inputNewPassword(event.target.value)} type="password" className="form-control" placeholder="Enter New Password" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Confirm Password:</label>
                    <div className="btn-group d-flex">
                        <input onChange={(event) => set_inputRePassword(event.target.value)} type="password" defaultValue={_inputRePassword} className="form-control" placeholder="Enter New Password" />
                    </div>
                </div>
                <div className="btn-group w-100">
                    <div className="btn-group btn-block m-0 d-flex">
                        <button onClick={() => { postUserNewPassoword()}} type="button" className="btn btn-success">Change</button>
                    </div>
                    <div className="btn-group btn-block m-0 d-flex">
                        <button onClick={()=>set_isEditPassword(false)} type="button" className="btn btn-warning">Cancel</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <main className="userDetail pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-lg-7">
                            <form className="form-userDetail" method="post">
                                {showInputFullname()}
                                

                                {showInputEmail()}
                                {showInputPhone()}
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6">
                                        {showInputSource()}
                                    </div>
                                    <div className="col-lg-6 col-sm-6">
                                        {showInputPosition()}
                                    </div>
                                </div>
                                {showInputAddress()}

                            </form>
                        </div>
                        <div className="col-sm col-lg">
                            <div className="form-group">
                                <label htmlFor="password"></label>
                                <div className="btn-group d-flex">
                                    <button onClick={()=>set_isEditPassword(!_isEditPassword)} type="button" className="btn btn-primary">Change Password</button>
                                </div>
                            </div>
                            {showInputPassword()}
                           
                        </div>
                    </div>
                </div>
            </main>
            <style jsx global>{`
                .none-input{
                    position: absolute;
                    top: -100000px;
                }
            
            `}</style>
        </>
    )
}

export default ClientInfo;