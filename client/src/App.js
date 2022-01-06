import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "./context/userContext";
import { API, setAuthToken } from "./config/api";
import React from "react";

// -------------- PAGE ----------------
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyProduct from "./pages/MyProduct";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import DetailProduct from "./pages/DetailProduct";
import IncomeTransaction from "./pages/IncomeTransaction";

// Init token on axios every time the app is refreshed here ...
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (!state.isLogin) {
      // navigate("/");
    } else if (state.user.role === "admin") {
      navigate("/income");
    } else if (state.user.role === "user") {
      // navigate("/");
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.user;

      console.log(response.data.data.user);

      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Call function check user with useEffect didMount here ...
  useEffect(() => {
    checkUser();
  }, []);
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail-product/:id" element={<DetailProduct />} />
        <Route path="/add-cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/my-product" element={<MyProduct />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/income" element={<IncomeTransaction />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
