import React from 'react';
import { Typography, Card, Space, Button, Badge, Divider } from 'antd';
import { useTicTacToeStore } from '../../../store/ticTacToeStore';
import './ticTacToe.css';

const { Title, Text } = Typography;

// 🎲 게임 셀 컴포넌트
const GameCell = ({ index, value, isWinning, onClick }) => {
  return (
    <button
      className={`game-cell ${value ? 'filled' : 'empty'} ${isWinning ? 'winning' : ''} ${value === 'X' ? 'player-x' : value === 'O' ? 'player-o' : ''}`}
      onClick={() => onClick(index)}
      disabled={value !== null}
    >
      {value}
    </button>
  );
};

// 🎮 게임 보드 컴포넌트
const GameBoard = () => {
  const { board, winningLine, makeMove } = useTicTacToeStore();

  return (
    <div className="game-board">
      {board.map((value, index) => (
        <GameCell
          key={index}
          index={index}
          value={value}
          isWinning={winningLine.includes(index)}
          onClick={makeMove}
        />
      ))}
    </div>
  );
};

// 📊 게임 상태 정보 컴포넌트
const GameStatus = () => {
  const { currentPlayer, winner, getGameStats } = useTicTacToeStore();
  const stats = getGameStats();

  const getStatusMessage = () => {
    if (winner === 'draw') {
      return '🤝 무승부!';
    } else if (winner) {
      return `🎉 ${winner} 승리!`;
    } else {
      return `🎯 ${currentPlayer}의 차례`;
    }
  };

  const getStatusColor = () => {
    if (winner === 'draw') return 'orange';
    if (winner) return 'green';
    return currentPlayer === 'X' ? 'blue' : 'red';
  };

  return (
    <Card className="game-status-card">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Badge 
            color={getStatusColor()} 
            text={
              <Title level={4} style={{ margin: 0, color: getStatusColor() }}>
                {getStatusMessage()}
              </Title>
            } 
          />
        </div>
        
        <Divider style={{ margin: '8px 0' }} />
        
        <div className="game-stats">
          <Space size="large">
            <Text><strong>총 수:</strong> {stats.totalMoves}</Text>
            <Text><strong>X:</strong> {stats.xMoves}수</Text>
            <Text><strong>O:</strong> {stats.oMoves}수</Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

// 🎮 게임 컨트롤 버튼들
const GameControls = () => {
  const { resetGame, undoMove, moveHistory } = useTicTacToeStore();

  return (
    <Card className="game-controls-card">
      <Space size="middle">
        <Button 
          type="primary" 
          onClick={resetGame}
          size="large"
        >
          🔄 새 게임
        </Button>
        
        <Button 
          onClick={undoMove}
          disabled={moveHistory.length === 0}
          size="large"
        >
          ↶ 되돌리기
        </Button>
        
        <Badge count={moveHistory.length} color="blue">
          <Button disabled size="large">
            📝 수순
          </Button>
        </Badge>
      </Space>
    </Card>
  );
};

// 📜 게임 히스토리 컴포넌트
const GameHistory = () => {
  const { moveHistory } = useTicTacToeStore();

  if (moveHistory.length === 0) {
    return (
      <Card title="📜 게임 히스토리" className="game-history-card">
        <Text type="secondary">아직 수가 없습니다.</Text>
      </Card>
    );
  }

  return (
    <Card title="📜 게임 히스토리" className="game-history-card">
      <div className="history-moves">
        {moveHistory.map((move, index) => (
          <div key={index} className="history-move">
            <Badge 
              count={move.move} 
              color={move.player === 'X' ? 'blue' : 'red'}
            />
            <Text>
              <strong>{move.player}</strong>가 {Math.floor(move.position / 3) + 1}행 {(move.position % 3) + 1}열에
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 🎲 메인 Tic-Tac-Toe 컴포넌트
const TicTacToeGame = () => {
  return (
    <div className="tic-tac-toe-container">
      <div className="game-header">
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
          🎮 Zustand Tic-Tac-Toe
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '30px' }}>
          Zustand 상태관리를 활용한 틱택토 게임
        </Text>
      </div>

      <div className="game-content">
        <div className="game-main">
          <GameStatus />
          <GameBoard />
          <GameControls />
        </div>
        
        <div className="game-sidebar">
          <GameHistory />
        </div>
      </div>
    </div>
  );
};

export default TicTacToeGame;