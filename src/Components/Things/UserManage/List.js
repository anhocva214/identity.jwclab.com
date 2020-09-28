import {useDispatch, useSelector} from 'react-redux';
import {useState, useRef, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import { Select, InputLabel, MenuItem} from '@material-ui/core';
import cookie from 'react-cookies';
import axios from 'axios';
import {useRouter} from 'next/router';

const UserList = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const dataUsersList = useSelector(state => state.Things.dataUsersList);
    const urlBackend = useSelector(state => state.Api.urlBackend);
    const optionsManager = useSelector(state => state.Things.optionsManager);
    const selectedPage = useSelector(state => state.Things.selectedPage);

    const [_selectedPage, set_selectedPage] = useState(selectedPage);
    const [_totalPage, set_totalPage] = useState(0);
    const [_inputSearch, set_inputSearch] = useState("");
    const [_change, set_change] = useState(false);
    const [_filterManager, set_filterManager] = useState("");
    const [_inputSelect, set_inputSelect] = useState("all");
    const [_optionsManager, set_optionsManager] = useState([]);

    const useComponentWillMount = func => {
        const willMount = useRef(true);
        if (willMount.current) {
          func();
        }
        willMount.current = false;
    };


    useEffect(() => {
        //var arrayFilterSource = dataUsersList.filter(item => item.manager.indexOf(_filterManager)>-1);
        //var total = arrayFilterSource.filter(item => item.id.indexOf(_inputSearch)>-1 || item.address.indexOf(_inputSearch)>-1 || item.phone.indexOf(_inputSearch)>-1 ).length;

        var arrayFilterSource = dataUsersList;
        var total = arrayFilterSource.filter(item => item.id.indexOf(_inputSearch) > -1).length;


        set_totalPage(total/10);
    })
    
    useComponentWillMount(()=>{
        set_selectedPage(selectedPage);
        // console.log("selected page: ",_selectedPage);
        set_totalPage(dataUsersList.length/10);
        set_change(!_change);
    })

    const changeFilterManager = (value)=>{
        // console.log(source);
        if (value=="all"){
            set_filterManager("");
        }
        else{
            set_filterManager(value);
            //console.log(`You choose ${source}`)
        }       
    }

    const remove_user = (id)=>{
        var tempData = dataUsersList;
        tempData = dataUsersList.filter(item => item.id != id);
        dispatch({ type: "SET_DATA_USERS_LIST", dataUsersList: tempData});
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

    const showUsersList = () => {
        //console.log(dataUsersList);
        //console.log(dataUsersList.filter(item => { console.log(item.name) ; return true}));
        //console.log(dataUsersList.filter(item => { console.log(item.manager.index); return true }));
        var dataStationList = dataUsersList.filter(item => typeof item.id != 'undefined' || typeof item.location != 'undefined' || typeof item.manager != 'undefined');
        return dataStationList.filter(item => item.id.indexOf(_inputSearch) > -1 || item.name.indexOf(_inputSearch) > -1 || item.manager.indexOf(_inputSearch) > -1 || item.phone.indexOf(_inputSearch) > -1).filter(item =>  item.manager.indexOf(_filterManager)>-1 ).map((value, index) => {
            if (index>=_selectedPage*10 && index<(_selectedPage+1)*10)
            return (
                <div key={index} className="row row-body">
                    <div className="col-2 col-sm-1 col-stt">{index+1}</div> 
                    <div style={{padding: "0"}} className="col"> 
                        <div className="row">
                            <div className="col-3 col-lg-2 col-md-2 col-sm-3 col-i-body col-id">{value.id}</div>
                            <div className="col-4 col-lg-2 col-md-3 col-sm-4 col-i-body col-name">{value.name}</div>
                            <div className="col-3 col-lg-2 col-md-2 col-sm-3 col-i-body col-address d-sm-block">{value.address}</div>
                            <div className="col col-lg-2 col-md-2 col-i-body col-manager d-lg-block d-none">{value.manager}</div>
                            <div className="col col-lg-2 col-md-2 col-sm-2 col-i-body col-phone d-none d-md-block">{value.phone}</div>
                            <div className="col-2 col-lg-2 col-md-3 col-sm-2 col-i-body col-active d-flex justify-content-center align-items-center">
                                <button onClick={()=>detailUser(value.id)} type="button" className="btn d-none d-md-block btn-size-smalllarge btn-primary m-0 p-0">Detail</button>
                                <button onClick={()=>detailUser(value.id)} type="button" className="btn d-block d-md-none btn-size-small btn-primary"><i className="fa fa-info" aria-hidden="true" />
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
            <main className="users-list pt-5">
                <div className="container">
                    <div className="top-table mb-4">
                        <div className="row">
                            <div className="col-12 col-lg-7">
                                <div className="btn-group w-100">
                                    <input onChange={(event)=>{set_inputSearch(event.target.value.trim()); set_selectedPage(0);}} type="text" className="input-search" name="searchBar" id="searchBar" placeholder="Tìm kiếm ở đây" />
                                    <i className="d-none fa fa-search icon-search" aria-hidden="true" />
                                </div>
                            </div>
                            <div className="col-12 mt-3 col-lg-5 d-flex justify-content-end">
                                <div className="box d-flex align-items-center">
                                    <InputLabel id="label">Manager: </InputLabel>
                                    <Select labelId="label" id="select" value={_inputSelect} onChange={(event) => { set_inputSelect(event.target.value); changeFilterManager(event.target.value); }}>
                                        <MenuItem value="all">All</MenuItem>
                                        {
                                            optionsManager.map((value, index) => {
                                                return <MenuItem key={index} value={value}>{value}</MenuItem>
                                            })
                                        }
                                    </Select>
                                    <button onClick={()=>router.push('/things/register')} type="button" className="btn btn-primary ml-3">Create New</button>
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
                                    <div className="col-3 col-lg-2 col-md-2 col-sm-3 col-i-head col-id text-center">ID</div>
                                    <div className=" col-4 col-lg-2 col-md-3 col-sm-4 col-i-head col-fullname text-center">Name</div>
                                    <div className=" col-3 col-lg-2 col-md-2 col-sm-3 col-i-head col-address text-center">Address</div>
                                    <div className=" col col-lg-2 col-md-2 col-i-head col-manager text-center d-lg-block d-none ">Manager</div>
                                    <div className=" col col-lg-2 col-md-2 col-sm-2 col-i-head col-phone text-center d-none d-md-block">Phone</div>
                                    <div className=" col-2 col-lg-2 col-md-3 col-sm-2 col-i-body col-active d-flex justify-content-center align-items-center">Action</div>
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