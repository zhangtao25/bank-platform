import {useMemo, useState} from 'react'
import {useLocation, useRoutes} from 'react-router-dom';
// import reactLogo from './assets/react.svg'
// import './App.css'
import MainBox from "./layout/MainBox";
import Login from "./pages/Login";
// import routerConfig from './router'
function App() {
    const loc = useLocation()
    console.log(loc.pathname)
    const isLogin = useMemo(()=>{

        if (loc.pathname.includes('login')){
            return true
        } else {
            return false
        }

    },[loc])
  return (
    <div className="App">
        {
            isLogin?<Login/>:<MainBox/>
        }

    </div>
  )
}

export default App
