// React hooks와 메모이제이션을 위한 import
import { useState, useCallback, useMemo, memo } from 'react';
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Input, List, Divider, Tag, Alert } from 'antd';
// Ant Design 아이콘들을 import
import {
  FunctionOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography;

// =====================================
// 1. 기본 useCallback 예제
// =====================================
// 메모이제이션 없는 일반 컴포넌트 (비교용)
const ExpensiveComponent = memo(({ onCalculate, count }) => {
  console.log('ExpensiveComponent 리렌더링됨');

  return (
    <Card size="small" title="계산 컴포넌트 (메모화됨)">
      <Space direction="vertical">
        <Text>현재 카운트: {count}</Text>
        <Button type="primary" icon={<ThunderboltOutlined />} onClick={onCalculate}>
          복잡한 계산 실행
        </Button>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          콘솔을 확인하여 리렌더링 횟수를 확인하세요
        </Text>
      </Space>
    </Card>
  );
});

// useCallback을 사용하는 부모 컴포넌트
const CallbackExample = () => {
  const [count, setCount] = useState(0);
  const [otherValue, setOtherValue] = useState(0);

  // useCallback을 사용하지 않은 함수 (매번 새로 생성됨)
  const handleCalculateWithoutCallback = () => {
    console.log('복잡한 계산 실행 (useCallback 없음)');
    // 복잡한 계산 시뮬레이션
    let result = 0;
    for (let i = 0; i < count * 1000; i++) {
      result += i;
    }
    alert(`계산 결과: ${result}`);
  };

  // useCallback을 사용한 함수 (count가 변경될 때만 새로 생성됨)
  const handleCalculateWithCallback = useCallback(() => {
    console.log('복잡한 계산 실행 (useCallback 사용)');
    // 복잡한 계산 시뮬레이션
    let result = 0;
    for (let i = 0; i < count * 1000; i++) {
      result += i;
    }
    alert(`계산 결과: ${result}`);
  }, [count]); // count가 변경될 때만 함수 재생성

  return (
    <Card title="useCallback 성능 비교">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useCallback 패턴 설명 */}
        <Alert
          message="🎯 useCallback 패턴: 자식 컴포넌트 리렌더링 최적화"
          description={
            <div>
              <Text strong style={{ color: '#fa8c16' }}>
                이 예제에서 useCallback이 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>handleCalculateWithCallback = useCallback(fn, [count])</Text> - count
                  변경시에만 함수 재생성
                </li>
                <li>
                  <Text code>ExpensiveComponent = memo()</Text> - props 변경시에만 리렌더링
                </li>
                <li>
                  <Text code>onCalculate={`{handleCalculateWithCallback}`}</Text> - 메모이제이션된
                  함수 전달
                </li>
                <li>기타 값 변경시에도 자식 컴포넌트는 리렌더링되지 않음</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useCallback과 React.memo를 함께 사용하여 불필요한 리렌더링을 방지합니다.
                콘솔에서 "기타 값 증가" 버튼을 클릭해도 ExpensiveComponent가 리렌더링되지 않는 것을
                확인하세요.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#fff7e6', border: '1px solid #fa8c16' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="컨트롤 패널">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>카운트 (계산에 영향): {count}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button.Group>
                      <Button icon={<PlusOutlined />} onClick={() => setCount((c) => c + 1)}>
                        증가
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={() => setCount(0)}>
                        리셋
                      </Button>
                    </Button.Group>
                  </div>
                </div>

                <div>
                  <Text>기타 값 (계산에 무관): {otherValue}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button icon={<PlusOutlined />} onClick={() => setOtherValue((v) => v + 1)}>
                      기타 값 증가
                    </Button>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <ExpensiveComponent onCalculate={handleCalculateWithCallback} count={count} />
          </Col>
        </Row>

        <Alert
          message="성능 최적화 포인트"
          description="기타 값을 증가시켜도 ExpensiveComponent가 리렌더링되지 않는 것을 콘솔에서 확인하세요. useCallback과 React.memo의 조합으로 불필요한 리렌더링을 방지합니다."
          type="info"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 2. 실시간 검색 예제 (debounce 패턴)
// =====================================
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 가상의 검색 데이터
  const mockData = useMemo(
    () => [
      'React',
      'Vue',
      'Angular',
      'Svelte',
      'Next.js',
      'Nuxt.js',
      'Gatsby',
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'Go',
      'Rust',
      'Node.js',
      'Express',
      'Fastify',
      'Koa',
      'NestJS',
      'Deno',
    ],
    [],
  );

  // useCallback을 사용한 검색 함수
  const handleSearch = useCallback(
    async (term) => {
      if (!term.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      // API 호출 시뮬레이션 (500ms 지연)
      setTimeout(() => {
        const filtered = mockData.filter((item) => item.toLowerCase().includes(term.toLowerCase()));
        setResults(filtered);
        setLoading(false);
      }, 500);
    },
    [mockData],
  );

  // 디바운스된 검색 (실제로는 lodash.debounce나 커스텀 훅 사용 권장)
  const debouncedSearch = useCallback(
    (term) => {
      const timer = setTimeout(() => handleSearch(term), 300);
      return () => clearTimeout(timer);
    },
    [handleSearch],
  );

  return (
    <Card title="실시간 검색 (useCallback + debounce)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useCallback 패턴 설명 */}
        <Alert
          message="🔍 useCallback 패턴: 검색 함수 최적화와 디바운싱"
          description={
            <div>
              <Text strong style={{ color: '#1890ff' }}>
                이 예제에서 useCallback이 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>handleSearch = useCallback(fn, [mockData])</Text> - 검색 로직
                  메모이제이션
                </li>
                <li>
                  <Text code>debouncedSearch = useCallback(fn, [handleSearch])</Text> - 디바운스
                  함수 메모이제이션
                </li>
                <li>검색어 변경시마다 새로운 함수가 생성되는 것을 방지</li>
                <li>300ms 디바운스로 불필요한 API 호출 방지</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useCallback으로 검색 함수를 메모이제이션하여 디바운싱이 정확히 작동하도록
                합니다. 함수가 매번 새로 생성되면 디바운스 타이머가 제대로 작동하지 않을 수
                있습니다.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#e6f7ff', border: '1px solid #1890ff' }}
        />

        <Input.Search
          placeholder="프레임워크나 언어를 검색해보세요"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedSearch(value);
          }}
          loading={loading}
          allowClear
        />

        <div>
          <Text type="secondary">검색 결과: {results.length}개</Text>
          {results.length > 0 && (
            <List
              size="small"
              dataSource={results}
              renderItem={(item) => (
                <List.Item>
                  <Tag color="blue">{item}</Tag>
                </List.Item>
              )}
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '8px',
                border: '1px solid #f0f0f0',
                borderRadius: '6px',
              }}
            />
          )}
        </div>
      </Space>
    </Card>
  );
};

