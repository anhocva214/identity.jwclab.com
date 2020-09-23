import axios from 'axios';
import {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cookie from 'react-cookies';
import IconLoading1 from '../IconLoading/Icon1';

const UserDetail = () => {

    const dispatch = useDispatch();
    const urlBackend = useSelector(state => state.Api.urlBackend);
    const userDetail = useSelector(state => state.Users.userDetail);

    const [_isEditFullname, set_isEditFullname] = useState(false);
    const [_inputFullname, set_inputFullname] = useState(userDetail.fullname);
    const [_isEditEmail, set_isEditEmail] = useState(false);
    const [_inputEmail, set_inputEmail] = useState(userDetail.email);
    const [_isEditPhone, set_isEditPhone] = useState(false);
    const [_inputPhone, set_inputPhone] = useState(userDetail.phone);
    const [_isEditPosition, set_isEditPosition] = useState(false);
    const [_inputPosition, set_inputPosition] = useState(userDetail.position);
    const [_isEditAddress, set_isEditAddress] = useState(false);
    const [_inputAddress, set_inputAddress] = useState(userDetail.address);
    const [_isEditRole, set_isEditRole] = useState(false);
    const [_inputRole, set_inputRole] = useState(userDetail.role);
    const [_isEditSource, set_isEditSource] = useState(false);
    const [_inputSource, set_inputSource] = useState(userDetail.source);
    const [_isEditPassword, set_isEditPassword] = useState(false);
    const [_inputPassword, set_inputPassword] = useState("");

    const [_historyLogin, set_historyLogin] = useState([]);
    const [_historyLoading, set_historyLoading] = useState(true);
    const [_change, set_change] = useState(false);

    const useComponentWillMount = func => {
        const willMount = useRef(true);
        if (willMount.current) {
          func();
        }
        willMount.current = false;
    };

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
                id: userDetail.id
            }
        })
            .then(({ data })=>{
                set_historyLoading(false);
                preprocessingHistoryLogin(data.response);
            })
            .catch(error=>{
                // console.log(error);
            })
    }

    useComponentWillMount(()=>{
        getHistoryLogin();
    })


    const postUserInfo = ()=>{
        var user = {
            "id": userDetail.id,
            "role": _inputRole,
            "fullname": _inputFullname,
            "email": _inputEmail,
            "phone": _inputPhone,
            "source": _inputSource,
            "position": _inputPosition,
            "address": _inputAddress,
        }
        if (_inputPassword.length>0){
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
                dispatch({ type:'MSG_ALERT', mode:'success', msg: data.response});
            })
            .catch(error=>{
                // console.log(error);
                dispatch({ type:'MSG_ALERT', mode:'error', msg: "ERROR SYSTEM"});

            })
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
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <input onChange={(event)=>set_inputFullname(event.target.value)} type="text" className="form-control" defaultValue={_inputFullname} />
                    <button onClick={()=>{postUserInfo(); set_isEditFullname(false)}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditFullname(false); set_inputFullname(userDetail.fullname);}} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

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
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <input onChange={(event)=>set_inputEmail(event.target.value)} type="text" className="form-control" defaultValue={_inputEmail} />
                    <button onClick={()=>{postUserInfo(); set_isEditEmail(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditEmail(false); set_inputEmail(userDetail.email)}} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
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
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <input onChange={(event)=>set_inputPhone(event.target.value)} type="text" className="form-control" defaultValue={_inputPhone} />
                    <button onClick={()=>{postUserInfo(); set_isEditPhone(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditPhone(false); set_inputPhone(userDetail.phone)}} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
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
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <input onChange={(event)=>set_inputPosition(event.target.value)} type="text" className="form-control" defaultValue={_inputPosition} />
                    <button onClick={()=>{postUserInfo(); set_isEditPosition(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditPosition(false); set_inputPosition(userDetail.position);}} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
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
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <input onChange={(event)=>set_inputAddress(event.target.value)} type="text" className="form-control" defaultValue={_inputAddress} />
                    <button onClick={()=>{postUserInfo(); set_isEditAddress(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditAddress(false); set_inputAddress(userDetail.address);}} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
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
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <input onChange={(event)=>set_inputSource(event.target.value)} type="text" className="form-control" defaultValue={_inputSource} />
                    <button onClick={()=>{postUserInfo(); set_isEditSource(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditSource(false); set_inputSource(userDetail.source);}} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

    const showInputRole = ()=>{
        if (_isEditRole == false){
            return (
                <div className="form-group">
                    <label htmlFor="Role">Role</label>
                    <div className="btn-group d-flex">
                        <input disabled type="text" className="form-control" defaultValue={_inputRole} />
                        <button onClick={()=>set_isEditRole(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label>Role:</label>
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <select className="form-control" value={_inputRole} onChange={(event)=>{set_inputRole(event.target.value);}}>
                        <option value="admin">Admin</option>
                        <option value="client">Client</option>
                    </select>
                    <button onClick={()=>{postUserInfo(); set_isEditRole(false);}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={()=>{set_isEditRole(false); set_inputRole(userDetail.role)}} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>
        )
    }

    const showInputPassword = ()=>{
        if (_isEditPassword == false){
            return (
                <div className="form-group">
                    <label htmlFor="Role">Password</label>
                    <div className="btn-group d-flex">
                        <input disabled type="password" className="form-control" defaultValue={_inputPassword}/>
                        <button onClick={()=>set_isEditPassword(true)} type="button" className="btn btn-primary"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
                    </div>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <form className="btn-group d-flex" onSubmit={(event)=>{event.preventDefault()}} >
                    <input onChange={(event) => set_inputPassword(event.target.value)} type="password" name="pass" className="form-control" name="password" id="password" placeholder="Enter New Password" />
                    <button onClick={() => { if (_inputPassword.length > 0) postUserInfo(); set_isEditPassword(false) }} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                    <button onClick={() => set_isEditPassword(false)} type="reset" className="btn btn-danger"><i className="fa fa-window-close" aria-hidden="true"></i></button>
                </form>
            </div>

        )
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
        if (_historyLoading == true) return <IconLoading1 />
        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <b style={{color: "#28a745"}}><i className="fa fa-check-circle-o" aria-hidden="true"></i> Blockchain Validated</b>
                    <button type="button" onClick={()=>getHistoryLogin()} className="btn btn-dark">REFRESH</button>
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
            <main className="userDetail pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-lg-7">
                            <form className="form-userDetail" method="post" onSubmit={(event)=>{event.preventDefault()}} >
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="ID">ID:</label>
                                            <div className="btn-group d-flex">
                                                <input disabled type="text" className="form-control w-100" defaultValue={userDetail.id} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6">
                                        {showInputRole()}
                                    </div>
                                </div>
                                {/* <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <div className="btn-group d-flex">
                                        <input onChange={(event)=>set_inputPassword(event.target.value)} type="text" name="pass" className="form-control" name="password" id="password" placeholder="Enter New Password" />
                                        <button onClick={()=>{if (_inputPassword.length>0) postUserInfo()}} type="button" className="btn btn-success"><i className="fa fa-check-square-o" aria-hidden="true"></i></button>
                                    </div>
                                </div> */}
                                {showInputPassword()}
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

                                <div className="form-group w-100 d-flex">
                                    <button onClick={()=>{dispatch({ type:"SHOW_DETAIL_PAGE", showDetailPage: false});}} type="button" className="btn btn-warning btn-block m-0">Back</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-sm col-lg">
                            <div className="history-section">
                                <div className="title">History</div>
                                <div className="content">
                                    {/* <div className="box"> */}
                                        {/* <div className="day">Today - Friday, August 14, 2020</div> */}
                                        {/* <ol> */}
                                            
                                            {/* <li>Login at 11:54 AM</li>
                                            <li>Login at 11:54 AM</li>
                                            <li>Login at 11:54 AM</li> */}
                                        {/* </ol> */}
                                    {/* </div> */}

                                    {/* <div className="box">
                                        <div className="day">Yesterday - Thursday, August 13, 2020</div>
                                        <ol>
                                            <li>Login at 11:54 AM</li>
                                            <li>Login at 11:54 AM</li>
                                            <li>Login at 11:54 AM</li>
                                        </ol>
                                    </div> */}
                                   
                                   {showTableHistory()}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');
                    ol{
                        list-style: none;
                    }
                    main.userDetail .history-section .content{
                        padding: 0;
                        background-color: #fff;
                        color: #111;
                    }
                    main.userDetail .history-section .content .box ol li {
                        margin-left: 0;
                        padding: 10px;
                        font-family: 'Do Hyeon', sans-serif;
                    }
                    .history-section .content .box ol li:nth-child(even) {
                        background-color: #e9ecef;
                    }
                  
                `}
            </style>
        </>
    )
}

export default UserDetail;