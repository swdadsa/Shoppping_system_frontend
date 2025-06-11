import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ShoppingCart } from "lucide-react";

type HeaderProps = {
    cartCount: number;
    onCartCountRefresh: () => void;
};

export function Header({ cartCount, onCartCountRefresh }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = Cookies.get("token");
        const storedUsername = Cookies.get("username");
        setIsAuthenticated(!!token);
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // 每次頁面變動都嘗試刷新購物車
        if (token) {
            onCartCountRefresh();
        }
    }, [location]);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("id");
        setIsAuthenticated(false);
        setUsername("");
        navigate("/SignIn");
    };

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
                    <Link to="/cart" className="relative hover:text-orange-800 transition">
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-orange-700">歡迎，{username}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-1 rounded border border-orange-600 text-orange-700 hover:bg-orange-200 transition"
                            >
                                登出
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/signIn"
                                className="ml-6 px-4 py-1 rounded border border-orange-600 text-orange-700 hover:bg-orange-200 transition"
                            >
                                登入
                            </Link>
                            <Link
                                to="/signUp"
                                className="ml-2 px-4 py-1 rounded bg-orange-600 text-white hover:bg-orange-700 transition"
                            >
                                註冊
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
