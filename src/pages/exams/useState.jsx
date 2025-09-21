import { useRef, useState } from 'react';
import { Typography, notification, Form, Input, Button, List, Space } from 'antd';

import './exams.css';

const { Title } = Typography;

const UseStateExamPage = () => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 State...
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const initFetch = () => {
    const initialNames = ['홍길동', '김철수', '박영희'];
    return initialNames;
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛸 State...
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const [Cnt, setCnt] = useState(0);
  const [Names, setNames] = useState(() => {
    return initFetch();
  });
  const [form] = Form.useForm();
  const inputRef = useRef(null);

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
  // 폼 제출 시: 이름 추가 로직 (중복 체크 포함)
  const onFinish = ({ name }) => {
    const trimmedName = (name || '').trim();
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
  form.resetFields(['name']);
  // Enter/제출 후 입력창 포커스 유지
  setTimeout(() => inputRef.current?.focus?.(), 0);
  };

  const handlerClickClear = () => {
    setNames([]);
    form.resetFields();
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

      {/* 🛸 Name List with useForm */}
      <Title level={4}>Name List</Title>
      <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 12 }}>
        <Form.Item name="name" rules={[{ required: true, message: '이름을 입력하세요' }]}>
          <Input
            ref={inputRef}
            placeholder="이름을 입력하세요"
            onPressEnter={() => form.submit()}
          />
        </Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
          <Button onClick={handlerClickClear}>Clear</Button>
        </Space>
      </Form>
      <List
        bordered
        dataSource={Names}
        renderItem={(name, idx) => <List.Item key={idx}>{name}</List.Item>}
      />
    </div>
  );
};

export default UseStateExamPage;
