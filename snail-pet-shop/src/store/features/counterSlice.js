import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  title: "redux toolkit pre",
};
// 创建一个 slice
// 1. name: 用户标记的slice的名词: 在之后的 redux-devtool中会显示对应的名词;
// 2. initialState: 初始化值, 第一次初始化时的值;
// 3. reducers: 相当于之前的 reducer函数
// 解释: 对象类型,并且可以添加很多的函数; 函数类似于redux原来reducer中的一个case语句;
// 函数的参数:
// 参数一: state
// 参数二: 调用这个action时, 传递的action参数;
// 4. createSlice返回值是一个对象, 包含说有的actions;
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // 定义 reducers, 并生成关联的操作
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    decrement10: (state, { payload }) => {
      // action 里面有 type 和 payload 两个属性, 所有的参数都在 payload里面
      state.value -= payload.value;
    },
  },
});

// 导出加减的方法
export const { increment, decrement, decrement10 } = counterSlice.actions;
// 默认导出
export default counterSlice.reducer;
