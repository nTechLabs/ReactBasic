// React hooks와 라우터를 위한 import
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Input, List, Tag, Alert, Descriptions, Breadcrumb, Steps, Divider, Timeline } from 'antd'
// Ant Design 아이콘들을 import
import { 
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  HomeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  HistoryOutlined,
  PlusOutlined,
  MinusOutlined,
  SwapOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography

// =====================================
// 1. 기본 useNavigate 예제 - 프로그래매틱 네비게이션
// =====================================
const BasicNavigationDemo = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [navigationHistory, setNavigationHistory] = useState([])

  // 네비게이션 히스토리 추가 함수
  const addToHistory = (action, path) => {
    const historyItem = {
      id: Date.now(),
      action,
      path,
      timestamp: new Date().toLocaleTimeString()
    }
    setNavigationHistory(prev => [historyItem, ...prev.slice(0, 9)]) // 최근 10개만 유지
  }

  // 다양한 네비게이션 함수들
  const navigateToHome = () => {
    navigate('/')
    addToHistory('navigate', '/')
  }

  const navigateToHooks = () => {
    navigate('/hooks')
    addToHistory('navigate', '/hooks')
  }

  const navigateWithReplace = () => {
    navigate('/hooks/useState', { replace: true })
    addToHistory('navigate (replace)', '/hooks/useState')
  }

  const navigateWithState = () => {
    navigate('/hooks/useEffect', { 
      state: { 
        fromNavigateDemo: true, 
        message: 'useNavigate에서 전달된 상태입니다!' 
      } 
    })
    addToHistory('navigate (with state)', '/hooks/useEffect')
  }

  const goBack = () => {
    navigate(-1)
    addToHistory('navigate(-1)', 'back')
  }

  const goForward = () => {
    navigate(1)
    addToHistory('navigate(1)', 'forward')
  }

  const goBackTwoSteps = () => {
    navigate(-2)
    addToHistory('navigate(-2)', 'back 2 steps')
  }

  return (
    <Card title="기본 useNavigate 사용법">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useNavigate 패턴 설명 */}
        <Alert
          message="🧭 useNavigate 패턴: 프로그래매틱 네비게이션"
          description={
            <div>
              <Text strong style={{ color: '#1890ff' }}>
                이 예제에서 useNavigate가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li><Text code>const navigate = useNavigate()</Text> - 네비게이션 함수 생성</li>
                <li><Text code>navigate('/path')</Text> - 특정 경로로 이동</li>
                <li><Text code>navigate(-1)</Text> - 뒤로 가기 (브라우저 히스토리)</li>
                <li><Text code>navigate(1)</Text> - 앞으로 가기 (브라우저 히스토리)</li>
                <li><Text code>navigate('/path', {`{replace: true}`})</Text> - 현재 히스토리 교체</li>
                <li><Text code>navigate('/path', {`{state: data}`})</Text> - 상태와 함께 이동</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useNavigate는 사용자 액션이나 로직에 따라 프로그래매틱하게 페이지 이동을 제어할 수 있습니다. 
                버튼 클릭, 폼 제출, 조건부 리다이렉트 등에 주로 사용됩니다.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#e6f7ff', border: '1px solid #1890ff' }}
        />
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="현재 위치 정보">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Descriptions size="small" column={1} bordered>
                  <Descriptions.Item label="현재 경로">
                    <Text code>{location.pathname}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="검색 쿼리">
                    <Text code>{location.search || '없음'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="해시">
                    <Text code>{location.hash || '없음'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="전달된 상태">
                    <Text code style={{ fontSize: '11px' }}>
                      {location.state ? JSON.stringify(location.state, null, 2) : '없음'}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card size="small" title="네비게이션 컨트롤">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>기본 네비게이션:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space wrap>
                      <Button 
                        onClick={navigateToHome}
                        icon={<HomeOutlined />}
                        type="primary"
                        size="small"
                      >
                        홈으로
                      </Button>
                      <Button 
                        onClick={navigateToHooks}
                        icon={<ArrowRightOutlined />}
                        size="small"
                      >
                        Hooks 목록
                      </Button>
                    </Space>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text strong>고급 네비게이션:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button 
                        onClick={navigateWithReplace}
                        icon={<SwapOutlined />}
                        block
                        size="small"
                      >
                        Replace로 이동 (히스토리 교체)
                      </Button>
                      <Button 
                        onClick={navigateWithState}
                        icon={<PlusOutlined />}
                        block
                        size="small"
                      >
                        상태와 함께 이동
                      </Button>
                    </Space>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text strong>히스토리 네비게이션:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space wrap>
                      <Button 
                        onClick={goBack}
                        icon={<ArrowLeftOutlined />}
                        size="small"
                      >
                        뒤로
                      </Button>
                      <Button 
                        onClick={goForward}
                        icon={<ArrowRightOutlined />}
                        size="small"
                      >
                        앞으로
                      </Button>
                      <Button 
                        onClick={goBackTwoSteps}
                        icon={<MinusOutlined />}
                        size="small"
                      >
                        2단계 뒤로
                      </Button>
                    </Space>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 네비게이션 히스토리 */}
        <Card size="small" title="네비게이션 히스토리">
          <List
            size="small"
            dataSource={navigationHistory}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Tag color="blue">{item.action}</Tag>
                  <Text>{item.path}</Text>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {item.timestamp}
                  </Text>
                </Space>
              </List.Item>
            )}
            locale={{ emptyText: '네비게이션 기록이 없습니다' }}
          />
        </Card>
        
        <Alert
          message="🔄 프로그래매틱 네비게이션의 장점"
          description="사용자 액션이나 비즈니스 로직에 따라 동적으로 페이지 이동을 제어할 수 있습니다. 폼 제출 후 리다이렉트, 권한 체크 후 이동, 조건부 네비게이션 등에 활용됩니다."
          type="success"
          showIcon
        />
      </Space>
    </Card>
  )
}

