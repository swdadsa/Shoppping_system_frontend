import axios from "axios";
import Cookies from "js-cookie";
import type IExtendCookieExpireTime from "./Interface/IExtendCookieExpireTime";
import dayjs from 'dayjs';

class ItemsApi implements IExtendCookieExpireTime {
    private axiosInstance: any;
    constructor() {
        const baseUrl = import.meta.env.VITE_API_URL;
        this.axiosInstance = axios.create({
            baseURL: `${baseUrl}/api/items`,
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

    // 獲取商品清單
    async getItems(sub_title_id?: number, searchKeyword?: string) {
        try {
            const date = dayjs().format('YYYY-MM-DD');

            let searchURL = `index?date=${date}`
            if (sub_title_id) {
                searchURL += `&sub_title_id=${sub_title_id}`
            }
            if (searchKeyword) {
                searchURL += `&searchKeyword=${searchKeyword}`
            }

            const res = await this.axiosInstance.get(searchURL);
            return res.data.data;

        } catch (error) {
            console.error("取得商品清單錯誤", error);
            throw error;
        }
    }

    // 獲取商品詳細資料
    async getItemDetail(id: string) {
        try {
            const res = await this.axiosInstance.get(`show?id=${id}`);
            return res.data.data;
        } catch (error) {
            console.error("取得商品詳細資料錯誤", error);
            throw error;
        }
    }
}

export default new ItemsApi();