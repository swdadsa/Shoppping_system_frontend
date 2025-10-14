import { useEffect, useState } from "react";
import cartApi from "@/api/CartApi";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { getDiscountedPrice } from "@/utils/discountUtils";
import { useNavigate } from "react-router-dom";

type Discount = {
    id: number;
    startAt: string;
    endAt: string;
    discountNumber: number;
    discountPercent: number;
};

type CartItem = {
    id: number;
    name: string;
    price: number;
    totalPrice: number;
    storage: number;
    images: { path: string }[];
    amount: number;
    discount: Discount[];
    path: string;
};

type ProductsPageProps = {
    onCartCountChange?: (count: number) => void;
};

const CartPage = ({ onCartCountChange }: ProductsPageProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [updatingItems, setUpdatingItems] = useState<{ [key: number]: boolean }>({});
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (token && userId) {
            const CartApi = new cartApi(token);
            CartApi.getCart(Number(userId))
                .then((res) => {
                    setCartItems(res);
                    updateTotal(res);
                })
                .catch((err) => {
                    console.error("取得購物車失敗", err);
                });
        }

    }, []);

    const updateTotal = (items: CartItem[]) => {
        const newTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotal(newTotal);
    };

    const handleQuantityChange = async (itemId: number, movement: "+" | "-") => {
        if (updatingItems[itemId]) return; // 已鎖定

        setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (!token || !userId) return;

        const CartApi = new cartApi(token);

        try {
            await CartApi.updateCart(Number(userId), itemId, movement);
            const updatedCart = await CartApi.getCart(Number(userId));
            setCartItems(updatedCart);
            updateTotal(updatedCart);

            // 取得最新購物車數量並傳給 Header
            CartApi.getCartCount(Number(userId)).then((count: number) => {
                if (onCartCountChange) {
                    onCartCountChange(count);
                }
            });
        } catch (err) {
            console.error("更新購物車數量錯誤", err);
        } finally {
            setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
        }
    };



    const handleRemoveItem = async (itemId: number) => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (!token || !userId) return;

        const CartApi = new cartApi(token);

        try {
            await CartApi.removeFromCart(Number(userId), itemId);
            const updatedCart = await CartApi.getCart(Number(userId));
            setCartItems(updatedCart);
            updateTotal(updatedCart);

            // 取得最新購物車數量並傳給 Header
            CartApi.getCartCount(Number(userId)).then((count: number) => {
                if (onCartCountChange) {
                    onCartCountChange(count);
                }
            });
        } catch (err) {
            console.error("移除購物車項目錯誤", err);
        }
    };

    // handelcheckout 傳送資料智付款介面
    const handleCheckout = () => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        if (!token || !userId) {
            navigate("/signIn");
            return;
        }
        const payload = {
            user_id: Number(userId),
            total_price: total,
            item: cartItems.map((item) => ({
                id: item.id,
                amount: item.amount,
            })),
        };

        localStorage.setItem("checkoutData", JSON.stringify(payload));
        navigate("/payment")
    };


    useEffect(() => {
        updateTotal(cartItems);
    }, [cartItems]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-orange-700 mb-6">購物車</h1>

            {cartItems.length === 0 ? (
                <p className="text-orange-500">目前這裡空空如也。</p>
            ) : (
                <>
                    <div className="grid gap-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 border rounded-2xl bg-orange-50 shadow-sm"
                            >
                                <img
                                    src={item.path}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h2 className="font-semibold text-orange-800 text-lg">{item.name}</h2>
                                    {
                                        item.discount && item.discount.length > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 line-through">原價：NT$ {item.price}</p>
                                                <p className="text-red-600 font-semibold text-base">特價：NT$ {getDiscountedPrice(item.price, item.discount[0].discountNumber, item.discount[0].discountPercent)}</p>
                                            </div>
                                        ) : (
                                            <p className="text-orange-600">單價：NT$ {item.price}</p>
                                        )
                                    }

                                    <div className="flex items-center gap-2 mt-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            disabled={updatingItems[item.id]}
                                            onClick={() => handleQuantityChange(item.id, '-')}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="px-2">{item.amount}</span>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            disabled={updatingItems[item.id]}
                                            onClick={() => handleQuantityChange(item.id, '+')}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-orange-700 font-bold whitespace-nowrap">
                                    NT$ {item.totalPrice}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    <Trash2 className="text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-8 border-t pt-6">
                        <div className="text-xl font-bold text-orange-700">
                            總金額：NT$ {total}
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
                            onClick={() => handleCheckout()}>
                            前往結帳
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
