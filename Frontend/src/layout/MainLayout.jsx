import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader.jsx';
import MainFooter from '../components/MainFooter.jsx';
import NavOffCanva from '../components/NavOffCanva.jsx';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />
      </main>

      <NavOffCanva />

      <MainFooter />

      <ToastContainer />
    </>
  )
}

export default MainLayout