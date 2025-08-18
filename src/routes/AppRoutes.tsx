import { Navigate, Route, Routes } from "react-router-dom";
import Admin from "../pages/Admin/Admin";
import User from "../components/users/User";
import Campaigns from "../components/Campaign/Campaign";
import Login from "../pages/Login/login";
import Promotion from "../components/Promotion/Promotion";
import Store from "../components/Store/Store";
import Qrcode from "../components/QrCode/Qrcode";
import EnrolledUsersPage from "../components/Campaign/EnrolledUser";
import Brand from "../components/Brand/Brand";
import BankPremium from "../components/Bank Premium/BankPremium";
import ProtectedRoute from "./ProtectedRoute";
import SendNotification from "../components/SendNotification/SendNotification";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Admin />}>
          <Route path="users" element={<User />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="brand" element={<Brand />} />
          <Route path="enrolled-users" element={<EnrolledUsersPage />} />
          <Route path="stores" element={<Store />} />
          <Route path="promotions" element={<Promotion />} />
          <Route path="notifications" element={<SendNotification />} />
          <Route path="bank-premium" element={<BankPremium />} />
          <Route path="qrcodes" element={<Qrcode />} />
        </Route>
      </Route>

      {/* Fallback route for 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