// =====================================
// 3. 할일 목록 예제 (복잡한 상태 관리)
// =====================================
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem ${todo.id} 렌더링됨`);

  return (
    <List.Item
      actions={[
        <Button
          key="delete"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(todo.id)}
          size="small"
        />,
      ]}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button
          type="text"
          icon={todo.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          onClick={() => onToggle(todo.id)}
          style={{
            color: todo.completed ? '#52c41a' : '#faad14',
            padding: 0,
            minWidth: 'auto',
          }}
        />
        <Text
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#999' : '#000',
          }}
        >
          {todo.text}
        </Text>
      </div>
    </List.Item>
  );
});

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React Hooks 학습하기', completed: false },
    { id: 2, text: 'useCallback 마스터하기', completed: false },
    { id: 3, text: '성능 최적화 적용하기', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  // useCallback을 사용한 할일 토글 함수
  const handleToggle = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  }, []);

  // useCallback을 사용한 할일 삭제 함수
  const handleDelete = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  // useCallback을 사용한 할일 추가 함수
  const handleAdd = useCallback(() => {
    if (newTodo.trim()) {
      const newId = Math.max(...todos.map((t) => t.id), 0) + 1;
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: newId, text: newTodo.trim(), completed: false },
      ]);
      setNewTodo('');
    }
  }, [newTodo, todos]);

  // 완료된 할일 개수 계산 (useMemo 사용)
  const completedCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  return (
    <Card
      title="할일 목록 (useCallback 최적화)"
      extra={
        <Text type="secondary">
          완료: {completedCount} / {todos.length}
        </Text>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useCallback 패턴 설명 */}
        <Alert
          message="📝 useCallback 패턴: 리스트 아이템 최적화"
          description={
            <div>
              <Text strong style={{ color: '#52c41a' }}>
                이 예제에서 useCallback이 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>handleToggle = useCallback(fn, [])</Text> - 할일 토글 함수 메모이제이션
                </li>
                <li>
                  <Text code>handleDelete = useCallback(fn, [])</Text> - 할일 삭제 함수 메모이제이션
                </li>
                <li>
                  <Text code>handleAdd = useCallback(fn, [newTodo, todos])</Text> - 할일 추가 함수
                  메모이제이션
                </li>
                <li>
                  <Text code>TodoItem = memo()</Text> - 개별 할일 아이템 메모이제이션
                </li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useCallback으로 이벤트 핸들러를 메모이제이션하여 개별 TodoItem이 불필요하게
                리렌더링되지 않도록 합니다. 하나의 할일을 변경해도 다른 할일 아이템들은 리렌더링되지
                않습니다.
              </Text>
            </div>
          }
          type="success"
          showIcon
          style={{ backgroundColor: '#f6ffed', border: '1px solid #52c41a' }}
        />

        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="새 할일을 입력하세요"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onPressEnter={handleAdd}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={!newTodo.trim()}
          >
            추가
          </Button>
        </Space.Compact>

        <List
          size="small"
          dataSource={todos}
          renderItem={(todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
          )}
          style={{ minHeight: '200px' }}
        />

        <Alert
          message="최적화 확인 방법"
          description="콘솔을 열고 할일을 토글하거나 삭제해보세요. 변경되지 않은 TodoItem은 리렌더링되지 않습니다."
          type="success"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 메인 페이지 컴포넌트
// =====================================
const UseCallbackPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <FunctionOutlined style={{ color: '#fa8c16' }} />
          useCallback Hook 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          useCallback을 사용한 성능 최적화 패턴을 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* useCallback 기본 개념 도식화 */}
        <Card
          title="📚 useCallback 기본 개념"
          style={{
            backgroundColor: '#fff7e6',
            border: '2px solid #fa8c16',
            borderRadius: '12px',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 기본 설명 */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ color: '#fa8c16', marginBottom: '8px' }}>
                🎯 useCallback은 함수를 메모이제이션하여 불필요한 리렌더링을 방지하는 React
                Hook입니다
              </Title>
              <Text type="secondary">
                의존성 배열의 값이 변경될 때만 함수를 새로 생성하고, 그렇지 않으면 이전 함수를
                재사용합니다
              </Text>
            </div>

            {/* 구조 도식화 */}
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} lg={20}>
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    position: 'relative',
                  }}
                >
                  {/* 코드 구조 */}
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '16px',
                      textAlign: 'center',
                      marginBottom: '20px',
                      padding: '12px',
                      backgroundColor: '#f6f6f6',
                      borderRadius: '6px',
                      border: '1px solid #d9d9d9',
                    }}
                  >
                    <Text code style={{ fontSize: '16px' }}>
                      const memoizedCallback = useCallback(함수, [의존성])
                    </Text>
                  </div>

                  {/* useCallback vs 일반 함수 비교 */}
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px',
                          backgroundColor: '#fff0f6',
                          borderRadius: '8px',
                          border: '2px solid #eb2f96',
                        }}
                      >
                        <Title level={5} style={{ color: '#eb2f96', margin: '0 0 8px 0' }}>
                          ❌ 일반 함수
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 매 렌더링마다 새 함수 생성
                          <br />
                          • 자식 컴포넌트 불필요한 리렌더링
                          <br />
                          • 참조 동등성 실패
                          <br />• 성능 저하 가능성
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px',
                          backgroundColor: '#f6ffed',
                          borderRadius: '8px',
                          border: '2px solid #52c41a',
                        }}
                      >
                        <Title level={5} style={{ color: '#52c41a', margin: '0 0 8px 0' }}>
                          ✅ useCallback
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 의존성 변경시만 새 함수 생성
                          <br />
                          • 불필요한 리렌더링 방지
                          <br />
                          • 참조 동등성 유지
                          <br />• 성능 최적화
                        </Text>
                      </div>
                    </Col>
                  </Row>

                  {/* useCallback 작동 원리 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '16px', color: '#722ed1' }}
                    >
                      🔍 useCallback 작동 원리
                    </Title>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#1890ff',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          1️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>렌더링 발생</strong>
                          <br />
                          컴포넌트가
                          <br />
                          리렌더링됨
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#fa8c16',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          2️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>의존성 검사</strong>
                          <br />
                          이전 의존성과
                          <br />
                          현재 의존성 비교
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#52c41a',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          3️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>함수 결정</strong>
                          <br />
                          변경시: 새 함수
                          <br />
                          미변경시: 기존 함수
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#722ed1',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          4️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>자식 컴포넌트</strong>
                          <br />
                          동일 참조시
                          <br />
                          리렌더링 방지
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 의존성 배열 패턴 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '16px', color: '#13c2c2' }}
                    >
                      📋 의존성 배열 패턴
                    </Title>

                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#e6f7ff',
                            borderRadius: '6px',
                            border: '1px solid #91d5ff',
                            height: '100%',
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: '12px',
                              color: '#1890ff',
                              display: 'block',
                              marginBottom: '8px',
                            }}
                          >
                            🔵 빈 배열 []
                          </Text>
                          <pre
                            style={{
                              margin: '8px 0',
                              fontSize: '10px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`useCallback(() => {
  // 항상 동일한 함수
}, [])`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            컴포넌트 생성 시 한 번만 생성
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} md={8}>
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#fff7e6',
                            borderRadius: '6px',
                            border: '1px solid #ffd591',
                            height: '100%',
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: '12px',
                              color: '#fa8c16',
                              display: 'block',
                              marginBottom: '8px',
                            }}
                          >
                            🟡 의존성 포함 [value]
                          </Text>
                          <pre
                            style={{
                              margin: '8px 0',
                              fontSize: '10px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`useCallback(() => {
  doSomething(value)
}, [value])`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            value 변경 시에만 새 함수 생성
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} md={8}>
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#fff0f6',
                            borderRadius: '6px',
                            border: '1px solid #ffadd6',
                            height: '100%',
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: '12px',
                              color: '#eb2f96',
                              display: 'block',
                              marginBottom: '8px',
                            }}
                          >
                            🔴 배열 없음 (비권장)
                          </Text>
                          <pre
                            style={{
                              margin: '8px 0',
                              fontSize: '10px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`useCallback(() => {
  // 매번 새로운 함수
}) // 의존성 배열 없음`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            매 렌더링마다 새 함수 생성
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 실제 사용 사례 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '16px', color: '#eb2f96' }}
                    >
                      💡 주요 사용 사례
                    </Title>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#f6f6f6',
                            borderRadius: '6px',
                            border: '1px solid #d9d9d9',
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: '12px',
                              color: '#666',
                              display: 'block',
                              marginBottom: '8px',
                            }}
                          >
                            🎯 React.memo와 함께 사용
                          </Text>
                          <pre
                            style={{
                              margin: 0,
                              fontSize: '10px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`const Child = memo(({ onClick }) => {
  return <button onClick={onClick} />
})

