import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
// ...

function App() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
