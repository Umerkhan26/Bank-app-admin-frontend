import { Navigate, Route, Router, Routes } from "react-router-dom";
import Admin from "../pages/Admin/Admin";
import User from "../components/users/User";
import Campaigns from "../components/Campaign/Campaign";
import Login from "../pages/Login/login";
import Promotion from "../components/Promotion/Promotion";
import Store from "../components/Store/Store";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Admin />}>
        {/* Use relative path for nested routes */}
        <Route path="users" element={<User />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="stores" element={<Store />} />
        <Route path="promotions" element={<Promotion />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
