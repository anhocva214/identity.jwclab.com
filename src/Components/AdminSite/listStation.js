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

const ListStation = () => {

    const dispatch = useDispatch();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    // table
    const [_selectedPage, set_selectedPage] = useState(0);
    const [_totalPage, set_totalPage] = useState(1);
    const [_dataListStations, set_dataListStations] = useState([]);
    const [_loadingTable, set_loadingTable] = useState(true);
    const [_totalRowUser, set_totalRowUser] = useState(10);
    // search
    const [_inputSearch, set_inputSearch] = useState("");
    // fillter source
    const [_dataManager, set_dataManager] = useState([]);
    const [_inputManager, set_inputManager] = useState("");
    

    const useComponentWillMount = func => { const willMount = useRef(true); if (willMount.current) {func();} willMount.current = false;};

    const handleManager = (sourceManager)=>{
        var temp = [];
        for (var i=0; i<= sourceManager.length; i++){
            if (i == sourceManager.length){
                // console.log(temp);
                set_dataManager(temp);
            }
            else{
                var filter = temp.filter(item => item == sourceManager[i]);
                if (filter.length==0 && sourceManager[i].length > 1){
                    temp.push(sourceManager[i]);
                }
            }
        }
    }

    // Get data list user
    const getDataListStation = ()=>{
        var headers = {
            'x-access-token': cookie.load('token').accessToken
        }
        axios({
            method: 'get',
            url: urlBackend + "/liststation",
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
                set_dataListStations(tempData);
                set_totalPage(tempData.length/10)
                set_loadingTable(false);
                // filter source
                var manager = [];
                tempData.forEach((value, index)=>{
                    manager.push(value.manager);
                })
                handleManager(manager);
                
            })
            .catch(error => {
            })
    }
    useComponentWillMount(() => {
        getDataListStation();
    })

    const setdetailStation = (station)=>{
        dispatch({ type: "SET_DETAIL_STATION", detailStation: station});
        dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "detailStation"});
    }


    const displayTableList = () => {
        if (_loadingTable == true) return <PulseLoader css={cssLoading} size={15} color={"#75bde5"} />
        return _dataListStations.filter(item => item.id.indexOf(_inputSearch)>-1 || item.name.indexOf(_inputSearch)>-1).filter(item => item.manager.indexOf(_inputManager)>-1).map((value, index) => {
            if (index>=_selectedPage*_totalRowUser && index<(_selectedPage+1)*_totalRowUser)
            return (
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{value.id}</td>
                    <td>{value.name}</td>
                    <td className="d-none d-md-table-cell">{value.address}</td>
                    <td className="d-none d-md-table-cell">
                        {value.manager}
                    </td>
                    <td>{value.phone}</td>
                    <td className="text-center">
                        <span onClick={()=>{setdetailStation(value)}} className="icon-edit"><i className="fas fa-pen" /></span>
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
                        <span className="ml-2 mr-2">Manager:</span>
                        <select className="source-select" defaultValue="" onChange={(event)=> {set_inputManager(event.target.value);}}>
                            <option value="">All</option>
                            {
                                _dataManager.map((value, index) => {
                                    return <option key={index} value={value}>{value}</option>
                                })
                            }
                        </select>
                    </div>
                    <button onClick={()=>{dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "registerStation"});}} type="button" className="btn btn-add-user ml-3">New User</button>
                </div>
            </div>
            <div className="table-list">
                <div className="table-responsive bg-white">
                    <table className="table table-striped mb-0">
                        <thead style={{textTransform: 'uppercase'}}>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Id</th>
                                <th scope="col">Name</th>
                                <th className="d-none d-md-table-cell" scope="col">Address</th>
                                <th className="d-none d-md-table-cell" scope="col">Manager</th>
                                <th scope="col">Phone</th>
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
                        <select className="form-control ml-3 pr-2" defaultValue="10" onChange={(event)=>{set_totalPage(_dataListStations.length/parseInt(event.target.value)); set_totalRowUser(parseInt(event.target.value)); set_selectedPage(0);}}>
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

export default ListStation;