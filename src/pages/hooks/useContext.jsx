// React hooks와 Context API를 위한 import
import { useState, createContext, useContext } from 'react'
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Switch, Select, Input, Divider, Tag } from 'antd'
// Ant Design 아이콘들을 import
import { 
  UserOutlined, 
  SettingOutlined, 
  BulbOutlined, 
  GlobalOutlined,
  ShoppingCartOutlined,
  CodeOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons'

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography
// Select 컴포넌트의 Option을 구조 분해 할당으로 추출
const { Option } = Select

// =====================================
// 1. 테마 관리를 위한 Context 생성
// =====================================
// 테마 상태를 전역으로 관리하기 위한 Context 생성
const ThemeContext = createContext()

// 테마 Context의 Provider 컴포넌트
// 자식 컴포넌트들에게 테마 상태와 변경 함수를 제공
const ThemeProvider = ({ children }) => {
  // 현재 테마 상태 관리 ('light' 또는 'dark')
  const [theme, setTheme] = useState('light')
  
  // 테마를 토글하는 함수 (라이트 ↔ 다크 모드 전환)
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Context Provider로 테마 상태와 토글 함수를 하위 컴포넌트에 제공
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 테마 Context를 소비하는 컴포넌트
// useContext 훅을 사용하여 테마 상태에 접근
const ThemeComponent = () => {
  // ThemeContext에서 테마 상태와 토글 함수를 가져옴
  const { theme, toggleTheme } = useContext(ThemeContext)
  
  return (
    <Card 
      title={<><BulbOutlined /> 테마 설정</>}
      // 현재 테마에 따라 동적으로 스타일 변경
      style={{
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000'
      }}
    >
      <Space direction="vertical" size="middle">
        {/* 현재 테마 상태 표시 */}
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
          현재 테마: <Tag color={theme === 'dark' ? 'purple' : 'gold'}>{theme === 'dark' ? '다크 모드' : '라이트 모드'}</Tag>
        </Text>
        {/* 테마 토글 스위치 */}
        <Switch 
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren="🌙" // 다크 모드일 때 표시될 아이콘
          unCheckedChildren="☀️" // 라이트 모드일 때 표시될 아이콘
        />
        {/* useContext 사용 설명 텍스트 */}
        <Paragraph style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
          useContext를 사용하여 전역 테마 상태를 관리하고 있습니다.
        </Paragraph>
      </Space>
    </Card>
  )
}

// =====================================
// 2. 사용자 정보 관리를 위한 Context 생성
// =====================================
// 사용자 정보를 전역으로 관리하기 위한 Context 생성
const UserContext = createContext()

// 사용자 정보 Context의 Provider 컴포넌트
const UserProvider = ({ children }) => {
  // 사용자 정보 상태 관리 (이름, 이메일, 역할)
  const [user, setUser] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    role: 'user'
  })

  // 사용자 정보를 업데이트하는 함수
  // 기존 사용자 정보를 유지하면서 새로운 데이터만 업데이트
  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }))
  }

  // Context Provider로 사용자 정보와 업데이트 함수를 하위 컴포넌트에 제공
  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

// 사용자 프로필을 표시하는 컴포넌트 (읽기 전용)
const UserProfile = () => {
  // UserContext에서 사용자 정보만 가져옴 (업데이트 함수는 사용하지 않음)
  const { user } = useContext(UserContext)
  
  return (
    <Card title={<><UserOutlined /> 사용자 프로필</>}>
      <Space direction="vertical" size="small">
        {/* 사용자 정보를 읽기 전용으로 표시 */}
        <Text><strong>이름:</strong> {user.name}</Text>
        <Text><strong>이메일:</strong> {user.email}</Text>
        <Text><strong>역할:</strong> <Tag color="blue">{user.role}</Tag></Text>
      </Space>
    </Card>
  )
}

