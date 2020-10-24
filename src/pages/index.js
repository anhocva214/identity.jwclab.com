import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { GridLoader } from 'react-spinners'
import {useDispatch, useSelector} from 'react-redux';
import LoginPage from '../Components/Login'
import AdminSite from '../Components/AdminSite/main'
import ClientSite from '../Components/ClientSite/main'
import axios from 'axios'

const IndexPage = () => {

    const dispatch = useDispatch();

    const navPage = useSelector(state => state.Navigation.navPage);
    const myInfo = useSelector(state => state.MyInfo.myInfo);


    const [_loadingBg, set_loadingBg] = useState(true);
    const [_isLoading, set_isLoading] = useState(9);


    const useComponentWillMount = func => { const willMount = useRef(true); if (willMount.current) { func(); } willMount.current = false; };
    // useComponentWillMount(()=>{
    //     dispatch({ type:'CONNECT'})
    // })

    useComponentWillMount(() => {
        axios({
            method: 'get',
            url: "/img/background.jpg"
        })
            .then(({ data })=>{
                set_isLoading(0)
            })
            .catch(error=>{
                set_isLoading(0)
            })
    })

    // useEffect(() => {
    //     if (_isLoading >= 1) {
    //         setTimeout(() => {
    //             set_isLoading(0)
    //         }, 700);
    //     }
    // })

    const displayNavigation = ()=>{
        // console.log(myInfo);
        switch (navPage) {
            case "login":
                return <LoginPage />
            case "adminSite":
                return <AdminSite/>
            case "clientSite":
                return <ClientSite/>
            default:
                return <LoginPage/>
        }
    }



    return (
        <>
            {/* <section className={"loading-page justify-content-center align-items-center d-flex"} style={{ opacity: _isLoading.toString(), transition: "all .5s", zIndex: (_isLoading - 1).toString() }}>
                <GridLoader size={50} color={"#fff"} loading={true} />
            </section> */}

            <section className={"loading-page justify-content-center align-items-center d-flex"} style={{ opacity: _isLoading.toString(), transition: "all .7s", zIndex: (_isLoading - 1).toString() }}>
                <GridLoader size={50} color={"#fff"} loading={true} />
            </section>
            
            {displayNavigation()}

            <style jsx global>{`
                .loading-page{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: #4c7ee0;
                }
            `}</style>

        </>
    )
}

export default IndexPage;