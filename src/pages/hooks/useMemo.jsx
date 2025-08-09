// React hooks와 메모이제이션을 위한 import
import { useState, useMemo, useCallback, memo } from 'react'
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Input, Slider, List, Tag, Alert, Progress, Statistic } from 'antd'
// Ant Design 아이콘들을 import
import { 
  ThunderboltOutlined,
  CalculatorOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons'

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography

// =====================================
// 1. 기본 useMemo 예제 - 복잡한 계산 최적화
// =====================================
const ExpensiveCalculationDemo = () => {
  const [count, setCount] = useState(1)
  const [multiplier, setMultiplier] = useState(1)
  const [otherValue, setOtherValue] = useState(0)

  // useMemo 없는 복잡한 계산 (매번 실행됨)
  const expensiveCalculationWithoutMemo = () => {
    console.log('복잡한 계산 실행됨 (useMemo 없음)')
    let result = 0
    // 의도적으로 무거운 연산 시뮬레이션
    for (let i = 0; i < count * 1000000; i++) {
      result += i * multiplier
    }
    return result
  }

  // useMemo를 사용한 복잡한 계산 (count나 multiplier가 변경될 때만 실행)
  const expensiveCalculationWithMemo = useMemo(() => {
    console.log('복잡한 계산 실행됨 (useMemo 사용)')
    let result = 0
    // 의도적으로 무거운 연산 시뮬레이션
    for (let i = 0; i < count * 1000000; i++) {
      result += i * multiplier
    }
    return result
  }, [count, multiplier]) // count나 multiplier가 변경될 때만 재계산

  return (
    <Card title="복잡한 계산 최적화 (useMemo)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useMemo 패턴 설명 */}
        <Alert
          message="🧮 useMemo 패턴: 복잡한 계산 결과 메모이제이션"
          description={
            <div>
              <Text strong style={{ color: '#52c41a' }}>
                이 예제에서 useMemo가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li><Text code>{"useMemo(() => heavyCalculation(), [count, multiplier])"}</Text> - 계산 결과 메모이제이션</li>
                <li>count나 multiplier 변경시에만 재계산 수행</li>
                <li>otherValue 변경시에는 재계산하지 않음</li>
                <li>1백만 번의 반복 연산을 효율적으로 관리</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: 무거운 계산을 메모이제이션하여 불필요한 재계산을 방지합니다. 
                "기타 값 증가" 버튼을 클릭해도 계산이 다시 실행되지 않습니다.
              </Text>
            </div>
          }
          type="success"
          showIcon
          style={{ backgroundColor: '#f6ffed', border: '1px solid #52c41a' }}
        />
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="컨트롤 패널">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>카운트 (계산에 영향): {count}</Text>
                  <Slider
                    min={1}
                    max={10}
                    value={count}
                    onChange={setCount}
                    marks={{
                      1: '1', 3: '3', 5: '5', 7: '7', 10: '10'
                    }}
                  />
                </div>
                
                <div>
                  <Text>곱셈 값 (계산에 영향): {multiplier}</Text>
                  <Slider
                    min={1}
                    max={5}
                    value={multiplier}
                    onChange={setMultiplier}
                    marks={{
                      1: '1x', 2: '2x', 3: '3x', 4: '4x', 5: '5x'
                    }}
                  />
                </div>
                
                <div>
                  <Text>기타 값 (계산에 무관): {otherValue}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      onClick={() => setOtherValue(v => v + 1)}
                      icon={<ReloadOutlined />}
                    >
                      기타 값 증가
                    </Button>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card size="small" title="계산 결과">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic
                  title="useMemo 사용 결과"
                  value={expensiveCalculationWithMemo}
                  precision={0}
                  prefix={<CalculatorOutlined />}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  콘솔을 확인하여 계산 실행 횟수를 확인하세요
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Alert
          message="⚡ 성능 최적화 포인트"
          description="기타 값을 증가시켜도 useMemo로 메모이제이션된 계산은 다시 실행되지 않습니다. count나 multiplier를 변경했을 때만 재계산됩니다."
          type="info"
          showIcon
        />
      </Space>
    </Card>
  )
}

// =====================================
// 2. 필터링과 정렬 예제
// =====================================
const FilterAndSortDemo = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sortBy, setSortBy] = useState('name')
  const [rerenderTrigger, setRerenderTrigger] = useState(0)

  // 상품 데이터 (useMemo로 메모이제이션)
  const products = useMemo(() => [
    { id: 1, name: '노트북', price: 800, category: 'electronics', rating: 4.5 },
    { id: 2, name: '마우스', price: 50, category: 'electronics', rating: 4.2 },
    { id: 3, name: '키보드', price: 120, category: 'electronics', rating: 4.8 },
    { id: 4, name: '모니터', price: 300, category: 'electronics', rating: 4.3 },
    { id: 5, name: '헤드폰', price: 200, category: 'electronics', rating: 4.6 },
    { id: 6, name: '스피커', price: 150, category: 'electronics', rating: 4.1 },
    { id: 7, name: '웹캠', price: 80, category: 'electronics', rating: 3.9 },
    { id: 8, name: '마이크', price: 100, category: 'electronics', rating: 4.4 },
    { id: 9, name: '태블릿', price: 400, category: 'electronics', rating: 4.0 },
    { id: 10, name: '충전기', price: 30, category: 'electronics', rating: 4.2 }
  ], [])

  // 필터링된 상품 목록 (useMemo 사용)
  const filteredProducts = useMemo(() => {
    console.log('상품 필터링 실행됨')
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice
      return matchesSearch && matchesPrice
    })
  }, [products, searchTerm, minPrice, maxPrice])

  // 정렬된 상품 목록 (useMemo 사용)
  const sortedProducts = useMemo(() => {
    console.log('상품 정렬 실행됨')
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          return a.price - b.price
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })
  }, [filteredProducts, sortBy])

  // 통계 정보 (useMemo 사용)
  const statistics = useMemo(() => {
    console.log('통계 계산 실행됨')
    const totalProducts = sortedProducts.length
    const averagePrice = totalProducts > 0 
      ? sortedProducts.reduce((sum, product) => sum + product.price, 0) / totalProducts 
      : 0
    const averageRating = totalProducts > 0
      ? sortedProducts.reduce((sum, product) => sum + product.rating, 0) / totalProducts
      : 0
    
    return { totalProducts, averagePrice, averageRating }
  }, [sortedProducts])

  return (
    <Card title="상품 필터링 및 정렬 (useMemo 최적화)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useMemo 패턴 설명 */}
        <Alert
          message="🔍 useMemo 패턴: 데이터 필터링, 정렬, 통계 최적화"
          description={
            <div>
              <Text strong style={{ color: '#1890ff' }}>
                이 예제에서 useMemo가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li><Text code>{"filteredProducts = useMemo(() => products.filter(...), [products, searchTerm, minPrice, maxPrice])"}</Text></li>
                <li><Text code>{"sortedProducts = useMemo(() => [...filteredProducts].sort(...), [filteredProducts, sortBy])"}</Text></li>
                <li><Text code>{"statistics = useMemo(() => calculateStats(...), [sortedProducts])"}</Text></li>
                <li>각 단계별로 필요한 의존성만 포함하여 효율적인 재계산</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: 필터링→정렬→통계 계산을 체인으로 연결하여 각각 독립적으로 메모이제이션합니다. 
                강제 리렌더링 시에도 불필요한 계산은 수행되지 않습니다.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#e6f7ff', border: '1px solid #1890ff' }}
        />
        
        {/* 컨트롤 패널 */}
        <Card size="small" title="필터 및 정렬 옵션">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>상품명 검색:</Text>
                <Input
                  placeholder="상품명을 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>가격 범위: ${minPrice} - ${maxPrice}</Text>
                <Slider
                  range
                  min={0}
                  max={1000}
                  value={[minPrice, maxPrice]}
                  onChange={([min, max]) => {
                    setMinPrice(min)
                    setMaxPrice(max)
                  }}
                />
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>정렬 기준:</Text>
                <Button.Group style={{ width: '100%' }}>
                  <Button
                    type={sortBy === 'name' ? 'primary' : 'default'}
                    onClick={() => setSortBy('name')}
                    size="small"
                  >
                    이름순
                  </Button>
                  <Button
                    type={sortBy === 'price' ? 'primary' : 'default'}
                    onClick={() => setSortBy('price')}
                    size="small"
                  >
                    가격순
                  </Button>
                  <Button
                    type={sortBy === 'rating' ? 'primary' : 'default'}
                    onClick={() => setSortBy('rating')}
                    size="small"
                  >
                    평점순
                  </Button>
                </Button.Group>
              </Space>
            </Col>
          </Row>
          
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button 
              onClick={() => setRerenderTrigger(prev => prev + 1)}
              icon={<ReloadOutlined />}
            >
              강제 리렌더링 (useMemo 테스트용)
            </Button>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
              리렌더링 횟수: {rerenderTrigger}
            </Text>
          </div>
        </Card>

        {/* 통계 정보 */}
        <Row gutter={[16, 16]}>
          <Col xs={8}>
            <Statistic
              title="총 상품 수"
              value={statistics.totalProducts}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={8}>
            <Statistic
              title="평균 가격"
              value={statistics.averagePrice}
              precision={2}
              prefix="$"
            />
          </Col>
          <Col xs={8}>
            <Statistic
              title="평균 평점"
              value={statistics.averageRating}
              precision={1}
              suffix="/ 5"
              prefix={<StarOutlined />}
            />
          </Col>
        </Row>

        {/* 상품 목록 */}
        <Card size="small" title={`상품 목록 (${sortedProducts.length}개)`}>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={sortedProducts}
            renderItem={(product) => (
              <List.Item>
                <Card 
                  size="small"
                  hoverable
                  style={{ height: '100%' }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text strong>{product.name}</Text>
                    <Text type="success" style={{ fontSize: '16px' }}>${product.price}</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StarOutlined style={{ color: '#faad14' }} />
                      <Text>{product.rating}</Text>
                    </div>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Card>
        
        <Alert
          message="메모이제이션 효과"
          description="강제 리렌더링 버튼을 클릭해도 필터링, 정렬, 통계 계산이 다시 실행되지 않습니다. 검색어나 가격 범위, 정렬 기준이 변경될 때만 해당 계산이 실행됩니다."
          type="success"
          showIcon
        />
      </Space>
    </Card>
  )
}

// =====================================
// 3. 참조 동등성 예제
// =====================================
const ChildComponent = memo(({ data, onUpdate }) => {
  console.log('ChildComponent 렌더링됨')
  
  return (
    <Card size="small" title="자식 컴포넌트 (메모화됨)">
      <Space direction="vertical">
        <Text>받은 데이터: {JSON.stringify(data)}</Text>
        <Button onClick={() => onUpdate('자식에서 업데이트됨')} size="small">
          데이터 업데이트
        </Button>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          콘솔에서 리렌더링 확인
        </Text>
      </Space>
    </Card>
  )
})

const ReferenceEqualityDemo = () => {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('초기 메시지')

  // useMemo로 메모이제이션된 객체 (count가 변경될 때만 새로 생성)
  const dataWithMemo = useMemo(() => ({
    count,
    timestamp: Date.now()
  }), [count])

  // useCallback으로 메모이제이션된 함수
  const handleUpdate = useCallback((newMessage) => {
    setMessage(newMessage)
  }, [])

  return (
    <Card title="참조 동등성과 React.memo (useMemo + useCallback)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useMemo 패턴 설명 */}
        <Alert
          message="🎯 useMemo 패턴: 참조 동등성과 React.memo 최적화"
          description={
            <div>
              <Text strong style={{ color: '#722ed1' }}>
                이 예제에서 useMemo가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li><Text code>{"dataWithMemo = useMemo(() => ({count, timestamp}), [count])"}</Text> - 객체 참조 안정화</li>
                <li><Text code>handleUpdate = useCallback(fn, [])</Text> - 함수 참조 안정화</li>
                <li>React.memo와 함께 사용하여 불필요한 리렌더링 방지</li>
                <li>count 변경시에만 새로운 객체 생성</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useMemo로 객체의 참조 동등성을 유지하여 자식 컴포넌트의 불필요한 리렌더링을 방지합니다. 
                메시지 변경 시에도 ChildComponent가 리렌더링되지 않습니다.
              </Text>
            </div>
          }
          type="warning"
          showIcon
          style={{ backgroundColor: '#f9f0ff', border: '1px solid #722ed1' }}
        />
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="컨트롤 패널">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>카운트: {count}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button.Group>
                      <Button 
                        onClick={() => setCount(c => c + 1)}
                        type="primary"
                      >
                        증가
                      </Button>
                      <Button onClick={() => setCount(0)}>
                        리셋
                      </Button>
                    </Button.Group>
                  </div>
                </div>
                
                <div>
                  <Text>메시지: {message}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      onClick={() => setMessage(`업데이트됨 ${Date.now()}`)}
                    >
                      메시지 변경 (count에 무관)
                    </Button>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <ChildComponent 
              data={dataWithMemo}
              onUpdate={handleUpdate}
            />
          </Col>
        </Row>
        
        <Alert
          message="참조 동등성의 중요성"
          description="메시지 변경 버튼을 클릭해도 ChildComponent가 리렌더링되지 않습니다. useMemo로 데이터 객체를, useCallback으로 콜백 함수를 메모이제이션했기 때문입니다."
          type="info"
          showIcon
        />
      </Space>
    </Card>
  )
}

// =====================================
// 메인 페이지 컴포넌트
// =====================================
const UseMemoPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <ThunderboltOutlined style={{ color: '#52c41a' }} /> 
          useMemo Hook 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          useMemo를 사용한 계산 결과 메모이제이션 패턴을 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* useMemo 기본 개념 도식화 */}
        <Card 
          title="📚 useMemo 기본 개념" 
          style={{ 
            backgroundColor: '#f6ffed', 
            border: '2px solid #52c41a',
            borderRadius: '12px'
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 기본 설명 */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ color: '#52c41a', marginBottom: '8px' }}>
                🎯 useMemo는 계산 결과를 메모이제이션하여 불필요한 재계산을 방지하는 React Hook입니다
              </Title>
              <Text type="secondary">
                의존성 배열의 값이 변경될 때만 계산을 다시 수행하고, 그렇지 않으면 이전 결과를 재사용합니다
              </Text>
            </div>

            {/* 구조 도식화 */}
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} lg={20}>
                <div style={{ 
                  padding: '20px',
                  backgroundColor: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  position: 'relative'
                }}>
                  {/* 코드 구조 */}
                  <div style={{ 
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    padding: '12px',
                    backgroundColor: '#f6f6f6',
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9'
                  }}>
                    <Text code style={{ fontSize: '16px' }}>
                      const memoizedValue = useMemo(계산함수, [의존성])
                    </Text>
                  </div>

                  {/* useMemo vs 일반 계산 비교 */}
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                      <div style={{ 
                        textAlign: 'center',
                        padding: '16px',
                        backgroundColor: '#fff0f6',
                        borderRadius: '8px',
                        border: '2px solid #eb2f96'
                      }}>
                        <Title level={5} style={{ color: '#eb2f96', margin: '0 0 8px 0' }}>
                          ❌ 일반 계산
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 매 렌더링마다 재계산<br/>
                          • 불필요한 연산 수행<br/>
                          • 성능 저하 발생<br/>
                          • CPU 자원 낭비
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div style={{ 
                        textAlign: 'center',
                        padding: '16px',
                        backgroundColor: '#f6ffed',
                        borderRadius: '8px',
                        border: '2px solid #52c41a'
                      }}>
                        <Title level={5} style={{ color: '#52c41a', margin: '0 0 8px 0' }}>
                          ✅ useMemo
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 의존성 변경시만 재계산<br/>
                          • 이전 결과 재사용<br/>
                          • 성능 최적화<br/>
                          • 효율적인 자원 사용
                        </Text>
                      </div>
                    </Col>
                  </Row>

                  {/* useMemo 작동 원리 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '16px', color: '#722ed1' }}>
                      🔍 useMemo 작동 원리
                    </Title>
                    
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#1890ff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>1️⃣</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>렌더링 발생</strong><br/>
                          컴포넌트가<br/>
                          리렌더링됨
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#fa8c16',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>2️⃣</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>의존성 검사</strong><br/>
                          이전 의존성과<br/>
                          현재 의존성 비교
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#52c41a',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>3️⃣</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>계산 결정</strong><br/>
                          변경시: 재계산<br/>
                          미변경시: 캐시 사용
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#722ed1',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>4️⃣</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>결과 반환</strong><br/>
                          계산된 값 또는<br/>
                          캐시된 값 반환
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 의존성 배열 패턴 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '16px', color: '#13c2c2' }}>
                      📋 의존성 배열 패턴
                    </Title>
                    
                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#f6ffed',
                          borderRadius: '6px',
                          border: '1px solid #b7eb8f',
                          height: '100%'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#52c41a', display: 'block', marginBottom: '8px' }}>
                            🟢 빈 배열 []
                          </Text>
                          <pre style={{ 
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`useMemo(() => {
  return expensiveCalculation()
}, [])`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            컴포넌트 생성 시 한 번만 계산
                          </Text>
                        </div>
                      </Col>
                      
                      <Col xs={24} md={8}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#fff7e6',
                          borderRadius: '6px',
                          border: '1px solid #ffd591',
                          height: '100%'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#fa8c16', display: 'block', marginBottom: '8px' }}>
                            🟡 의존성 포함 [value]
                          </Text>
                          <pre style={{ 
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`useMemo(() => {
  return calculate(value)
}, [value])`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            value 변경 시에만 재계산
                          </Text>
                        </div>
                      </Col>
                      
                      <Col xs={24} md={8}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#fff0f6',
                          borderRadius: '6px',
                          border: '1px solid #ffadd6',
                          height: '100%'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#eb2f96', display: 'block', marginBottom: '8px' }}>
                            🔴 배열 없음 (비권장)
                          </Text>
                          <pre style={{ 
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`useMemo(() => {
  return calculate()
}) // 의존성 배열 없음`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            매 렌더링마다 재계산
                          </Text>
                        </div>
                      </Col>
                    </Row>
                    
                    {/* 의존성 배열 패턴 상세 설명 */}
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <Text style={{ fontSize: '13px', color: '#8c8c8c', lineHeight: '1.6' }}>
                        <strong>의존성 배열의 패턴 3가지</strong><br/>
                        1. 컴포넌트 생성시 한번만 실행<br/>
                        2. 의존성 value변경시에만 재계산<br/>
                        3. 매 렌더링마다 재계산
                      </Text>
                    </div>
                  </div>

                  {/* 주요 사용 사례 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '16px', color: '#eb2f96' }}>
                      💡 주요 사용 사례
                    </Title>
                    
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#1890ff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>🧮</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>복잡한 계산</strong><br/>
                          수학 연산<br/>
                          알고리즘 처리
                        </Text>
                      </div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#52c41a',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>🔍</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>데이터 필터링</strong><br/>
                          배열 필터<br/>
                          검색 결과
                        </Text>
                      </div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#fa8c16',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>📊</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>데이터 정렬</strong><br/>
                          배열 정렬<br/>
                          통계 계산
                        </Text>
                      </div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div style={{ 
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#722ed1',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '20px'
                        }}>🎯</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>참조 동등성</strong><br/>
                          객체 생성<br/>
                          props 전달
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 실제 사용 예제 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '12px', color: '#13c2c2' }}>
                      💡 실제 사용 예제
                    </Title>
                    
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#f6f6f6',
                          borderRadius: '6px',
                          border: '1px solid #d9d9d9'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>
                            📝 복잡한 계산 메모이제이션
                          </Text>
                          <pre style={{ 
                            margin: '0 0 8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`const expensiveValue = useMemo(() => {
  let result = 0
  for (let i = 0; i < count * 1000000; i++) {
    result += i * multiplier
  }
  return result
}, [count, multiplier])`}
                          </pre>
                          <div style={{ 
                            padding: '6px',
                            backgroundColor: '#e8f4fd',
                            borderRadius: '4px',
                            fontSize: '9px',
                            color: '#1890ff',
                            lineHeight: '1.3'
                          }}>
                            <Text strong style={{ fontSize: '9px', color: '#1890ff' }}>💡 장점:</Text> 
                            무거운 반복 연산을 메모이제이션하여 불필요한 재계산 방지. 
                            count/multiplier 변경시에만 재계산되어 성능 향상.
                          </div>
                        </div>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#f0f6ff',
                          borderRadius: '6px',
                          border: '1px solid #d6e4ff'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#1890ff', display: 'block', marginBottom: '8px' }}>
                            📋 배열 필터링 최적화
                          </Text>
                          <pre style={{ 
                            margin: '0 0 8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`const filteredItems = useMemo(() => {
  return items.filter(item => 
    item.name.toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
}, [items, searchTerm])`}
                          </pre>
                          <div style={{ 
                            padding: '6px',
                            backgroundColor: '#e6f7ff',
                            borderRadius: '4px',
                            fontSize: '9px',
                            color: '#1890ff',
                            lineHeight: '1.3'
                          }}>
                            <Text strong style={{ fontSize: '9px', color: '#1890ff' }}>💡 장점:</Text> 
                            배열 순회와 문자열 변환을 메모이제이션. 
                            items나 searchTerm 변경시에만 필터링하여 렌더링 성능 개선.
                          </div>
                        </div>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#fff7e6',
                          borderRadius: '6px',
                          border: '1px solid #ffd591'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#fa8c16', display: 'block', marginBottom: '8px' }}>
                            📊 데이터 정렬 최적화
                          </Text>
                          <pre style={{ 
                            margin: '0 0 8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`const sortedData = useMemo(() => {
  return [...data].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }
    return a[sortBy] - b[sortBy]
  })
}, [data, sortBy])`}
                          </pre>
                          <div style={{ 
                            padding: '6px',
                            backgroundColor: '#fff2e8',
                            borderRadius: '4px',
                            fontSize: '9px',
                            color: '#fa8c16',
                            lineHeight: '1.3'
                          }}>
                            <Text strong style={{ fontSize: '9px', color: '#fa8c16' }}>💡 장점:</Text> 
                            배열 복사 및 정렬 연산을 메모이제이션. 
                            data나 sortBy 기준 변경시에만 재정렬하여 UI 반응성 향상.
                          </div>
                        </div>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#f9f0ff',
                          borderRadius: '6px',
                          border: '1px solid #d3adf7'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#722ed1', display: 'block', marginBottom: '8px' }}>
                            🎯 참조 동등성 최적화
                          </Text>
                          <pre style={{ 
                            margin: '0 0 8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`const memoizedProps = useMemo(() => ({
  user: { id: userId, name: userName },
  config: { theme, language },
  onUpdate: handleUpdate
}), [userId, userName, theme, language])`}
                          </pre>
                          <div style={{ 
                            padding: '6px',
                            backgroundColor: '#f0e6ff',
                            borderRadius: '4px',
                            fontSize: '9px',
                            color: '#722ed1',
                            lineHeight: '1.3'
                          }}>
                            <Text strong style={{ fontSize: '9px', color: '#722ed1' }}>💡 장점:</Text> 
                            객체 참조 안정성 확보로 자식 컴포넌트 불필요한 리렌더링 방지. 
                            React.memo와 함께 사용시 최적화 효과 극대화.
                          </div>
                          
                          {/* React.memo와 함께 사용하는 추가 예제 */}
                          <div style={{ marginTop: '8px' }}>
                            <Text strong style={{ fontSize: '11px', color: '#722ed1', display: 'block', marginBottom: '6px' }}>
                              🔗 React.memo와 함께 사용하는 패턴:
                            </Text>
                            <pre style={{ 
                              margin: '0 0 6px 0',
                              fontSize: '9px',
                              lineHeight: '1.3',
                              fontFamily: 'monospace',
                              backgroundColor: '#fafafa',
                              padding: '4px',
                              borderRadius: '3px'
                            }}>
{`// 자식 컴포넌트를 React.memo로 감싸기
const ChildComponent = memo(({ config }) => {
  console.log('Child rendered!')
  return <div>{config.title}</div>
})

// 부모에서 useMemo로 props 메모이제이션
const Parent = () => {
  const [count, setCount] = useState(0)
  const [otherState, setOtherState] = useState('')
  
  const memoizedConfig = useMemo(() => ({
    title: 'Title',
    theme: 'dark',
    count: count
  }), [count]) // count 변경시에만 새 객체 생성
  
  return (
    <div>
      <ChildComponent config={memoizedConfig} />
      {/* otherState 변경시 Child 리렌더링 안됨 */}
    </div>
  )
}`}
                            </pre>
                            <div style={{ 
                              padding: '4px',
                              backgroundColor: '#f0e6ff',
                              borderRadius: '3px',
                              fontSize: '8px',
                              color: '#722ed1',
                              lineHeight: '1.2'
                            }}>
                              <Text strong style={{ fontSize: '8px' }}>⚡ 핵심 장점:</Text> 
                              otherState 변경시 ChildComponent가 리렌더링되지 않음. 
                              useMemo 없이는 매번 새 객체가 생성되어 React.memo 효과 무력화.
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 주의사항 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '12px', color: '#fa541c' }}>
                      ⚠️ useMemo 사용 시 주의사항
                    </Title>
                    
                    <div style={{ 
                      padding: '16px',
                      backgroundColor: '#fff2e8',
                      borderRadius: '8px',
                      border: '2px solid #fa541c'
                    }}>
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Text strong style={{ color: '#fa541c', display: 'block', marginBottom: '8px' }}>
                            🚨 과도한 사용 금지
                          </Text>
                          <ul style={{ 
                            margin: '8px 0',
                            paddingLeft: '16px',
                            fontSize: '11px',
                            lineHeight: '1.6',
                            color: '#666'
                          }}>
                            <li>단순한 계산에는 사용하지 말 것</li>
                            <li>메모이제이션 오버헤드 고려</li>
                            <li>의존성 배열 관리 비용</li>
                            <li>메모리 사용량 증가 주의</li>
                          </ul>
                        </Col>
                        
                        <Col xs={24} md={12}>
                          <Text strong style={{ color: '#fa541c', display: 'block', marginBottom: '8px' }}>
                            💡 올바른 사용법
                          </Text>
                          <ul style={{ 
                            margin: '8px 0',
                            paddingLeft: '16px',
                            fontSize: '11px',
                            lineHeight: '1.6',
                            color: '#666'
                          }}>
                            <li>복잡하고 비용이 큰 계산</li>
                            <li>참조 동등성이 중요한 객체</li>
                            <li>자주 변경되지 않는 데이터</li>
                            <li>성능 측정 후 적용</li>
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

        {/* 1. 복잡한 계산 최적화 */}
        <ExpensiveCalculationDemo />
        
        {/* 2. 필터링과 정렬 예제 */}
        <FilterAndSortDemo />
        
        {/* 3. 참조 동등성 예제 */}
        <ReferenceEqualityDemo />

        {/* useMemo 사용법 가이드 */}
        <Card 
          title="useMemo 사용법 가이드" 
          style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={5}>1. 기본 사용법</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const memoizedValue = useMemo(
  () => {
    // 복잡한 계산
    return expensiveCalculation(a, b);
  },
  [a, b] // 의존성 배열
);`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. 객체 메모이제이션</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const memoizedObject = useMemo(
  () => ({
    prop1: value1,
    prop2: value2
  }),
  [value1, value2]
);`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 배열 필터링/정렬</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const filteredData = useMemo(
  () => data.filter(item => 
    item.name.includes(searchTerm)
  ),
  [data, searchTerm]
);`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>4. 주의사항</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>무분별한 사용은 오히려 성능 저하</li>
                <li>단순한 계산에는 사용하지 말 것</li>
                <li>의존성 배열을 정확히 설정</li>
                <li>참조 동등성이 중요한 경우에만 사용</li>
              </ul>
            </Col>
          </Row>
          
          <Alert
            message="useMemo vs useCallback"
            description="useMemo는 계산 결과를 메모이제이션하고, useCallback은 함수 자체를 메모이제이션합니다. 둘 다 불필요한 재계산이나 리렌더링을 방지하는 데 사용됩니다."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Card>
      </Space>
    </div>
  )
}

// 컴포넌트를 기본 내보내기로 설정
export default UseMemoPage
