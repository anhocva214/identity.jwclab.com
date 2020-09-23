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

   
    const registerUser = (event)=>{
        event.preventDefault();
        if (_id.length == 0 || _password.length == 0 || _rePassword.length == 0 || _role.length == 0 || _fullname.length == 0  ){
            dispatch({ type: "MSG_ALERT", mode: 'warning', msg: "Register failed. Please check your form"})
        }
        else if (_password != _rePassword){
            dispatch({ type: "MSG_ALERT", mode: 'error', msg: "Confirm password not match"})
        }
        else{
            var dataUser = {
                "admin": "admin_api",
                "id": _id,
                "password": _password,
                "role": _role,
                "fullname": _fullname,
                "email": _email,
                "phone": _phone,
                "source": _source,
                "position": _position,
                "address": _address
            }
            var headers = {
                'x-access-token': cookie.load('token').accessToken
            }
            axios({
                method: 'post',
                url: urlBackend + "/register",
                headers: headers,
                data: dataUser
            })
                .then(({data})=>{
                    dispatch({ type: "MSG_ALERT", mode: 'success', msg: data.response});
                    router.push("/users");
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
                    <form className="form-userCreate"  onSubmit={(event)=>registerUser(event)}>
                        <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="ID">ID(*)::</label>
                                    <input onChange={(event)=>set_id(event.target.value)} type="text" className="form-control" name="ID" id="ID" placeholder="Enter ID" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="fullname">Fullname(*):</label>
                                    <input onChange={(event)=>set_fullname(event.target.value)} type="text" className="form-control" name="fullname" id="fullname" placeholder="Enter Fullname" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="password">Password(*):</label>
                                    <input onChange={(event)=>set_password(event.target.value)} type="password" className="form-control" name="password" id="password" placeholder="Enter Password" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="password">Confirm Password(*):</label>
                                    <input onChange={(event)=>set_rePassword(event.target.value)} type="password" className="form-control" name="password" id="rePassword" placeholder="Enter Password" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input onChange={(event)=>set_email(event.target.value)} type="email" className="form-control" name="email" id="email" placeholder="Enter Email" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="role">Role(*):</label>
                                    <select onChange={(event)=>set_role(event.target.value)} className="form-control" name="role" id="role">
                                        <option value="admin">Admin</option>
                                        <option value="client">Client</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phonenumber">Phone Number:</label>
                            <input onChange={(event)=>set_phone(event.target.value)} type="text" className="form-control" name="phonenumber" id="phonenumber" placeholder="Enter Phone Number" />
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="position">Position:</label>
                                    <input onChange={(event)=>set_position(event.target.value)} type="text" className="form-control" name="position" id="position" placeholder="Enter Position" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="source">Source:</label>
                                    <input onChange={(event)=>set_source(event.target.value)} type="text" className="form-control" name="source" id="source" placeholder="Enter source" />
                                </div>

                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input onChange={(event)=>set_address(event.target.value)} type="text" className="form-control" name="address" id="address" placeholder="Enter Address" />
                        </div>
                        <div className="form-group w-100 d-flex">
                            <button type="submit" className="btn btn-success btn-block m-0">Register</button>
                            <button onClick={()=>router.push("/")} type="button" className="btn btn-warning btn-block m-0">Back</button>
                        </div>
                    </form>
                </div>
            </main>

        </>
    )
}

export default UserCreate;