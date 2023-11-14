import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  totals: 0,
};

// 请求电影列表
const getMovieListApi = () =>
  fetch(
    "https://pcw-api.iqiyi.com/search/recommend/list?channel_id=1&data_type=1&mode=24&page_id=1&ret_num=48"
  ).then((res) => res.json());

// thunk函数允许执行异步逻辑, 通常用于发出异步请求
// createAsyncThunk 创建一个异步action, 方法触发的时候会有三种状态:
// pending(进行中), fulfilled(成功), rejected(失败)
export const getMovieData = createAsyncThunk(
  "movie/getMovie",
  async (params, { dispatch, getState }) => {
    const res = await getMovieListApi();
    // 2. 方法二: 直接使用dispatch修改store里的数据
    const list = res.data.list;
    const totals = list.length;
    dispatch(loadDataEnd({ list, totals }));
    return res;
  }
);

// 创建一个 slice
export const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    // 数据请求完成触发
    loadDataEnd: (state, { type, payload }) => {
      state.list = payload.list;
      state.totals = payload.totals;
    },
  },
  // 1. 方法一: 由 extraReducers 控制处理 异步 action
  // extraReducers 字段让 slice 可以处理在别处定义的 actions,
  // 包括由 createAsyncThunk 或其他slice生成的actions.
  extraReducers(builder) {
    builder
      .addCase(getMovieData.pending, (state) => {
        console.log("🚀 ~进行中! ");
      })
      .addCase(getMovieData.fulfilled, (state, { payload }) => {
        console.log("🚀 ~完成了! ", payload);
        // 不用dispatch loadDataEnd action
        // 这里可以直接完成数据更新
        const { list } = payload.data;
        state.list = list;
        state.totals = list.length;
      })
      .addCase(getMovieData.rejected, (state, err) => {
        console.log("🚀 ~rejected ", err);
      });
  },
});

// 导出方法
export const { loadDataEnd } = movieSlice.actions;
// 默认导出
export default movieSlice.reducer;
