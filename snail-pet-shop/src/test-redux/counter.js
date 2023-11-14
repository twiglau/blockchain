import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
  decrement10,
} from "@/store/features/counterSlice";
const Counter = memo(() => {
  // 通过 useSelector 直接拿到 store 中定义的 value
  const { value } = useSelector((store) => store.counter);
  // 通过useDispatch 派发事件
  const dispatch = useDispatch();
  return (
    <div className="Counter">
      <h2>Counter计数器</h2>
      <p>{value}</p>
      <div className="actor">
        <button onClick={(e) => dispatch(increment())}>加一</button>
        <button onClick={(e) => dispatch(decrement())}>减一</button>
        <button onClick={(e) => dispatch(decrement10({ value: 10 }))}>
          减10
        </button>
      </div>
    </div>
  );
});

export default Counter;
