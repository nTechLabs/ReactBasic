import { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Typography,
  Row,
  Col,
  Switch,
  Select,
  Slider,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
  HeartFilled,
  HeartOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const UseStatePage = () => {
  // 1. 기본 카운터
  const [count, setCount] = useState(0);

  // 2. 문자열 상태
  const [name, setName] = useState('');
  const [message, setMessage] = useState('안녕하세요!');

  // 3. 불린 상태
  const [isVisible, setIsVisible] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  // 4. 배열 상태
  const [items, setItems] = useState(['React', 'Vue', 'Angular']);
  const [newItem, setNewItem] = useState('');

  // 5. 객체 상태
  const [user, setUser] = useState({
    name: '홍길동',
    age: 25,
    city: '서울',
  });

  // 6. 복잡한 상태 (여러 input)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 7. 숫자 상태 (슬라이더)
  const [volume, setVolume] = useState(50);

  // 카운터 함수들
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  // 배열 조작 함수들
  const addItem = () => {
    if (newItem.trim()) {
      setItems((prev) => [...prev, newItem]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 객체 업데이트 함수
  const updateUser = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 폼 데이터 업데이트 함수
  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 폼 유효성 검사
  const isEmailValid = formData.email.includes('@');
  const isPasswordValid = formData.password.length >= 6;
  const isPasswordMatch = formData.password === formData.confirmPassword;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <Title level={2}>useState 예제 모음</Title>
        <Paragraph>React useState 훅의 다양한 사용 패턴을 확인해보세요</Paragraph>
      </div>

      {/* useState 기본 개념 도식화 */}
      <Card
        title="📚 useState 기본 개념"
        style={{
          backgroundColor: '#f8fffe',
          border: '2px solid #52c41a',
          borderRadius: '12px',
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 기본 설명 */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ color: '#52c41a', marginBottom: '8px' }}>
              🎯 useState는 함수형 컴포넌트에서 상태를 관리하는 React Hook입니다
            </Title>
            <Text type="secondary">
              상태값과 그 상태를 변경할 수 있는 함수를 반환하여 컴포넌트의 데이터를 관리합니다
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
                    const [상태값, 상태변경함수] = useState(초기값)
                  </Text>
                </div>

                {/* 화살표와 설명 */}
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={8}>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        backgroundColor: '#e6f7ff',
                        borderRadius: '8px',
                        border: '2px solid #1890ff',
                      }}
                    >
                      <Title level={5} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
                        📊 상태값
                      </Title>
                      <Text style={{ fontSize: '13px' }}>
                        현재 컴포넌트의
                        <br />
                        데이터 상태
                      </Text>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        backgroundColor: '#fff7e6',
                        borderRadius: '8px',
                        border: '2px solid #fa8c16',
                      }}
                    >
                      <Title level={5} style={{ color: '#fa8c16', margin: '0 0 8px 0' }}>
                        ⚡ 상태변경함수
                      </Title>
                      <Text style={{ fontSize: '13px' }}>
                        상태를 업데이트하고
                        <br />
                        리렌더링을 트리거
                      </Text>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
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
                        🎯 초기값
                      </Title>
                      <Text style={{ fontSize: '13px' }}>
                        컴포넌트 첫 렌더링 시<br />
                        사용할 기본값
                      </Text>
                    </div>
                  </Col>
                </Row>

                {/* 동작 과정 */}
                <div style={{ marginTop: '24px' }}>
                  <Title
                    level={5}
                    style={{ textAlign: 'center', marginBottom: '16px', color: '#722ed1' }}
                  >
                    🔄 useState 동작 과정
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
                    <div style={{ flex: 1, textAlign: 'center', minWidth: '120px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#1890ff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontWeight: 'bold',
                        }}
                      >
                        1
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>초기화</strong>
                        <br />
                        초기값으로 상태 설정
                      </Text>
                    </div>

                    <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '120px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#fa8c16',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontWeight: 'bold',
                        }}
                      >
                        2
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>이벤트 발생</strong>
                        <br />
                        사용자 상호작용
                      </Text>
                    </div>

                    <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '120px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#52c41a',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontWeight: 'bold',
                        }}
                      >
                        3
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>상태 업데이트</strong>
                        <br />
                        setState 함수 호출
                      </Text>
                    </div>

                    <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '120px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#722ed1',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontWeight: 'bold',
                        }}
                      >
                        4
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>리렌더링</strong>
                        <br />
                        새로운 값으로 화면 갱신
                      </Text>
                    </div>
                  </div>
                </div>

                {/* 함수형 업데이트 상세 설명 */}
                <div style={{ marginTop: '24px' }}>
                  <Title
                    level={5}
                    style={{ textAlign: 'center', marginBottom: '16px', color: '#eb2f96' }}
                  >
                    ⚠️ 함수형 업데이트가 중요한 이유
                  </Title>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#fff0f6',
                      borderRadius: '8px',
                      border: '2px solid #eb2f96',
                      marginBottom: '16px',
                    }}
                  >
                    <Text
                      strong
                      style={{ color: '#eb2f96', display: 'block', marginBottom: '8px' }}
                    >
                      🚨 문제가 되는 코드 (직접 값 사용)
                    </Text>
                    <pre
                      style={{
                        margin: '8px 0',
                        fontSize: '11px',
                        lineHeight: '1.4',
                        fontFamily: 'monospace',
                        backgroundColor: '#fff',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ffadd6',
                      }}
                    >
                      {`const [count, setCount] = useState(0)

// ❌ 문제: 여러 번 빠르게 클릭하면 예상과 다르게 동작
const handleMultipleClicks = () => {
  setCount(count + 1)  // 첫 번째 클릭: 0 + 1 = 1
  setCount(count + 1)  // 두 번째 클릭: 여전히 0 + 1 = 1 (예상: 2)
  setCount(count + 1)  // 세 번째 클릭: 여전히 0 + 1 = 1 (예상: 3)
}
// 결과: 3이 아닌 1이 됨`}
                    </pre>
                    <Text style={{ fontSize: '11px', color: '#eb2f96' }}>
                      💡 이유: React는 상태 업데이트를 배치(batch)로 처리하므로, count 값이 아직
                      업데이트되지 않은 상태에서 여러 번 호출됨
                    </Text>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#f6ffed',
                      borderRadius: '8px',
                      border: '2px solid #52c41a',
                      marginBottom: '16px',
                    }}
                  >
                    <Text
                      strong
                      style={{ color: '#52c41a', display: 'block', marginBottom: '8px' }}
                    >
                      ✅ 올바른 코드 (함수형 업데이트)
                    </Text>
                    <pre
                      style={{
                        margin: '8px 0',
                        fontSize: '11px',
                        lineHeight: '1.4',
                        fontFamily: 'monospace',
                        backgroundColor: '#fff',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #b7eb8f',
                      }}
                    >
                      {`const [count, setCount] = useState(0)

// ✅ 해결: 함수형 업데이트 사용
const handleMultipleClicks = () => {
  setCount(prev => prev + 1)  // 첫 번째: 0 + 1 = 1
  setCount(prev => prev + 1)  // 두 번째: 1 + 1 = 2  
  setCount(prev => prev + 1)  // 세 번째: 2 + 1 = 3
}
// 결과: 정확히 3이 됨`}
                    </pre>
                    <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                      💡 이유: 함수형 업데이트는 항상 최신 상태값을 받아서 계산하므로 정확한 결과를
                      보장함
                    </Text>
                  </div>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          padding: '12px',
                          backgroundColor: '#fff7e6',
                          borderRadius: '6px',
                          border: '1px solid #ffd591',
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
                          🎯 언제 함수형 업데이트를 사용해야 할까?
                        </Text>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: '16px',
                            fontSize: '11px',
                            lineHeight: '1.6',
                            color: '#666',
                          }}
                        >
                          <li>
                            <strong>이전 상태에 의존:</strong> count + 1, count * 2 등
                          </li>
                          <li>
                            <strong>배열 조작:</strong> [...prev, newItem], prev.filter() 등
                          </li>
                          <li>
                            <strong>객체 업데이트:</strong> {`{...prev, newProperty}`} 등
                          </li>
                          <li>
                            <strong>연속 업데이트:</strong> 빠른 연속 클릭, 애니메이션 등
                          </li>
                          <li>
                            <strong>useEffect 내부:</strong> 의존성 배열 최적화
                          </li>
                        </ul>
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
                          📚 추가 예제들
                        </Text>
                        <pre
                          style={{
                            margin: 0,
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace',
                            color: '#666',
                          }}
                        >
                          {`// 배열에 항목 추가
setItems(prev => [...prev, newItem])

// 배열에서 항목 제거  
setItems(prev => prev.filter(item => item.id !== id))

// 객체 속성 업데이트
setUser(prev => ({ ...prev, name: 'New Name' }))

// 토글 기능
setIsOpen(prev => !prev)

// 카운터 증가 (복수 클릭 안전)
setCount(prev => prev + 1)`}
                        </pre>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* 예제 코드 */}
                <div style={{ marginTop: '24px' }}>
                  <Title
                    level={5}
                    style={{ textAlign: 'center', marginBottom: '12px', color: '#13c2c2' }}
                  >
                    💡 기본 사용법
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
                          📝 기본 코드
                        </Text>
                        <pre
                          style={{
                            margin: 0,
                            fontSize: '11px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace',
                          }}
                        >
                          {`// 1. useState 훅 import
import { useState } from 'react'

// 2. 컴포넌트 내부에서 사용
const [count, setCount] = useState(0)

// 3. 상태 변경
const increment = () => {
  setCount(count + 1)  // 직접 값
  // 또는 (권장)
  setCount(prev => prev + 1)  // 함수형 

  state 초기화시 콜백을 사용하면 heavy 연산이 랜더링될 때마다 불리는 것을 피할 수 있다.
  setState 에서 변경값은 콜백으로 처리해 준다. (prevStat) => { return newState }
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
                          📋 주요 특징
                        </Text>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: '16px',
                            fontSize: '11px',
                            lineHeight: '1.6',
                            color: '#666',
                          }}
                        >
                          <li>함수형 컴포넌트에서만 사용 가능</li>
                          <li>상태 변경 시 자동으로 리렌더링</li>
                          <li>비동기적으로 상태가 업데이트됨</li>
                          <li>이전 상태에 의존적인 경우 함수형 업데이트 권장</li>
                          <li>객체나 배열은 불변성을 유지해야 함</li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* 함수형 업데이트 실습 데모 */}
      <Card
        title="🧪 함수형 업데이트 실습"
        style={{
          backgroundColor: '#f9f0ff',
          border: '2px solid #722ed1',
          borderRadius: '12px',
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ color: '#722ed1', marginBottom: '8px' }}>
              🎮 직접 체험해보세요! 차이점을 확인할 수 있습니다
            </Title>
            <Text type="secondary">
              "빠른 연속 클릭" 버튼을 눌러서 직접 값 vs 함수형 업데이트의 차이를 경험해보세요
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            {/* 직접 값 사용 (문제가 있는 방식) */}
            <Col xs={24} md={12}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#fff0f6',
                  borderRadius: '8px',
                  border: '2px solid #eb2f96',
                  textAlign: 'center',
                }}
              >
                <Title level={5} style={{ color: '#eb2f96', margin: '0 0 12px 0' }}>
                  ❌ 직접 값 사용 (문제)
                </Title>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#eb2f96',
                    marginBottom: '12px',
                    fontFamily: 'monospace',
                  }}
                >
                  {count}
                </div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      // 의도적으로 문제가 있는 방식 사용
                      setCount(count + 1);
                      setCount(count + 1);
                      setCount(count + 1);
                    }}
                    block
                  >
                    빠른 연속 클릭 (+3 시도)
                  </Button>
                  <Text style={{ fontSize: '12px', color: '#eb2f96' }}>
                    버튼을 누르면 3이 아닌 1만 증가합니다
                  </Text>
                  <Button
                    size="small"
                    onClick={() => setCount(0)}
                    ghost
                    style={{ borderColor: '#eb2f96', color: '#eb2f96' }}
                  >
                    리셋
                  </Button>
                </Space>
              </div>
            </Col>

            {/* 함수형 업데이트 (올바른 방식) */}
            <Col xs={24} md={12}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f6ffed',
                  borderRadius: '8px',
                  border: '2px solid #52c41a',
                  textAlign: 'center',
                }}
              >
                <Title level={5} style={{ color: '#52c41a', margin: '0 0 12px 0' }}>
                  ✅ 함수형 업데이트 (올바름)
                </Title>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#52c41a',
                    marginBottom: '12px',
                    fontFamily: 'monospace',
                  }}
                >
                  {count}
                </div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      // 올바른 함수형 업데이트 방식
                      setCount((prev) => prev + 1);
                      setCount((prev) => prev + 1);
                      setCount((prev) => prev + 1);
                    }}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    block
                  >
                    빠른 연속 클릭 (+3 정확히)
                  </Button>
                  <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                    버튼을 누르면 정확히 3이 증가합니다
                  </Text>
                  <Button
                    size="small"
                    onClick={() => setCount(0)}
                    ghost
                    style={{ borderColor: '#52c41a', color: '#52c41a' }}
                  >
                    리셋
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>

          {/* 설명 */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
              marginTop: '16px',
            }}
          >
            <Title level={5} style={{ margin: '0 0 12px 0', color: '#722ed1' }}>
              🔍 왜 이런 차이가 발생할까요?
            </Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong style={{ color: '#eb2f96' }}>
                    ❌ 직접 값 사용 시:
                  </Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '12px' }}>
                    <li>setCount(count + 1) 호출 시 count는 여전히 초기값</li>
                    <li>React가 상태 업데이트를 배치 처리함</li>
                    <li>세 번 모두 같은 값(현재 count)을 참조</li>
                    <li>결과: 예상과 다른 결과</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong style={{ color: '#52c41a' }}>
                    ✅ 함수형 업데이트 시:
                  </Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '12px' }}>
                    <li>setCount(prev {'=>'} prev + 1) 호출 시 항상 최신 값 사용</li>
                    <li>각 업데이트가 이전 업데이트 결과를 기반으로 함</li>
                    <li>순차적으로 정확한 계산이 이루어짐</li>
                    <li>결과: 예상한 대로 정확한 결과</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 1. 기본 카운터 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="📊 기본 카운터" size="small">
            {/* useState 설명 */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f6ff',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #d6e4ff',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: '11px',
                  color: '#1890ff',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                🎯 사용된 useState 패턴
              </Text>
              <Text style={{ fontSize: '10px', lineHeight: '1.4', color: '#666' }}>
                <Text code style={{ fontSize: '10px' }}>
                  const [count, setCount] = useState(0)
                </Text>
                <br />
                • 숫자 타입 상태 관리
                <br />
                • 함수형 업데이트로 안전한 증감
                <br />• 이전 값에 의존한 계산 처리
              </Text>
            </div>

            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Title level={1} style={{ margin: 0, color: '#1890ff' }}>
                {count}
              </Title>
              <Space>
                <Button icon={<MinusOutlined />} onClick={decrement}>
                  감소
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={increment}>
                  증가
                </Button>
                <Button icon={<ReloadOutlined />} onClick={reset}>
                  리셋
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* 2. 문자열 상태 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="📝 문자열 상태" size="small">
            {/* useState 설명 */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f6ffed',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #b7eb8f',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: '11px',
                  color: '#52c41a',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                🎯 사용된 useState 패턴
              </Text>
              <Text style={{ fontSize: '10px', lineHeight: '1.4', color: '#666' }}>
                <Text code style={{ fontSize: '10px' }}>
                  const [name, setName] = useState('')
                </Text>
                <br />
                • 문자열 타입 상태 관리
                <br />
                • 입력값과 상태 동기화
                <br />• 조건부 렌더링 (name || '익명')
              </Text>
            </div>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Text>
                안녕하세요, <strong>{name || '익명'}</strong>님!
              </Text>

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
            {/* useState 설명 */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff7e6',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #ffd591',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: '11px',
                  color: '#fa8c16',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                🎯 사용된 useState 패턴
              </Text>
              <Text style={{ fontSize: '10px', lineHeight: '1.4', color: '#666' }}>
                <Text code style={{ fontSize: '10px' }}>
                  const [isVisible, setIsVisible] = useState(true)
                </Text>
                <br />
                • 불린(boolean) 타입 상태 관리
                <br />
                • 토글 기능 구현
                <br />• 조건부 렌더링 제어
              </Text>
            </div>

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
            {/* useState 설명 */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f9f0ff',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #d3adf7',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: '11px',
                  color: '#722ed1',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                🎯 사용된 useState 패턴
              </Text>
              <Text style={{ fontSize: '10px', lineHeight: '1.4', color: '#666' }}>
                <Text code style={{ fontSize: '10px' }}>
                  const [items, setItems] = useState(['React', 'Vue'])
                </Text>
                <br />
                • 배열 타입 상태 관리
                <br />
                • 스프레드 연산자로 불변성 유지
                <br />• filter 메서드로 항목 제거
              </Text>
            </div>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="새 프레임워크 추가"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onPressEnter={addItem}
                />
                <Button type="primary" onClick={addItem} disabled={!newItem.trim()}>
                  추가
                </Button>
              </Space.Compact>

              <div
                style={{
                  minHeight: '60px',
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px',
                }}
              >
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

              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
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
            {/* useState 설명 */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#e6f7ff',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #91d5ff',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: '11px',
                  color: '#1890ff',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                🎯 사용된 useState 패턴
              </Text>
              <Text style={{ fontSize: '10px', lineHeight: '1.4', color: '#666' }}>
                <Text code style={{ fontSize: '10px' }}>
                  const [user, setUser] = useState({`{name, age, city}`})
                </Text>
                <br />
                • 객체 타입 상태 관리
                <br />
                • 스프레드 연산자로 불변성 유지
                <br />• 특정 속성만 업데이트
              </Text>
            </div>

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

              <Card
                size="small"
                style={{ backgroundColor: '#f0f6ff', border: '1px solid #d6e4ff' }}
              >
                <Title level={5} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
                  사용자 프로필
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text>
                    👤 이름: <strong>{user.name || '미입력'}</strong>
                  </Text>
                  <Text>
                    🎂 나이: <strong>{user.age}세</strong>
                  </Text>
                  <Text>
                    🏠 거주지: <strong>{user.city || '미선택'}</strong>
                  </Text>
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
            {/* useState 설명 */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f6ff',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #d6e4ff',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: '11px',
                  color: '#1890ff',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                🎯 사용된 useState 패턴
              </Text>
              <Text style={{ fontSize: '10px', lineHeight: '1.4', color: '#666' }}>
                <Text code style={{ fontSize: '10px' }}>
                  const [formData, setFormData] = useState({`{email, password}`})
                </Text>
                <br />
                • 복잡한 폼 상태 관리
                <br />
                • 동적 속성 업데이트 [field]: value
                <br />• 유효성 검사와 상태 연동
              </Text>
            </div>

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
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    올바른 이메일 형식이 아닙니다
                  </Text>
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
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    비밀번호는 최소 6자 이상이어야 합니다
                  </Text>
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
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    비밀번호가 일치하지 않습니다
                  </Text>
                )}
              </div>

              <div style={{ padding: '12px', backgroundColor: '#f6f6f6', borderRadius: '6px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  폼 상태:
                </Text>
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
            {/* useState 설명 */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff2e8',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #ffbb96',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: '11px',
                  color: '#fa541c',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                🎯 사용된 useState 패턴
              </Text>
              <Text style={{ fontSize: '10px', lineHeight: '1.4', color: '#666' }}>
                <Text code style={{ fontSize: '10px' }}>
                  const [volume, setVolume] = useState(50)
                </Text>
                <br />
                • 숫자 범위 상태 관리 (0-100)
                <br />
                • 슬라이더 컴포넌트와 상태 동기화
                <br />• 조건부 스타일링 (색상 변경)
              </Text>
            </div>

            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <Text>볼륨 조절</Text>
                  <Text
                    strong
                    style={{
                      fontSize: '16px',
                      color: volume > 70 ? '#ff4d4f' : volume > 30 ? '#1890ff' : '#52c41a',
                    }}
                  >
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
                    100: { style: { fontSize: '10px' }, label: '최대' },
                  }}
                  tooltip={{
                    formatter: (value) => `${value}%`,
                  }}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Text
                  type="secondary"
                  style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}
                >
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
                    border: '1px solid #d9d9d9',
                  }}
                >
                  <div
                    style={{
                      width: `${volume}%`,
                      height: '100%',
                      backgroundColor:
                        volume > 70 ? '#ff4d4f' : volume > 30 ? '#1890ff' : '#52c41a',
                      borderRadius: '6px',
                      transition: 'all 0.3s ease',
                      boxShadow: volume > 0 ? '0 0 8px rgba(0,0,0,0.1)' : 'none',
                    }}
                  />
                </div>
                <Text
                  style={{ fontSize: '11px', color: '#999', marginTop: '4px', display: 'block' }}
                >
                  {volume === 0
                    ? '🔇 무음'
                    : volume < 30
                      ? '🔈 낮음'
                      : volume < 70
                        ? '🔉 보통'
                        : '🔊 높음'}
                </Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <Button size="small" onClick={() => setVolume(0)}>
                  무음
                </Button>
                <Button size="small" onClick={() => setVolume(25)}>
                  25%
                </Button>
                <Button size="small" onClick={() => setVolume(50)}>
                  50%
                </Button>
                <Button size="small" onClick={() => setVolume(75)}>
                  75%
                </Button>
                <Button size="small" onClick={() => setVolume(100)}>
                  최대
                </Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default UseStatePage;
