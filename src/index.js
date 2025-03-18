import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Xiangqi from "./Xiangqi";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Xiangqi />
  </StrictMode>
);