// =====================================
// 2. 조건부 네비게이션과 가드 예제
// =====================================
const ConditionalNavigationDemo = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('user')
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [navigationAttempts, setNavigationAttempts] = useState([])

  // 네비게이션 시도 기록
  const recordAttempt = (action, result, reason = '') => {
    const attempt = {
      id: Date.now(),
      action,
      result,
      reason,
      timestamp: new Date().toLocaleTimeString()
    }
    setNavigationAttempts(prev => [attempt, ...prev.slice(0, 4)])
  }

  // 로그인 체크 후 네비게이션
  const navigateWithAuthCheck = (path, requiredRole = null) => {
    if (!isLoggedIn) {
      recordAttempt(`navigate to ${path}`, 'blocked', '로그인 필요')
      alert('로그인이 필요합니다!')
      return
    }

    if (requiredRole && userRole !== requiredRole) {
      recordAttempt(`navigate to ${path}`, 'blocked', `${requiredRole} 권한 필요`)
      alert(`${requiredRole} 권한이 필요합니다!`)
      return
    }

    navigate(path)
    recordAttempt(`navigate to ${path}`, 'success', '권한 확인 완료')
  }

  // 폼 검증 후 네비게이션
  const submitFormAndNavigate = () => {
    if (!formData.name || !formData.email) {
      recordAttempt('form submit', 'blocked', '필수 필드 누락')
      alert('이름과 이메일을 모두 입력해주세요!')
      return
    }

    if (!formData.email.includes('@')) {
      recordAttempt('form submit', 'blocked', '이메일 형식 오류')
      alert('올바른 이메일 형식을 입력해주세요!')
      return
    }

    // 폼 제출 성공 시 결과 페이지로 이동
    navigate('/hooks/useEffect', { 
      state: { 
        formSubmitted: true, 
        userData: formData,
        message: '폼이 성공적으로 제출되었습니다!'
      } 
    })
    recordAttempt('form submit', 'success', '폼 제출 및 이동 완료')
  }

  // 뒤로 가기 확인
  const confirmAndGoBack = () => {
    const hasUnsavedChanges = formData.name || formData.email
    
    if (hasUnsavedChanges) {
      const confirmResult = window.confirm('저장되지 않은 변경사항이 있습니다. 정말 나가시겠습니까?')
      if (!confirmResult) {
        recordAttempt('go back', 'blocked', '사용자가 취소')
        return
      }
    }

    navigate(-1)
    recordAttempt('go back', 'success', '확인 후 이동')
  }

  return (
    <Card title="조건부 네비게이션과 가드 (useNavigate)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 조건부 네비게이션 패턴 설명 */}
        <Alert
          message="🛡️ 조건부 네비게이션 패턴: 가드와 검증"
          description={
            <div>
              <Text strong style={{ color: '#52c41a' }}>
                이 예제에서 사용되는 고급 패턴:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>로그인 상태 확인 후 네비게이션</li>
                <li>사용자 권한 체크</li>
                <li>폼 검증 후 이동</li>
                <li>unsaved changes 확인</li>
                <li>네비게이션 시도 로깅</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: 실제 애플리케이션에서 사용되는 보안과 사용자 경험을 고려한 
                네비게이션 가드 패턴을 구현합니다.
              </Text>
            </div>
          }
          type="success"
          showIcon
          style={{ backgroundColor: '#f6ffed', border: '1px solid #52c41a' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="사용자 상태 시뮬레이션">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>로그인 상태:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button.Group>
                      <Button
                        type={isLoggedIn ? 'primary' : 'default'}
                        onClick={() => setIsLoggedIn(true)}
                        size="small"
                      >
                        로그인
                      </Button>
                      <Button
                        type={!isLoggedIn ? 'primary' : 'default'}
                        onClick={() => setIsLoggedIn(false)}
                        size="small"
                      >
                        로그아웃
                      </Button>
                    </Button.Group>
                  </div>
                </div>

                <div>
                  <Text>사용자 권한:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button.Group>
                      <Button
                        type={userRole === 'user' ? 'primary' : 'default'}
                        onClick={() => setUserRole('user')}
                        size="small"
                      >
                        일반 사용자
                      </Button>
                      <Button
                        type={userRole === 'admin' ? 'primary' : 'default'}
                        onClick={() => setUserRole('admin')}
                        size="small"
                      >
                        관리자
                      </Button>
                    </Button.Group>
                  </div>
                </div>

                <div>
                  <Text>현재 상태:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={isLoggedIn ? 'green' : 'red'}>
                      {isLoggedIn ? '로그인됨' : '로그아웃됨'}
                    </Tag>
                    <Tag color="blue">{userRole}</Tag>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="가드된 네비게이션">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  onClick={() => navigateWithAuthCheck('/hooks/useState')}
                  icon={<UserOutlined />}
                  block
                  size="small"
                >
                  사용자 페이지 (로그인 필요)
                </Button>
                <Button
                  onClick={() => navigateWithAuthCheck('/hooks/useContext', 'admin')}
                  icon={<SettingOutlined />}
                  block
                  size="small"
                >
                  관리자 페이지 (관리자 권한 필요)
                </Button>
                <Button
                  onClick={() => navigateWithAuthCheck('/hooks/useCallback')}
                  icon={<ShoppingCartOutlined />}
                  block
                  size="small"
                >
                  일반 페이지 (로그인 필요)
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 폼 예제 */}
        <Card size="small" title="폼 검증 후 네비게이션">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <Button
                  type="primary"
                  onClick={submitFormAndNavigate}
                  block
                >
                  폼 제출 후 이동
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <Text strong>확인 후 뒤로 가기:</Text>
                <div style={{ marginTop: 8 }}>
                  <Button
                    onClick={confirmAndGoBack}
                    icon={<ArrowLeftOutlined />}
                    block
                  >
                    변경사항 확인 후 뒤로
                  </Button>
                </div>
                <Text type="secondary" style={{ fontSize: '12px', marginTop: 8, display: 'block' }}>
                  폼에 데이터가 있으면 확인 창이 표시됩니다
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 네비게이션 시도 로그 */}
        <Card size="small" title="네비게이션 시도 로그">
          <List
            size="small"
            dataSource={navigationAttempts}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Tag color={item.result === 'success' ? 'green' : 'red'}>
                    {item.result}
                  </Tag>
                  <Text>{item.action}</Text>
                  {item.reason && (
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      - {item.reason}
                    </Text>
                  )}
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {item.timestamp}
                  </Text>
                </Space>
              </List.Item>
            )}
            locale={{ emptyText: '네비게이션 시도 기록이 없습니다' }}
          />
        </Card>

        <Alert
          message="🔐 보안과 UX의 균형"
          description="적절한 가드와 검증을 통해 보안을 유지하면서도 사용자에게 명확한 피드백을 제공하는 것이 중요합니다."
          type="warning"
          showIcon
        />
      </Space>
    </Card>
  )
}

