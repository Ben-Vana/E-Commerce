import Home from "./pages/homePage/Home";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/authPages/Register";
import Login from "./pages/authPages/Login";
import useAutoLogin from "./hooks/useAutoLogin";
import ForgotPassword from "./pages/authPages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/authPages/forgotPassword/ResetPassword";
import SearchPage from "./pages/searchPage/SearchPage";
import ProductPage from "./pages/productPage/ProductPage";
import AuthGuard from "./components/AuthGuard";
import Dashboard from "./pages/dashboard/Dashboard";
import DashAddProduct from "./pages/dashboard/addProduct/DashAddProduct";
import DashEditProduct from "./pages/dashboard/editProduct/EditProduct";
import AllProducts from "./pages/dashboard/allProducts/AllProducts";
import ReviewsPage from "./pages/reviewsPage/ReviewsPage";
import Users from "./pages/dashboard/users/Users";
import User from "./pages/dashboard/users/user/User";
import Statistics from "./pages/dashboard/statistics/Statistics";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.css";

const App = (): JSX.Element => {
  const [tryLogin, setTryLogin] = useState(true);
  const autoLogin = useAutoLogin();
  const isLoggedIn = useSelector(
    (state: { authReducer: { login: boolean } }): boolean =>
      state.authReducer.login
  );

  useEffect((): void => {
    //Check if user have a token before loading the page
    (async () => {
      let status = await autoLogin();
      if (!status) setTryLogin(false);
    })();
  }, []);

  useEffect((): void => {
    //Check if user just logged in before loading the page
    if (isLoggedIn && tryLogin) setTryLogin(false);
  }, [isLoggedIn]);

  return (
    <div className="main-div">
      {!tryLogin && (
        <div>
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/productreviews" element={<ReviewsPage />} />
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              >
                <Route path="/dashboard/statistics" element={<Statistics />} />
                <Route
                  path="/dashboard/addproduct"
                  element={<DashAddProduct />}
                />
                <Route
                  path="/dashboard/manageproduct"
                  element={<AllProducts />}
                />
                <Route
                  path="/dashboard/editproduct/:pid"
                  element={<DashEditProduct />}
                />
                <Route path="/dashboard/users" element={<Users />} />
                <Route path="/dashboard/users/user" element={<User />} />
              </Route>
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
