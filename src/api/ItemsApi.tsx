import axios from "axios";

class ItemsApi {
    private axiosInstance: any;
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "http://localhost:3000/api/items",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // 獲取商品清單
    async getItems() {
        try {
            const res = await this.axiosInstance.get(`index`);
            return res.data.data;
        } catch (error) {
            console.error("取得get", error);
            throw error;
        }
    }
}

export default new ItemsApi();