// 사용자 설정을 변경하는 컴포넌트
const UserSettings = () => {
  // UserContext에서 사용자 정보와 업데이트 함수를 모두 가져옴
  const { user, updateUser } = useContext(UserContext)
  
  // 이름 변경 핸들러 함수
  const handleNameChange = (e) => {
    updateUser({ name: e.target.value })
  }

  // 역할 변경 핸들러 함수
  const handleRoleChange = (value) => {
    updateUser({ role: value })
  }

  return (
    <Card title={<><SettingOutlined /> 설정 변경</>}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 이름 변경 입력 필드 */}
        <div>
          <Text>이름 변경:</Text>
          <Input 
            value={user.name}
            onChange={handleNameChange}
            placeholder="이름을 입력하세요"
            style={{ marginTop: 8 }}
          />
        </div>
        {/* 역할 변경 선택 필드 */}
        <div>
          <Text>역할 변경:</Text>
          <Select 
            value={user.role}
            onChange={handleRoleChange}
            style={{ width: '100%', marginTop: 8 }}
          >
            <Option value="user">사용자</Option>
            <Option value="admin">관리자</Option>
            <Option value="guest">게스트</Option>
          </Select>
        </div>
      </Space>
    </Card>
  )
}

// =====================================
// 3. 장바구니 관리를 위한 Context 생성
// =====================================
// 쇼핑몰 장바구니 기능을 전역으로 관리하기 위한 Context
const CartContext = createContext()

// 장바구니 Context의 Provider 컴포넌트
const CartProvider = ({ children }) => {
  // 장바구니 아이템 배열 상태 관리
  const [items, setItems] = useState([])

  // 장바구니에 상품을 추가하는 함수
  const addItem = (item) => {
    setItems(prev => {
      // 이미 존재하는 상품인지 확인
      const existingItem = prev.find(i => i.id === item.id)
      if (existingItem) {
        // 존재하면 수량만 1 증가
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      // 새로운 상품이면 수량 1로 추가
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  // 장바구니에서 상품을 완전히 제거하는 함수
  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  // 특정 상품의 수량을 업데이트하는 함수
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      // 수량이 0 이하이면 상품 제거
      removeItem(id)
      return
    }
    // 수량 업데이트
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  // 총 상품 개수를 계산하는 함수
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  // 총 가격을 계산하는 함수
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // 장바구니 관련 모든 함수와 상태를 Context로 제공
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

// 상품 목록을 표시하고 장바구니에 추가할 수 있는 컴포넌트
const ProductList = () => {
  // CartContext에서 상품 추가 함수만 가져옴
  const { addItem } = useContext(CartContext)

  // 예시 상품 데이터 (실제 프로젝트에서는 API에서 가져올 데이터)
  const products = [
    { id: 1, name: '노트북', price: 1000000 },
    { id: 2, name: '마우스', price: 50000 },
    { id: 3, name: '키보드', price: 100000 }
  ]

  return (
    <Card title="상품 목록">
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {/* 각 상품을 순회하며 표시 */}
        {products.map(product => (
          <div key={product.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px',
            border: '1px solid #f0f0f0',
            borderRadius: '4px'
          }}>
            {/* 상품 정보 표시 */}
            <div>
              <Text strong>{product.name}</Text>
              <br />
              <Text type="secondary">{product.price.toLocaleString()}원</Text>
            </div>
            {/* 장바구니 담기 버튼 */}
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => addItem(product)} // 클릭 시 장바구니에 상품 추가
              size="small"
            >
              담기
            </Button>
          </div>
        ))}
      </Space>
    </Card>
  )
}

// 장바구니 내용을 표시하고 관리하는 컴포넌트
const ShoppingCart = () => {
  // CartContext에서 장바구니 관련 모든 함수와 상태를 가져옴
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useContext(CartContext)

  return (
    <Card 
      title={
        <>
          <ShoppingCartOutlined /> 
          장바구니 ({getTotalItems()}) {/* 헤더에 총 상품 개수 표시 */}
        </>
      }
    >
      {/* 장바구니가 비어있는지 확인 */}
      {items.length === 0 ? (
        <Text type="secondary">장바구니가 비어있습니다.</Text>
      ) : (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {/* 장바구니의 각 상품을 순회하며 표시 */}
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #f0f0f0',
              borderRadius: '4px'
            }}>
              {/* 상품 정보 */}
              <div>
                <Text strong>{item.name}</Text>
                <br />
                <Text type="secondary">{item.price.toLocaleString()}원</Text>
              </div>
              {/* 수량 조절 및 삭제 버튼들 */}
              <Space>
                {/* 수량 감소 버튼 */}
                <Button 
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                />
                {/* 현재 수량 표시 */}
                <Text>{item.quantity}</Text>
                {/* 수량 증가 버튼 */}
                <Button 
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                />
                {/* 상품 완전 삭제 버튼 */}
                <Button 
                  size="small"
                  danger
                  onClick={() => removeItem(item.id)}
                >
                  삭제
                </Button>
              </Space>
            </div>
          ))}
          {/* 구분선 */}
          <Divider />
          {/* 총 가격 표시 */}
          <div style={{ textAlign: 'right' }}>
            <Text strong style={{ fontSize: '16px' }}>
              총합: {getTotalPrice().toLocaleString()}원
            </Text>
          </div>
        </Space>
      )}
    </Card>
  )
}

