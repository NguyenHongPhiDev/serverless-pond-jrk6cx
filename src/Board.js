import React from "react";
import { useState } from "react";
import { useMemo } from "react";

const BOARD_SIZE = 500; // Kích thước tổng của bàn cờ
const CELL_SIZE = BOARD_SIZE / 9; // Kích thước mỗi ô
const RIVER_Y = CELL_SIZE * 4.5; // Vị trí sông
const PIECE_RADIUS = CELL_SIZE * 0.38; // Giảm bớt bán kính để không tràn ra ngoài

const initialPieces = [
  { x: 0, y: 0, text: "车", color: "red" },
  { x: 1, y: 0, text: "马", color: "red" },
  { x: 2, y: 0, text: "相", color: "red" },
  { x: 3, y: 0, text: "仕", color: "red" },
  { x: 4, y: 0, text: "帅", color: "red" },
  { x: 5, y: 0, text: "仕", color: "red" },
  { x: 6, y: 0, text: "相", color: "red" },
  { x: 7, y: 0, text: "马", color: "red" },
  { x: 8, y: 0, text: "车", color: "red" },
  { x: 1, y: 2, text: "炮", color: "red" },
  { x: 7, y: 2, text: "炮", color: "red" },
  { x: 0, y: 3, text: "兵", color: "red" },
  { x: 2, y: 3, text: "兵", color: "red" },
  { x: 4, y: 3, text: "兵", color: "red" },
  { x: 6, y: 3, text: "兵", color: "red" },
  { x: 8, y: 3, text: "兵", color: "red" },
  { x: 0, y: 9, text: "車", color: "black" },
  { x: 1, y: 9, text: "馬", color: "black" },
  { x: 2, y: 9, text: "象", color: "black" },
  { x: 3, y: 9, text: "士", color: "black" },
  { x: 4, y: 9, text: "将", color: "black" },
  { x: 5, y: 9, text: "士", color: "black" },
  { x: 6, y: 9, text: "象", color: "black" },
  { x: 7, y: 9, text: "馬", color: "black" },
  { x: 8, y: 9, text: "車", color: "black" },
  { x: 1, y: 7, text: "砲", color: "black" },
  { x: 7, y: 7, text: "砲", color: "black" },
  { x: 0, y: 6, text: "卒", color: "black" },
  { x: 2, y: 6, text: "卒", color: "black" },
  { x: 4, y: 6, text: "卒", color: "black" },
  { x: 6, y: 6, text: "卒", color: "black" },
  { x: 8, y: 6, text: "卒", color: "black" },
];

