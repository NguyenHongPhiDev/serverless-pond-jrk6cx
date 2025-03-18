import React, { useState } from "react";
import "./Xiangqi.css";
import Board from "./Board";
const Xiangqi = () => {
  return (
    <div>
      <h1>Cờ Tướng</h1>
      <Board size={600} />
    </div>
  );
};
export default Xiangqi;
