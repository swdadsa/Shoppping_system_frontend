
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getDiscountedPrice } from "@/utils/discountUtils";


type Discount = {
    id: number;
    item_id: number;
    startAt: string;
    endAt: string;
    discountNumber: number;
    discountPercent: number;
};

type ProductCardProps = {
    id: number;
    name: string;
    price: number;
    image: string;
    discounts?: Discount[];
    onAddToCart?: (id: number) => void;
    clickable?: boolean;
};

const ProductCard = ({ id, name, price, image, discounts, onAddToCart, clickable = true }: ProductCardProps) => {
    const navigate = useNavigate();
    const now = new Date();

    const activeDiscount = discounts?.find((d) => {
        const start = new Date(d.startAt);
        const end = new Date(d.endAt);
        return start <= now && now <= end;
    });

    const discountedPrice = activeDiscount ? getDiscountedPrice(price, activeDiscount.discountNumber, activeDiscount.discountPercent) : null;

    const handleClick = () => {
        if (clickable) {
            navigate(`/products/${id}`);
        }
    };

    return (
        <div
            className={`bg-white rounded-xl shadow hover:shadow-lg transform transition-transform duration-200 hover:scale-105 p-4 ${clickable ? "cursor-pointer" : ""}`}
            onClick={handleClick}
        >
            <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold text-orange-800">{name}</h3>
            {discountedPrice !== null ? (
                <p className="text-orange-800">
                    🔥 特價 NT$ {discountedPrice}
                    <span className="text-gray-500 line-through ml-2 text-sm">NT$ {price}</span>
                </p>
            ) : (
                <p className="text-orange-600">NT$ {price}</p>
            )}

            {onAddToCart && (
                <Button
                    className="w-full mt-2 bg-orange-500 text-white hover:bg-orange-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(id);
                    }}
                >
                    加入購物車
                </Button>
            )}
        </div>
    );
};

export default ProductCard;
