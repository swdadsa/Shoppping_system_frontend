import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SignInPage from "./pages/SignInPage";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import CartPage from "./pages/CartPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "@/components/ui/sonner";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCartCount } from "@/store/slices/cartSlice";


function App() {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((s) => s.cart.count);

  const refreshCartCount = () => {
    dispatch(fetchCartCount());
  };

  // 提供給頁面端呼叫（忽略傳入值，統一以 thunk 重新抓取）
  const handleCartCountChanged = (_?: number) => {
    dispatch(fetchCartCount());
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("id");
    if (token && userId) {
      dispatch(fetchCartCount());
    }
  }, []);

  return (
    <>
      <main className="min-h-[calc(100vh-200px)]">
        <Toaster richColors theme="light" />
        <Header cartCount={cartCount} onCartCountRefresh={refreshCartCount} />
        <Routes>
          <Route path="/" element={<HomePage onCartCountChange={handleCartCountChanged} />} />
          <Route
            path="/products"
            element={<ProductsPage onCartCountChange={handleCartCountChanged} />}
          />
          <Route path="/products/:id" element={<ProductDetailPage onCartCountChange={handleCartCountChanged} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/cart" element={<CartPage onCartCountChange={handleCartCountChanged} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/result" element={<PaymentResultPage />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}

export default App;

