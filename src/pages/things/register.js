import { useDispatch, useSelector } from 'react-redux';
import Login from '../../Components/Things/Login';
import Header from '../../Components/Things/Header';
import UserCreate from '../../Components/Things/UserManage/Create';
import { useRouter } from 'next/router';
import ClientInfo from '../../Components/Things/Client/Info';
import cookie from 'react-cookies';


const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const showLoginPage = useSelector(state => state.Things.showLoginPage);
  const role = useSelector(state => state.Things.role);

  const backClientPage = () => {
    router.push("/things");
  }

  const displayLoginPage = () => {
    if (showLoginPage == true) return <Login />
    else 
      return (
        <>
          <Header />
          <UserCreate />
        </>
      )
    return (<>
      <h1></h1>
      {backClientPage()}
    </>)

  }

  return displayLoginPage();
}

export default RegisterPage;