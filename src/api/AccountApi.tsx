import axios from "axios";
import type IExtendCookieExpireTime from "./IExtendCookieExpireTime";
import Cookies from "js-cookie";

class AccountApi implements IExtendCookieExpireTime {
    private axiosInstance: any;
    private token: string | undefined;
    constructor(insertToken?: string) {
        const baseUrl = import.meta.env.VITE_API_URL;
        this.token = insertToken
        this.axiosInstance = axios.create({
            baseURL: `${baseUrl}/api/account`,
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

    // 登入
    async Signin(payload: {}) {
        try {
            const res = await this.axiosInstance.post(`signIn`, payload);
            return res.data;
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

    // 登出
    async SignOut() {
        try {
            const res = await this.axiosInstance.post(`signOut`);
            return res.data;
        } catch (error) {
            console.error("登出錯誤", error);
            throw error;
        }
    }

    // 個人資料
    async profiles(id: number) {
        try {
            const res = await this.axiosInstance.get(`profiles?id=${id}`);
            return res.data;
        } catch (error) {
            console.error("個人資料錯誤", error);
            throw error;
        }
    }

}

export default AccountApi;