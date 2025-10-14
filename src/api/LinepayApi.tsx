import axios from "axios";

class LinepayApi {
    private axiosInstance: any;
    private token: string;

    constructor(insertToken: string) {
        this.token = insertToken
        const baseUrl = import.meta.env.VITE_API_URL;
        this.axiosInstance = axios.create({
            baseURL: `${baseUrl}/api/linepay`,
            headers: {
                token: this.token,
                "Content-Type": "application/json",
            },
        });
    }

    // linepay 付款API
    async request(payload: String) {
        const res = await this.axiosInstance.post("/request", { payload: payload });
        return res.data
    }


    // 檢查付款狀態 check API
    async check(transactionId: string) {
        const res = await this.axiosInstance.get(`/check?transactionId=${transactionId}`);
        return res.data
    }


}

export default LinepayApi;