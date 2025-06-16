import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ShoppingCart } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import accountApi from "@/api/AccountApi";
import { toast } from "sonner";
import TitleApi from "@/api/TitleApi";

type HeaderProps = {
    cartCount: number;
    onCartCountRefresh: () => void;
};

type Category = {
    id: number;
    name: string;
    SubTitles: { id: number; name: string }[];
};

function Header({ cartCount, onCartCountRefresh }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        const storedUsername = Cookies.get("username");
        setIsAuthenticated(!!token);
        if (storedUsername) {
            setUsername(storedUsername);
        }

        if (token) {
            onCartCountRefresh();
        }
    }, [location]);

    // 點擊外部關閉商品下拉選單
    useEffect(() => {
        // 獲取分類
        TitleApi.getIndexWithMainTitle()
            .then((res) => setCategories(res))
            .catch((err) => console.error(err));

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        const AccountApi = new accountApi(Cookies.get("token"));
        AccountApi.SignOut()
            .then((res) => {
                if (res.status === "success") {
                    Cookies.remove("token");
                    Cookies.remove("username");
                    Cookies.remove("id");
                    setIsAuthenticated(false);
                    setUsername("");
                    onCartCountRefresh();
                    navigate("/signIn", { state: { from: "SignOut" } });
                } else {
                    toast.error("Api 錯誤，請重新登入");
                    Cookies.remove("token");
                    navigate("/signIn");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("無法取得使用者資料，請重新登入");
                Cookies.remove("token");
            });
    };

    return (
        <header className="bg-orange-100 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <Link to="/" className="text-2xl font-bold text-orange-700">
                    WarmShop
                </Link>
                <nav className="flex items-center space-x-6 text-orange-600 font-medium relative">
                    <Link to="/" className="hover:text-orange-800 transition">首頁</Link>
                    {/* 商品 - 點擊觸發 */}
                    <div>
                        <span
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="cursor-pointer hover:text-orange-800"
                        >
                            商品
                        </span>
                    </div>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="text-orange-700 cursor-pointer hover:text-orange-900 transition">
                                    歡迎，{username}
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white shadow-lg rounded-xl mt-2">
                                <DropdownMenuItem onClick={() => navigate("/profile")}>
                                    帳號
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/cart")}>
                                    購物車
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/orders")}>
                                    訂單
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    登出
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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

            {/* 展開的商品分類清單 */}
            {isDropdownOpen && (
                <div className="bg-white border-t border-orange-200 shadow-inner">
                    <div className="container mx-auto flex flex-wrap py-4 px-6">
                        {categories.map((main) => (
                            <div key={main.id} className="p-4 min-w-[200px] border-r border-orange-100">
                                <div className="font-semibold text-orange-700 mb-2">{main.name}</div>
                                <ul className="space-y-1">
                                    {main.SubTitles.map((sub) => (
                                        <li key={sub.id}>
                                            <Link
                                                to={`/products?sub_title_id=${sub.id}`}
                                                className="text-orange-600 hover:text-orange-800"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {sub.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
