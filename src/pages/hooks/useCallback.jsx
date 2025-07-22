// React hooks와 메모이제이션을 위한 import
import { useState, useCallback, useMemo, memo } from 'react'
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Input, List, Divider, Tag, Alert } from 'antd'
// Ant Design 아이콘들을 import
import { 
  FunctionOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography

// =====================================
// 1. 기본 useCallback 예제
// =====================================
// 메모이제이션 없는 일반 컴포넌트 (비교용)
const ExpensiveComponent = memo(({ onCalculate, count }) => {
  console.log('ExpensiveComponent 리렌더링됨')
  
  return (
    <Card size="small" title="계산 컴포넌트 (메모화됨)">
      <Space direction="vertical">
        <Text>현재 카운트: {count}</Text>
        <Button 
          type="primary" 
          icon={<ThunderboltOutlined />}
          onClick={onCalculate}
        >
          복잡한 계산 실행
        </Button>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          콘솔을 확인하여 리렌더링 횟수를 확인하세요
        </Text>
      </Space>
    </Card>
  )
})

// useCallback을 사용하는 부모 컴포넌트
const CallbackExample = () => {
  const [count, setCount] = useState(0)
  const [otherValue, setOtherValue] = useState(0)

  // useCallback을 사용하지 않은 함수 (매번 새로 생성됨)
  const handleCalculateWithoutCallback = () => {
    console.log('복잡한 계산 실행 (useCallback 없음)')
    // 복잡한 계산 시뮬레이션
    let result = 0
    for (let i = 0; i < count * 1000; i++) {
      result += i
    }
    alert(`계산 결과: ${result}`)
  }

  // useCallback을 사용한 함수 (count가 변경될 때만 새로 생성됨)
  const handleCalculateWithCallback = useCallback(() => {
    console.log('복잡한 계산 실행 (useCallback 사용)')
    // 복잡한 계산 시뮬레이션
    let result = 0
    for (let i = 0; i < count * 1000; i++) {
      result += i
    }
    alert(`계산 결과: ${result}`)
  }, [count]) // count가 변경될 때만 함수 재생성

  return (
    <Card title="useCallback 성능 비교">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="컨트롤 패널">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>카운트 (계산에 영향): {count}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button.Group>
                      <Button 
                        icon={<PlusOutlined />}
                        onClick={() => setCount(c => c + 1)}
                      >
                        증가
                      </Button>
                      <Button 
                        icon={<ReloadOutlined />}
                        onClick={() => setCount(0)}
                      >
                        리셋
                      </Button>
                    </Button.Group>
                  </div>
                </div>
                
                <div>
                  <Text>기타 값 (계산에 무관): {otherValue}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      icon={<PlusOutlined />}
                      onClick={() => setOtherValue(v => v + 1)}
                    >
                      기타 값 증가
                    </Button>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <ExpensiveComponent 
              onCalculate={handleCalculateWithCallback}
              count={count}
            />
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
  )
}

// =====================================
// 2. 실시간 검색 예제 (debounce 패턴)
// =====================================
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // 가상의 검색 데이터
  const mockData = useMemo(() => [
    'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust',
    'Node.js', 'Express', 'Fastify', 'Koa', 'NestJS', 'Deno'
  ], [])

  // useCallback을 사용한 검색 함수
  const handleSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    
    // API 호출 시뮬레이션 (500ms 지연)
    setTimeout(() => {
      const filtered = mockData.filter(item => 
        item.toLowerCase().includes(term.toLowerCase())
      )
      setResults(filtered)
      setLoading(false)
    }, 500)
  }, [mockData])

  // 디바운스된 검색 (실제로는 lodash.debounce나 커스텀 훅 사용 권장)
  const debouncedSearch = useCallback((term) => {
    const timer = setTimeout(() => handleSearch(term), 300)
    return () => clearTimeout(timer)
  }, [handleSearch])

  return (
    <Card title="실시간 검색 (useCallback + debounce)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input.Search
          placeholder="프레임워크나 언어를 검색해보세요"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value
            setSearchTerm(value)
            debouncedSearch(value)
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
                borderRadius: '6px'
              }}
            />
          )}
        </div>
      </Space>
    </Card>
  )
}

// =====================================
// 3. 할일 목록 예제 (복잡한 상태 관리)
// =====================================
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem ${todo.id} 렌더링됨`)
  
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
        />
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
            minWidth: 'auto'
          }}
        />
        <Text 
          style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#999' : '#000'
          }}
        >
          {todo.text}
        </Text>
      </div>
    </List.Item>
  )
})

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React Hooks 학습하기', completed: false },
    { id: 2, text: 'useCallback 마스터하기', completed: false },
    { id: 3, text: '성능 최적화 적용하기', completed: true }
  ])
  const [newTodo, setNewTodo] = useState('')

  // useCallback을 사용한 할일 토글 함수
  const handleToggle = useCallback((id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }, [])

  // useCallback을 사용한 할일 삭제 함수
  const handleDelete = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
  }, [])

  // useCallback을 사용한 할일 추가 함수
  const handleAdd = useCallback(() => {
    if (newTodo.trim()) {
      const newId = Math.max(...todos.map(t => t.id), 0) + 1
      setTodos(prevTodos => [
        ...prevTodos,
        { id: newId, text: newTodo.trim(), completed: false }
      ])
      setNewTodo('')
    }
  }, [newTodo, todos])

  // 완료된 할일 개수 계산 (useMemo 사용)
  const completedCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length
  }, [todos])

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
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
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
  )
}

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
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
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
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
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
  )
}

// 컴포넌트를 기본 내보내기로 설정
export default UseCallbackPage
