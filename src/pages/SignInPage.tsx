import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import signinImage from "@/assets/signin.jpg";
import accountApi from "@/api/AccountApi";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const SignInPage = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState<"username" | "email">("username");
    const location = useLocation();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (location.state?.from === "SignOut") {
            toast.success("登出成功，歡迎再度光臨！");
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload =
            loginType === "username"
                ? { username: formData.username, password: formData.password }
                : { email: formData.email, password: formData.password };

        try {
            const AccountApi = new accountApi(Cookies.get("token"));
            const res = await AccountApi.Signin(payload);

            if (res.status === "success") {
                const userData = res.data;
                Cookies.set("token", userData.token, {
                    expires: new Date(new Date().getTime() + 30 * 60 * 1000),
                });
                Cookies.set("username", userData.username);
                Cookies.set("permissions", userData.permissions.toString());
                Cookies.set("id", userData.id.toString());

                navigate("/", { state: { from: "login" } });
            } else {
                toast.error(res.data);
            }
        } catch (err) {
            console.error("API 錯誤：", err);
            toast.error("帳號或密碼錯誤");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* 圖片區塊 */}
                <div className="hidden md:block">
                    <img
                        src={signinImage}
                        alt="Login"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 表單區塊 */}
                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-orange-700 mb-4">歡迎回來</h2>

                    {/* 切換登入方式 */}
                    <div className="flex space-x-4 mb-6">
                        <Button
                            type="button"
                            variant={loginType === "username" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setLoginType("username")}
                        >
                            使用帳號
                        </Button>
                        <Button
                            type="button"
                            variant={loginType === "email" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setLoginType("email")}
                        >
                            使用信箱
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {loginType === "username" && (
                            <div>
                                <Label htmlFor="username" className="text-orange-800">
                                    帳號
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="輸入帳號"
                                    className="mt-2"
                                    required
                                />
                            </div>
                        )}

                        {loginType === "email" && (
                            <div>
                                <Label htmlFor="email" className="text-orange-800">
                                    電子信箱
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="輸入信箱"
                                    className="mt-2"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="password" className="text-orange-800">
                                密碼
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="輸入密碼"
                                className="mt-2"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-2 rounded-xl"
                        >
                            登入
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
