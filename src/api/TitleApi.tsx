import axios from "axios";

class TitleApi {
    private axiosInstance: any;
    constructor() {
        const baseUrl = import.meta.env.VITE_API_URL;
        this.axiosInstance = axios.create({
            baseURL: `${baseUrl}/api`,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // 獲取主標題
    async getMainTitle() {
        try {
            const res = await this.axiosInstance.get(`mainTitle/index`);
            return res.data;
        } catch (error) {
            console.error("取得主標題錯誤", error);
            throw error;
        }
    }

    // 獲取標題
    async getIndexWithMainTitle() {
        try {
            const res = await this.axiosInstance.get(`subTitle/indexWithMainTitle`);
            return res.data.data;
        } catch (error) {
            console.error("取得標題錯誤", error);
            throw error;
        }

    }

}

export default new TitleApi();