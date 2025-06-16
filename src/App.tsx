import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SignInPage from "./pages/SignInPage";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import cartApi from "./api/CartApi";
import CartPage from "./pages/CartPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "@/components/ui/sonner";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";


function App() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = () => {
    const token = Cookies.get("token");
    const userId = Cookies.get("id");
    if (token && userId) {
      const api = new cartApi(token);
      api.getCartCount(Number(userId)).then(setCartCount);
    } else {
      // 沒登入 → 清空購物車數量
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <>
      <main className="min-h-[calc(100vh-200px)]">
        <Toaster richColors theme="light" />
        <Header cartCount={cartCount} onCartCountRefresh={refreshCartCount} />
        <Routes>
          <Route path="/" element={<HomePage onCartCountChange={refreshCartCount} />} />
          <Route
            path="/products"
            element={<ProductsPage onCartCountChange={refreshCartCount} />}
          />
          <Route path="/products/:id" element={<ProductDetailPage onCartCountChange={refreshCartCount} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/cart" element={<CartPage onCartCountChange={refreshCartCount} />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}

export default App;
