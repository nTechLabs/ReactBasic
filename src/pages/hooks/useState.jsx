import { useState } from 'react'
import { Card, Button, Input, Space, Typography, Row, Col, Switch, Select, Slider, Tag } from 'antd'
import { 
  PlusOutlined, 
  MinusOutlined, 
  ReloadOutlined, 
  HeartFilled, 
  HeartOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

const UseStatePage = () => {
  // 1. 기본 카운터
  const [count, setCount] = useState(0)

  // 2. 문자열 상태
  const [name, setName] = useState('')
  const [message, setMessage] = useState('안녕하세요!')

  // 3. 불린 상태
  const [isVisible, setIsVisible] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  // 4. 배열 상태
  const [items, setItems] = useState(['React', 'Vue', 'Angular'])
  const [newItem, setNewItem] = useState('')

  // 5. 객체 상태
  const [user, setUser] = useState({
    name: '홍길동',
    age: 25,
    city: '서울'
  })

  // 6. 복잡한 상태 (여러 input)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  // 7. 숫자 상태 (슬라이더)
  const [volume, setVolume] = useState(50)

  // 카운터 함수들
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(0)

  // 배열 조작 함수들
  const addItem = () => {
    if (newItem.trim()) {
      setItems(prev => [...prev, newItem])
      setNewItem('')
    }
  }

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  // 객체 업데이트 함수
  const updateUser = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 폼 데이터 업데이트 함수
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 폼 유효성 검사
  const isEmailValid = formData.email.includes('@')
  const isPasswordValid = formData.password.length >= 6
  const isPasswordMatch = formData.password === formData.confirmPassword

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <Title level={2}>useState 예제 모음</Title>
        <Paragraph>React useState 훅의 다양한 사용 패턴을 확인해보세요</Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {/* 1. 기본 카운터 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="📊 기본 카운터" size="small">
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Title level={1} style={{ margin: 0, color: '#1890ff' }}>{count}</Title>
              <Space>
                <Button icon={<MinusOutlined />} onClick={decrement}>감소</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={increment}>증가</Button>
                <Button icon={<ReloadOutlined />} onClick={reset}>리셋</Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* 2. 문자열 상태 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="📝 문자열 상태" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Text>안녕하세요, <strong>{name || '익명'}</strong>님!</Text>
              
              <Input
                placeholder="메시지를 입력하세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Text>메시지: {message}</Text>
            </Space>
          </Card>
        </Col>

        {/* 3. 불린 상태 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="🔘 불린 상태" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Switch checked={isVisible} onChange={setIsVisible} />
                <Text>표시/숨김</Text>
              </Space>
              {isVisible && <Tag color="green">보이는 상태입니다!</Tag>}
              
              <Space>
                <Button
                  icon={isLiked ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  {isLiked ? '좋아함' : '좋아요'}
                </Button>
              </Space>

              <Space>
                <Button
                  icon={isEnabled ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  onClick={() => setIsEnabled(!isEnabled)}
                  type={isEnabled ? 'primary' : 'default'}
                >
                  {isEnabled ? '활성화됨' : '비활성화됨'}
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* 4. 배열 상태 */}
        <Col xs={24} md={12}>
          <Card title="📋 배열 상태" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="새 프레임워크 추가"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onPressEnter={addItem}
                />
                <Button 
                  type="primary" 
                  onClick={addItem}
                  disabled={!newItem.trim()}
                >
                  추가
                </Button>
              </Space.Compact>
              
              <div style={{ minHeight: '60px', padding: '8px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <Tag
                      key={`${item}-${index}`}
                      closable
                      onClose={() => removeItem(index)}
                      style={{ marginBottom: '4px', marginRight: '4px' }}
                      color={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'green' : 'orange'}
                    >
                      {item}
                    </Tag>
                  ))
                ) : (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    아직 항목이 없습니다. 위에서 추가해보세요!
                  </Text>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  총 <strong>{items.length}</strong>개 항목
                </Text>
                <Button 
                  type="link" 
                  size="small" 
                  onClick={() => setItems([])}
                  disabled={items.length === 0}
                  style={{ padding: 0, fontSize: '12px' }}
                >
                  모두 삭제
                </Button>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 5. 객체 상태 */}
        <Col xs={24} md={12}>
          <Card title="👤 객체 상태" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                addonBefore="이름"
                placeholder="이름을 입력하세요"
                value={user.name}
                onChange={(e) => updateUser('name', e.target.value)}
              />
              <Input
                addonBefore="나이"
                placeholder="나이를 입력하세요"
                type="number"
                min={0}
                max={120}
                value={user.age}
                onChange={(e) => updateUser('age', parseInt(e.target.value) || 0)}
              />
              <Select
                placeholder="거주 도시를 선택하세요"
                value={user.city}
                onChange={(value) => updateUser('city', value)}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="서울">서울특별시</Option>
                <Option value="부산">부산광역시</Option>
                <Option value="대구">대구광역시</Option>
                <Option value="인천">인천광역시</Option>
                <Option value="광주">광주광역시</Option>
                <Option value="대전">대전광역시</Option>
                <Option value="울산">울산광역시</Option>
              </Select>
              
              <Card size="small" style={{ backgroundColor: '#f0f6ff', border: '1px solid #d6e4ff' }}>
                <Title level={5} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>사용자 프로필</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text>👤 이름: <strong>{user.name || '미입력'}</strong></Text>
                  <Text>🎂 나이: <strong>{user.age}세</strong></Text>
                  <Text>🏠 거주지: <strong>{user.city || '미선택'}</strong></Text>
                </div>
              </Card>
              
              <Button 
                type="dashed" 
                block 
                onClick={() => setUser({ name: '홍길동', age: 25, city: '서울' })}
                size="small"
              >
                기본값으로 초기화
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 6. 폼 데이터 */}
        <Col xs={24} lg={12}>
          <Card title="📋 폼 데이터" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Input
                  placeholder="이메일"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  status={formData.email && !isEmailValid ? 'error' : ''}
                />
                {formData.email && !isEmailValid && (
                  <Text type="danger" style={{ fontSize: '12px' }}>올바른 이메일 형식이 아닙니다</Text>
                )}
              </div>
              
              <div>
                <Input.Password
                  placeholder="비밀번호 (최소 6자)"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  status={formData.password && !isPasswordValid ? 'error' : ''}
                />
                {formData.password && !isPasswordValid && (
                  <Text type="danger" style={{ fontSize: '12px' }}>비밀번호는 최소 6자 이상이어야 합니다</Text>
                )}
              </div>
              
              <div>
                <Input.Password
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  status={formData.confirmPassword && !isPasswordMatch ? 'error' : ''}
                />
                {formData.confirmPassword && !isPasswordMatch && (
                  <Text type="danger" style={{ fontSize: '12px' }}>비밀번호가 일치하지 않습니다</Text>
                )}
              </div>
              
              <div style={{ padding: '12px', backgroundColor: '#f6f6f6', borderRadius: '6px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>폼 상태:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag color={isEmailValid || !formData.email ? 'green' : 'red'}>
                    이메일: {isEmailValid || !formData.email ? '✓' : '✗'}
                  </Tag>
                  <Tag color={isPasswordValid || !formData.password ? 'green' : 'red'}>
                    비밀번호: {isPasswordValid || !formData.password ? '✓' : '✗'}
                  </Tag>
                  <Tag color={isPasswordMatch || !formData.confirmPassword ? 'green' : 'red'}>
                    일치: {isPasswordMatch || !formData.confirmPassword ? '✓' : '✗'}
                  </Tag>
                </div>
                <pre style={{ fontSize: '11px', margin: '8px 0 0 0', color: '#666' }}>
{JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 7. 슬라이더 */}
        <Col xs={24} lg={12}>
          <Card title="🔊 슬라이더 상태" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Text>볼륨 조절</Text>
                  <Text strong style={{ fontSize: '16px', color: volume > 70 ? '#ff4d4f' : volume > 30 ? '#1890ff' : '#52c41a' }}>
                    {volume}%
                  </Text>
                </div>
                
                <Slider
                  min={0}
                  max={100}
                  value={volume}
                  onChange={setVolume}
                  marks={{
                    0: { style: { fontSize: '10px' }, label: '무음' },
                    25: { style: { fontSize: '10px' }, label: '낮음' },
                    50: { style: { fontSize: '10px' }, label: '보통' },
                    75: { style: { fontSize: '10px' }, label: '높음' },
                    100: { style: { fontSize: '10px' }, label: '최대' }
                  }}
                  tooltip={{
                    formatter: (value) => `${value}%`
                  }}
                />
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  시각적 볼륨 표시기
                </Text>
                <div 
                  style={{
                    width: '150px',
                    height: '12px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '6px',
                    position: 'relative',
                    margin: '0 auto',
                    border: '1px solid #d9d9d9'
                  }}
                >
                  <div
                    style={{
                      width: `${volume}%`,
                      height: '100%',
                      backgroundColor: volume > 70 ? '#ff4d4f' : volume > 30 ? '#1890ff' : '#52c41a',
                      borderRadius: '6px',
                      transition: 'all 0.3s ease',
                      boxShadow: volume > 0 ? '0 0 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                  />
                </div>
                <Text style={{ fontSize: '11px', color: '#999', marginTop: '4px', display: 'block' }}>
                  {volume === 0 ? '🔇 무음' : volume < 30 ? '🔈 낮음' : volume < 70 ? '🔉 보통' : '🔊 높음'}
                </Text>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <Button size="small" onClick={() => setVolume(0)}>무음</Button>
                <Button size="small" onClick={() => setVolume(25)}>25%</Button>
                <Button size="small" onClick={() => setVolume(50)}>50%</Button>
                <Button size="small" onClick={() => setVolume(75)}>75%</Button>
                <Button size="small" onClick={() => setVolume(100)}>최대</Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default UseStatePage