// =====================================
// 3. 동적 라우팅과 매개변수 전달 예제
// =====================================
const DynamicRoutingDemo = () => {
  const navigate = useNavigate()
  const [routeHistory, setRouteHistory] = useState([])
  const [customPath, setCustomPath] = useState('')
  const [queryParams, setQueryParams] = useState({ page: '1', size: '10', filter: '' })

  // 라우트 히스토리 추가
  const addRouteHistory = (type, path, params = null) => {
    const historyItem = {
      id: Date.now(),
      type,
      path,
      params,
      timestamp: new Date().toLocaleTimeString()
    }
    setRouteHistory(prev => [historyItem, ...prev.slice(0, 4)])
  }

  // 동적 라우트 네비게이션
  const navigateToUserProfile = (userId, username) => {
    const path = `/hooks/useParams/user/${userId}/${username}`
    navigate(path)
    addRouteHistory('dynamic route', path, { userId, username })
  }

  const navigateToProduct = (category, productId) => {
    const path = `/hooks/useParams/shop/${category}/product/${productId}`
    navigate(path)
    addRouteHistory('nested route', path, { category, productId })
  }

  // 쿼리 매개변수와 함께 네비게이션
  const navigateWithQuery = () => {
    const searchParams = new URLSearchParams(queryParams)
    const path = `/hooks/useMemo?${searchParams.toString()}`
    navigate(path)
    addRouteHistory('with query', path, queryParams)
  }

  // 해시와 함께 네비게이션
  const navigateWithHash = (section) => {
    const path = `/hooks/useEffect#${section}`
    navigate(path)
    addRouteHistory('with hash', path, { section })
  }

  // 커스텀 경로 네비게이션
  const navigateToCustomPath = () => {
    if (!customPath) {
      alert('경로를 입력해주세요!')
      return
    }
    
    try {
      navigate(customPath)
      addRouteHistory('custom path', customPath)
      setCustomPath('')
    } catch {
      alert('유효하지 않은 경로입니다!')
    }
  }

  // 사전 정의된 샘플 데이터
  const sampleUsers = [
    { id: '123', name: 'john', displayName: 'John Doe' },
    { id: '456', name: 'jane', displayName: 'Jane Smith' },
    { id: '789', name: 'admin', displayName: 'Admin User' }
  ]

  const sampleProducts = [
    { category: 'electronics', id: 'laptop', name: '노트북' },
    { category: 'electronics', id: 'phone', name: '스마트폰' },
    { category: 'books', id: 'novel', name: '소설' },
    { category: 'clothing', id: 'shirt', name: '셔츠' }
  ]

  const sections = ['basic', 'advanced', 'cleanup', 'api-calls']

  return (
    <Card title="동적 라우팅과 매개변수 전달 (useNavigate)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 동적 라우팅 패턴 설명 */}
        <Alert
          message="🚀 동적 라우팅 패턴: 매개변수와 상태 전달"
          description={
            <div>
              <Text strong style={{ color: '#722ed1' }}>
                이 예제에서 사용되는 동적 네비게이션 패턴:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li><Text code>navigate(`/user/${`{userId}`}/${`{username}`}`)</Text> - 경로 매개변수</li>
                <li><Text code>navigate(`/path?${`{searchParams}`}`)</Text> - 쿼리 매개변수</li>
                <li><Text code>navigate(`/path#${`{hash}`}`)</Text> - 해시 프래그먼트</li>
                <li><Text code>navigate(path, {`{state: data}`})</Text> - 상태 객체 전달</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: URL을 동적으로 구성하여 다양한 데이터와 상태를 페이지 간에 전달할 수 있습니다. 
                SEO 친화적이며 북마크 가능한 URL을 생성합니다.
              </Text>
            </div>
          }
          type="warning"
          showIcon
          style={{ backgroundColor: '#f9f0ff', border: '1px solid #722ed1' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="동적 사용자 프로필">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>사용자 프로필로 이동:</Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {sampleUsers.map(user => (
                    <Button
                      key={user.id}
                      onClick={() => navigateToUserProfile(user.id, user.name)}
                      block
                      size="small"
                    >
                      {user.displayName} (ID: {user.id})
                    </Button>
                  ))}
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="중첩 상품 라우트">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>상품 페이지로 이동:</Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {sampleProducts.map(product => (
                    <Button
                      key={`${product.category}-${product.id}`}
                      onClick={() => navigateToProduct(product.category, product.id)}
                      block
                      size="small"
                    >
                      {product.name} ({product.category})
                    </Button>
                  ))}
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 쿼리 매개변수 예제 */}
        <Card size="small" title="쿼리 매개변수와 함께 네비게이션">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  placeholder="페이지 번호"
                  value={queryParams.page}
                  onChange={(e) => setQueryParams(prev => ({ ...prev, page: e.target.value }))}
                  addonBefore="page"
                />
                <Input
                  placeholder="페이지 크기"
                  value={queryParams.size}
                  onChange={(e) => setQueryParams(prev => ({ ...prev, size: e.target.value }))}
                  addonBefore="size"
                />
                <Input
                  placeholder="필터"
                  value={queryParams.filter}
                  onChange={(e) => setQueryParams(prev => ({ ...prev, filter: e.target.value }))}
                  addonBefore="filter"
                />
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>생성될 URL:</Text>
                <Text code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                  /hooks/useMemo?{new URLSearchParams(queryParams).toString()}
                </Text>
                <Button
                  type="primary"
                  onClick={navigateWithQuery}
                  block
                >
                  쿼리와 함께 이동
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 해시 네비게이션 */}
        <Card size="small" title="해시 프래그먼트 네비게이션">
          <Space wrap>
            {sections.map(section => (
              <Button
                key={section}
                onClick={() => navigateWithHash(section)}
                size="small"
              >
                #{section}
              </Button>
            ))}
          </Space>
        </Card>

        {/* 커스텀 경로 입력 */}
        <Card size="small" title="커스텀 경로 네비게이션">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="/hooks/useState 또는 /about 등"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              onPressEnter={navigateToCustomPath}
            />
            <Button
              type="primary"
              onClick={navigateToCustomPath}
            >
              이동
            </Button>
          </Space.Compact>
        </Card>

        {/* 라우트 히스토리 */}
        <Card size="small" title="동적 라우팅 히스토리">
          <Timeline
            size="small"
            items={routeHistory.map(item => ({
              color: item.type === 'custom path' ? 'red' : item.type === 'dynamic route' ? 'blue' : 'green',
              children: (
                <div>
                  <Space direction="vertical" size="small">
                    <Space>
                      <Tag color={item.type === 'custom path' ? 'red' : item.type === 'dynamic route' ? 'blue' : 'green'}>
                        {item.type}
                      </Tag>
                      <Text code style={{ fontSize: '11px' }}>{item.path}</Text>
                      <Text type="secondary" style={{ fontSize: '10px' }}>
                        {item.timestamp}
                      </Text>
                    </Space>
                    {item.params && (
                      <Text type="secondary" style={{ fontSize: '10px' }}>
                        매개변수: {JSON.stringify(item.params)}
                      </Text>
                    )}
                  </Space>
                </div>
              )
            }))}
          />
        </Card>

        <Alert
          message="🎯 동적 라우팅의 활용"
          description="사용자 ID, 카테고리, 검색 조건 등을 URL에 포함하여 의미있는 주소를 만들고, 직접 접근이나 북마크가 가능한 페이지를 구성할 수 있습니다."
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
const UseNavigatePage = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <ArrowRightOutlined style={{ color: '#1890ff' }} /> 
          useNavigate Hook 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          React Router의 useNavigate를 사용한 프로그래매틱 네비게이션 패턴을 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* useNavigate 기본 개념 도식화 */}
        <Card 
          title="📚 useNavigate 기본 개념" 
          style={{ 
            backgroundColor: '#e6f7ff', 
            border: '2px solid #1890ff',
            borderRadius: '12px'
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 기본 설명 */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ color: '#1890ff', marginBottom: '8px' }}>
                🎯 useNavigate는 React Router에서 프로그래매틱 네비게이션을 제공하는 Hook입니다
              </Title>
              <Text type="secondary">
                링크 클릭이 아닌 JavaScript 코드를 통해 페이지 이동을 제어할 수 있게 해주는 강력한 도구입니다
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
                      const navigate = useNavigate()
                    </Text>
                  </div>

                  {/* Link vs useNavigate 비교 */}
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                      <div style={{ 
                        textAlign: 'center',
                        padding: '16px',
                        backgroundColor: '#fff2e8',
                        borderRadius: '8px',
                        border: '2px solid #fa8c16'
                      }}>
                        <Title level={5} style={{ color: '#fa8c16', margin: '0 0 8px 0' }}>
                          🔗 Link 컴포넌트
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 선언적 네비게이션<br/>
                          • 사용자 클릭 기반<br/>
                          • JSX에서 직접 사용<br/>
                          • 접근성 기본 제공
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div style={{ 
                        textAlign: 'center',
                        padding: '16px',
                        backgroundColor: '#e6f7ff',
                        borderRadius: '8px',
                        border: '2px solid #1890ff'
                      }}>
                        <Title level={5} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
                          🧭 useNavigate Hook
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 명령적 네비게이션<br/>
                          • 로직 기반 이동<br/>
                          • JavaScript에서 사용<br/>
                          • 조건부 제어 가능
                        </Text>
                      </div>
                    </Col>
                  </Row>

                  {/* useNavigate 작동 원리 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '16px', color: '#722ed1' }}>
                      🔍 useNavigate 작동 원리
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
                          <strong>이벤트 발생</strong><br/>
                          버튼 클릭, 폼 제출<br/>
                          조건 만족 등
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
                          <strong>조건 확인</strong><br/>
                          권한, 인증상태<br/>
                          폼 검증 등
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
                          <strong>navigate 호출</strong><br/>
                          경로와 옵션<br/>
                          설정하여 이동
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
                          <strong>페이지 이동</strong><br/>
                          브라우저 히스토리<br/>
                          업데이트 및 이동
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 네비게이션 옵션들 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '16px', color: '#13c2c2' }}>
                      📋 useNavigate 옵션들
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
                            🟢 기본 네비게이션
                          </Text>
                          <pre style={{ 
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`navigate('/path')
navigate('/user/123')
navigate('/product/abc')`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            단순한 경로 이동
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
                            🟡 히스토리 제어
                          </Text>
                          <pre style={{ 
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`navigate(-1)    // 뒤로
navigate(1)     // 앞으로
navigate(-2)    // 2단계 뒤로`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            브라우저 히스토리 조작
                          </Text>
                        </div>
                      </Col>
                      
                      <Col xs={24} md={8}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#f9f0ff',
                          borderRadius: '6px',
                          border: '1px solid #d3adf7',
                          height: '100%'
                        }}>
                          <Text strong style={{ fontSize: '12px', color: '#722ed1', display: 'block', marginBottom: '8px' }}>
                            🟣 고급 옵션
                          </Text>
                          <pre style={{ 
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`navigate('/path', {
  replace: true,
  state: { data }
})`}
                          </pre>
                          <Text style={{ fontSize: '10px', color: '#666' }}>
                            히스토리 교체, 상태 전달
                          </Text>
                        </div>
                      </Col>
                    </Row>
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
                        }}>📝</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>폼 제출 후</strong><br/>
                          성공/실패에 따른<br/>
                          페이지 이동
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
                        }}>🔐</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>인증 가드</strong><br/>
                          로그인 상태 확인<br/>
                          후 리다이렉트
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
                        }}>⏰</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>시간 기반</strong><br/>
                          타이머 만료<br/>
                          자동 이동
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
                        }}>🔄</div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>조건부 이동</strong><br/>
                          사용자 권한이나<br/>
                          상태에 따른 이동
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
                            📝 폼 제출 후 리다이렉트
                          </Text>
                          <pre style={{ 
                            margin: '0 0 8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`const handleSubmit = async (formData) => {
  try {
    await submitForm(formData)
    navigate('/success', { 
      state: { message: '제출 완료!' } 
    })
  } catch (error) {
    navigate('/error', { 
      state: { error: error.message } 
    })
  }
}`}
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
                            폼 제출 결과에 따라 다른 페이지로 이동하며 상태 정보도 함께 전달. 
                            사용자에게 명확한 피드백 제공.
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
                            🔐 인증 가드와 리다이렉트
                          </Text>
                          <pre style={{ 
                            margin: '0 0 8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace'
                          }}>
{`const protectedAction = () => {
  if (!isAuthenticated) {
    navigate('/login', { 
      state: { 
        from: location.pathname,
        message: '로그인이 필요합니다' 
      } 
    })
    return
  }
  
  // 인증된 사용자 로직
  navigate('/dashboard')
}`}
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
                            인증 상태를 확인하고 미인증 시 로그인 페이지로 리다이렉트. 
                            원래 페이지 정보를 state로 전달하여 로그인 후 복귀 가능.
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 주의사항 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: '12px', color: '#fa541c' }}>
                      ⚠️ useNavigate 사용 시 주의사항
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
                            🚨 성능과 사용성
                          </Text>
                          <ul style={{ 
                            margin: '8px 0',
                            paddingLeft: '16px',
                            fontSize: '11px',
                            lineHeight: '1.6',
                            color: '#666'
                          }}>
                            <li>과도한 자동 리다이렉트 지양</li>
                            <li>사용자 의도와 맞는 네비게이션</li>
                            <li>뒤로 가기 버튼 고려</li>
                            <li>무한 리다이렉트 루프 방지</li>
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
                            <li>React Router 환경에서만 사용</li>
                            <li>적절한 로딩 상태 표시</li>
                            <li>에러 처리와 fallback 제공</li>
                            <li>사용자에게 명확한 피드백</li>
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

        {/* 예제들 */}
        <BasicNavigationDemo />
        <ConditionalNavigationDemo />
        <DynamicRoutingDemo />

        {/* useNavigate 사용법 가이드 */}
        <Card 
          title="useNavigate 사용법 가이드" 
          style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={5}>1. 기본 사용법</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const navigate = useNavigate()

// 기본 네비게이션
navigate('/home')
navigate('/user/123')

// 뒤로/앞으로 가기
navigate(-1) // 뒤로
navigate(1)  // 앞으로`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. 고급 옵션</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`// 히스토리 교체 (뒤로가기 방지)
navigate('/path', { replace: true })

// 상태와 함께 이동
navigate('/path', { 
  state: { user: userData } 
})`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 조건부 네비게이션</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`if (isAuthenticated) {
  navigate('/dashboard')
} else {
  navigate('/login', { 
    state: { from: location.pathname } 
  })
}`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>4. 주의사항</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>React Router 환경에서만 동작</li>
                <li>사용자 액션 기반으로 사용</li>
                <li>무한 리다이렉트 루프 방지</li>
                <li>적절한 에러 처리 필요</li>
              </ul>
            </Col>
          </Row>
          
          <Alert
            message="useNavigate vs Link"
            description="Link는 선언적 네비게이션(사용자 클릭), useNavigate는 명령적 네비게이션(로직 기반)에 사용됩니다. 상황에 맞는 선택이 중요합니다."
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
export default UseNavigatePage
