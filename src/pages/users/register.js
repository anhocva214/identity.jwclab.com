import {useDispatch, useSelector} from 'react-redux';
import Login from '../../Components/Users/Login';
import Header from '../../Components/Users/Header';
import UserCreate from '../../Components/Users/UserManage/Create';
import {useRouter} from 'next/router';
// import ClientInfo from '../../Components/Client/Info';
import cookie from 'react-cookies';


const RegisterPage = ()=>{
  const dispatch = useDispatch();
  const router = useRouter();

  const showLoginPage = useSelector(state => state.Users.showLoginPage);
  const role = useSelector(state => state.Users.role);

  const backClientPage = ()=>{
    // cookie.remove('token');
    // dispatch({ type: "MSG_ALERT", mode: "error", msg: "Block You"});
    router.push("/users");
  }
  
  const displayLoginPage = ()=>{
    if (showLoginPage == true) return <Login/>
    else if (role == "admin") {
        return (
            <>
              <Header/>
              <UserCreate/>
            </> 
        )
    }
    return (<>
      <h1></h1>
      {backClientPage()}
    </>)
    
  }

  return displayLoginPage();
}

export default RegisterPage;