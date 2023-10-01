import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import ScrollToTop from "./components/ScrollToTop";
import { BaseOptionChartStyle } from "./components/chart/BaseOptionChart";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import BuyerLayout from "./layouts/buyer";
import DashboardLayout from "./layouts/dashboard";
import { FeedBack, FeedBackManagement } from "./pages";
import DashboardApp from "./pages/DashboardApp";
import NotFound from "./pages/Page404";
import { Buyer } from "./pages/Project/Buyer/Buyer";
import ItemManagement from "./pages/Project/ItemManagement/ItemManagement";
import PaymentInvoice from "./pages/Project/PaymentManagement/PaymentInvoice";
import PaymentManagement from "./pages/Project/PaymentManagement/PaymentManagement";
import ProductApproveManagement from "./pages/Project/ProductApproveManagement/ProductManagement";
import ShopManagement from "./pages/Project/ShopManagement/ShopManagement";
import Login from "./pages/Project/UserManagement/Login";
import Register from "./pages/Project/UserManagement/Register";
import User from "./pages/Project/UserManagement/User";
import UserApprove from "./pages/Project/UserManagement/UserApprove";
import UserEdit from "./pages/Project/UserManagement/UserEdit";
import UserView from "./pages/Project/UserManagement/UserView";
import ThemeProvider from "./theme";
import { getToken } from "./pages/Project/UserManagement/Session";

export default function App() {
  const user = getToken();

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Routes>
        <Route path="/" element={<LogoOnlyLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Route>

        <Route path="/dashboard" element={<PrivateRoute component={DashboardLayout} requiredRole="all" />}>
          <Route path="app" element={<PrivateRoute component={DashboardApp} requiredRole="all" />} />
          <Route path="user-management" element={user ?  user.result.type == "admin" ? <User /> : <Navigate to="/404" /> : <Navigate to="/404" />} />
          <Route path="approve/:id" element={user ?  user.result.type == "admin" ? <UserApprove /> : <Navigate to="/404" /> : <Navigate to="/404" />} />
          <Route path="view/:id" element={user ?  user.result.type == "admin" ? <UserView /> : <Navigate to="/404" /> : <Navigate to="/404" />} />
          <Route path="edit/:id" element={user ?  user.result.type == "admin" ? <UserEdit /> : <Navigate to="/404" /> : <Navigate to="/404" />} />
          <Route path="item-management" element={<ItemManagement />} />
          <Route path="product-approve-management" element={user ?  user.result.type == "admin" ? <ProductApproveManagement /> : <Navigate to="/404" /> : <Navigate to="/404" />} />
          <Route path="shop-management" element={<ShopManagement />} />
          <Route path="payment-management" element={<PaymentInvoice />} />
          <Route path="transaction-management" element={<PaymentManagement />} />
          <Route path="feedback-management" element={user ?  user.result.type == "admin" ? <FeedBackManagement /> : <Navigate to="/404" /> : <Navigate to="/404" />} />
          <Route path="feedback" element={<FeedBack />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Route>

        <Route path="buyer" element={<BuyerLayout />} >
          <Route path="shop-management" element={<ShopManagement />} />
          <Route path="feedback" element={<FeedBack />} />
          <Route path={`*`} element={<Buyer />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
