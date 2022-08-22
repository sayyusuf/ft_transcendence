import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import 'bootstrap/dist/css/bootstrap.min.css'
import Authorize from "./pages/Authorize";
import Settings from "./pages/Settings";
import Friends from './pages/Friends'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
              <Route index={true} element={<PrivateRoute> <Dashboard/> </PrivateRoute>} />
              <Route path="profile" element={<PrivateRoute> <Profile/> </PrivateRoute>} />
              <Route path="settings" element={<PrivateRoute> <Settings/> </PrivateRoute>} />
              <Route path="friends" element={<PrivateRoute> <Friends/> </PrivateRoute>} />
        </Route>      
        <Route path="/login" element={<Login/>} />
        <Route path="/auth" element={<Authorize/>} />
      </Routes>
    </>
  );
}

export default App;
