import React, { useEffect, useCallback } from 'react';

const UseCallbackExamPage = () => {
  const [number, setNumber] = React.useState(0);
  const [inputValue, setInputValue] = React.useState('0');
  const inputRef = React.useRef(null);

  const someFunc = useCallback(() => {
    console.log('someFunc called');
    console.log(number);
  }, [number]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const raw = e.currentTarget.value.trim();
      if (raw === '') return;
      const nextNum = Number(raw);
      if (Number.isNaN(nextNum)) return;
      setNumber(nextNum);
      // 입력값 리셋 및 포커스 유지
      setInputValue('');
      setTimeout(() => inputRef.current?.focus?.(), 0);
    }
  };

  useEffect(() => {
    console.log('number changed:');
  }, [someFunc]);

  return (
    <div>
      <h2>useCallback Hook</h2>
      <input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={someFunc}>call func</button>
      <p>Number: {number}</p>
    </div>
  );
};

export default UseCallbackExamPage;
