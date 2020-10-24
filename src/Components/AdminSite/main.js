import {useState, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListUsers from './listUsers'
import RegisterUsers from './registerUsers'
import RegisterStation from './registerStation'
import About from '../about'
import ListStation from './listStation'
import MyInfo from './myInfo'
import DetailUser from './detailUser'
import DetailStation from './detailStation'
import { Sling as Hamburger } from 'hamburger-react'
import axios from 'axios'
import cookie from 'react-cookies'
import { PopupboxManager } from 'react-popupbox';



const AdminSite = (props) => {
    const dispatch = useDispatch();

    const urlBackend = useSelector(state => state.Api.urlBackend);

    const navAdmin = useSelector(state => state.Navigation.navAdmin);
    const myInfo = useSelector(state => state.MyInfo.myInfo);

    const [_nav, set_nav] = useState(["active", "", "", ""])
    // const [_title, set_title] = useState("");
    const [_barActive, set_barActive] = useState(false);

    const [_oldPassword, set_oldPassword] = useState("");
    const [_newPassword, set_newPassword] = useState("");
    const [_confirmPassowrd, set_confirmPassowrd] = useState("");

    const displaySection = () => {
        switch (navAdmin) {
            case "listUsers":
                return <ListUsers />
            case "listThings":
                return <ListStation />
            case "registerUser":
                return <RegisterUsers />
            case "registerStation":
                return <RegisterStation />
            case "detailUser":
                return <DetailUser />
            case "detailStation":
                return <DetailStation />
            case "myInfo":
                return <MyInfo />
            case "about":
                return <About />
            default:
                return <ListUsers />
        }
    }

    const displayTitle = () => {
        switch (navAdmin) {
            case "listUsers":
                return "List Users"
            case "listThings":
                return "List Stations"
            case "registerUser":
                return "Register User"
            case "registerStation":
                return "Register Station"
            case "myInfo":
                return "My Info"
            case "about":
                return "About"
            default:
                return ""
        }
    }

    const activeNav = (index)=>{
        var temp = _nav;
        temp.forEach((value, i)=>{
            temp[i] = "";
        })
        temp[index] = "active";
        set_nav(temp);
    }

    const displayClassActive = ()=>{
        if (_barActive == true) return "active"
        return ""
    }

    const logout = ()=>{
        if (!cookie.load('token')){
            dispatch({type: "NAVIGATE_PAGE", navPage: 'login'});
        }
        else{
            var accessToken = cookie.load('token').accessToken;
        }
        var headers = {
            'x-access-token': accessToken
        }
        axios({
            method: 'post',
            url: urlBackend + "/logout",
            headers: headers
        })
        .then(({data})=>{
            cookie.remove('token');
            dispatch({type: "NAVIGATE_PAGE", navPage: 'login'});
            dispatch({type: "ALERT_SUCCESS", msg: data.response});
        })
        .catch(({response})=>{
            // var error = response.data;
            // console.log(error);
        })

    }

    const inputDelete = useRef();
    const resetform = useRef();

    const onClickDelete = () => {
        inputDelete.current.click();
        resetform.current.click();
    }

    const changePassword = (event, oldPassword, newPassword, confirmPassowrd) => {
        event.preventDefault();
        if (oldPassword.length == 0 || newPassword.length == 0 || confirmPassowrd.length == 0) {
            dispatch({ type: "ALERT_ERROR", msg: "Register failed. Please check your form" });
        }
        else if (newPassword !== confirmPassowrd) {
            dispatch({ type: "ALERT_ERROR", msg: "Confirm password not match" });
        }
        else {
            var accessToken = cookie.load('token').accessToken;
            axios({
                method: 'post',
                url: urlBackend + "/changepw",
                headers: {
                    "x-access-token": accessToken
                },
                data: {
                    oldpassword: oldPassword,
                    newpassword: newPassword
                }
            })
                .then(({ data })=>{
                    onClickDelete();
                    dispatch({type: "ALERT_SUCCESS", msg: data.response});
                })
                .catch(error=>{
                    // console.log(error.response.data);
                    if (error.response.status == 500)
                    dispatch({type: "ALERT_ERROR", msg: error.response.data.message})
                })
        }

    }

    const openPopupChangePassword = () => {
        var oldPassword = "", newPassword = "", confirmPassowrd = "";
        const content = (
            <form onSubmit={(event)=> changePassword(event, oldPassword, newPassword, confirmPassowrd)}>
                <div classame="form-group">
                  <label >Old Password:</label>
                  <input onChange={(event)=>{oldPassword = event.target.value.trim();}} type="password" className="form-control" placeholder="Enter old password"/>
                </div>
                <div classame="form-group">
                  <label className="mt-3" >New Password:</label>
                  <input onChange={(event)=>{newPassword = event.target.value.trim();}} type="password" className="form-control" placeholder="Enter new password"/>
                </div>
                <div classame="form-group ">
                  <label className="mt-3" >Confirm Password:</label>
                  <input onChange={(event)=>{confirmPassowrd = event.target.value.trim();}} type="password" className="form-control" placeholder="Enter new password again"/>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3">Save</button>
                <button ref={resetform} type="reset" className="btn d-none">Save</button>
                <span ref={inputDelete} onClick={PopupboxManager.close}></span>
            </form>
        )

        PopupboxManager.open({
            content,
            config: {
                titleBar: {
                    enable: true,
                    text: 'Change password !'
                },
                fadeIn: true,
                fadeInSpeed: 500
            }
        })
    }

    return (
        <>
            <main className="list-page">
                <div className="row ml-0 mr-0">
                    <div className="col-null d-none d-lg-block" />
                    <div className="col-xl-2 col-lg-2 col-md-12 col-main-left active" id="col-main-left">
                        <div className="content">
                            <div className="head-section">
                                <img className="w-100" src="/img/logo-text.png" alt="logo-text" />
                                <span onClick={()=>set_barActive(!_barActive)} id="icon-bars" className="icon-bars" style={{cursor: "pointer"}}>
                                    <Hamburger
                                        open={true}
                                        // onClick={}
                                        width={18}
                                        height={15}
                                        strokeWidth={1}
                                        color='black'
                                        animationDuration={0.5}
                                    />
                                </span>
                                
                            </div>
                            <ul className={"list-nav mb-0 "+displayClassActive()}>
                                <li onClick={()=>{dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listUsers"}); activeNav(0)}} className={"item-nav "+_nav[0]}>
                                    <span className="icon">
                                        <i className="fa fa-users" aria-hidden="true" />
                                    </span>
                                    <span className="text">users</span>
                                </li>
                                <li onClick={()=>{dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "listThings"}); activeNav(1)}} className={"item-nav "+_nav[1]}>
                                    <span className="icon">
                                        <i className="far fa-life-ring" />
                                    </span>
                                    <span className="text">things</span>
                                </li>
                                <li onClick={()=>{dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "myInfo"}); activeNav(2)}} className={"item-nav "+_nav[2]}>
                                    <span className="icon">
                                        <i className="far fa-user-circle" />
                                    </span>
                                    <span className="text">account</span>
                                </li>
                                <li onClick={()=>{dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "about"}); activeNav(3)}} className={"item-nav "+_nav[3]}>
                                    <span className="icon">
                                        <i className="fas fa-info-circle" />
                                    </span>
                                    <span className="text">about</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl col-lg col-md-12 col-main-right p-0 pb-4">
                        <div className={"bg-reps-mobile "+displayClassActive()} />
                        <div className="head-section">
                            <span className="title" style={{textTransform: 'uppercase'}}>{displayTitle()}</span>
                            <div className="name-account text-center">
                                <img className="avatar mr-3" src="/img/avatar.jpg" alt="avatar" />
                                <span className="text">
                                    <span className="name">{myInfo.fullname}</span>
                                    <span className="badge badge-primary d-block">admin</span>
                                </span>
                                <span className="icon-down">
                                    <i className="fas fa-sort-down" />
                                </span>
                                <div className="box-info">
                                    <div onClick={()=>{dispatch({ type: "NAVIGATE_ADMIN", navAdmin: "myInfo"}); activeNav(2)}} className="item">Thông tin</div>
                                    <div onClick={()=>openPopupChangePassword()} className="item">Đổi mật khẩu</div>
                                    <div onClick={()=>logout()} className="item">Đăng xuất</div>
                                </div>
                            </div>
                        </div>
                        
                        {displaySection()}
                        
                    </div>
                </div>
            </main>

        </>
    )
}

export default AdminSite;