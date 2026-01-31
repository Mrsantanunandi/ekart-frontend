import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrder from './pages/admin/AdminOrder'
import AdminUsers from './pages/admin/AdminUsers'
import ShowUserOrder from './pages/admin/ShowUserOrder'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoutes from './components/ui/ProtectedRoutes'
import DashBoard from './pages/DashBoard'
import SingleProduct from './pages/SingleProduct'
import Address from './pages/Address'
import OrderSuccess from './pages/OrderSuccess'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /> <Footer /> </>
  },
  {
    path: '/signup',
    element: <><SignUp /></>
  },
  {
    path: '/login',
    element: <><Login /></>
  },
  {
    path: '/verify',
    element: <><Verify /></>
  },
  {
    path: '/verify-email',
    element: <><VerifyEmail /></>
  },
  {
    path: '/profile/:id',
    element: <ProtectedRoutes><Navbar /> <Profile /></ProtectedRoutes>
  },
  {
    path: '/products',
    element: <><Navbar /> <Products /></>
  },
  {
    path: '/products/:id',
    element: <><Navbar /> <SingleProduct /></>
  },
  {
    path: '/cart',
    element: <ProtectedRoutes><Navbar /> <Cart /></ProtectedRoutes>
  },
  {
    path: '/address',
    element: <ProtectedRoutes><Address/></ProtectedRoutes>
  },
  {
  path: '/orders',
  element: <ProtectedRoutes><OrderSuccess/></ProtectedRoutes>
},
  {
    path: '/dashboard',
    element: <ProtectedRoutes adminOnly={true}><Navbar /> <DashBoard /> </ProtectedRoutes>,
    children: [
      {
        path: "sales",
        element: <AdminSales />
      },
      {
        path: "add-product",
        element: <AddProduct />
      },
      {
        path: "products",
        element: <AdminProducts />
      },
      {
        path: "orders",
        element: <AdminOrder />
      },
      {
        path: "users",
        element: <AdminUsers />
      },
      {
        path: "users/orders/:userId",
        element: <ShowUserOrder />
      },
      {
        path: "users/:id",
        element: <UserInfo />
      }
    ]
  }
])
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