// =====================================
// 4. 다국어 지원을 위한 Context 생성
// =====================================
// 언어 설정을 전역으로 관리하기 위한 Context
const LanguageContext = createContext()

// 언어 Context의 Provider 컴포넌트
const LanguageProvider = ({ children }) => {
  // 현재 선택된 언어 상태 관리 (기본값: 한국어)
  const [language, setLanguage] = useState('ko')
  
  // 각 언어별 메시지 객체
  const messages = {
    ko: {
      welcome: '환영합니다',
      goodbye: '안녕히 가세요',
      current: '현재 언어'
    },
    en: {
      welcome: 'Welcome',
      goodbye: 'Goodbye',
      current: 'Current Language'
    },
    ja: {
      welcome: 'いらっしゃいませ',
      goodbye: 'さようなら',
      current: '現在の言語'
    }
  }

  // 현재 언어에 맞는 메시지를 가져오는 함수
  const getMessage = (key) => {
    return messages[language][key] || key // 키가 없으면 키 자체를 반환
  }

  // Context Provider로 언어 상태, 변경 함수, 메시지 함수를 하위 컴포넌트에 제공
  return (
    <LanguageContext.Provider value={{ language, setLanguage, getMessage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 언어 선택 및 다국어 메시지 표시 컴포넌트
const LanguageSelector = () => {
  // LanguageContext에서 언어 관련 상태와 함수들을 가져옴
  const { language, setLanguage, getMessage } = useContext(LanguageContext)

  return (
    <Card title={<><GlobalOutlined /> 언어 설정</>}>
      <Space direction="vertical" size="middle">
        {/* 현재 선택된 언어 표시 */}
        <div>
          <Text>{getMessage('current')}: </Text>
          <Tag color="green">
            {language === 'ko' ? '한국어' : language === 'en' ? 'English' : '日本語'}
          </Tag>
        </div>
        {/* 언어 선택 드롭다운 */}
        <Select
          value={language}
          onChange={setLanguage} // 선택 변경 시 언어 상태 업데이트
          style={{ width: '100%' }}
        >
          <Option value="ko">한국어</Option>
          <Option value="en">English</Option>
          <Option value="ja">日本語</Option>
        </Select>
        {/* 선택된 언어에 맞는 메시지 표시 */}
        <div>
          <Text strong>{getMessage('welcome')}</Text> {/* 환영 메시지 */}
          <br />
          <Text type="secondary">{getMessage('goodbye')}</Text> {/* 작별 메시지 */}
        </div>
      </Space>
    </Card>
  )
}

// =====================================
// 메인 페이지 컴포넌트
// =====================================
// useContext 훅의 다양한 사용 사례를 보여주는 메인 컴포넌트
const UseContextPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <CodeOutlined style={{ color: '#722ed1' }} /> 
          useContext Hook 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          useContext를 사용한 다양한 상태 공유 패턴을 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 1. 테마 Context 예제 */}
        <Card title="1. 테마 Context" style={{ backgroundColor: '#f6f6f6' }}>
          <Paragraph>
            <Text code>useContext</Text>를 사용하여 전역 테마 상태를 관리하는 예제입니다.
          </Paragraph>
          {/* ThemeProvider로 감싸서 테마 상태를 하위 컴포넌트에 제공 */}
          <ThemeProvider>
            <ThemeComponent />
          </ThemeProvider>
        </Card>

        {/* 2. 사용자 정보 Context 예제 */}
        <Card title="2. 사용자 정보 Context" style={{ backgroundColor: '#f6f6f6' }}>
          <Paragraph>
            여러 컴포넌트에서 사용자 정보를 공유하고 업데이트하는 예제입니다.
          </Paragraph>
          {/* UserProvider로 감싸서 사용자 정보를 하위 컴포넌트에 제공 */}
          <UserProvider>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <UserProfile /> {/* 읽기 전용 프로필 컴포넌트 */}
              </Col>
              <Col xs={24} md={12}>
                <UserSettings /> {/* 설정 변경 컴포넌트 */}
              </Col>
            </Row>
          </UserProvider>
        </Card>

        {/* 3. 장바구니 Context 예제 */}
        <Card title="3. 장바구니 Context" style={{ backgroundColor: '#f6f6f6' }}>
          <Paragraph>
            복잡한 상태 로직을 Context로 관리하는 쇼핑몰 장바구니 예제입니다.
          </Paragraph>
          {/* CartProvider로 감싸서 장바구니 상태를 하위 컴포넌트에 제공 */}
          <CartProvider>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <ProductList /> {/* 상품 목록 컴포넌트 */}
              </Col>
              <Col xs={24} lg={12}>
                <ShoppingCart /> {/* 장바구니 컴포넌트 */}
              </Col>
            </Row>
          </CartProvider>
        </Card>

        {/* 4. 다국어 지원 Context 예제 */}
        <Card title="4. 다국어 지원 Context" style={{ backgroundColor: '#f6f6f6' }}>
          <Paragraph>
            다국어 지원을 위한 Context 활용 예제입니다.
          </Paragraph>
          {/* LanguageProvider로 감싸서 언어 상태를 하위 컴포넌트에 제공 */}
          <LanguageProvider>
            <LanguageSelector />
          </LanguageProvider>
        </Card>

        {/* useContext 사용법 가이드 */}
        <Card 
          title="useContext 사용법 가이드" 
          style={{ backgroundColor: '#fff2e8', border: '1px solid #ffd591' }}
        >
          <Row gutter={[16, 16]}>
            {/* Context 생성 방법 */}
            <Col xs={24} md={12}>
              <Title level={5}>1. Context 생성</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const MyContext = createContext()`}</pre>
              </div>
            </Col>
            {/* Provider 설정 방법 */}
            <Col xs={24} md={12}>
              <Title level={5}>2. Provider 설정</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`<MyContext.Provider value={data}>
  {children}
</MyContext.Provider>`}</pre>
              </div>
            </Col>
            {/* Context 사용 방법 */}
            <Col xs={24} md={12}>
              <Title level={5}>3. Context 사용</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const data = useContext(MyContext)`}</pre>
              </div>
            </Col>
            {/* 주의사항 */}
            <Col xs={24} md={12}>
              <Title level={5}>4. 주의사항</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>Provider 외부에서 사용 시 기본값 반환</li>
                <li>Context 값 변경 시 모든 소비자 리렌더링</li>
                <li>성능을 위해 Context 분리 고려</li>
              </ul>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  )
}

// 컴포넌트를 기본 내보내기로 설정
export default UseContextPage
