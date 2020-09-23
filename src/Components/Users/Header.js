import axios from 'axios';
import cookie from 'react-cookies';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';
import {useRouter} from 'next/router';

const Header = (props) => {

    const dispatch = useDispatch();
    const router = useRouter();
    const urlBackend = useSelector(state => state.Api.urlBackend);

    const logout = ()=>{
        var accessToken = cookie.load('token').accessToken;
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
            dispatch({type: "SHOW_LOGIN_PAGE", showLoginPage: true});
            dispatch({type: "MSG_ALERT", mode: 'success', msg: data.response});
        })
        .catch(({response})=>{
            // var error = response.data;
            // console.log(error);
        })

    }

    const btn_logo = ()=>{
        dispatch({ type: "SHOW_DETAIL_PAGE", showDetailPage: false});
        router.push("/");
    }

    return (
        <>
            <header>
                <div className="container">
                    <div className="row">
                        <div className="col-logo col-4 col-sm-3 col-lg-2">
                            <img style={{cursor: "pointer"}} onClick={()=>btn_logo()} className="w-100" src="/img/logo.png" alt="logo" />
                        </div>
                        <div className="col-title col-6 col-sm-7 col-lg-8">
                        <h1 className="m-0 h-100 d-flex align-items-center justify-content-center">{props.title}</h1>
                        </div>
                        <div className="col-2 col-sm-2 col-lg-2 d-flex align-items-center justify-content-end">
                            <Link href="/users/"><button onClick={()=>logout()} type="button" className="btn btn-danger btn-logout"><i className="fa fa-sign-out" aria-hidden="true"></i><span>Logout</span></button></Link>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    @media only screen and (max-width: 768px){
                        .btn-logout span{
                            display: none;
                            
                        }
                    }
                `}</style>
            </header>
            
        </>
    )
}

export default Header;