import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counterSlice";
import movieSlice from "./features/movieSlice";

// configureStore 创建一个redux数据
// 1. reducer: 将 slice 中的 reducer 可以组成一个对象传入
// 2. middleware: 可以使用参数, 传入其他的中间件
// 3. devTools: 是否配置devTools工具, 默认为true
const store = configureStore({
  // 合并多个 Slice
  reducer: {
    counter: counterSlice,
    movie: movieSlice,
  },
  devTools: true,
});

export default store;

/**
 * Redux Toolkit的核心API主要是如下几个:
 * 1. configureStore: 包装createStore以提供简化的配置选项和良好的默认值. 它可以自动组合你的 slice reducer, 添加你提供的任何 Redux 中间件;
 * 其中, redux-thunk 默认包含, 并默认启用 Redux DevTools Extension.
 * 2. createSlice: 接受 reducer 函数的对象, 切换名称和初始状态值, 并自动生成切片 reducer, 并带有响应的 actions.
 * 3. createAsyncThunk: 接受一个动作类型字符串和一个返回承诺的函数, 并生成一个 pending/fulfilled/rejected基于该承诺分派动作类型的 thunk.
 */
