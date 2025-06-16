import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import accountApi from "@/api/AccountApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


type AccountData = {
    id: number;
    username: string;
    email: string;
    permissions: number;
    isVerified: "0" | "1";
};

function ProfilePage() {
    const [user, setUser] = useState<AccountData | null>(null);
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);


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
                            {user.permissions === 0 ? "管理員" : "一般使用者"}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => navigate("/")}>
                            回首頁
                        </Button>
                        <Button onClick={() => setDialogOpen(true)}>
                            更改密碼
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>修改密碼</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="oldPassword">舊密碼</Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="newPassword">新密碼</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            取消
                        </Button>
                        <Button
                            disabled={loading}
                            onClick={async () => {
                                if (!oldPassword || !newPassword) {
                                    toast.error("請輸入舊密碼與新密碼");
                                    return;
                                }

                                setLoading(true);

                                try {
                                    const token = Cookies.get("token");
                                    const AccountApi = new accountApi(token!);

                                    const res = await AccountApi.updatePassword({
                                        oldPassword,
                                        newPassword,
                                    });

                                    if (res.status === "success") {
                                        toast.success("密碼修改成功，下次登入請使用新密碼!");
                                        setDialogOpen(false);
                                        setOldPassword("");
                                        setNewPassword("");
                                    } else {
                                        toast.error(res.message || "密碼修改失敗");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    toast.error("伺服器錯誤，請稍後再試");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {loading ? "儲存中..." : "送出"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    );
}

export default ProfilePage;