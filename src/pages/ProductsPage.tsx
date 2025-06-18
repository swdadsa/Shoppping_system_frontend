import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ItemsApi from "../api/ItemsApi";
import TitleApi from "../api/TitleApi";
import cartApi from "../api/CartApi";
import SignInOrSignUp from "@/components/SignInOrSignUp";

type ItemImage = {
    id: number;
    order: number;
    path: string;
};

type Discount = {
    id: number;
    item_id: number;
    startAt: string;
    endAt: string;
    discountPercent: number;
};

type Item = {
    id: number;
    sub_title_id: number;
    name: string;
    price: number;
    storage: number;
    images: ItemImage[];
    discounts: Discount[];
    Item_images: string;
};

type SubTitle = {
    id: number;
    main_title_id: number;
    name: string;
};

type Category = {
    id: number;
    name: string;
    SubTitles: SubTitle[];
};

type ProductsPageProps = {
    onCartCountChange?: (count: number) => void;
};

const ProductsPage = ({ onCartCountChange }: ProductsPageProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchParams] = useSearchParams();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const subTitleId = searchParams.get("sub_title_id");
    const navigate = useNavigate();

    // 載入商品
    useEffect(() => {
        setIsLoading(true);
        ItemsApi.getItems(Number(subTitleId))
            .then((res) => setItems(res))
            .catch((err) => console.error("API 錯誤：", err))
            .finally(() => setIsLoading(false));

        ItemsApi.extendCookieExpireTime();
    }, [subTitleId]);

    // 載入分類
    useEffect(() => {
        setIsLoading(true);
        TitleApi.getIndexWithMainTitle()
            .then((res) => setCategories(res))
            .catch((err) => console.error("分類API錯誤：", err))
            .finally(() => setIsLoading(false));
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

    // 點擊子分類，導向商品頁，帶入 sub_title_id
    const handleSubTitleClick = (id: number) => {
        navigate(`/products?sub_title_id=${id}`);
    };

    // 搜尋觸發事件
    const handleSearch = () => {
        setIsLoading(true);
        ItemsApi.getItems(Number(subTitleId), searchKeyword)
            .then((res) => setItems(res))
            .catch((err) => console.error("搜尋API錯誤：", err))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="flex px-4 py-8">
            {/* 左側漢堡清單 */}
            <aside className="w-64 pr-6 sticky top-20 self-start h-[calc(100vh-80px)] overflow-auto border-r border-orange-200">
                <h2 className="text-xl font-bold mb-4 text-orange-700">商品分類</h2>

                <ul className="mb-4">
                    <li>
                        <button
                            className={`text-left w-full py-1 px-2 rounded hover:bg-orange-100 transition ${!subTitleId ? "bg-orange-200 font-bold" : ""
                                }`}
                            onClick={() => navigate("/products")}
                        >
                            所有商品
                        </button>
                    </li>
                </ul>

                {categories.map((category) => (
                    <div key={category.id} className="mb-6">
                        <h3 className="text-lg font-semibold text-orange-600 mb-2">{category.name}</h3>
                        <ul>
                            {category.SubTitles.map((sub) => (
                                <li key={sub.id}>
                                    <button
                                        className={`text-left w-full py-1 px-2 rounded hover:bg-orange-100 transition
                      ${subTitleId === String(sub.id) ? "bg-orange-200 font-bold" : ""}
                    `}
                                        onClick={() => handleSubTitleClick(sub.id)}
                                    >
                                        {sub.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </aside>

            {/* 商品列表 */}
            <section className="flex-1">
                <h1 className="text-3xl font-bold text-orange-700 mb-8">
                    {subTitleId ? `分類商品` : `精選商品`}
                </h1>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="搜尋商品名稱"
                        className="border border-orange-300 rounded px-3 py-2"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSearch}>
                        搜尋
                    </Button>
                </div>
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {isLoading ? (
                        <div className="col-span-full text-center text-orange-600 text-lg animate-pulse">
                            商品載入中...
                        </div>
                    ) : items.length > 0 ? (
                        items.map((item) => (
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
                                            {item.discounts && item.discounts.length > 0 ? (
                                                <>
                                                    <p className="text-sm text-red-600 font-bold mb-1">🔥 打折中</p>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <p className="line-through text-gray-400">NT$ {item.price}</p>
                                                        <p className="text-orange-600 font-semibold">
                                                            NT$ {Math.floor(item.price * (Number(item.discounts[0].discountPercent) / 100))}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-orange-600 mb-2">NT$ {item.price}</p>
                                            )}

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
                        ))) : (
                        <div className="col-span-full text-center text-gray-500">查無商品</div>
                    )}
                </div>

                {/* SignInOrSignUp */}
                <SignInOrSignUp dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
            </section>
        </div>
    );
};

export default ProductsPage;
