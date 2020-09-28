import {useDispatch, useSelector} from 'react-redux';
import {useState, useRef, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import { Select, InputLabel, MenuItem} from '@material-ui/core';
import cookie from 'react-cookies';
import axios from 'axios';
import {useRouter} from 'next/router';
import IconLoading1 from '../IconLoading/Icon1';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';

const UserList = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    // const dataUsersList = useSelector(state => state.Users.dataUsersList);
    const urlBackend = useSelector(state => state.Api.urlBackend);
    const optionsSource = useSelector(state => state.Users.optionsSource);
    const selectedPage = useSelector(state => state.Users.selectedPage);

    const [dataUsersList, setdataUsersList] = useState([]);
    const [_selectedPage, set_selectedPage] = useState(selectedPage);
    const [_totalPage, set_totalPage] = useState(0);
    const [_inputSearch, set_inputSearch] = useState("");
    const [_change, set_change] = useState(false);
    const [_filterSource, set_filterSource] = useState("");
    const [_inputSelect, set_inputSelect] = useState("all");
    // const [_optionsSource, set_optionsSource] = useState([]);
    const [_isLoadingList, set_isLoadingList] = useState(true);


    const useComponentWillMount = func => {
        const willMount = useRef(true);
        if (willMount.current) {
          func();
        }
        willMount.current = false;
    };


    useEffect(() => {
        var arrayFilterSource = dataUsersList.filter(item => item.source.indexOf(_filterSource)>-1);
        var total = arrayFilterSource.filter(item => item.fullname.indexOf(_inputSearch)>-1 || item.email.indexOf(_inputSearch)>-1 || item.phone.indexOf(_inputSearch)>-1 ).length;

        set_totalPage(total/10);
    })
    
    useComponentWillMount(()=>{
        set_selectedPage(selectedPage);
        // console.log("selected page: ",_selectedPage);
        set_totalPage(dataUsersList.length/10);
        set_change(!_change);
    })

    useComponentWillMount(() => {

        var headers = {
            'x-access-token': cookie.load('token').accessToken
        }
        axios({
            method: 'get',
            url: urlBackend + "/getlistusers",
            headers: headers
        })
            .then(({ data }) => {
                // console.log('getUsersList: ',data);
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
                setdataUsersList(tempData);
                set_isLoadingList(false);
                dispatch({ type: "FILTER_SOURCE", dataUsersList: data.response });
            })
            .catch(error => {
                // console.log('getUsersList: ',error);
            })

    })

    const changeFilterSource = (source)=>{
        // console.log(source);
        if (source=="all"){
            set_filterSource("");
        }
        else{
            set_filterSource(source);
        }       
    }

    const remove_user = (id)=>{

        var tempData = dataUsersList;
        tempData = dataUsersList.filter(item => item.id != id);
        setdataUsersList(tempData);
        // dispatch({ type: "SET_DATA_USERS_LIST", dataUsersList: tempData});
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
                dispatch({type: "MSG_ALERT", mode: 'success', msg: data.response});
            })
            .catch(error=>{
                if (error.response.data.response)
                dispatch({type: "MSG_ALERT", mode: 'success', msg: error.response.data.response});
            })
    }

    const detailUser = (id)=>{
        var userInfo = dataUsersList.filter(item => item.id == id)[0];
        dispatch({ type: "SET_USER_DETAIL", userDetail: userInfo});
        dispatch({ type: "SHOW_DETAIL_PAGE", showDetailPage: true});
        dispatch({ type: "SET_SELECTED_PAGE", selectedPage: _selectedPage});
    }

    const checkConfirmId = (id, text)=>{

        if (text == id){remove_user(id)}
        else{
            dispatch({ type: "MSG_ALERT", mode: 'error', msg: "Confirm Id Failed"});
        }
    }

    const inputDelete = useRef();
    const onClickDelete = ()=>{
        inputDelete.current.click();
    }

    const openPopupbox = (id)=>{
        var text = "";
        const content = (
          <div>
            <p>Please type <b>{id}</b> to confirm.</p>
            <div className="form-group">
              <input type="text" className="form-control" onBlur={(event)=> {event.target.value = "";}}  onChange={(event)=> {text = event.target.value.trim();}}/>
            </div>
            <button onClick={()=>{checkConfirmId(id, text)}} type="button" className="btn btn-danger btn-block">Delete</button>
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

    const showUsersList = () => {
        if (_isLoadingList == true) return <IconLoading1/>
        return dataUsersList.filter(item => item.id.indexOf(_inputSearch)>-1 || item.phone.indexOf(_inputSearch)>-1).filter(item =>  item.source.indexOf(_filterSource)>-1 ).map((value, index) => {
            if (index>=_selectedPage*10 && index<(_selectedPage+1)*10)
            return (
                <div key={index} className="row row-body">
                    <div className="col-2 col-sm-1 col-stt">{index+1}</div> 
                    <div style={{padding: "0"}} className="col"> 
                        <div className="row">
                            <div className="col col-lg-2 col-md-2 col-sm-3 col-i-body col-id">{value.id}</div>
                            <div className="col-5 col-lg-2 col-md-3 col-sm-4 col-i-body col-fullname">{value.fullname}</div>
                            <div className="col col-lg-2 col-md-2 col-sm-3 col-i-body col-email">{value.email}</div>
                            <div className="col col-lg-2 col-md-2 col-i-body col-phoneNumber">{value.phone}</div>
                            <div className="col col-lg-2 col-md-2 col-sm-2 col-i-body col-source">{value.source}</div>
                            <div className="col col-i-body col-active">
                                <button onClick={()=>detailUser(value.id)} type="button" className="btn btn-size-large btn-primary m-0 p-0">Detail</button>
                                <button onClick={()=>openPopupbox(value.id)} type="button" className="btn btn-size-large btn-danger m-0 p-0">Delete</button>
                                <button onClick={()=>detailUser(value.id)} type="button" className="btn d-none btn-size-small btn-primary"><i className="fa fa-info" aria-hidden="true" />
                                </button>
                                <button onClick={()=>openPopupbox(value.id)} type="button" className="btn d-none btn-size-small btn-danger"><i className="fa fa-trash" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    return (
        <>
            <PopupboxContainer />
            <main className="users-list pt-5">
                <div className="container">
                    <div className="top-table mb-4">
                        <div className="row">
                            <div className="col-sm-7 col-lg-7">
                                <div className="btn-group w-100">
                                    <input onChange={(event)=>{set_inputSearch(event.target.value.trim()); set_selectedPage(0);}} type="text" className="input-search" name="searchBar" id="searchBar" placeholder="Tìm kiếm ID hoặc SĐT" />
                                    <i className="d-none fa fa-search icon-search" aria-hidden="true" />
                                </div>
                            </div>
                            <div className="col-sm-5 mt-3 col-lg-5 d-flex justify-content-end">
                                <div className="box d-flex align-items-center">
                                    <InputLabel id="label">Source: </InputLabel>
                                    <Select  labelId="label" id="select" value={_inputSelect}  onChange={(event)=>{set_inputSelect(event.target.value); changeFilterSource(event.target.value);}}>
                                        <MenuItem value="all">All</MenuItem>
                                        {
                                            optionsSource.map((value, index)=>{
                                                return <MenuItem key={index} value={value}>{value}</MenuItem>
                                            })
                                        }
                                    </Select>
                                    <button onClick={()=>router.push('/users/register')} type="button" className="btn btn-primary ml-3">Create New</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-users-list">
                        {/* col head */}
                        <div className="row row-head">
                            <div className="col-2 col-sm-1 col-stt">#</div>
                            <div style={{padding: "0"}} className="col">
                                <div className="row">
                                    <div className="col col-lg-2 col-md-2 col-sm-3 col-i-head col-id text-center">ID</div>
                                    <div className=" col-5 col-lg-2 col-md-3 col-sm-4 col-i-head col-fullname text-center">Fullname</div>
                                    <div className=" col col-lg-2 col-md-2 col-sm-3 col-i-head col-email text-center">Email</div>
                                    <div className=" col col-lg-2 col-md-2 col-i-head col-phoneNumber text-center">Phone Number</div>
                                    <div className=" col col-lg-2 col-md-2 col-sm-2 col-i-head col-source text-center">Source</div>
                                    <div className="col col-i-head col-active text-center">Action</div>
                                </div>
                            </div>
                        </div>
                        {/* col body */}
                        {showUsersList()}
                        
                    </div>
                    {/* <div className="pagination mt-4">
                        <ul className="list">
                            <li className="item pre">Previous</li>
                            <li className="item" style={{ fontWeight: 900 }}>1</li>
                            <li className="item">2</li>
                            <li className="item">3</li>
                            <li className="item next">Next</li>
                        </ul>
                    </div> */}
                </div>
            </main>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={_totalPage}
                marginPagesDisplayed={1}
                // pageRangeDisplayed={5}
                initialPage={_selectedPage}
                onPageChange={(event)=>{set_selectedPage(event.selected)}}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
            />
            <style jsx global>
                {`
                    .row.row-body{
                        transition: all .3s;
                    }
                    .row.row-body:hover, .row.row-body:active{
                        background-color: #001c4c36;
                    }
                    label#label {
                        font-weight: 700;
                        margin: 0;
                        margin-right: 10px;
                    }
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

export default UserList;