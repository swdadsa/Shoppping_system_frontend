import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SignInPage from "./pages/SignInPage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import cartApi from "./api/CartApi";
import CartPage from "./pages/CartPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = () => {
    const token = Cookies.get("token");
    const userId = Cookies.get("id");
    if (token && userId) {
      const api = new cartApi(token);
      api.getCartCount(Number(userId)).then(setCartCount);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <>
      <main className="min-h-[calc(100vh-200px)]">
        <Header cartCount={cartCount} onCartCountRefresh={refreshCartCount} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductsPage onCartCountChange={refreshCartCount} />}
          />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/cart" element={<CartPage onCartCountChange={refreshCartCount} />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}

export default App;
