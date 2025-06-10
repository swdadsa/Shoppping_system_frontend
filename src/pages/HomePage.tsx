import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="space-y-16">
            {/* Hero Banner */}
            <section className="bg-orange-100 text-center py-20">
                <h1 className="text-4xl font-bold text-orange-700 mb-4">讓每一次購物都更溫暖</h1>
                <p className="text-orange-600 mb-6">發現你喜愛的每一樣商品</p>
                <Link to="/products">
                    <Button className="bg-orange-500 text-white hover:bg-orange-600">立即逛逛</Button>
                </Link>
            </section>

            {/* Promotions */}
            <section className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-orange-50 p-6 rounded-xl shadow">免運費</div>
                <div className="bg-orange-50 p-6 rounded-xl shadow">滿額折扣</div>
                <div className="bg-orange-50 p-6 rounded-xl shadow">新品上架</div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold text-orange-700 mb-4">快速選單</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {['服飾', '居家', '3C', '美妝'].map((cat) => (
                        <Link
                            to={`/products?category=${cat}`}
                            key={cat}
                            className="bg-orange-50 p-6 rounded-xl shadow hover:bg-orange-100"
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </section>

            {/* About Us */}
            <section className="bg-orange-50 py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-48 bg-orange-200 rounded-xl"></div>
                    <div>
                        <h3 className="text-xl font-semibold text-orange-700 mb-2">關於 SunnyShop</h3>
                        <p className="text-orange-600">
                            我們致力於打造一個溫暖、親切、充滿設計感的線上購物空間，讓每一次選購都能感受到細膩與美好。
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Items */}
            <section className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold text-orange-700 mb-4">精選商品</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((id) => (
                        <div key={id} className="bg-white rounded-xl shadow p-4">
                            <div className="bg-orange-100 h-32 mb-2 rounded"></div>
                            <h4 className="text-orange-700 font-medium">商品名稱</h4>
                            <p className="text-orange-500">$19.99</p>
                            <Button className="w-full mt-2 bg-orange-500 text-white hover:bg-orange-600">
                                加入購物車
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default HomePage