import { useDispatch, useSelector } from 'react-redux';
import Login from '../../Components/Things/Login';
import UserList from '../../Components/Things/UserManage/List';
import Header from '../../Components/Things/Header';
import UserDetail from '../../Components/Things/UserManage/Detail';
import ClientInfo from '../../Components/Things/Client/Info';
import { GridLoader } from 'react-spinners'
import {useState, useEffect} from 'react'


const IndexPage = () => {
  const dispatch = useDispatch();

  const showLoginPage = useSelector(state => state.Things.showLoginPage);
  const showDetailPage = useSelector(state => state.Things.showDetailPage);
  const role = useSelector(state => state.Things.role);


  const [_isLoading, set_isLoading] = useState(9);
  useEffect(() => {
    if (_isLoading >= 1) {
      setTimeout(() => {
        set_isLoading(0)
      }, 700);
    }
  })


  const displayIndexPage = () => {
    if (showDetailPage == true) return <UserDetail />
    return <UserList />
  }

  const displayLoginPage = () => {
    if (showLoginPage == true) return <Login />
    else if (role == "client") return (<><Header title="Client Info" /><ClientInfo /></>)
    return (
      <>
        <Header title="Station Management" />
        {displayIndexPage()}
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