const Board = () => {
  const [pieces, setPieces] = useState(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState("red");
  const [validMoves, setValidMoves] = useState([]); // Danh sách các nước đi hợp lệ
  const [captureTargets, setCaptureTargets] = useState([]); // Quân có thể ăn
  const [history, setHistory] = useState([]); // Danh sách lưu lại lịch sử đi quân
  const [isSwapped, setIsSwapped] = useState(false); //Swap bàn cờ

  //RollBack
  const movePiece = (from, to) => {
    const newBoard = [...initialPieces]; // Copy bàn cờ
    newBoard[to] = newBoard[from];
    newBoard[from] = null;

    // Lưu trạng thái trước đó vào history
    setHistory([...history, initialPieces]);

    setPieces(newBoard);
    setValidMoves([]);
    setCaptureTargets([]);
    setTurn(turn === "red" ? "black" : "red");
  };

  //Swap bàn Cờ
  const getPieceColor = () => {
    if (isSwapped) {
      setPieces([...initialPieces]); // Quay lại bàn cờ ban đầu
    } else {
      const swappedBoard = initialPieces.map((piece) => ({
        ...piece,
        x: 8 - piece.x,
        y: 9 - piece.y,
      }));
      setPieces(swappedBoard);
    }
    setValidMoves([]);
    setCaptureTargets([]);
    setIsSwapped(!isSwapped); // Đảo trạng thái
    setTurn("red"); // Reset lượt đi
  };

  const getValidMoves = (piece) => {
    let moves = [];
    let targets = [];
    const { x, y, type, color } = piece;

    if (piece.text === "车" || piece.text === "車") {
      // Check hướng lên
      for (let i = x - 1; i >= 0; i--) {
        let targetPiece = pieces.find((p) => p.x === i && p.y === y);
        if (targetPiece) {
          if (targetPiece.color !== piece.color) {
            targets.push({ x: i, y: y }); // Quân địch -> có thể ăn
          }
          break; // Dừng dù là quân nào
        }
        moves.push({ x: i, y: y }); // Ô trống -> đi tiếp
      }

      // Check hướng xuống
      for (let i = x + 1; i < 10; i++) {
        let targetPiece = pieces.find((p) => p.x === i && p.y === y);
        if (targetPiece) {
          if (targetPiece.color !== piece.color) {
            targets.push({ x: i, y: y });
          }
          break;
        }
        moves.push({ x: i, y: y });
      }

      // Check hướng trái
      for (let j = y - 1; j >= 0; j--) {
        let targetPiece = pieces.find((p) => p.x === x && p.y === j);
        if (targetPiece) {
          if (targetPiece.color !== piece.color) {
            targets.push({ x: x, y: j });
          }
          break;
        }
        moves.push({ x: x, y: j });
      }

      // Check hướng phải
      for (let j = y + 1; j < 9; j++) {
        let targetPiece = pieces.find((p) => p.x === x && p.y === j);
        if (targetPiece) {
          if (targetPiece.color !== piece.color) {
            targets.push({ x: x, y: j });
          }
          break;
        }
        moves.push({ x: x, y: j });
      }
    } else if (piece.text === "炮" || piece.text === "砲") {
      // Duyệt 4 hướng
      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ].forEach(([dx, dy]) => {
        let hasJumped = false; // Kiểm tra đã nhảy qua 1 quân chưa
        for (let step = 1; step < 10; step++) {
          let nx = x + dx * step;
          let ny = y + dy * step;
          let target = pieces.find((p) => p.x === nx && p.y === ny);

          if (nx < 0 || nx >= 9 || ny < 0 || ny >= 10) break; // Không ra ngoài bàn cờ

          if (!target) {
            if (!hasJumped) moves.push({ x: nx, y: ny }); // Nếu chưa nhảy, thêm ô trống
          } else {
            if (!hasJumped) {
              hasJumped = true; // Nếu gặp quân cản, đánh dấu đã nhảy qua
            } else {
              if (target.color !== color) targets.push({ x: nx, y: ny }); // Nếu đã nhảy, ô tiếp theo là quân có thể ăn
              break; // Chỉ ăn được 1 quân rồi dừng
            }
          }
        }
      });
    }
    return { moves, targets };
  };

  // Xử lý khi click vào quân cờ
  const handlePieceClick = (piece) => {
    if (!selectedPiece) {
      if (piece.color !== turn) {
        console.log("Không phải lượt của bạn!");
        return;
      }
      const { moves, targets } = getValidMoves(piece);
      setSelectedPiece(piece);
      setValidMoves(moves); // Cập nhật nước đi hợp lệ
      setCaptureTargets(targets); // Cập nhật quân có thể ăn
      return;
    }

    const isValidMove = captureTargets.some(
      (move) => move.x === piece.x && move.y === piece.y
    );

    if (!isValidMove || selectedPiece === piece) {
      // Nếu không hợp lệ, hủy chọn quân cờ
      setSelectedPiece(null);
      setValidMoves([]);
      setCaptureTargets([]);
      return;
    }

    if (selectedPiece.color === piece.color) {
      // Chọn lại quân cùng màu
      const { moves, targets } = getValidMoves(piece);
      setSelectedPiece(piece);
      setValidMoves(moves);
      setCaptureTargets(targets);
    } else {
      // Kiểm tra xem có thể ăn quân này không
      if (captureTargets.some((m) => m.x === piece.x && m.y === piece.y)) {
        handleCapturePiece(piece);
        setValidMoves([]);
        setCaptureTargets([]);
      } else {
        console.log("Không thể ăn quân này!");
      }
    }
  };

  const handleCapturePiece = (targetPiece) => {
    const newPieces = pieces.filter((p) => p !== targetPiece);
    setPieces(
      newPieces.map((p) =>
        p === selectedPiece ? { ...p, x: targetPiece.x, y: targetPiece.y } : p
      )
    );

    setSelectedPiece(null);
    setValidMoves([]);
    setCaptureTargets([]);
    setTurn(turn === "red" ? "black" : "red"); // 🔥 Đổi lượt
  };

  // Xử lý khi click vào bàn cờ
  const handleBoardClick = (event) => {
    if (!selectedPiece) return;

    // Lấy tọa độ chính xác từ event
    const rect = event.currentTarget.getBoundingClientRect();
    const boardX = Math.round((event.clientX - rect.left) / CELL_SIZE);
    const boardY = Math.round((event.clientY - rect.top) / CELL_SIZE);

    // Cập nhật vị trí quân cờ
    const isValidMove = validMoves.some(
      (move) => move.x === boardX && move.y === boardY
    );

    if (!isValidMove) {
      // Nếu không hợp lệ, hủy chọn quân cờ
      setSelectedPiece(null);
      setValidMoves([]);
      setCaptureTargets([]);
      return;
    }

    setPieces((prev) =>
      prev.map((p) =>
        p === selectedPiece ? { ...p, x: boardX, y: boardY } : p
      )
    );

    setSelectedPiece(null);
    setValidMoves([]);
    setCaptureTargets([]);
    setTurn(turn === "red" ? "black" : "red"); // 🔥 Đổi lượt
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      {/* Thông báo lượt đi */}
      <div className="turn-indicator">
        <p style={{ color: turn === "red" ? "red" : "black" }}>
          Lượt đi của {turn === "red" ? "ĐỎ" : "ĐEN"}
        </p>
        <button onClick={movePiece}>Rollback</button>
        <button onClick={getPieceColor}>Reset & Swap</button>
      </div>
      <div
        style={{
          backgroundColor: "#f4d9b0",
          marginTop: "30px",
          padding: "15px",
          border: "5px solid #8b4513",
          borderRadius: "10px",
          boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <svg
          width={CELL_SIZE * 8} // 9 cột nhưng vẽ từ 0 nên chỉ cần 8 khoảng
          height={CELL_SIZE * 9} // 10 hàng nhưng vẽ từ 0 nên chỉ cần 9 khoảng
          viewBox={`-${CELL_SIZE / 2} -${CELL_SIZE / 2} ${CELL_SIZE * 9} ${
            CELL_SIZE * 10
          }`}
          onClick={handleBoardClick}
        >
          {/* Vẽ khung ngoài */}
          <rect
            x="0"
            y="0"
            width={CELL_SIZE * 8}
            height={CELL_SIZE * 9}
            fill="none"
            stroke="black"
            strokeWidth="4"
          />

          {/* Vẽ các đường dọc */}
          {[...Array(9)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={CELL_SIZE * i}
              y1={0}
              x2={CELL_SIZE * i}
              y2={BOARD_SIZE}
              stroke="black"
              strokeWidth="2"
            />
          ))}

          {/* Vẽ các đường ngang */}
          {[...Array(10)].map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={CELL_SIZE * i}
              x2={BOARD_SIZE - 65}
              y2={CELL_SIZE * i}
              stroke="black"
              strokeWidth="2"
            />
          ))}

          {/* Vẽ sông */}
          <text
            x={BOARD_SIZE / 2 - 35}
            y={RIVER_Y}
            fontSize="30"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
          >
            楚河 — 汉界
          </text>

          {/* Hiển thị ô có thể đi (màu xanh) */}
          {Array.isArray(validMoves) &&
            validMoves.map((pos, index) => (
              <circle
                key={`move-${index}`}
                cx={pos.x * CELL_SIZE}
                cy={pos.y * CELL_SIZE}
                r={10}
                fill="blue"
              />
            ))}

          {/* Vẽ quân cờ */}
          {pieces.map((p, index) => (
            <g
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện click lan lên bàn cờ
                handlePieceClick(p);
              }}
            >
              <circle
                cx={p.x * CELL_SIZE}
                cy={p.y * CELL_SIZE}
                r={PIECE_RADIUS}
                fill={selectedPiece === p ? "yellow" : "white"} // Hiển thị màu khi chọn
                stroke={p.color}
                strokeWidth="3"
                style={{
                  outline:
                    selectedPiece &&
                    selectedPiece.color !== p.color &&
                    captureTargets &&
                    Array.isArray(captureTargets) &&
                    captureTargets.some((m) => m.x === p.x && m.y === p.y)
                      ? "3px solid red"
                      : "none",
                }} // Quân có thể ăn -> Viền đỏ
              />
              <text
                x={p.x * CELL_SIZE}
                y={p.y * CELL_SIZE + 5} // Dịch xuống một chút để cân bằng
                fontSize="28"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={p.color}
              >
                {p.text}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Board;
