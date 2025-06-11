import axios from "axios";
import type IExtendCookieExpireTime from "./IExtendCookieExpireTime";
import Cookies from "js-cookie";

class AccountApi implements IExtendCookieExpireTime {
    private axiosInstance: any;
    constructor() {
        const baseUrl = import.meta.env.VITE_API_URL;
        this.axiosInstance = axios.create({
            baseURL: `${baseUrl}/api/account`,
            headers: {
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

    // 登入
    async Signin(payload: {}) {
        try {
            const res = await this.axiosInstance.post(`signIn`, payload);
            return res.data.data;
        } catch (error) {
            console.error("登入錯誤", error);
            throw error;
        }
    }

    // 註冊
    async SignUp(payload: {}) {
        try {
            const res = await this.axiosInstance.post(`signUp`, payload);
            return res.data;
        } catch (error) {
            console.error("註冊錯誤", error);
            throw error;
        }
    }

}

export default new AccountApi();