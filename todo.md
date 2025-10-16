## Redux 導入後續 TODO

### 1. 購物車整合（高優先）
- [ ] 建立 `cartSlice` 的完整狀態（`items`、`total`、`status`、`error`）。
- [ ] 實作 thunk：`fetchCart`、`updateCartItem`、`removeCartItem`，統一呼叫 `CartApi`。
- [ ] `CartPage` 全面改用 `useAppSelector` 與 dispatch thunk，移除頁面中的 API 呼叫與本地 `setCartItems`。
- [ ] Header 及其他頁面只需依賴 `cartSlice` 的 `count` 或 `items`。

### 2. 商品頁面加入購物車流程（高優先）
- [ ] 在 `cartSlice` 新增 `addToCart` thunk，處理登入檢查、成功/失敗訊息（與 UI slice 或 toast 整合）。
- [ ] `HomePage` (`src/pages/HomePage.tsx:57`) 及 `ProductDetailPage` (`src/pages/ProductDetailPage.tsx:89`) 改為 dispatch `addToCart`，避免重複 Cookie 檢查與 `CartApi.getCartCount`。
- [ ] 重新檢視 `ProductsPage` 的加入購物車按鈕，確保統一流程。

### 3. Auth 狀態集中管理（中優先）
- [ ] 建立 `authSlice`（狀態：`user`、`token`、`status`）。
- [ ] 新增 `signin`, `signout`, `refreshProfile` thunk；統一管理 Cookies、錯誤訊息。
- [ ] `Header` (`src/components/Header.tsx`) 和 `SignInPage` (`src/pages/SignInPage.tsx`) 改為使用 Redux 供應的登入狀態與動作，避免分散的 Cookie 操作。

### 4. Checkout/付款流程（中優先）
- [ ] 規劃 `checkoutSlice` 或擴充 `cartSlice` 管理 `checkoutData`，避免依賴 `localStorage`。
- [ ] `PaymentPage`（`src/pages/PaymentPage.tsx:22`）改用 Redux 取得總金額、購物車內容與收件資訊。
- [ ] 視需求加入 `PaymentResultPage` 的查詢結果狀態，集中紀錄交易回覆。

### 5. 商品資料與篩選（可視需求）
- [ ] 建立 `productsSlice` 管理列表、分類、搜尋 keyword、載入狀態。
- [ ] `ProductsPage`、`HomePage` 共用該 slice，避免重複呼叫 `ItemsApi`。

### 6. UI 狀態延伸（可視需求）
- [ ] 擴充現有的 `uiSlice`，統一管理 loading、dialog（如 `SignInOrSignUp` 彈窗）、全域主題等。

> 備註：`npm run build` 目前會報未使用參數警告（`CartApi.tsx`、`PaymentPage.tsx`），可於重構時一併調整。
