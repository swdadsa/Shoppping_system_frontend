import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import orderApi from "@/api/OrderApi";


type Order = {
    id: number;
    order_unique_number: string;
    condition: "0" | "1" | "2";
    total_price: string;
};

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
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

    return (
        <div className="max-w-3xl mx-auto mt-10 px-6 space-y-6">
            <h2 className="text-2xl font-bold text-orange-700 mb-4">我的訂單</h2>

            {orders.length === 0 ? (
                <p className="text-orange-600">目前沒有任何訂單。</p>
            ) : (
                orders.map((order) => (
                    <Card key={order.id} className="bg-orange-50 border-orange-100">
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
    );
}

export default OrdersPage;
