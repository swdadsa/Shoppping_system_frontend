import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ItemsApi from "../api/ItemsApi";
import SignInOrSignUp from "@/components/SignInOrSignUp";
import Cookies from "js-cookie";
import cartApi from "../api/CartApi";


type Item = {
    id: number;
    sub_title_id: number;
    name: string;
    price: number;
    storage: number;
    images: { id: number; order: number; path: string }[];
    Item_images: string;
};

type ProductsPageProps = {
    onCartCountChange?: (count: number) => void;
};

const HomePage = ({ onCartCountChange }: ProductsPageProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const location = useLocation();
    const staticCategories = [
        { name: "服飾", sub_title_id: 14 },
        { name: "居家", sub_title_id: 8 },
        { name: "3C", sub_title_id: 1 },
        { name: "美妝", sub_title_id: 19 },
    ];


    // 顯示登入成功 toast
    useEffect(() => {
        if (location.state?.from === "login") {
            toast.success("登入成功，歡迎回來！");
        }

        ItemsApi.getItems()
            .then((res) => setItems(res.slice(0, 4))) // 僅取前四個當作精選商品
            .catch((err) => console.error("取得商品失敗：", err));
    }, []);

    const handleAddToCart = (itemId: number) => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (!token || !userId) {
            setDialogOpen(true);
            return;
        }

        const CartApi = new cartApi(token);
        CartApi.addToCart(Number(userId), itemId, 1)
            .then(() => {
                toast.success("成功加入購物車！", {
                    description: "您可以到右上角查看您的購物車。",
                });

                // 取得最新購物車數量並傳給 Header
                CartApi.getCartCount(Number(userId)).then((count: number) => {
                    if (onCartCountChange) {
                        onCartCountChange(count);
                    }
                });
            })
            .catch((err) => {
                console.error("加入購物車失敗：", err);
                alert("加入購物車失敗");
            });
    };

    return (
        <div className="space-y-16">
            {/* Hero Banner */}
            <section className="bg-orange-100 text-center py-20">
                <h1 className="text-4xl font-bold text-orange-700 mb-4">讓每一次購物都更溫暖</h1>
                <p className="text-orange-600 mb-6">發現你喜愛的每一樣商品</p>
                <Link to="/products">
                    <Button className="bg-orange-500 text-white hover:bg-orange-600">立即逛逛</Button>
                </Link>
            </section>

            {/* Promotions */}
            <section className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-orange-50 p-6 rounded-xl shadow">免運費</div>
                <div className="bg-orange-50 p-6 rounded-xl shadow">滿額折扣</div>
                <div className="bg-orange-50 p-6 rounded-xl shadow">新品上架</div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold text-orange-700 mb-4">快速選單</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {staticCategories.map((val) => (
                        <Link
                            to={`/products?sub_title_id=${val.sub_title_id}`}
                            key={val.name}
                            className="bg-orange-50 p-6 rounded-xl shadow hover:bg-orange-100"
                        >
                            {val.name}
                        </Link>
                    ))}
                </div>
            </section>

            {/* About Us */}
            <section className="bg-orange-50 py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-48 bg-orange-200 rounded-xl"></div>
                    <div>
                        <h3 className="text-xl font-semibold text-orange-700 mb-2">關於 WarmShop</h3>
                        <p className="text-orange-600">
                            我們致力於打造一個溫暖、親切、充滿設計感的線上購物空間，讓每一次選購都能感受到細膩與美好。
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Items */}
            <section className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold text-orange-700 mb-4">精選商品</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow p-4">
                            <Link to={`/products/${item.id}`}>
                                <img
                                    src={item.Item_images}
                                    alt={item.name}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <h4 className="text-orange-700 font-medium">{item.name}</h4>
                                <p className="text-orange-500">NT$ {item.price}</p>
                            </Link>
                            <Button className="w-full mt-2 bg-orange-500 text-white hover:bg-orange-600" onClick={() => handleAddToCart(item.id)}>
                                加入購物車
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* SignInOrSignUp */}
            <SignInOrSignUp dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </div>
    );
};

export default HomePage;