const Parent = () => {
  const handleClick = useCallback(() => {
    // 클릭 처리
  }, [])
  
  return <Child onClick={handleClick} />
}`}
                          </pre>
                        </div>
                      </Col>

                      <Col xs={24} md={12}>
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#f0f6ff',
                            borderRadius: '6px',
                            border: '1px solid #d6e4ff',
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: '12px',
                              color: '#1890ff',
                              display: 'block',
                              marginBottom: '8px',
                            }}
                          >
                            📋 이벤트 핸들러 최적화
                          </Text>
                          <pre
                            style={{
                              margin: 0,
                              fontSize: '10px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`const TodoList = ({ todos }) => {
  const handleToggle = useCallback((id) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, done: !todo.done }
          : todo
      )
    )
  }, [])
  
  // todos 변경 시에도 함수는 재생성되지 않음
}`}
                          </pre>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 주의사항 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '12px', color: '#fa541c' }}
                    >
                      ⚠️ useCallback 사용 시 주의사항
                    </Title>

                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#fff2e8',
                        borderRadius: '8px',
                        border: '2px solid #fa541c',
                      }}
                    >
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Text
                            strong
                            style={{ color: '#fa541c', display: 'block', marginBottom: '8px' }}
                          >
                            🚨 과도한 사용 금지
                          </Text>
                          <ul
                            style={{
                              margin: '8px 0',
                              paddingLeft: '16px',
                              fontSize: '11px',
                              lineHeight: '1.6',
                              color: '#666',
                            }}
                          >
                            <li>모든 함수에 useCallback 적용하지 말 것</li>
                            <li>실제 성능 문제가 있을 때만 사용</li>
                            <li>의존성 배열 관리 비용 고려</li>
                            <li>메모리 사용량 증가 주의</li>
                          </ul>
                        </Col>

                        <Col xs={24} md={12}>
                          <Text
                            strong
                            style={{ color: '#fa541c', display: 'block', marginBottom: '8px' }}
                          >
                            💡 올바른 사용법
                          </Text>
                          <ul
                            style={{
                              margin: '8px 0',
                              paddingLeft: '16px',
                              fontSize: '11px',
                              lineHeight: '1.6',
                              color: '#666',
                            }}
                          >
                            <li>자식 컴포넌트 props로 전달시</li>
                            <li>다른 Hook의 의존성으로 사용시</li>
                            <li>복잡한 연산이 포함된 함수</li>
                            <li>React.memo와 함께 사용시</li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 1. 기본 useCallback 예제 */}
        <CallbackExample />

        <Divider />

        {/* 2. 실시간 검색 예제 */}
        <SearchComponent />

        <Divider />

        {/* 3. 할일 목록 예제 */}
        <TodoList />

        {/* useCallback 사용법 가이드 */}
        <Card
          title="useCallback 사용법 가이드"
          style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={5}>1. 기본 사용법</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`const memoizedCallback = useCallback(
  () => {
    // 콜백 함수 로직
  },
  [dependency] // 의존성 배열
);`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. React.memo와 함께 사용</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`const OptimizedComponent = memo(({ onClick }) => {
  return <button onClick={onClick}>클릭</button>
});`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 의존성 배열 관리</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>빈 배열 []: 컴포넌트 생성 시 한 번만 생성</li>
                <li>의존성 포함: 해당 값 변경 시에만 재생성</li>
                <li>배열 없음: 매 렌더링마다 새로 생성</li>
              </ul>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>4. 사용 시기</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>자식 컴포넌트에 콜백을 props로 전달할 때</li>
                <li>다른 Hook의 의존성 배열에 함수가 포함될 때</li>
                <li>복잡한 계산이 포함된 함수일 때</li>
                <li>이벤트 핸들러 최적화가 필요할 때</li>
              </ul>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

// 컴포넌트를 기본 내보내기로 설정
export default UseCallbackPage;
