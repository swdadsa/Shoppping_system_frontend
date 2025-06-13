import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import ItemsApi from "../api/ItemsApi";
import cartApi from "../api/CartApi";
import SignInOrSignUp from "@/components/SignInOrSignUp";

type ItemImage = {
    id: number;
    order: number;
    path: string;
};

type Item = {
    id: number;
    sub_title_id: number;
    name: string;
    price: number;
    storage: number;
    images: ItemImage[];
    Item_images: string;
};

type ProductsPageProps = {
    onCartCountChange?: (count: number) => void;
};

const ProductsPage = ({ onCartCountChange }: ProductsPageProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        ItemsApi.getItems()
            .then((res) => setItems(res))
            .catch((err) => console.error("API 錯誤：", err));

        ItemsApi.extendCookieExpireTime();
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
        <section className="px-4 py-8 relative">
            <h1 className="text-3xl font-bold text-orange-700 mb-8">精選商品</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="transform transition-transform duration-200 hover:scale-105"
                    >
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl shadow-sm hover:shadow-md transition p-4 h-full flex flex-col justify-between">
                            <Link to={`/products/${item.id}`} className="block hover:opacity-90 transition">
                                <img
                                    src={item.Item_images}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold text-orange-800 mb-1">{item.name}</h2>
                                    <p className="text-orange-600 mb-2">NT$ {item.price}</p>
                                    <p className="text-sm text-orange-500 mb-4">庫存：{item.storage}</p>
                                </div>
                            </Link>

                            <Button
                                onClick={() => handleAddToCart(item.id)}
                                className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-auto"
                            >
                                加入購物車
                            </Button>
                        </div>
                    </div>

                ))}
            </div>

            {/* SignInOrSignUp */}
            <SignInOrSignUp dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </section>
    );
};

export default ProductsPage;
