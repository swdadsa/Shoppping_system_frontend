import axios from "axios";
import Cookies from "js-cookie";
import type IExtendCookieExpireTime from "./Interface/IExtendCookieExpireTime";

class CartApi implements IExtendCookieExpireTime {
    private axiosInstance: any;
    private token: string;
    constructor(insertToken: string) {
        const baseUrl = import.meta.env.VITE_API_URL;
        this.token = insertToken
        this.axiosInstance = axios.create({
            baseURL: `${baseUrl}/api/cart`,
            headers: {
                token: this.token,
                "Content-Type": "application/json",
            },
        });
    }

    // 延長cookie有效期
    extendCookieExpireTime() {
        const token = Cookies.get("token");
        if (token) {
            Cookies.set("token", token, { expires: new Date(new Date().getTime() + 30 * 60 * 1000) }); //30分後過期
        }
    }

    // 獲取購物車物品數量
    async getCartCount(user_id: number) {
        try {
            type Cart = {
                id: number;
                name: string;
                price: number;
                totalPrice: number;
                storage: number;
                images: [];
                amount: number;
                path: string

            };

            const res = await this.axiosInstance.get(`show?user_id=${user_id}`);
            let count: number = 0;

            // 計算總數
            if (res.data.data != null) {
                res.data.data.forEach((item: Cart) => {
                    count += item.amount
                })
            }
            console.log(count);

            return count;
        } catch (error) {
            console.error("取得商品清單錯誤", error);
            throw error;
        }

    }

    //加入購物車
    async addToCart(user_id: number, item_id: number, amount: number) {
        try {
            const res = await this.axiosInstance.post(`store`, { user_id: user_id, item_id: item_id, amount: amount });
            return res.data.data;
        } catch (error) {
            console.error("加入購物車錯誤", error);
            throw error;
        }
    }

    // 獲取購物車清單
    async getCart(user_id: number) {
        try {
            const res = await this.axiosInstance.get(`show?user_id=${user_id}`);
            return res.data.data;
        } catch (error) {
            console.error("取得購物車清單錯誤", error);
            throw error;
        }
    }

    // 更新購物車物品數量
    async updateCart(user_id: number, item_id: number, movement: string) {
        try {
            const res = await this.axiosInstance.patch(`update`, { user_id: user_id, item_id: item_id, movement: movement });
            return res.data.data;
        } catch (error) {
            console.error("更新購物車物品數量錯誤", error);
            throw error;
        }
    }

    // 移除購物車物品
    async removeFromCart(user_id: number, item_id: number) {
        try {
            const res = await this.axiosInstance.delete(`delete`, {
                data: { user_id: user_id, item_id: item_id }
            }); //刪除購物車物品
            return res.data.data;
        } catch (error) {
            console.error("移除購物車物品錯誤", error);
            throw error;
        }
    }

}

export default CartApi;