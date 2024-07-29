import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader.jsx';
import MainFooter from '../components/MainFooter.jsx';
import NavOffCanva from '../components/NavOffCanva.jsx';

const MainLayout = () => {
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />
      </main>

      <NavOffCanva />

      <MainFooter />
    </>
  )
}

export default MainLayout