import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemsApi from "../api/ItemsApi";
import { Button } from "@/components/ui/button";

type ItemImage = {
    id: number;
    path: string;
    order: number;
};

type ItemDetail = {
    id: number;
    name: string;
    price: number;
    storage: number;
    description: string;
    images: ItemImage[];
};

type Item = {
    id: number;
    name: string;
    price: number;
    images: ItemImage[];
};

const ProductDetailPage = () => {
    const baseUrl = import.meta.env.VITE_API_URL;

    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<ItemDetail | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [others, setOthers] = useState<Item[]>([]);

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

    const handleDecrease = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    if (!item) return <div className="p-8">載入中...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
            {/* 商品內容 */}
            <div className="grid md:grid-cols-2 gap-8">
                <img
                    src={` ${baseUrl}/${item.images[0]?.path}`}
                    alt={item.name}
                    className="w-full rounded-xl object-cover h-96"
                />

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-orange-800">{item.name}</h1>
                    <p className="text-xl text-orange-600 font-semibold">NT$ {item.price}</p>
                    <p className="text-orange-500">庫存：{item.storage}</p>
                    <p className="text-gray-700">{item.description}</p>

                    <div className="flex items-center space-x-4 mt-6">
                        <Button variant="outline" onClick={handleDecrease} className="w-10 h-10 text-xl">−</Button>
                        <span className="text-lg">{quantity}</span>
                        <Button variant="outline" onClick={handleIncrease} className="w-10 h-10 text-xl">+</Button>
                    </div>

                    <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-6">
                        加入購物車
                    </Button>
                </div>
            </div>

            {/* 其他商品推薦 */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-orange-700 mb-6">其他商品推薦</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {others.map((other) => (
                        <div
                            key={other.id}
                            onClick={() => navigate(`/products/${other.id}`)}
                            className="cursor-pointer bg-orange-50 rounded-2xl border border-orange-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-4"
                        >
                            <img
                                src={`${baseUrl}/${other.images[0]?.path}`}
                                alt={other.name}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="text-lg font-semibold text-orange-800">{other.name}</h3>
                            <p className="text-orange-600">NT$ {other.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
