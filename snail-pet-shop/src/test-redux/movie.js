import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovieData } from "@/store/features/movieSlice";
const Movice = memo(() => {
  const { list, totals } = useSelector((state) => state.movie);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMovieData());
  }, [dispatch]);
  return (
    <div>
      <h2>电影总条数: {totals}</h2>
      {list.map((ele) => (
        <p key={ele.tvId}>{ele.name}</p>
      ))}
    </div>
  );
});

export default Movice;
