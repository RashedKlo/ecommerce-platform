import { Route, Routes } from "react-router-dom";
import HomePage from "./Web/HomePage/HomePage";
import Navbar from "./Component/Web/Navbar";
import Product from "./Web/Products/Product";
import Cart from "./Web/Cart/Cart";
import Products from "./Web/Products/Products";
import ProductList from "./Dashboard/Products/Products";
import ContactUs from "./Web/Contact/ContactUs";
import Dashboard from "./Dashboard/Dashboard";
import Categories from "./Dashboard/Categories/Categories";
import CategoriesPage from "./Web/Categories/Categories";
import Customers from "./Dashboard/Customers/Customers";
import Main from "./Dashboard/main";
import AddProduct from "./Dashboard/Products/AddProduct";
import Profile from "./Web/Profile/Profile";
import AddCategory from "./Dashboard/Categories/AddCategory";
import Category from "./Dashboard/Categories/Category";
import HomeScreen from "./Dashboard/HomeScreen/HomeScreen";
import RequireBack from "./Auth/RequireBack";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import GoogleLogin from "./Auth/GoogleLogin";
import AddCustomer from "./Dashboard/Customers/AddCustomer";
import Customer from "./Dashboard/Customers/Customer";
import Page404 from "./Component/Placeholder/Page404";
import RequireAuth from "./Auth/RequireAuth";
import ShowCustomer from "./Dashboard/Customers/ShowCustomer";
import ShowCategory from "./Dashboard/Categories/ShowCategory";
import ShowProduct from "./Dashboard/Products/ShowProduct";
import EditProduct from "./Dashboard/Products/Product";
import Orders from "./Dashboard/Orders/Orders";
import OrderDetails from "./Dashboard/Orders/OrderDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<Page404 />} />
      <Route element={<Navbar />}>
        <Route path="/" element={<HomePage />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="/shop" element={<Products />} />

        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/contact" element={<ContactUs />} />
      </Route>
      <Route element={<RequireAuth role={["admin", "user"]} />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Route>
      {/* <Route element={<RequireBack />}> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/googlelogin/:id" element={<GoogleLogin />} />
      {/* </Route> */}
      <Route element={<RequireAuth role={["admin"]} />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="main" element={<Main />} />
          <Route path="home" element={<HomeScreen />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<EditProduct />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="categories/new" element={<AddCategory />} />
          <Route path="customers/new" element={<AddCustomer />} />
          <Route path="customers/:id" element={<Customer />} />
          <Route path="customers/customer/:id" element={<ShowCustomer />} />
          <Route path="categories/category/:id" element={<ShowCategory />} />
          <Route path="products/product/:id" element={<ShowProduct />} />
          <Route path="categories/:id" element={<Category />} />
          <Route path="orders/:id/:name" element={<OrderDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}
