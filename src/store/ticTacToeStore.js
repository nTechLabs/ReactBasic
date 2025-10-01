import { create } from 'zustand';

// 승리 조건을 체크하는 헬퍼 함수
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], // 첫 번째 행
    [3, 4, 5], // 두 번째 행  
    [6, 7, 8], // 세 번째 행
    [0, 3, 6], // 첫 번째 열
    [1, 4, 7], // 두 번째 열
    [2, 5, 8], // 세 번째 열
    [0, 4, 8], // 대각선
    [2, 4, 6]  // 반대 대각선
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningLine: line
      };
    }
  }

  return null;
};

// 보드가 가득 찼는지 체크하는 함수
const isBoardFull = (board) => {
  return board.every(square => square !== null);
};

// Zustand 스토어 생성
export const useTicTacToeStore = create((set, get) => ({
  // 🎮 게임 상태
  board: Array(9).fill(null), // 3x3 보드 (null, 'X', 'O')
  currentPlayer: 'X', // 현재 플레이어
  winner: null, // 승자 ('X', 'O', 'draw', null)
  winningLine: [], // 승리한 라인의 인덱스들
  gameOver: false, // 게임 종료 여부
  moveHistory: [], // 수순 기록
  
  // 🎯 게임 액션들
  
  // 셀을 클릭했을 때 실행되는 함수
  makeMove: (index) => {
    const { board, currentPlayer, gameOver } = get();
    
    // 게임이 끝났거나 해당 칸이 이미 차있으면 무시
    if (gameOver || board[index]) {
      return;
    }

    // 새로운 보드 생성
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    
    // 승자 체크
    const winResult = checkWinner(newBoard);
    const isDraw = !winResult && isBoardFull(newBoard);
    
    // 상태 업데이트
    set((state) => ({
      board: newBoard,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      winner: winResult ? winResult.winner : (isDraw ? 'draw' : null),
      winningLine: winResult ? winResult.winningLine : [],
      gameOver: winResult || isDraw,
      moveHistory: [
        ...state.moveHistory,
        {
          player: currentPlayer,
          position: index,
          move: state.moveHistory.length + 1
        }
      ]
    }));
  },

  // 게임을 초기화하는 함수
  resetGame: () => {
    set({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winningLine: [],
      gameOver: false,
      moveHistory: []
    });
  },

  // 마지막 수를 되돌리는 함수 (선택사항)
  undoMove: () => {
    const { moveHistory } = get();
    if (moveHistory.length === 0) return;

    const newHistory = moveHistory.slice(0, -1);
    const newBoard = Array(9).fill(null);
    
    // 히스토리를 기반으로 보드 재구성
    newHistory.forEach(move => {
      newBoard[move.position] = move.player;
    });

    // 현재 플레이어 결정
    const currentPlayer = newHistory.length % 2 === 0 ? 'X' : 'O';
    
    // 승자 체크
    const winResult = checkWinner(newBoard);
    const isDraw = !winResult && isBoardFull(newBoard);

    set({
      board: newBoard,
      currentPlayer,
      winner: winResult ? winResult.winner : (isDraw ? 'draw' : null),
      winningLine: winResult ? winResult.winningLine : [],
      gameOver: winResult || isDraw,
      moveHistory: newHistory
    });
  },

  // 게임 통계 (선택사항)
  getGameStats: () => {
    const { moveHistory, winner } = get();
    return {
      totalMoves: moveHistory.length,
      winner,
      xMoves: moveHistory.filter(move => move.player === 'X').length,
      oMoves: moveHistory.filter(move => move.player === 'O').length
    };
  }
}));