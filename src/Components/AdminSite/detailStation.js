import axios from 'axios';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cookie from 'react-cookies';
import { PulseLoader} from 'react-spinners'
import { css } from "@emotion/core";


const cssLoading = css`
text-align: center;
`

const DetailStation = () => {

    const dispatch = useDispatch();
    const urlBackend = useSelector(state => state.Api.urlBackend);
    const detailStation = useSelector(state => state.MyInfo.detailStation);

    const [_id, set_id] = useState(detailStation.id);
    const [_name, set_name] = useState(detailStation.name);
    const [_phone, set_phone] = useState(detailStation.phone);
    const [_coordinate, set_coordinate] = useState(detailStation.coordinate);
    const [_manager, set_manager] = useState(detailStation.manager);
    const [_address, set_address] = useState(detailStation.address);

    const [_statusEdit, set_statusEdit] = useState(false);

    const [_historyLogin, set_historyLogin] = useState([]);
    const [_historyLoading, set_historyLoading] = useState(true);
    const [_change, set_change] = useState(false);

    // loading post user
    const [_loadingPostStation, set_loadingPostStation] = useState(false);

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
            url: urlBackend + "/history",
            headers:{
                'x-access-token': cookie.load('token').accessToken
            },
            data:{
                id: `HISTORY_${detailStation.id}`
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

    const postStationInfo = (event)=>{
        set_loadingPostStation(true)
        event.preventDefault();
        var station = {
            "id": _id,
            "name": _name,
            "manager": _manager,
            "phone": _phone,
            "location": _coordinate,
            "address": _address
        }
        axios({
            method: 'post',
            url: urlBackend + "/updatestation",
            headers: {
                'x-access-token': cookie.load('token').accessToken
            },
            data: station
        })
            .then(({data})=>{
                // console.log(data);
                set_loadingPostStation(false)
                dispatch({ type:'ALERT_SUCCESS', msg: data.response});
                set_statusEdit(false);
                dispatch({ type: "SET_DETAIL_STATION", detailStation: station});
                setTimeout(() => {
                    getHistoryLogin();
                }, 2000);
            })
            .catch(error=>{
                // console.log(error);
                set_loadingPostStation(false)
                dispatch({ type:'ALERT_ERROR', msg: "ERROR SYSTEM"});

            })
    }

    const displayForm = () => {
        if (_statusEdit == false) {
            return (
                <form  onSubmit={(event)=> {event.preventDefault(); set_statusEdit(true)}} >
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Id :</label>
                            <input disabled type="text" className="form-control" value={detailStation.id} />
                        </div>
                        <div className="form-group">
                            <label>Name :</label>
                            <input disabled type="text" className="form-control" value={detailStation.name} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Manager :</label>
                            <input disabled  className="form-control" value={detailStation.manager} />
                        </div>
                        <div className="form-group">
                            <label>Phone :</label>
                            <input disabled  className="form-control" value={detailStation.phone}/>       
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Location :</label>
                            <input disabled type="text" className="form-control" value={detailStation.location} />
                        </div>
                        <div className="form-group">
                            <label>Address :</label>
                            <input disabled type="text" className="form-control" value={detailStation.address} />
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
                <form onSubmit={(event)=> postStationInfo(event)}>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Id :</label>
                            <input disabled type="text" className="form-control" value={detailStation.id} />
                        </div>
                        <div className="form-group">
                            <label>Name :</label>
                            <input onChange={(event)=>set_name(event.target.value.trim())} type="text" className="form-control" defaultValue={detailStation.name} />
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Manager :</label>
                            <input onChange={(event)=>set_manager(event.target.value.trim())}  className="form-control" defaultValue={detailStation.manager} />
                        </div>
                        <div className="form-group">
                            <label>Phone :</label>
                            <input onChange={(event)=>set_phone(event.target.value.trim())}  className="form-control" defaultValue={detailStation.phone}/>       
                        </div>
                    </div>
                    <div className="jwc-row">
                        <div className="form-group">
                            <label>Location :</label>
                            <input onChange={(event)=>set_coordinate(event.target.value.trim())} type="text" className="form-control" defaultValue={detailStation._coordinate} />
                        </div>
                        <div className="form-group">
                            <label>Address :</label>
                            <input onChange={(event)=>set_address(event.target.value.trim())} type="text" className="form-control" defaultValue={detailStation.address} />
                        </div>
                    </div>
                    <div className="btn-form  d-flex justify-content-between mt-3">
                        <button type="submit" className="btn btn-primary btn-save btn-myinfo">
                            {_loadingPostStation==true?<PulseLoader size={15} color={"#fff"} />:"Save"}
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
        if (_historyLoading == true) return <PulseLoader css={cssLoading} size={15} color={"#75bde5"} />
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
            <div className="accounnt-register-box ">
                <div className="nav-bar">
                    <div className="col-left">
                        <img onClick={() => dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listThings" })} src="/img/icon-2.png" alt="Icon2" />
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

export default DetailStation;