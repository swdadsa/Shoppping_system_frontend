import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemsApi from "../api/ItemsApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Cookies from "js-cookie";
import cartApi from "../api/CartApi";
import SignInOrSignUp from "@/components/SignInOrSignUp";
import ProductCard from "@/components/ProductCard";
import { getDiscountedPrice } from "@/utils/discountUtils";

type ItemImage = {
    id: number;
    path: string;
    order: number;
};

type Discount = {
    id: number;
    item_id: number;
    startAt: string;
    endAt: string;
    discountNumber: number;
    discountPercent: number;
};


type ItemDetail = {
    id: number;
    name: string;
    price: number;
    storage: number;
    description: string;
    images: ItemImage[];
    discounts: Discount[];
};

type Item = {
    id: number;
    name: string;
    price: number;
    images: ItemImage[];
    discounts: Discount[];
};

type ProductsPageProps = {
    onCartCountChange?: (count: number) => void;
};

const ProductDetailPage = ({ onCartCountChange }: ProductsPageProps) => {
    const baseUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState<ItemDetail | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [others, setOthers] = useState<Item[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        // 商品詳細資料
        ItemsApi.getItemDetail(id)
            .then((res) => {
                setItem(res);
            })
            .catch((err) => {
                console.error("取得商品資料失敗：", err);
            });

        // 所有商品資料（過濾目前這筆）
        ItemsApi.getItems()
            .then((res) => {
                const filtered = res.filter((it: Item) => it.id !== Number(id));
                setOthers(filtered.slice(0, 3)); // 顯示前 3 筆
            })
            .catch((err) => {
                console.error("取得其他商品失敗：", err);
            });

        // 重設數量
        setQuantity(1);

        // 延長cookie有效期
        ItemsApi.extendCookieExpireTime();
    }, [id]);

    const handleAddToCart = (itemId: number, amount: number) => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (!token || !userId) {
            setDialogOpen(true);
            return;
        }

        const CartApi = new cartApi(token);
        CartApi.addToCart(Number(userId), itemId, amount)
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

    const handleDecrease = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    if (!item) return <div className="p-8">載入中...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {/* 商品內容 */}
            <div className="grid md:grid-cols-12 gap-8">
                <div className="col-span-1">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        ← 返回
                    </Button>
                </div>
                <div className="col-span-6">
                    <img
                        src={` ${baseUrl}/${item.images[0]?.path}`}
                        alt={item.name}
                        className="w-full rounded-xl object-cover h-96"
                    />
                </div>
                <div className="col-span-5">
                    <h1 className="text-3xl font-bold text-orange-800">{item.name}</h1>

                    {item.discounts && item.discounts.length > 0 ? (
                        <>
                            <p className="text-sm text-red-600 font-bold mb-1">🔥 打折中</p>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="line-through text-gray-400">NT$ {item.price}</p>
                                <p className="text-orange-600 font-semibold">
                                    NT$ {getDiscountedPrice(item.price, item.discounts[0].discountNumber, item.discounts[0].discountPercent)}
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className="text-xl text-orange-600 font-semibold">NT$ {item.price}</p>
                    )}

                    <p className="text-orange-500">庫存：{item.storage}</p>
                    <p className="text-gray-700">{item.description}</p>

                    <div className="flex items-center space-x-4 mt-6">
                        <Button variant="outline" onClick={handleDecrease} className="w-10 h-10 text-xl">−</Button>
                        <span className="text-lg">{quantity}</span>
                        <Button variant="outline" onClick={handleIncrease} className="w-10 h-10 text-xl">+</Button>
                    </div>

                    <Button
                        className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-6"
                        onClick={() => handleAddToCart(item.id, quantity)}
                    >
                        加入購物車
                    </Button>
                </div>
            </div>


            {/* 其他商品推薦 */}
            <div className="grid md:grid-cols-12 gap-8">
                <div className="col-span-2">
                    <h2 className="text-2xl font-bold text-orange-700 mb-6 ">其他商品推薦</h2>
                </div>
                <div className="col-span-10">
                </div>
                {others.map((other) => (
                    <div className="col-span-4 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <ProductCard
                            key={other.id}
                            id={other.id}
                            name={other.name}
                            price={other.price}
                            image={`${baseUrl}/${other.images[0]?.path}`}
                            discounts={other.discounts}
                            clickable={true}
                        />
                    </div>
                ))}
            </div>

            {/* SignInOrSignUp */}
            <SignInOrSignUp dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </div>
    );
};

export default ProductDetailPage;
