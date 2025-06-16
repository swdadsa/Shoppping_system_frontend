import axios from "axios";
import Cookies from "js-cookie";
import type IExtendCookieExpireTime from "./IExtendCookieExpireTime";

class OrderApi implements IExtendCookieExpireTime {
    private axiosInstance: any;
    private token: string | undefined
    constructor(token?: string) {
        const baseUrl = import.meta.env.VITE_API_URL;
        this.token = token
        this.axiosInstance = axios.create({
            baseURL: `${baseUrl}/api/orderList`,
            headers: {
                "Content-Type": "application/json",
                token: this.token || "",
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

    // 訂單列表
    async getOrderList(user_id: number) {
        try {
            const res = await this.axiosInstance.get(`index?user_id=${user_id}`);
            return res.data;
        } catch (error) {
            console.error("修改密碼錯誤", error);
            throw error;
        }

    }
}

export default OrderApi;