import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddGift from "../pages/AddGift";
import AllGift from "../pages/AllGift";
import SaleHistory from "../pages/SaleHistory";
import ProtectedRoute from "../component/layout/ProtectedRoute";
import Coupons from "../pages/Coupons";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <AllGift />
            },
            {
                path: 'add-gift',
                element: <ProtectedRoute role="manager"><AddGift /></ProtectedRoute>
            },
            {
                path: 'sale-history',
                element: <SaleHistory />
            },
            {
                path: 'coupons',
                element: <Coupons />
            },
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
])

export default router;