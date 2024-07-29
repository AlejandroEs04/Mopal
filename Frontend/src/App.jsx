import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { socket } from './socket.js'
import { AppProvider } from "./context/AppProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import './styles.css'
// Layouts
import MainLayout from "./layout/MainLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import InventoryLayout from "./layout/InventoryLayout.jsx";
// Public Page
import Index from "./pages/Index.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductPage from "./pages/ProductoPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import ContactoPage from "./pages/ContactoPage.jsx";
import NosotrosPage from "./pages/NosotrosPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import InventoryHistoryPage from "./pages/InventoryHistoryPage.jsx";
// Admin Page
import AdminIndex from "./pages/AdminIndex.jsx";
import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import AdminPurchasePage from "./pages/AdminPurchasePage.jsx";
import AdminSupplierPage from "./pages/AdminSupplierPage.jsx";
import AdminSalePage from "./pages/AdminSalePage.jsx";
import AdminQuotationPage from "./pages/AdminQuotationPage.jsx";
import AdminRequestPage from "./pages/AdminRequestPage.jsx";
import AdminStoragePage from "./pages/AdminStoragePage.jsx";
import AdminUserPage from "./pages/AdminUserPage.jsx";
// Cruds
import CrudProductPage from "./pages/CrudProductPage.jsx";
import CrudPurchasePage from "./pages/CrudPurchasePage.jsx";
import CrudSalePage from "./pages/CrudSalePage.jsx";
import CrudQuotationPage from "./pages/CrudQuotationPage.jsx";
import CrudUserPage from "./pages/CrudUserPage.jsx";
import CrudSupplierPage from "./pages/CrudSupplierPage.jsx";
import AdminCustomerPage from "./pages/AdminCustomerPage.jsx";
import CrudCustomerPage from "./pages/CrudCustomerPage.jsx";
import InfoSalePage from "./pages/InfoSalePage.jsx";
import InfoPurchasePage from "./pages/InfoPurchasePage.jsx";
import InfoRequestPage from "./pages/InfoRequestPage.jsx";
import StorageSales from "./pages/StorageSales.jsx";
import StoragePurchases from "./pages/StoragePurchases.jsx";
import AdminRequestsPage from "./pages/AdminRequestsPage.jsx";
import CrudProductAccesoriesPage from "./pages/CrudProductAccesoriesPage.jsx";
import ExcelProductsCrud from "./pages/ExcelProductsCrud.jsx";
import CrudProductListPage from "./pages/CrudProductListPage.jsx";
import AdminProductsListPage from "./pages/AdminProductsListPage.jsx";
import UserInfoRequest from "./pages/UserInfoRequest.jsx";
import InventoryUserInfo from "./pages/InventoryUserInfo.jsx";
import CrudRequestPage from "./pages/CrudRequestPage.jsx";
import AdminTypePage from "./pages/AdminTypePage.jsx";
import CrudTypePage from "./pages/CrudTypePage.jsx";
import Statistics from "./pages/Statistics.jsx";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect)
    }
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="productos" element={<ProductsPage />} />
              <Route path="productos/:folio" element={<ProductPage />} />
              <Route path="contacto" element={<ContactoPage />} />
              <Route path="nosotros" element={<NosotrosPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>

            <Route path="/inventory" element={<InventoryLayout />}>
              <Route index element={<InventoryPage />} />
              <Route path="products-list" element={<ProductListPage />} />
              <Route path="requests" element={<InventoryHistoryPage />} />
              <Route path="requests/:id" element={<UserInfoRequest />} />
              <Route path="user" element={<InventoryUserInfo />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminProductsPage />} />
              <Route path="type" element={<AdminTypePage />} />
              <Route path="type/form" element={<CrudTypePage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/excel" element={<ExcelProductsCrud />} />
              <Route path="productsList" element={<AdminProductsListPage />} />
              <Route path="productsList/form" element={<CrudProductListPage />} />
              <Route path="productsList/form/:id" element={<CrudProductListPage />} />
              <Route path="products/form" element={<CrudProductPage />} />
              <Route path="products/form/:id" element={<CrudProductPage />} />
              <Route path="products/form/:id/accessory" element={<CrudProductAccesoriesPage />} />
              <Route path="purchase" element={<AdminPurchasePage />} />
              <Route path="purchase/info/:id" element={<InfoPurchasePage />} />
              <Route path="purchase/form" element={<CrudPurchasePage />} />
              <Route path="purchase/form/:id" element={<CrudPurchasePage />} />
              <Route path="sales" element={<AdminSalePage />} />
              <Route path="sales/form" element={<CrudSalePage />} />
              <Route path="sales/form/:id" element={<CrudSalePage />} />
              <Route path="quotation" element={<AdminQuotationPage />} />
              <Route path="quotation/form" element={<CrudQuotationPage />} />
              <Route path="quotation/form/:id" element={<CrudQuotationPage />} />
              <Route path="request" element={<AdminRequestsPage />} />
              <Route path="request/form" element={<CrudRequestPage />} />
              <Route path="request/:id" element={<AdminRequestPage />} />
              <Route path="storage" element={<AdminStoragePage />} />
              <Route path="storage/sales" element={<StorageSales />} />
              <Route path="storage/purchases" element={<StoragePurchases />} />
              <Route path="users" element={<AdminUserPage />} />
              <Route path="users/form" element={<CrudUserPage />} />
              <Route path="users/form/:id" element={<CrudUserPage />} />
              <Route path="suppliers" element={<AdminSupplierPage />} />
              <Route path="suppliers/form" element={<CrudSupplierPage />} />
              <Route path="suppliers/form/:id" element={<CrudSupplierPage />} />
              <Route path="customers" element={<AdminCustomerPage />} />
              <Route path="customers/form" element={<CrudCustomerPage />} />
              <Route path="customers/form/:id" element={<CrudCustomerPage />} />
              <Route path="statistics" element={<Statistics />} />
            </Route>

            <Route path="/info" element={<AdminLayout />}>
              <Route path="sales/:id" element={<InfoSalePage />} />
              <Route path="purchases/:id" element={<InfoPurchasePage />} />
              <Route path="requests/:id" element={<InfoRequestPage />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
