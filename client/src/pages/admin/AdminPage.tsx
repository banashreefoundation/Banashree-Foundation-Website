import { Outlet } from "react-router-dom"
import Sidebar from './Sidebar/Sidebar';
import "./adminPage.scss";
const AdminPage = () => {
  return (

    //Placeholder for Admin Layout with navbar and sidebar
    <>
      <div className="flex h-screen">
        <div className="flex-none w-72">
          <Sidebar />
        </div>
        <div className="flex w-full pl-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AdminPage