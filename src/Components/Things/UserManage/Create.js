import axios from 'axios';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useRouter } from 'next/router';
import cookie from 'react-cookies';


const UserCreate = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    const [_id, set_id] = useState("");
    const [_password, set_password] = useState("");
    const [_rePassword, set_rePassword] = useState("");
    const [_role, set_role] = useState("admin");
    const [_fullname, set_fullname] = useState("");
    const [_email, set_email] = useState("");
    const [_phone, set_phone] = useState("");
    const [_source, set_source] = useState("");
    const [_position, set_position] = useState("");
    const [_address, set_address] = useState("");

    const getUsersList = (accessToken) => {
        var headers = {
            'x-access-token': accessToken
        }
        axios({
            method: 'get',
            url: urlBackend + "/liststation",
            headers: headers
        })
            .then(({ data }) => {
                // console.log('getUsersList: ',data);
                dispatch({ type: "SET_DATA_USERS_LIST", dataUsersList: data.response});
                dispatch({ type: "FILTER_SOURCE", dataUsersList:data.response});

            })
            .catch(error=>{
                // console.log('getUsersList: ',error);
            })
    }

    const registerUser = ()=>{
        if (_id.length == 0 || _fullname.length == 0 || _email.length == 0 || _phone.length == 0 || _source.length == 0 || _address.length == 0){
            dispatch({ type: "MSG_ALERT", mode: 'warning', msg: "Please fill out the form"})
        }
        else if (_password != _rePassword){
            dispatch({ type: "MSG_ALERT", mode: 'error', msg: "Confirm password not match"})
        }
        else{
            var dataUser = {
                "id": _id,
                "name": _fullname,
                "manager": _email,
                "phone": _phone,
                "location": _source,
                "address": _address
            }
            var headers = {
                'x-access-token': cookie.load('token').accessToken
            }
            axios({
                method: 'post',
                url: urlBackend + "/addstation",
                headers: headers,
                data: dataUser
            })
                .then(({data})=>{
                    dispatch({ type: "MSG_ALERT", mode: 'success', msg: data.response});
                    getUsersList(cookie.load("token").accessToken);
                    router.push("/things");
                })
                .catch(error=>{
                    // console.log(error);
                    if (error.response.data.response)
                    dispatch({ type: "MSG_ALERT", mode: 'error', msg: error.response.data.response});
                })
        }
    }

    return (
        <>
            <main className="userCreate pt-5">
                <div className="container d-flex justify-content-center">
                    <form className="form-userCreate" method="post">
                        <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="ID">ID:</label>
                                    <input onChange={(event)=>set_id(event.target.value)} type="text" className="form-control" name="ID" id="ID" placeholder="Enter ID" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="fullname">Name:</label>
                                    <input onChange={(event)=>set_fullname(event.target.value)} type="text" className="form-control" name="fullname" id="fullname" placeholder="Enter Fullname" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input onChange={(event) => set_address(event.target.value)} type="text" className="form-control" name="address" id="address" placeholder="Enter Address" />
                        </div>

                        <div className="row">
                            <div className="col-lg-12 col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="email">Manager:</label>
                                    <input onChange={(event)=>set_email(event.target.value)} type="email" className="form-control" name="email" id="email" placeholder="Enter Manager" />
                                </div>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="phonenumber">Phone Number:</label>
                            <input onChange={(event)=>set_phone(event.target.value)} type="text" className="form-control" name="phonenumber" id="phonenumber" placeholder="Enter Phone Number" />
                        </div>

                        <div className="row">

                            <div className="col-lg-12 col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="source">Location:</label>
                                    <input onChange={(event)=>set_source(event.target.value)} type="text" className="form-control" name="source" id="source" placeholder="Enter Location" />
                                </div>

                            </div>
                        </div>


                        <div className="form-group w-100 d-flex">
                            <button onClick={()=>registerUser()} type="button" className="btn btn-success btn-block m-0">Register</button>
                            <button onClick={()=>router.push("/things")} type="button" className="btn btn-warning btn-block m-0">Back</button>
                        </div>
                    </form>
                </div>
            </main>

        </>
    )
}

export default UserCreate;