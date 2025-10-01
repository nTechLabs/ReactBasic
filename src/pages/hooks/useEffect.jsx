import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Typography,
  Row,
  Col,
  Switch,
  Progress,
  Alert,
  Statistic,
  Tag,
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  EyeOutlined,
  UserOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Countdown } = Statistic;

const UseEffectPage = () => {
  // 1. 기본 useEffect (컴포넌트 마운트시 실행)
  const [mountTime, setMountTime] = useState('');
  const [triggerCount, setTriggerCount] = useState(0);

  // 2. 의존성 배열이 있는 useEffect
  const [count, setCount] = useState(0);
  const [doubledCount, setDoubledCount] = useState(0);

  // 3. 타이머 useEffect (cleanup 함수 사용)
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 4. API 호출 useEffect
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 5. 윈도우 리사이즈 이벤트
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 6. 로컬 스토리지 동기화
  const [savedText, setSavedText] = useState('');
  const [inputText, setInputText] = useState('');

  // 7. 실시간 시계
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. 컴포넌트 마운트시 실행 (빈 의존성 배열)
  useEffect(() => {
    console.log('컴포넌트가 마운트되었습니다!');
    setMountTime(new Date().toLocaleString());

    // cleanup 함수
    return () => {
      console.log('컴포넌트가 언마운트됩니다!');
    };
  }, []);

  // 2. 렌더링 때마다 실행 (의존성 배열 없음) - 안전한 방법으로 변경
  const renderCountRef = useRef(0);

  // 컴포넌트가 렌더링될 때마다 ref 값 증가 (상태 업데이트 없음)
  renderCountRef.current += 1;

  // 3. count가 변경될 때마다 실행
  useEffect(() => {
    setDoubledCount(count * 2);
    console.log(`count가 ${count}로 변경되었습니다`);
  }, [count]);

  // 4. 타이머 useEffect (cleanup 사용)
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  // 5. API 호출 useEffect
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error('사용자를 찾을 수 없습니다');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // 6. 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 7. 로컬 스토리지 동기화
  useEffect(() => {
    const saved = localStorage.getItem('useEffect-demo-text');
    if (saved) {
      setSavedText(saved);
      setInputText(saved);
    }
  }, []);

  useEffect(() => {
    if (inputText.trim()) {
      localStorage.setItem('useEffect-demo-text', inputText);
      setSavedText(inputText);
    } else if (inputText === '') {
      localStorage.removeItem('useEffect-demo-text');
      setSavedText('');
    }
  }, [inputText]);

  // 8. 실시간 시계
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 유틸리티 함수들
  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <Title level={2}>useEffect 예제 모음</Title>
        <Paragraph>React useEffect 훅의 다양한 사용 패턴을 확인해보세요</Paragraph>
      </div>

      {/* useEffect 기본 개념 도식화 */}
      <Card
        title="📚 useEffect 기본 개념"
        style={{
          backgroundColor: '#e6f7ff',
          border: '2px solid #1890ff',
          borderRadius: '12px',
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 기본 설명 */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ color: '#1890ff', marginBottom: '8px' }}>
              🎯 useEffect는 컴포넌트의 생명주기와 사이드 이펙트를 관리하는 React Hook입니다
            </Title>
            <Text type="secondary">
              컴포넌트의 마운트, 업데이트, 언마운트 시점에 특정 작업을 수행할 수 있습니다
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
                    useEffect(사이드이펙트함수, [의존성배열])
                  </Text>
                </div>

                {/* useEffect 생명주기 */}
                <div style={{ marginTop: '24px' }}>
                  <Title
                    level={5}
                    style={{ textAlign: 'center', marginBottom: '16px', color: '#722ed1' }}
                  >
                    🔄 useEffect 생명주기
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
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#52c41a',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '18px',
                        }}
                      >
                        🚀
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>마운트</strong>
                        <br />
                        컴포넌트가
                        <br />
                        생성될 때
                      </Text>
                    </div>

                    <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '120px' }}>
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
                          fontSize: '18px',
                        }}
                      >
                        🔄
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>업데이트</strong>
                        <br />
                        의존성이
                        <br />
                        변경될 때
                      </Text>
                    </div>

                    <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '120px' }}>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#eb2f96',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '18px',
                        }}
                      >
                        🧹
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>정리(Cleanup)</strong>
                        <br />
                        컴포넌트
                        <br />
                        언마운트 시
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
                          backgroundColor: '#f6ffed',
                          borderRadius: '6px',
                          border: '1px solid #b7eb8f',
                          height: '100%',
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: '12px',
                            color: '#52c41a',
                            display: 'block',
                            marginBottom: '8px',
                          }}
                        >
                          🟢 빈 배열 []
                        </Text>
                        <pre
                          style={{
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace',
                          }}
                        >
                          {`useEffect(() => {
  // 마운트 시 한 번만 실행
  console.log('마운트됨')
}, [])`}
                        </pre>
                        <Text style={{ fontSize: '10px', color: '#666' }}>
                          컴포넌트 마운트 시 한 번만 실행
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
                          {`useEffect(() => {
  // value 변경 시마다 실행
  console.log(value)
}, [value])`}
                        </pre>
                        <Text style={{ fontSize: '10px', color: '#666' }}>
                          의존성 변경 시마다 실행
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
                          🔴 배열 없음 (주의)
                        </Text>
                        <pre
                          style={{
                            margin: '8px 0',
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace',
                          }}
                        >
                          {`useEffect(() => {
  // 매 렌더링마다 실행
  console.log('렌더링됨')
}) // 의존성 배열 없음`}
                        </pre>
                        <Text style={{ fontSize: '10px', color: '#666' }}>
                          매 렌더링마다 실행 (무한루프 주의)
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Cleanup 함수 설명 */}
                <div style={{ marginTop: '24px' }}>
                  <Title
                    level={5}
                    style={{ textAlign: 'center', marginBottom: '16px', color: '#eb2f96' }}
                  >
                    🧹 Cleanup 함수 (정리 함수)
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
                          📝 Cleanup 함수 사용법
                        </Text>
                        <pre
                          style={{
                            margin: 0,
                            fontSize: '10px',
                            lineHeight: '1.4',
                            fontFamily: 'monospace',
                          }}
                        >
                          {`useEffect(() => {
  // 사이드 이펙트 설정
  const timer = setInterval(fn, 1000)
  
  // Cleanup 함수 반환
  return () => {
    clearInterval(timer)
  }
}, [])`}
                        </pre>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div
                        style={{
                          padding: '12px',
                          backgroundColor: '#fff2e8',
                          borderRadius: '6px',
                          border: '1px solid #ffbb96',
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: '12px',
                            color: '#fa541c',
                            display: 'block',
                            marginBottom: '8px',
                          }}
                        >
                          ⚠️ Cleanup이 필요한 경우
                        </Text>
                        <ul
                          style={{
                            margin: '8px 0',
                            paddingLeft: '16px',
                            fontSize: '10px',
                            lineHeight: '1.6',
                            color: '#666',
                          }}
                        >
                          <li>타이머 (setInterval, setTimeout)</li>
                          <li>이벤트 리스너 등록</li>
                          <li>WebSocket 연결</li>
                          <li>구독(Subscription)</li>
                          <li>HTTP 요청 취소</li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* 주요 사용 사례 */}
                <div style={{ marginTop: '24px' }}>
                  <Title
                    level={5}
                    style={{ textAlign: 'center', marginBottom: '16px', color: '#1890ff' }}
                  >
                    💡 주요 사용 사례
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
                    <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
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
                        🌐
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>API 호출</strong>
                        <br />
                        데이터 페칭
                        <br />
                        서버 통신
                      </Text>
                    </div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
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
                        ⏰
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>타이머</strong>
                        <br />
                        setInterval
                        <br />
                        setTimeout
                      </Text>
                    </div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
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
                        👂
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>이벤트 리스너</strong>
                        <br />
                        resize, scroll
                        <br />
                        keydown
                      </Text>
                    </div>

                    <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
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
                        💾
                      </div>
                      <Text style={{ fontSize: '12px', display: 'block' }}>
                        <strong>데이터 동기화</strong>
                        <br />
                        로컬스토리지
                        <br />
                        외부 상태
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 1. 기본 useEffect */}
        <Col xs={24} md={12} lg={8}>
          <Card title="🚀 컴포넌트 생명주기" size="small">
            {/* useEffect 패턴 설명 */}
            <Alert
              message="🎯 useEffect 패턴: 컴포넌트 생명주기 관리"
              description={
                <div>
                  <Text strong style={{ color: '#52c41a' }}>
                    이 예제에서 useEffect가 사용되는 방식:
                  </Text>
                  <ul style={{ marginTop: '8px', marginBottom: '8px', fontSize: '11px' }}>
                    <li>
                      <Text code>{'useEffect(() => {...}, [])'}</Text> - 마운트 시 한 번만 실행
                    </li>
                    <li>마운트 시간을 기록하고 콘솔에 로그 출력</li>
                    <li>cleanup 함수로 언마운트 시 정리 작업</li>
                    <li>renderCountRef로 안전한 렌더링 횟수 추적</li>
                  </ul>
                </div>
              }
              type="success"
              size="small"
              style={{
                backgroundColor: '#f6ffed',
                border: '1px solid #52c41a',
                marginBottom: '12px',
              }}
            />

            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>마운트 시간:</Text>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{mountTime}</div>
              </div>

              <div>
                <Text strong>렌더링 횟수:</Text>
                <div
                  style={{
                    fontSize: '24px',
                    color: '#1890ff',
                    textAlign: 'center',
                    margin: '8px 0',
                  }}
                >
                  {renderCountRef.current}
                </div>
              </div>

              <div>
                <Text strong>수동 트리거 횟수:</Text>
                <div
                  style={{
                    fontSize: '20px',
                    color: '#52c41a',
                    textAlign: 'center',
                    margin: '8px 0',
                  }}
                >
                  {triggerCount}
                </div>
              </div>

              <Button type="primary" block onClick={() => setTriggerCount((prev) => prev + 1)}>
                리렌더링 트리거
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 2. 의존성 배열 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="📊 의존성 배열" size="small">
            {/* useEffect 패턴 설명 */}
            <Alert
              message="📊 useEffect 패턴: 의존성 기반 업데이트"
              description={
                <div>
                  <Text strong style={{ color: '#1890ff' }}>
                    이 예제에서 useEffect가 사용되는 방식:
                  </Text>
                  <ul style={{ marginTop: '8px', marginBottom: '8px', fontSize: '11px' }}>
                    <li>
                      <Text code>{'useEffect(() => {...}, [count])'}</Text> - count 변경시에만 실행
                    </li>
                    <li>count 값이 변경될 때마다 doubledCount 자동 계산</li>
                    <li>의존성 배열로 불필요한 계산 방지</li>
                    <li>콘솔에서 변경 추적 로그 확인 가능</li>
                  </ul>
                </div>
              }
              type="info"
              size="small"
              style={{
                backgroundColor: '#e6f7ff',
                border: '1px solid #1890ff',
                marginBottom: '12px',
              }}
            />

            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Text>Count: </Text>
                <Text style={{ fontSize: '20px', color: '#1890ff' }}>{count}</Text>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Text>Doubled: </Text>
                <Text style={{ fontSize: '20px', color: '#52c41a' }}>{doubledCount}</Text>
              </div>

              <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Button onClick={() => setCount((prev) => prev - 1)}>-</Button>
                <Button type="primary" onClick={() => setCount((prev) => prev + 1)}>
                  +
                </Button>
                <Button onClick={() => setCount(0)}>Reset</Button>
              </Space>

              <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                count가 변경될 때마다 doubledCount가 자동 계산됩니다
              </Text>
            </Space>
          </Card>
        </Col>

        {/* 3. 타이머 (cleanup 함수) */}
        <Col xs={24} md={12} lg={8}>
          <Card title="⏱️ 타이머 (Cleanup)" size="small">
            {/* useEffect 패턴 설명 */}
            <Alert
              message="⏱️ useEffect 패턴: 타이머와 Cleanup"
              description={
                <div>
                  <Text strong style={{ color: '#722ed1' }}>
                    이 예제에서 useEffect가 사용되는 방식:
                  </Text>
                  <ul style={{ marginTop: '8px', marginBottom: '8px', fontSize: '11px' }}>
                    <li>
                      <Text code>{'useEffect(() => {...}, [isRunning])'}</Text> - isRunning 변경시
                      실행
                    </li>
                    <li>setInterval로 1초마다 초 단위 증가</li>
                    <li>cleanup 함수로 clearInterval 호출</li>
                    <li>메모리 누수 방지를 위한 정리 작업</li>
                  </ul>
                </div>
              }
              type="warning"
              size="small"
              style={{
                backgroundColor: '#fff7e6',
                border: '1px solid #fa8c16',
                marginBottom: '12px',
              }}
            />

            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <div style={{ fontSize: '32px', fontFamily: 'monospace', color: '#722ed1' }}>
                {formatTime(seconds)}
              </div>

              <Space>
                <Button
                  type={isRunning ? 'default' : 'primary'}
                  icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? '일시정지' : '시작'}
                </Button>
                <Button icon={<ReloadOutlined />} onClick={resetTimer}>
                  리셋
                </Button>
              </Space>

              <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                cleanup 함수로 메모리 누수 방지
              </Text>
            </Space>
          </Card>
        </Col>

        {/* 4. API 호출 */}
        <Col xs={24} md={12}>
          <Card title="🌐 API 호출" size="small">
            {/* useEffect 패턴 설명 */}
            <Alert
              message="🌐 useEffect 패턴: 비동기 데이터 페칭"
              description={
                <div>
                  <Text strong style={{ color: '#13c2c2' }}>
                    이 예제에서 useEffect가 사용되는 방식:
                  </Text>
                  <ul style={{ marginTop: '8px', marginBottom: '8px', fontSize: '11px' }}>
                    <li>
                      <Text code>{'useEffect(() => {...}, [userId])'}</Text> - userId 변경시 API
                      호출
                    </li>
                    <li>async/await를 사용한 비동기 데이터 페칭</li>
                    <li>로딩 상태와 에러 상태 관리</li>
                    <li>fetch API로 외부 데이터 가져오기</li>
                  </ul>
                </div>
              }
              type="info"
              size="small"
              style={{
                backgroundColor: '#e6fffb',
                border: '1px solid #13c2c2',
                marginBottom: '12px',
              }}
            />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  addonBefore="User ID"
                  type="number"
                  min={1}
                  max={10}
                  value={userId}
                  onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
                />
                <Button type="primary" icon={<ApiOutlined />} loading={loading}>
                  조회
                </Button>
              </Space.Compact>

              {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Progress type="circle" percent={75} size={60} />
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">사용자 정보 로딩중...</Text>
                  </div>
                </div>
              )}

              {error && <Alert message={error} type="error" showIcon size="small" />}

              {user && !loading && (
                <Card size="small" style={{ backgroundColor: '#f6f6f6' }}>
                  <Space direction="vertical" size="small">
                    <Text>
                      <UserOutlined /> <strong>{user.name}</strong>
                    </Text>
                    <Text>📧 {user.email}</Text>
                    <Text>📞 {user.phone}</Text>
                    <Text>🌐 {user.website}</Text>
                    <Text>🏢 {user.company?.name}</Text>
                  </Space>
                </Card>
              )}
            </Space>
          </Card>
        </Col>

        {/* 5. 윈도우 리사이즈 */}
        <Col xs={24} md={12}>
          <Card title="📏 윈도우 크기 감지" size="small">
            {/* useEffect 패턴 설명 */}
            <Alert
              message="📏 useEffect 패턴: 이벤트 리스너 관리"
              description={
                <div>
                  <Text strong style={{ color: '#fa541c' }}>
                    이 예제에서 useEffect가 사용되는 방식:
                  </Text>
                  <ul style={{ marginTop: '8px', marginBottom: '8px', fontSize: '11px' }}>
                    <li>
                      <Text code>{'useEffect(() => {...}, [])'}</Text> - 마운트 시 이벤트 리스너
                      등록
                    </li>
                    <li>window.addEventListener로 resize 이벤트 감지</li>
                    <li>윈도우 크기 변경시 상태 업데이트</li>
                    <li>cleanup에서 removeEventListener로 정리</li>
                  </ul>
                </div>
              }
              type="warning"
              size="small"
              style={{
                backgroundColor: '#fff2e8',
                border: '1px solid #fa541c',
                marginBottom: '12px',
              }}
            />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="너비"
                    value={windowSize.width}
                    suffix="px"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="높이"
                    value={windowSize.height}
                    suffix="px"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>

              <Progress
                percent={Math.min((windowSize.width / 2000) * 100, 100)}
                strokeColor="#1890ff"
                size="small"
              />

              <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                브라우저 창 크기를 변경해보세요!
              </Text>
            </Space>
          </Card>
        </Col>

        {/* 6. 로컬 스토리지 */}
        <Col xs={24} lg={12}>
          <Card title="💾 로컬 스토리지 동기화" size="small">
            {/* useEffect 패턴 설명 */}
            <Alert
              message="💾 useEffect 패턴: 로컬 스토리지 동기화"
              description={
                <div>
                  <Text strong style={{ color: '#722ed1' }}>
                    이 예제에서 useEffect가 사용되는 방식:
                  </Text>
                  <ul style={{ marginTop: '8px', marginBottom: '8px', fontSize: '11px' }}>
                    <li>
                      <Text code>{'useEffect(() => {...}, [])'}</Text> - 마운트 시 로컬 스토리지에서
                      데이터 로드
                    </li>
                    <li>
                      <Text code>{'useEffect(() => {...}, [inputText])'}</Text> - 텍스트 변경시 자동
                      저장
                    </li>
                    <li>localStorage API로 데이터 영속성 제공</li>
                    <li>실시간 입력과 저장소 동기화</li>
                  </ul>
                </div>
              }
              type="info"
              size="small"
              style={{
                backgroundColor: '#f9f0ff',
                border: '1px solid #722ed1',
                marginBottom: '12px',
              }}
            />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Input.TextArea
                placeholder="텍스트를 입력하면 자동으로 로컬 스토리지에 저장됩니다"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
              />

              <div>
                <Text type="secondary">저장된 텍스트:</Text>
                <div
                  style={{
                    padding: '8px',
                    backgroundColor: '#f6f6f6',
                    borderRadius: '4px',
                    marginTop: '4px',
                    minHeight: '40px',
                  }}
                >
                  {savedText || '저장된 텍스트가 없습니다'}
                </div>
              </div>

              <Button
                block
                onClick={() => {
                  localStorage.removeItem('useEffect-demo-text');
                  setSavedText('');
                  setInputText('');
                }}
              >
                로컬 스토리지 초기화
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 7. 실시간 시계 */}
        <Col xs={24} lg={12}>
          <Card title="🕐 실시간 시계" size="small">
            {/* useEffect 패턴 설명 */}
            <Alert
              message="🕐 useEffect 패턴: 실시간 데이터 업데이트"
              description={
                <div>
                  <Text strong style={{ color: '#eb2f96' }}>
                    이 예제에서 useEffect가 사용되는 방식:
                  </Text>
                  <ul style={{ marginTop: '8px', marginBottom: '8px', fontSize: '11px' }}>
                    <li>
                      <Text code>{'useEffect(() => {...}, [])'}</Text> - 마운트 시 타이머 시작
                    </li>
                    <li>setInterval로 1초마다 현재 시간 업데이트</li>
                    <li>Date 객체로 실시간 시간 정보 제공</li>
                    <li>cleanup 함수로 타이머 정리</li>
                  </ul>
                </div>
              }
              type="error"
              size="small"
              style={{
                backgroundColor: '#fff0f6',
                border: '1px solid #eb2f96',
                marginBottom: '12px',
              }}
            />

            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <div
                style={{
                  fontSize: '24px',
                  fontFamily: 'monospace',
                  color: '#722ed1',
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f9f0ff',
                  borderRadius: '8px',
                  width: '100%',
                }}
              >
                {currentTime.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>

              <Space>
                <Tag color="blue">년: {currentTime.getFullYear()}</Tag>
                <Tag color="green">월: {currentTime.getMonth() + 1}</Tag>
                <Tag color="orange">일: {currentTime.getDate()}</Tag>
              </Space>

              <Text type="secondary" style={{ fontSize: '12px' }}>
                <ClockCircleOutlined /> 1초마다 자동 업데이트
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 학습 가이드 */}
      <Card title="📚 useEffect 패턴 가이드" style={{ backgroundColor: '#f6f6f6' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Text strong>빈 의존성 배열 []</Text>
              <Paragraph style={{ fontSize: '12px', margin: '8px 0 0 0' }}>
                컴포넌트 마운트시 한 번만 실행
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Text strong>의존성 배열 [value]</Text>
              <Paragraph style={{ fontSize: '12px', margin: '8px 0 0 0' }}>
                value가 변경될 때마다 실행
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Text strong>의존성 배열 없음</Text>
              <Paragraph style={{ fontSize: '12px', margin: '8px 0 0 0' }}>
                매 렌더링마다 실행 (주의: 무한 루프 위험)
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Text strong>Cleanup 함수</Text>
              <Paragraph style={{ fontSize: '12px', margin: '8px 0 0 0' }}>
                메모리 누수 방지를 위한 정리 작업
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fff7e6',
            borderRadius: '6px',
            border: '1px solid #ffd591',
          }}
        >
          <Text strong style={{ color: '#fa8c16' }}>
            ⚠️ 주의사항:
          </Text>
          <Paragraph style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
            의존성 배열이 없는 useEffect에서 상태를 업데이트하면 무한 루프가 발생할 수 있습니다.
            렌더링 횟수는 useRef를 사용하여 안전하게 추적합니다.
          </Paragraph>
        </div>
      </Card>
    </Space>
  );
};

export default UseEffectPage;
