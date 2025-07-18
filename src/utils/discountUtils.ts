/**
 * 根據有效折扣計算最終價格
 */
export function getDiscountedPrice(originalPrice: number, discountNumber: number | null, discountPercent: number | null): number {
    let finalPrice = originalPrice;

    if (discountNumber !== null) {
        finalPrice -= discountNumber;
        console.log(`discountNumber : ${finalPrice}`)
        return finalPrice;
    }

    if (discountPercent !== null) {
        finalPrice = Math.floor(finalPrice * (1 - discountPercent / 100));
        console.log(`discountPercent : ${finalPrice}`)
        return finalPrice;
    }

    return originalPrice;
}
