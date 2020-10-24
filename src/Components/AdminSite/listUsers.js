import ReactPaginate from 'react-paginate';
import {useState, useRef} from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { PulseLoader} from 'react-spinners'
import { css } from "@emotion/core";
import { PopupboxManager } from 'react-popupbox';


const cssLoading = css`
position: absolute;
left: 50%;
transform: translate(-50%);
margin: 10px;
`

const ListUsers = () => {

    const dispatch = useDispatch();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    // table
    const [_selectedPage, set_selectedPage] = useState(0);
    const [_totalPage, set_totalPage] = useState(1);
    const [_dataListUsers, set_dataListUsers] = useState([]);
    const [_loadingTable, set_loadingTable] = useState(true);
    const [_totalRowUser, set_totalRowUser] = useState(10);
    // search
    const [_inputSearch, set_inputSearch] = useState("");
    // fillter source
    const [_dataSource, set_dataSource] = useState([]);
    const [_inputSource, set_inputSource] = useState("");

    

    const useComponentWillMount = func => { const willMount = useRef(true); if (willMount.current) {func();} willMount.current = false;};

    const handleSource = (sourceData)=>{
        var temp = [];
        for (var i=0; i<= sourceData.length; i++){
            if (i == sourceData.length){
                // console.log(temp);
                set_dataSource(temp);
            }
            else{
                var filter = temp.filter(item => item == sourceData[i]);
                if (filter.length==0 && sourceData[i].length > 1){
                    temp.push(sourceData[i]);
                }
            }
        }
    }

    // Get data list user
    const getDataListUsers = ()=>{
        var headers = {
            'x-access-token': cookie.load('token').accessToken
        }
        axios({
            method: 'get',
            url: urlBackend + "/getlistusers",
            headers: headers
        })
            .then(({ data }) => {
                var tempData = data.response;
                var between = tempData.length / 2;
                if (between % 2 != 0) {
                    between = between - 1;
                }
                for (var i = 0; i <= between; i++) {
                    var temp = tempData[tempData.length - i - 1];
                    tempData[tempData.length - i - 1] = tempData[i];
                    tempData[i] = temp;
                }
                console.log(tempData);
                set_dataListUsers(tempData);
                set_totalPage(tempData.length/10)
                set_loadingTable(false);
                // filter source
                var source = [];
                tempData.forEach((value, index)=>{
                    source.push(value.source);
                })
                handleSource(source);
                
            })
            .catch(error => {
            })
    }
    useComponentWillMount(() => {
        getDataListUsers();
    })

    const setDetailUser = (user)=>{
        dispatch({ type: "SET_DETAIL_USER", detailUser: user});
        dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "detailUser"});
    }

    const remove_user = (id)=>{

        var tempData = _dataListUsers;
        tempData = tempData.filter(item => item.id != id);
        set_dataListUsers(tempData);
        // dispatch({ type: "SET_DETAIL_USER", detailUser: tempData});
        // dispatch({ type: "SET_DATA_USERS_LIST", detailUser: tempData});
        var data = {
            id: id
        };
        var headers = {
            'x-access-token': cookie.load('token').accessToken,
            'content-Type': 'application/json'
        };
        axios({
            method: 'post',
            url: urlBackend + "/remove",
            headers: headers,
            data: data
        })
            .then(({data})=>{
                // console.log(data);
                onClickDelete();
                dispatch({type: "ALERT_SUCCESS", msg: data.response});
            })
            .catch(error=>{
                if (error.response.data.response)
                dispatch({type: "ALERT_SUCCESS", msg: error.response.data.response});
            })
    }

    const checkConfirmId = (id, text)=>{

        if (text == id){remove_user(id)}
        else{
            dispatch({ type: "ALERT_ERROR", msg: "Confirm Id Failed"});
        }
    }

    const inputDelete = useRef();
    const onClickDelete = ()=>{
        inputDelete.current.click();
    }

    const openPopupRemoveUser = (id) => {
        var text = "";
        const content = (
            <div>
                <p>Please type <b>{id}</b> to confirm.</p>
                <div className="form-group">
                    <input type="text" className="form-control" onBlur={(event) => { event.target.value = ""; }} onChange={(event) => { text = event.target.value.trim(); }} />
                </div>
                <button onClick={() => { checkConfirmId(id, text) }} type="button" className="btn btn-danger btn-block">Delete</button>
                <span ref={inputDelete} onClick={PopupboxManager.close}></span>
            </div>
        )

        PopupboxManager.open({
            content,
            config: {
                titleBar: {
                    enable: true,
                    text: 'Confirm Delete !'
                },
                fadeIn: true,
                fadeInSpeed: 500
            }
        })
    }

    const displayTableList = () => {
        if (_loadingTable == true) return <PulseLoader css={cssLoading} size={15} color={"#75bde5"} />
        return _dataListUsers.filter(item => item.id.indexOf(_inputSearch)>-1 || item.phone.indexOf(_inputSearch)>-1).filter(item => item.source.indexOf(_inputSource)>-1).map((value, index) => {
            var classBage = "primary";
            if (value.role == "client") classBage = "client"
            if (value.role == "station") classBage = "station"
            if (index>=_selectedPage*_totalRowUser && index<(_selectedPage+1)*_totalRowUser)
            return (
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{value.id}</td>
                    <td>{value.fullname}</td>
                    <td className="d-none d-md-table-cell">{value.phone}</td>
                    <td className="d-none d-md-table-cell">
                        <span className={"badge badge-"+classBage}>{value.role}</span>
                    </td>
                    <td>{value.source}</td>
                    <td className="text-center">
                        <span onClick={()=>{setDetailUser(value)}} className="icon-edit mr-3"><i className="fas fa-pen" /></span>
                        <span onClick={()=>openPopupRemoveUser(value.id)} className="icon-remove ml-3"><i className="fas fa-trash" /></span>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <div className="support-tool">
                <div className="col-left">
                    <div className="btn-group mr-3 d-inline-flex d-sm-none">
                        <span className="icon-search">
                            <i className="fas fa-search" />
                        </span>
                        <input type="text" className="jwc-input-search" placeholder="Saerch for id" />
                    </div>
                </div>
                <div className="col-right">
                    <div className="btn-group mr-3 d-none d-sm-inline-flex">
                        <span className="icon-search">
                            <i className="fas fa-search" />
                        </span>
                        <input onChange={(event)=>set_inputSearch(event.target.value.trim())} type="text" className="jwc-input-search" placeholder="Search for ID" />
                    </div>
                    <div className="filter-source btn-group bg-white d-flex align-items-center justify-content-center">
                        <i className="fas fa-filter" />
                        <span className="ml-2 mr-2">Source:</span>
                        <select className="source-select" defaultValue="" onChange={(event)=> {set_inputSource(event.target.value);}}>
                            <option value="">All</option>
                            {
                                _dataSource.map((value, index) => {
                                    return <option key={index} value={value}>{value}</option>
                                })
                            }
                        </select>
                    </div>
                    <button onClick={()=>{dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "registerUser"});}} type="button" className="btn btn-add-user ml-3">New User</button>
                </div>
            </div>
            <div className="table-list">
                <div className="table-responsive bg-white">
                    <table className="table table-striped mb-0">
                        <thead style={{textTransform: 'uppercase'}}>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Id</th>
                                <th scope="col">Fullname</th>
                                <th className="d-none d-md-table-cell" scope="col">Phone Number</th>
                                <th className="d-none d-md-table-cell" scope="col">Role</th>
                                <th scope="col">Source</th>
                                <th scope="col" className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayTableList()}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer d-flex justify-content-between align-items-center mt-4">
                    <span className="d-flex align-items-center">
                        <label>Showing</label>
                        <select className="form-control ml-3 pr-2" defaultValue="10" onChange={(event)=>{set_totalPage(_dataListUsers.length/parseInt(event.target.value)); set_totalRowUser(parseInt(event.target.value)); set_selectedPage(0);}}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </span>
                    <span>
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={_totalPage}
                            marginPagesDisplayed={1}
                            forcePage={_selectedPage}
                            // pageRangeDisplayed={5}
                            initialPage={_selectedPage}
                            onPageChange={(event) => { set_selectedPage(event.selected) }}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                    </span>
                </div>
            </div>
            <style jsx global>
                {`
                    ul.pagination{
                        justify-content: center;
                        margin-top: 30px;
                    }
                    ul.pagination li{
                        margin: 0 10px;
                    }
                    ul.pagination li a{
                        color: #111;
                        text-decoration: none;
                        padding: 5px;
                        cursor: pointer;
                        font-weight: 600;
                    }
                    ul.pagination li.active a{
                        background: #001c4c;
                        color: #fff;
                        font-weight: 700;
                    }
                    ul.pagination li a:hover, ul.pagination li a:active, ul.pagination li a:focus{
                        
                        text-decoration: none;
                        border: 0;
                        outline-width: 0;
                    }
                    ul.pagination li a:hover, ul.pagination li a:active{
                        background: #001c4c;
                        color: #fff;
                    }
                    ul.pagination li.previous a, ul.pagination li.next a{
                        padding: 5px;
                        border-bottom: 2px solid #001c4c;
                        font-weight: 600;
                        color: #001c4c;
                        cursor: pointer;
                        transition: all .3s;
                    }
                    ul.pagination li.previous a:hover, ul.pagination li.previous a:active, ul.pagination li.next a:hover, ul.pagination li.next a:active{
                        background-color: #001c4c;
                        color: #fff;
                    }

                `}
            </style>
        </>
    )
}

export default ListUsers;