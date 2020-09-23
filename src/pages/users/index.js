import {useDispatch, useSelector} from 'react-redux';
import Login from '../../Components/Users/Login';
import UserList from '../../Components/Users/UserManage/List';
import Header from '../../Components/Users/Header';
import UserDetail from '../../Components/Users/UserManage/Detail';
import ClientInfo from '../../Components/Users/Client/Info';
import LoadingPage from '../../Components/Users/LoadingPage';
import { useState, useRef, useEffect } from 'react'
import { GridLoader } from 'react-spinners'

const IndexPage = ()=>{
  const dispatch = useDispatch();

  const showLoginPage = useSelector(state => state.Users.showLoginPage);
  const showDetailPage = useSelector(state => state.Users.showDetailPage);
  const role = useSelector(state => state.Users.role);

  const [_isLoading, set_isLoading] = useState(9);
  useEffect(() => {
    if (_isLoading >= 1) {
      setTimeout(() => {
        set_isLoading(0)
      }, 700);
    }
  })
  
  
  const displayIndexPage = ()=>{
    if (showDetailPage == true) return <UserDetail/>
    return <UserList/>
  }
  
  const displayLoginPage = ()=>{
    console.log("role: ",role);
    if (showLoginPage == true) return <Login/>
    // else if (role == "client") return (<><Header title="Client Info"/><ClientInfo/></>)
    // return ( <> <Header title="User Manage"/> {displayIndexPage()} </> )
    else if (role == "admin") return ( <> <Header title="User Manage"/> {displayIndexPage()} </>)
    if (role == "client") return ( <><Header title="Client Info"/><ClientInfo/></> )
    return (
      <>
         <main className="w-100 d-flex align-items-center" style={{height: '100vh'}}>
          <LoadingPage/>
        </main>
      </>
    )
  }

  return (
    <>
      <section className={"loading-page justify-content-center align-items-center d-flex"} style={{ opacity: _isLoading.toString(), transition: "all .5s", zIndex: (_isLoading - 1).toString() }}>
        <GridLoader size={50} color={"#fff"} loading={true} />
      </section>
      {displayLoginPage()}
    </>
  )
}

export default IndexPage;