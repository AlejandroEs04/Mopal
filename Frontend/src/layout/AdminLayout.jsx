import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminProvider } from "../context/AdminProvider";
import useAuth from "../hooks/useAuth";
import AdminHeader from "../components/AdminHeader";
import AdminNav from "../components/AdminNav";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import CenterModalContainer from "../components/CenterModalContainer";
import useAdmin from "../hooks/useAdmin";
import useApp from "../hooks/useApp";

const AdminLayout = () => {
  const { auth, loading } = useAuth();
  const { modalShow, setModalShow, modalInfo } = useApp()
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const checkRolID = (rolID) => {
    return rolID === 1 || rolID === 2 || rolID === 3 || rolID === 5
  }

  if(loading) return (
    <div className="container-fluid">
      <div className="text-center">
        <Loader />
        <p className="fw-bold fs-5 text-secondary">Autenticando...</p>
      </div>
    </div>
  )

  return (
    <AdminProvider>
      {auth.ID && checkRolID(auth.RolID) ? (
        <>
          <AdminHeader />
          <main className="container">
            {!(pathname.includes("form") || pathname === '/admin/user') && (
              <AdminNav />
            )}
  
            <Outlet />
          </main>

          <CenterModalContainer 
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalInfo={modalInfo}
          />
          <Toast />
        </>
      ) : navigate(auth.ID ? '/' : '/login')}
    </AdminProvider>
  )
}

export default AdminLayout