import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import linepayApi from "@/api/LinepayApi";

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [resultCode, setResultCode] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const transactionId = searchParams.get("transactionId");
        const token = Cookies.get("token");

        if (!transactionId) {
            toast.error("無法取得交易編號");
            navigate("/");
            return;
        }

        if (!token) {
            toast.error("登入逾時，請重新登入");
            navigate("/signIn");
            return;
        }

        const fetchResult = async () => {
            try {
                const LinepayApi = new linepayApi(token);
                const res = await LinepayApi.check(transactionId);

                if (res.status === "success") {
                    const code = res.data.raw.returnCode;
                    setResultCode(code);

                    switch (code) {
                        case "0110":
                            setMessage("LINE Pay 認證完成，等待付款授權。");
                            break;
                        case "0121":
                            setMessage("您已取消付款或付款逾時。");
                            break;
                        case "0122":
                            setMessage("付款失敗，請稍後再試。");
                            break;
                        case "0123":
                            setMessage("付款完成！感謝您的購買");
                            break;
                        default:
                            setMessage("未知的交易狀態，請聯絡客服。");
                    }
                } else {
                    setMessage("查詢失敗，請稍後再試。");
                }
            } catch (error) {
                console.error(error);
                toast.error("查詢付款狀態時發生錯誤");
                setMessage("伺服器錯誤，請稍後再試。");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-orange-700">
                <div className="animate-spin border-4 border-orange-400 border-t-transparent rounded-full w-12 h-12 mb-4"></div>
                <p className="text-lg">正在確認付款狀態...</p>
            </div>
        );
    }

    const renderIcon = () => {
        switch (resultCode) {
            case "0110":
                return <Clock className="text-yellow-500 w-20 h-20" />;
            case "0121":
                return <AlertCircle className="text-gray-500 w-20 h-20" />;
            case "0122":
                return <XCircle className="text-red-600 w-20 h-20" />;
            case "0123":
                return <CheckCircle className="text-green-600 w-20 h-20" />;
            default:
                return <AlertCircle className="text-gray-500 w-20 h-20" />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
            {renderIcon()}
            <h1 className="text-2xl font-bold text-orange-700">付款結果</h1>
            <p className="text-lg text-gray-600">{message}</p>
            <div className="flex gap-4 mt-4">
                <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => navigate("/")}
                >
                    返回首頁
                </Button>
                {resultCode === "0123" && (
                    <Button variant="outline" onClick={() => navigate("/orders")}>
                        查看訂單
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PaymentResultPage;
