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
          message="성능 최적화 포인트"
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

  // useMemo 없이 객체 생성 (매번 새로운 객체)
  const dataWithoutMemo = {
    count,
    timestamp: Date.now()
  }

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
