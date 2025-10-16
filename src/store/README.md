Redux 使用說明（Option A：thunk 包現有 API）

結構
- `src/store/store.ts`：建立 `store` 與 reducer 組合
- `src/store/index.ts`：輸出 `store`、`RootState`、`AppDispatch`
- `src/store/hooks.ts`：型別化 hooks（`useAppDispatch`、`useAppSelector`）
- `src/store/slices/cartSlice.ts`：購物車計數 + `fetchCartCount` thunk
- `src/store/slices/uiSlice.ts`：全域 UI 狀態（loading/theme）

在元件中使用
- 讀取 state：`const count = useAppSelector((s) => s.cart.count)`
- 發送 thunk：`dispatch(fetchCartCount())`

整合策略（A）
- 保留 `src/api/*Api.tsx`，在 `createAsyncThunk` 內呼叫（例：`CartApi.getCartCount`）
- 逐步將頁面更新/刪除後的「重抓資料」改為派發 thunk，避免頁面自行處理 loading 與錯誤

備註
- 本專案未使用 `redux-persist`，登入/會話維持交由 Cookie 與現有流程管理。
