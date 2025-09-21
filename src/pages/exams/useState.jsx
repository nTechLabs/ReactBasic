import { useState } from 'react';
import { Typography, notification } from 'antd';

import './exams.css';

const { Title } = Typography;

const UseStateExamPage = () => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 State...
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const [Cnt, setCnt] = useState(0);
  const [Names, setNames] = useState(['홍길동', '김철수', '박영희']);
  const [name, setName] = useState('');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 State.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 Counter handler...
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleClickIncrese = () => {
    setCnt((prevCnt) => (prevCnt + 1) % 11);
  };

  const handleClickDecrease = () => {
    setCnt((prevCnt) => (prevCnt - 1 < -10 ? 0 : prevCnt - 1));
  };

  const handleClickReset = () => {
    setCnt(0);
  };
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 Counter handler.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 Name List handler...
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handlerChangeName = (e) => {
    setName(e.target.value);
  };

  // 공통 함수: 이름 추가 로직 (중복 체크 포함)
  const addNameToList = () => {
    const trimmedName = name.trim();
    if (trimmedName === '') {
      return;
    }

    if (Names.includes(trimmedName)) {
      notification.warning({
        message: '중복된 이름',
        description: `'${trimmedName}'은(는) 이미 목록에 있습니다.`,
        placement: 'topLeft',
        duration: 1,
      });
      return;
    }
    setNames((prevName) => [...prevName, trimmedName]);
    setName('');
  };

  const handlerAddName = (e) => {
    // Enter 키 또는 클릭 이벤트 모두 처리
    if (e.type === 'keyup' && e.key !== 'Enter') return;
    addNameToList();
  };

  const handlerClickClear = () => {
    setNames([]);
    setName('');
  };
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 Name List handler.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div>
      {/* 🛸 Counter */}
      <Title level={4}>Counter</Title>
      <button onClick={handleClickDecrease}> - </button>
      <span> Cnt : {Cnt} </span>
      <button onClick={handleClickIncrese}> + </button>
      <button onClick={handleClickReset}> Reset </button>

      {/* 🛸 Name List */}
      <Title level={4}>Name List</Title>
      <ul>
        <input
          type="text"
          value={name}
          onChange={handlerChangeName}
          onKeyUp={handlerAddName}
          placeholder="이름을 입력하세요"
        />
        <button onClick={handlerAddName}>add</button>
        <button onClick={handlerClickClear}>Clear</button>
        {Names.map((Name, idx) => (
          <li key={idx}>{Name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UseStateExamPage;
