import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import accountApi from "@/api/AccountApi";
import linepayApi from "@/api/LinepayApi";

type UserInfo = {
    username: string;
    email: string;
};

function PaymentPage() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [address, setAddress] = useState("");
    const [total, setTotal] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkoutData = localStorage.getItem("checkoutData");
        if (!checkoutData) {
            toast.error("找不到結帳資料");
            return;
        }
        const payload = JSON.parse(checkoutData);
        setTotal(Number(payload.total_price) || 0);
        handleUserinfo();
    }, []);

    const handleUserinfo = async () => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");
        if (!token || !userId) {
            navigate("/signIn");
            return;
        }

        const AccountApi = new accountApi(token);
        const res = await AccountApi.profiles(Number(userId))

        if (res.status === "success") {
            setUser(res.data);
        }
    }

    const handleLinePay = async () => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (!token || !userId) return;

        try {
            const checkoutData = localStorage.getItem("checkoutData");
            if (!checkoutData) {
                toast.error("找不到結帳資料");
                return;
            }

            const payload = JSON.parse(checkoutData);
            //payload.address = address; // 加上使用者輸入的地址（若後端有需要可保留）
            const encodedPayload = encodeURIComponent(JSON.stringify(payload));// 編碼 用於傳送
            const LinepayApi = new linepayApi(token);
            const res = await LinepayApi.request(encodedPayload);

            if (res.status === "success") {
                window.location.href = res.data;
            } else {
                toast.error("初始化 LINE Pay 失敗");
                console.error(res);
            }
        } catch (error) {
            console.error(error);
            toast.error("呼叫 LINE Pay 錯誤");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-orange-50 rounded-2xl shadow-lg mt-10">
            <h1 className="text-3xl font-bold text-orange-700 mb-6">結帳頁面</h1>

            {user ? (
                <div className="space-y-6">
                    {/* 使用者資料卡 */}
                    <Card className="border-orange-200 bg-white">
                        <CardContent className="p-6 space-y-3">
                            <h2 className="text-xl font-semibold text-orange-700 mb-2">訂購人資料</h2>
                            <p>姓名：{user.username}</p>
                            <p>電子郵件：{user.email}</p>

                            <div className="mt-3">
                                <label className="block text-sm font-medium text-orange-700 mb-1">
                                    收件地址：
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="請輸入您的地址"
                                    className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 總金額 */}
                    <Card className="border-orange-200 bg-white">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold text-orange-700 mb-2">付款金額</h2>
                            <p className="text-2xl text-orange-800 font-bold">NT$ {total}</p>
                        </CardContent>
                    </Card>

                    {/* 付款方式 */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-orange-700 mb-4">選擇付款方式</h2>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg"
                            onClick={handleLinePay}
                        >
                            使用 LINE Pay 付款
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-orange-600">載入中...</p>
            )}
        </div>
    );
}

export default PaymentPage;