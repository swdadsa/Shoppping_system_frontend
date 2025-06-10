import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className="bg-orange-100 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <Link to="/" className="text-2xl font-bold text-orange-700">
                    WarmShop
                </Link>
                <nav className="flex items-center space-x-6 text-orange-600 font-medium">
                    <Link to="/" className="hover:text-orange-800 transition">首頁</Link>
                    <Link to="/products" className="hover:text-orange-800 transition">商品</Link>
                    <Link to="/about" className="hover:text-orange-800 transition">關於我們</Link>
                    <Link to="/contact" className="hover:text-orange-800 transition">聯絡我們</Link>
                    <Link to="/cart" className="hover:text-orange-800 transition">購物車</Link>

                    {/* 加入登入、註冊按鈕 */}
                    <Link
                        to="/login"
                        className="ml-6 px-4 py-1 rounded border border-orange-600 text-orange-700 hover:bg-orange-200 transition"
                    >
                        登入
                    </Link>
                    <Link
                        to="/register"
                        className="ml-2 px-4 py-1 rounded bg-orange-600 text-white hover:bg-orange-700 transition"
                    >
                        註冊
                    </Link>
                </nav>
            </div>
        </header>
    );
}
