import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import accountApi from "@/api/AccountApi";

type AccountData = {
    id: number;
    username: string;
    email: string;
    permissions: number;
    isVerified: "0" | "1";
};

export default function ProfilePage() {
    const [user, setUser] = useState<AccountData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/signIn");
            return;
        }

        const AccountApi = new accountApi(token);
        // 取得帳戶資料
        AccountApi.profiles(Number(Cookies.get("id")))
            .then((res) => {
                if (res.status === "success") {
                    setUser(res.data);
                } else {
                    toast.error("Api 錯誤，請重新登入");
                    Cookies.remove("token");
                    navigate("/signIn");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("無法取得使用者資料，請重新登入");
                Cookies.remove("token");
                navigate("/signIn");
            });
    }, []);

    if (!user) {
        return <div className="p-6 text-orange-700">載入中...</div>;
    }

    return (
        <div className="max-w-xl mx-auto mt-10 px-6">
            <Card className="bg-orange-50 border-orange-100">
                <CardContent className="py-6 space-y-6">
                    <h2 className="text-2xl font-bold text-orange-700 mb-4">帳戶資訊</h2>

                    <div className="text-orange-800 space-y-3">
                        <div><span className="font-semibold">使用者名稱：</span>{user.username}</div>
                        <div><span className="font-semibold">Email：</span>{user.email}</div>
                        <div>
                            <span className="font-semibold">帳號驗證：</span>
                            {user.isVerified === "1" ? (
                                <Badge className="bg-green-600">已驗證</Badge>
                            ) : (
                                <Badge variant="destructive">未驗證</Badge>
                            )}
                        </div>
                        <div>
                            <span className="font-semibold">權限等級：</span>
                            {user.permissions === 1 ? "管理員" : "一般使用者"}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => navigate("/")}>
                            回首頁
                        </Button>
                        <Button onClick={() => navigate("/change-password")}>
                            更改密碼
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
