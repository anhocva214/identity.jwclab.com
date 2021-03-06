import axios from 'axios';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cookie from 'react-cookies';
import { PulseLoader} from 'react-spinners'
import { css } from "@emotion/core";


const cssLoading = css`
text-align: center;
`

const DetailUser = () => {

    const dispatch = useDispatch();
    const urlBackend = useSelector(state => state.Api.urlBackend);
    const detailUser = useSelector(state => state.MyInfo.detailUser);

    const [_inputFullname, set_inputFullname] = useState(detailUser.fullname);
    const [_inputEmail, set_inputEmail] = useState(detailUser.email);
    const [_inputPhone, set_inputPhone] = useState(detailUser.phone);
    const [_inputPosition, set_inputPosition] = useState(detailUser.position);
    const [_inputAddress, set_inputAddress] = useState(detailUser.address);
    const [_inputRole, set_inputRole] = useState(detailUser.role);
    const [_inputSource, set_inputSource] = useState(detailUser.source);
    const [_inputPassword, set_inputPassword] = useState("");
    const [_inputRePassword, set_inputRePassword] = useState("");

    const [_statusEdit, set_statusEdit] = useState(false);

    const [_historyLogin, set_historyLogin] = useState([]);
    const [_historyLoading, set_historyLoading] = useState(true);
    const [_change, set_change] = useState(false);

    // loading post user
    const [_loadingPostUser, set_loadingPostUser] = useState(false);

    const refeshHistory = useRef();


    const useComponentWillMount = func => { const willMount = useRef(true); if (willMount.current) {func();} willMount.current = false;};

    const preprocessingHistoryLogin = (data)=>{
        var tempData = [];
        data.map((value)=>{
            if (value != null){
                var item = value.split(" : ");
                tempData.push(item);
            }
        });
        set_historyLogin(tempData);
        set_historyLoading(false);
        // console.log(tempData);
    }

    const getHistoryLogin = ()=>{
        set_historyLoading(true);
        axios({
            method: "post",
            url: urlBackend + "/historyLogin",
            headers:{
                'x-access-token': cookie.load('token').accessToken
            },
            data:{
                id: detailUser.id
            }
        })
            .then(({ data })=>{
                set_historyLoading(false);
                preprocessingHistoryLogin(data.response);
            })
            .catch(error=>{
                // console.log(error);
                set_historyLoading(false);
                set_historyLogin([]);

            })
    }

    useComponentWillMount(()=>{
        getHistoryLogin();
    })

    const postUserInfo = (event)=>{
        // console.log('click');
        set_loadingPostUser(true);
        event.preventDefault();
        var user = {
            "id": detailUser.id,
            "role": _inputRole,
            "fullname": _inputFullname,
            "email": _inputEmail,
            "phone": _inputPhone,
            "source": _inputSource,
            "position": _inputPosition,
            "address": _inputAddress,
        }
        if (_inputPassword.length>0 && _inputPassword===_inputRePassword){
            user.password = _inputPassword;
            
        }
        axios({
            method: 'post',
            url: urlBackend + "/modify",
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
                dispatch({ type: "SET_DETAIL_USER", detailUser: user});
                setTimeout(() => {
                    getHistoryLogin();
                }, 2000);
                
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
                            <input disabled type="text" className="form-control" value={detailUser.id} />
                        </div>
                        <div className="form-group">
                            <label>Fullname (*) :</label>
                            <input disabled type="text" className="form-control" value={detailUser.fullname} />
                        </div>
                    </div>
                    <div className="jwc-row d-none">
                        <div className="form-group">
                            <label>Password (*) :</label>
                            <input type="password" className="form-control" name="password" placeholder="Enter password" autoComplete="new-password" />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password (*) :</label>
                            <input type="password" className="form-control" placeholder="Enter confirm password" autoComplete="new-password" />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Email :</label>
                            <input disabled type="email" className="form-control" value={detailUser.email} />
                        </div>
                        <div className="form-group">
                            <label>Role (*) :</label>
                            <select disabled className="form-control" value={detailUser.role}>
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Position :</label>
                            <input disabled type="text" className="form-control" value={detailUser.position} />
                        </div>
                        <div className="form-group">
                            <label>Source :</label>
                            <input disabled type="text" className="form-control" value={detailUser.source} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Phone :</label>
                            <input disabled type="text" className="form-control" value={detailUser.phone} />
                        </div>
                        <div className="form-group">
                            <label>Address :</label>
                            <input disabled type="text" className="form-control" value={detailUser.address} />
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
                            <input disabled type="text" className="form-control" defaultValue={detailUser.id} />
                        </div>
                        <div className="form-group">
                            <label>Fullname (*) :</label>
                            <input onChange={(event)=>set_inputFullname(event.target.value.trim())} type="text" className="form-control" defaultValue={detailUser.fullname} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Password (*) :</label>
                            <input onChange={(event)=>set_inputPassword(event.target.value.trim())} type="password" className="form-control" name="password" placeholder="Enter password" autoComplete="new-password" />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password (*) :</label>
                            <input onChange={(event)=>set_inputRePassword(event.target.value.trim())} type="password" className="form-control" placeholder="Enter confirm password" autoComplete="new-password" />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Email :</label>
                            <input onChange={(event)=>set_inputEmail(event.target.value.trim())} type="email" className="form-control" defaultValue={detailUser.email} />
                        </div>
                        <div className="form-group">
                            <label>Role (*) :</label>
                            <select onChange={(event)=>set_inputRole(event.target.value.trim())} className="form-control" defaultValue={detailUser.role}>
                                <option>Client</option>
                                <option>Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Position :</label>
                            <input onChange={(event)=>set_inputPosition(event.target.value.trim())} type="text" className="form-control" defaultValue={detailUser.position} />
                        </div>
                        <div className="form-group">
                            <label>Source :</label>
                            <input onChange={(event)=>set_inputSource(event.target.value.trim())} type="text" className="form-control" defaultValue={detailUser.source} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Phone :</label>
                            <input onChange={(event)=>set_inputPhone(event.target.value.trim())} type="text" className="form-control" defaultValue={detailUser.phone} />
                        </div>
                        <div className="form-group">
                            <label>Address :</label>
                            <input onChange={(event)=>set_inputAddress(event.target.value.trim())} type="text" className="form-control" defaultValue={detailUser.address} />
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

    const sortTableHistoryLogin = ()=>{
        var tempData = _historyLogin;
        var between = tempData.length/2;
        if (between%2 != 0){
            between = between - 1;
        }
        for (var i=0; i<= between; i++){
            var temp = tempData[tempData.length-i-1];
            tempData[tempData.length-i-1] = tempData[i];
            tempData[i] = temp;
        }
        // console.log(tempData);
        set_historyLogin(tempData);
        set_change(!_change);
    }

    const showTableHistory = () => {
        if (_historyLoading == true) return <PulseLoader css={cssLoading}  size={15} color={"#75bde5"} />
        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <b style={{color: "#28a745"}}><i className="fa fa-check-circle-o" aria-hidden="true"></i> Blockchain Validated</b>
                    <button ref={refeshHistory} type="button" onClick={()=>getHistoryLogin()} className="btn btn-dark">REFRESH</button>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Action</th>
                            <th onClick={()=>sortTableHistoryLogin()} scope="col" style={{cursor: "pointer"}}>Time <i className="fa fa-sort" aria-hidden="true"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            _historyLogin.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{value[0]}</td>
                                        <td>{value[1]}</td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </>
        )
    }



    return (
        <>
            <div className="accounnt-register-box ">
                <div className="nav-bar">
                    <div className="col-left">
                        <img onClick={() => dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listUsers" })} src="/img/icon-2.png" alt="Icon2" />
                        <span>Detail User</span>
                    </div>
                    <div className="col-right" />
                </div>
                <div className="register-box">
                    {displayForm()}
                </div>
                <div className="register-box mt-5">
                    {showTableHistory()}
                </div>
            </div>
        </>
    )
}

export default DetailUser;