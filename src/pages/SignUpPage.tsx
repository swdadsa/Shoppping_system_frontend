import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("密碼與確認密碼不一致");
            return;
        }

        try {
            // TODO: 替換為實際 API 呼叫
            console.log("提交註冊資料：", form);
            navigate("/login");
        } catch (err) {
            setError("註冊失敗，請稍後再試");
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg rounded-2xl border-orange-200">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold text-orange-700 mb-6 text-center">註冊帳號</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-orange-800">姓名</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-orange-800">電子郵件</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-orange-800">密碼</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-orange-800">確認密碼</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                            建立帳號
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpPage;
