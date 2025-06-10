import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ItemsApi from "../api/ItemsApi";

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
    Item_images: string; // 完整圖片 URL
};

const ProductsPage = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        ItemsApi.getItems()
            .then((res) => {
                setItems(res);
            })
            .catch((err) => {
                console.error("API 錯誤：", err);
            });
    }, []);


    return (
        <section>
            <h1 className="text-3xl font-bold text-orange-700 mb-8">精選商品</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-orange-50 border border-orange-200 rounded-2xl shadow-sm hover:shadow-md transition p-4"
                    >
                        <img
                            src={item.Item_images}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-lg font-semibold text-orange-800 mb-1">
                            {item.name}
                        </h2>
                        <p className="text-orange-600 mb-2">NT$ {item.price}</p>
                        <p className="text-sm text-orange-500 mb-4">庫存：{item.storage}</p>
                        <Button
                            variant="default"
                            className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                        >
                            加入購物車
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ProductsPage