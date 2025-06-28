import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import orderApi from "@/api/OrderApi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getDiscountedPrice } from "@/utils/discountUtils";

type Order = {
    id: number;
    order_unique_number: string;
    condition: "0" | "1" | "2";
    total_price: string;
};


type OrderDetail = {
    items: OrderDetailItem[];
    totalPrice: string;
};


type OrderDetailItem = {
    id: number;
    order_list_id: number;
    item_id: number;
    amount: number;
    price: number;
    name: string;
    Item_images: string;
    discount: Discounts[];
};

type Discounts = {
    discountNumber: number;
    discountPercent: number;
};

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (!token || !userId) {
            navigate("/signIn");
            return;
        }

        const OrderApi = new orderApi(token);
        OrderApi.getOrderList(Number(userId))
            .then((res) => {
                if (res.status === "success") {
                    setOrders(res.data);
                } else {
                    toast.error("無法取得訂單資料");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("發生錯誤，請稍後再試");
            });
    }, []);

    const getStatusBadge = (condition: "0" | "1" | "2") => {
        switch (condition) {
            case "0":
                return <Badge variant="secondary">處理中</Badge>;
            case "1":
                return <Badge className="bg-green-600">已付款</Badge>;
            case "2":
                return <Badge className="bg-blue-600">已出貨</Badge>;
            default:
                return <Badge variant="outline">未知狀態</Badge>;
        }
    };

    const handleSelectOrder = (order_list_id: number) => {
        const token = Cookies.get("token");
        const OrderApi = new orderApi(token);

        OrderApi.getOrderDetail(order_list_id)
            .then((res) => {
                if (res.status === "success") {
                    setSelectedOrderId(order_list_id);
                    setOrderDetail(res.data);
                } else {
                    toast.error("無法取得訂單詳細資料");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("查詢訂單明細失敗");
            });

        setShowDetail(true);
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 px-6 overflow-hidden">
            <div className="relative h-full">
                <motion.div
                    className="flex w-[200%] transition-transform"
                    animate={{ x: showDetail ? "-50%" : "0%" }}
                    transition={{ duration: 0.1 }}
                >
                    {/* 訂單列表 */}
                    <div className="w-1/2 pr-6">
                        <h2 className="text-2xl font-bold text-orange-700 mb-4">我的訂單</h2>
                        {orders.length === 0 ? (
                            <p className="text-orange-600">目前沒有任何訂單。</p>
                        ) : (
                            orders.map((order) => (
                                <Card
                                    key={order.id}
                                    className={`bg-orange-50 border-orange-100 mb-4 cursor-pointer transition-transform duration-200 transform hover:scale-105 ${selectedOrderId === order.id ? "border-orange-500 ring-2 ring-orange-300" : ""}`}
                                    onClick={() => handleSelectOrder(order.id)}
                                >
                                    <CardContent className="py-4 space-y-2">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-orange-700 font-medium">
                                                    訂單編號：{order.order_unique_number}
                                                </p>
                                                <p className="text-orange-600">總金額：NT$ {order.total_price}</p>
                                            </div>
                                            <div className="flex items-center">{getStatusBadge(order.condition)}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* 詳細資料 */}
                    <div className="w-1/2 pl-6 flex flex-col">
                        <AnimatePresence>
                            {orderDetail && (
                                <motion.div
                                    key="order-detail"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.1 }}
                                    className="bg-orange-50 p-6 rounded-xl shadow-md flex-1 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-orange-700">訂單詳細</h3>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowDetail(false);
                                                setOrderDetail(null);
                                                setSelectedOrderId(null);
                                            }}
                                            className="text-sm"
                                        >
                                            ← 返回訂單列表
                                        </Button>
                                    </div>

                                    <div className="space-y-4 flex-1 overflow-auto pr-2">
                                        {orderDetail.items.map((item) => {
                                            const discount = item.discount;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4 border border-orange-200 rounded-xl p-3 items-center bg-white shadow-sm"
                                                >
                                                    <img
                                                        src={item.Item_images}
                                                        alt="商品圖片"
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="space-y-1">
                                                        <p className="text-orange-800 font-semibold">商品名稱：{item.name}</p>
                                                        {discount && discount.length > 0 ? (
                                                            <div className="space-y-0.5">
                                                                <p className="text-gray-500 text-sm line-through">
                                                                    原價：NT$ {item.price}
                                                                </p>
                                                                <p className="text-red-600 font-semibold">
                                                                    特價：NT$ {getDiscountedPrice(item.price, discount[0].discountNumber, discount[0].discountPercent)}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-800">單價：NT$ {item.price}</p>
                                                        )}
                                                        <p className="text-gray-700">數量：{item.amount}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <p className="text-right font-bold text-orange-700 mt-6">
                                        總金額：NT$ {orderDetail.totalPrice}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>

    );
}

export default OrdersPage;
