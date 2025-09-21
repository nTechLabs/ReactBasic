// React hooks와 DOM 조작을 위한 import
import { useState, useRef, useEffect, useCallback } from 'react';
// Ant Design UI 컴포넌트들을 import
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Input,
  Slider,
  Alert,
  Progress,
  Statistic,
  Divider,
} from 'antd';
// Ant Design 아이콘들을 import
import {
  AimOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  SelectOutlined,
} from '@ant-design/icons';

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography;

// =====================================
// 1. DOM 요소 직접 접근 예제
// =====================================
const DOMAccessDemo = () => {
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setInputValue('');
      inputRef.current.focus();
    }
  };

  const focusTextarea = () => {
    textareaRef.current?.focus();
  };

  const selectAllText = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  return (
    <Card title="DOM 요소 직접 접근 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useRef 패턴 설명 */}
        <Alert
          message="🎯 useRef 패턴: DOM 직접 제어"
          description={
            <div>
              <Text strong style={{ color: '#fa541c' }}>
                이 예제에서 useRef가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>inputRef = useRef(null)</Text> - input DOM 요소를 참조
                </li>
                <li>
                  <Text code>textareaRef = useRef(null)</Text> - textarea DOM 요소를 참조
                </li>
                <li>
                  <Text code>inputRef.current.focus()</Text> - DOM API 직접 호출
                </li>
                <li>
                  <Text code>textareaRef.current.select()</Text> - 텍스트 선택 기능
                </li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useState로는 불가능한 DOM 메서드 직접 호출이 가능합니다. focus(), select(),
                scroll() 등의 브라우저 API를 React에서 안전하게 사용할 수 있습니다.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#fff7e6', border: '1px solid #fa541c' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="Input 요소 제어">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  ref={inputRef}
                  placeholder="여기에 텍스트를 입력하세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Space wrap>
                  <Button
                    onClick={focusInput}
                    icon={<SelectOutlined />}
                    type="primary"
                    size="small"
                  >
                    포커스
                  </Button>
                  <Button onClick={clearInput} icon={<ReloadOutlined />} size="small">
                    클리어 & 포커스
                  </Button>
                </Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  입력된 텍스트: "{inputValue}"
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="Textarea 요소 제어">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input.TextArea
                  ref={textareaRef}
                  rows={4}
                  placeholder="여러 줄 텍스트를 입력하세요..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
                <Space wrap>
                  <Button
                    onClick={focusTextarea}
                    icon={<SelectOutlined />}
                    type="primary"
                    size="small"
                  >
                    포커스
                  </Button>
                  <Button onClick={selectAllText} icon={<EyeOutlined />} size="small">
                    전체 선택
                  </Button>
                  <Button onClick={scrollToBottom} icon={<FileTextOutlined />} size="small">
                    맨 아래로
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>

        <Alert
          message="DOM 직접 접근의 활용"
          description="useRef를 사용하여 DOM 요소에 직접 접근할 수 있습니다. focus(), select(), scroll 등의 DOM API를 호출할 수 있습니다."
          type="info"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 2. 이전 값 저장 예제
// =====================================
const PreviousValueDemo = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('홍길동');
  const prevCountRef = useRef();
  const prevNameRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  useEffect(() => {
    prevNameRef.current = name;
  }, [name]);

  return (
    <Card title="이전 값 저장 및 비교 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useRef 패턴 설명 */}
        <Alert
          message="💾 useRef 패턴: 이전 값 추적과 비교"
          description={
            <div>
              <Text strong style={{ color: '#1890ff' }}>
                이 예제에서 useRef가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>prevCountRef = useRef()</Text> - 이전 카운트 값 저장
                </li>
                <li>
                  <Text code>prevNameRef = useRef()</Text> - 이전 이름 값 저장
                </li>
                <li>
                  <Text code>{'useEffect(() => prevCountRef.current = count, [count])'}</Text> - 값
                  변경 추적
                </li>
                <li>
                  <Text code>count - prevCountRef.current</Text> - 변화량 계산
                </li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useRef는 리렌더링 간에 값을 유지하므로 이전 상태와 현재 상태를 비교할 수
                있습니다. 변화량 계산, 애니메이션, 성능 최적화에 매우 유용한 패턴입니다.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#e6f7ff', border: '1px solid #1890ff' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="카운터 이전 값 추적">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Statistic title="현재 값" value={count} precision={0} />
                  <Text type="secondary">이전 값: {prevCountRef.current ?? '없음'}</Text>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <Button onClick={() => setCount((c) => c + 1)} type="primary">
                      증가
                    </Button>
                    <Button onClick={() => setCount((c) => c - 1)}>감소</Button>
                    <Button onClick={() => setCount(0)} danger>
                      리셋
                    </Button>
                  </Space>
                </div>

                {prevCountRef.current !== undefined && (
                  <Alert
                    message={`변화량: ${count - prevCountRef.current}`}
                    type={
                      count > prevCountRef.current
                        ? 'success'
                        : count < prevCountRef.current
                          ? 'error'
                          : 'info'
                    }
                    size="small"
                  />
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="이름 변경 추적">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>현재 이름: </Text>
                  <Text>{name}</Text>
                </div>
                <div>
                  <Text strong>이전 이름: </Text>
                  <Text type="secondary">{prevNameRef.current ?? '없음'}</Text>
                </div>

                <Space wrap>
                  <Button
                    onClick={() => setName('홍길동')}
                    size="small"
                    type={name === '홍길동' ? 'primary' : 'default'}
                  >
                    홍길동
                  </Button>
                  <Button
                    onClick={() => setName('김철수')}
                    size="small"
                    type={name === '김철수' ? 'primary' : 'default'}
                  >
                    김철수
                  </Button>
                  <Button
                    onClick={() => setName('이영희')}
                    size="small"
                    type={name === '이영희' ? 'primary' : 'default'}
                  >
                    이영희
                  </Button>
                  <Button
                    onClick={() => setName('박민수')}
                    size="small"
                    type={name === '박민수' ? 'primary' : 'default'}
                  >
                    박민수
                  </Button>
                </Space>

                {prevNameRef.current && prevNameRef.current !== name && (
                  <Alert
                    message={`${prevNameRef.current} → ${name}`}
                    description="이름이 변경되었습니다"
                    type="info"
                    size="small"
                  />
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        <Alert
          message="이전 값 저장의 활용"
          description="useRef는 컴포넌트 리렌더링 사이에 값을 유지합니다. 이전 값과 현재 값을 비교하여 변화량을 계산하거나 애니메이션 효과를 구현할 수 있습니다."
          type="success"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 3. 타이머 및 인터벌 관리 예제
// =====================================
const TimerDemo = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const intervalRef = useRef(null);
  const renderCountRef = useRef(0);

  // 렌더링 횟수 추적 (useRef 사용)
  renderCountRef.current = renderCountRef.current + 1;

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  const forceRerender = () => {
    setRenderCount((prev) => prev + 1);
  };

  // 컴포넌트 언마운트시 타이머 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card title="타이머 및 인터벌 관리 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useRef 패턴 설명 */}
        <Alert
          message="⏱️ useRef 패턴: 타이머 ID 관리와 렌더링 최적화"
          description={
            <div>
              <Text strong style={{ color: '#fa8c16' }}>
                이 예제에서 useRef가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>intervalRef = useRef(null)</Text> - setInterval ID 저장
                </li>
                <li>
                  <Text code>renderCountRef = useRef(0)</Text> - 렌더링 횟수 추적
                </li>
                <li>
                  <Text code>intervalRef.current = setInterval(...)</Text> - 타이머 ID 저장
                </li>
                <li>
                  <Text code>clearInterval(intervalRef.current)</Text> - 타이머 정리
                </li>
                <li>
                  <Text code>renderCountRef.current++</Text> - 리렌더링 없는 카운팅
                </li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useRef는 타이머 ID를 안전하게 보관하여 메모리 누수를 방지합니다. 또한
                렌더링 횟수처럼 화면 업데이트가 필요 없는 값은 useRef로 관리하여 성능을 최적화할 수
                있습니다.
              </Text>
            </div>
          }
          type="warning"
          showIcon
          style={{ backgroundColor: '#fff7e6', border: '1px solid #fa8c16' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="스톱워치">
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: isRunning ? '#52c41a' : '#666',
                  }}
                >
                  {formatTime(seconds)}
                </div>

                <Progress
                  percent={((seconds % 60) / 60) * 100}
                  showInfo={false}
                  strokeColor={isRunning ? '#52c41a' : '#d9d9d9'}
                  size="small"
                />

                <Space>
                  <Button
                    onClick={startTimer}
                    disabled={isRunning}
                    icon={<PlayCircleOutlined />}
                    type="primary"
                  >
                    시작
                  </Button>
                  <Button onClick={stopTimer} disabled={!isRunning} icon={<PauseCircleOutlined />}>
                    정지
                  </Button>
                  <Button onClick={resetTimer} icon={<ReloadOutlined />} danger>
                    리셋
                  </Button>
                </Space>

                <Text type="secondary" style={{ fontSize: '12px' }}>
                  상태: {isRunning ? '실행 중' : '정지됨'}
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="렌더링 횟수 추적">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <Statistic
                      title="useState 렌더 카운터"
                      value={renderCount}
                      prefix={<SettingOutlined />}
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      (상태 변경시 리렌더링 발생)
                    </Text>
                  </Col>
                  <Col xs={12}>
                    <Statistic
                      title="useRef 렌더 카운터"
                      value={renderCountRef.current}
                      prefix={<AimOutlined />}
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      (리렌더링 없이 값 유지)
                    </Text>
                  </Col>
                </Row>

                <Button onClick={forceRerender} icon={<ReloadOutlined />} type="dashed" block>
                  강제 리렌더링 (useState)
                </Button>

                <Alert
                  message="렌더링 차이점"
                  description="useRef로 추적한 값은 리렌더링을 발생시키지 않지만, useState는 상태 변경시 리렌더링을 발생시킵니다."
                  type="info"
                  size="small"
                />
              </Space>
            </Card>
          </Col>
        </Row>

        <Alert
          message="타이머 관리의 중요성"
          description="useRef를 사용하여 타이머 ID를 저장하면 컴포넌트 리렌더링에 관계없이 안전하게 타이머를 관리할 수 있습니다. 메모리 누수를 방지하기 위해 컴포넌트 언마운트시 타이머를 정리해야 합니다."
          type="warning"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 4. 스크롤 위치 추적 예제
// =====================================
const ScrollTrackingDemo = () => {
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

      setScrollPosition(Math.round(scrollPercent));
      setIsAtTop(scrollTop === 0);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
    }
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollToMiddle = () => {
    if (scrollContainerRef.current) {
      const middle = scrollContainerRef.current.scrollHeight / 2;
      scrollContainerRef.current.scrollTo({ top: middle, behavior: 'smooth' });
    }
  };

  // 더미 콘텐츠 생성
  const dummyContent = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      style={{
        padding: '16px',
        margin: '8px 0',
        backgroundColor: i % 2 === 0 ? '#f6f6f6' : '#ffffff',
        borderRadius: '4px',
        border: '1px solid #e8e8e8',
      }}
    >
      <Text strong>아이템 {i + 1}</Text>
      <br />
      <Text type="secondary">
        이것은 스크롤 테스트용 더미 콘텐츠입니다. useRef를 사용하여 스크롤 위치를 추적할 수
        있습니다.
      </Text>
    </div>
  ));

  return (
    <Card title="스크롤 위치 추적 및 제어 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useRef 패턴 설명 */}
        <Alert
          message="📏 useRef 패턴: 스크롤 컨테이너 제어와 위치 추적"
          description={
            <div>
              <Text strong style={{ color: '#52c41a' }}>
                이 예제에서 useRef가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>scrollContainerRef = useRef(null)</Text> - 스크롤 컨테이너 참조
                </li>
                <li>
                  <Text code>scrollContainerRef.current.scrollTop</Text> - 스크롤 위치 읽기
                </li>
                <li>
                  <Text code>scrollContainerRef.current.scrollTo()</Text> - 스크롤 위치 제어
                </li>
                <li>
                  <Text code>onScroll={`{handleScroll}`}</Text> - 스크롤 이벤트 처리
                </li>
                <li>
                  <Text code>scrollHeight, clientHeight</Text> - 스크롤 정보 계산
                </li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: useRef로 스크롤 컨테이너에 접근하여 위치 정보를 읽고 제어할 수 있습니다.
                무한 스크롤, 스크롤 위치 저장/복원, 스크롤 기반 애니메이션 등에 활용됩니다.
              </Text>
            </div>
          }
          type="success"
          showIcon
          style={{ backgroundColor: '#f6ffed', border: '1px solid #52c41a' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small" title="스크롤 정보">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>스크롤 위치</Text>
                  <Progress
                    percent={scrollPosition}
                    size="small"
                    status={scrollPosition === 100 ? 'success' : 'active'}
                  />
                  <Text type="secondary">{scrollPosition}%</Text>
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Alert
                    message={isAtTop ? '최상단입니다' : '스크롤 중'}
                    type={isAtTop ? 'success' : 'info'}
                    size="small"
                    showIcon={false}
                  />
                  <Alert
                    message={isAtBottom ? '최하단입니다' : '더 스크롤 가능'}
                    type={isAtBottom ? 'success' : 'info'}
                    size="small"
                    showIcon={false}
                  />
                </Space>

                <Divider style={{ margin: '8px 0' }} />

                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Button onClick={scrollToTop} disabled={isAtTop} size="small" block>
                    맨 위로
                  </Button>
                  <Button onClick={scrollToMiddle} size="small" block>
                    중간으로
                  </Button>
                  <Button onClick={scrollToBottom} disabled={isAtBottom} size="small" block>
                    맨 아래로
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card size="small" title="스크롤 가능한 콘텐츠">
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                style={{
                  height: '400px',
                  overflowY: 'auto',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              >
                {dummyContent}
              </div>
            </Card>
          </Col>
        </Row>

        <Alert
          message="스크롤 추적의 활용"
          description="useRef를 사용하여 스크롤 컨테이너에 접근하고, 스크롤 이벤트를 통해 위치를 추적할 수 있습니다. 무한 스크롤, 스크롤 위치 저장, 스크롤 기반 애니메이션 등에 활용할 수 있습니다."
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
const UseRefPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <AimOutlined style={{ color: '#fa541c' }} />
          useRef Hook 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          useRef를 사용한 DOM 접근, 값 저장, 타이머 관리 패턴을 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* useRef 기본 개념 도식화 */}
        <Card
          title="📚 useRef 기본 개념"
          style={{
            backgroundColor: '#fff7e6',
            border: '2px solid #fa541c',
            borderRadius: '12px',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 기본 설명 */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ color: '#fa541c', marginBottom: '8px' }}>
                🎯 useRef는 리렌더링 없이 값을 유지하고 DOM에 접근하는 React Hook입니다
              </Title>
              <Text type="secondary">
                mutable 객체를 반환하여 .current 속성으로 값에 접근하며, 값 변경 시 리렌더링을
                발생시키지 않습니다
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
                      const ref = useRef(초기값)
                    </Text>
                  </div>

                  {/* useRef vs useState 비교 */}
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px',
                          backgroundColor: '#fff7e6',
                          borderRadius: '8px',
                          border: '2px solid #fa541c',
                        }}
                      >
                        <Title level={5} style={{ color: '#fa541c', margin: '0 0 8px 0' }}>
                          🎯 useRef
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 값 변경 시 리렌더링 ❌<br />
                          • DOM 요소 접근 ⭐<br />
                          • 타이머 ID 저장 ⭐<br />• 이전 값 추적 ⭐
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
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
                          📊 useState
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • 값 변경 시 리렌더링 ⭐<br />
                          • 화면 업데이트 ⭐<br />
                          • 사용자 입력 처리 ⭐<br />• 컴포넌트 상태 관리 ⭐
                        </Text>
                      </div>
                    </Col>
                  </Row>

                  {/* useRef 주요 사용법 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '16px', color: '#722ed1' }}
                    >
                      🔍 useRef 주요 사용법
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
                            backgroundColor: '#52c41a',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          🎯
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>DOM 접근</strong>
                          <br />
                          input.focus()
                          <br />
                          element.scroll()
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

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
                          💾
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>값 저장</strong>
                          <br />
                          타이머 ID
                          <br />
                          이전 상태값
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

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
                          ⏱️
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>타이머 관리</strong>
                          <br />
                          setInterval
                          <br />
                          setTimeout
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

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
                          🔄
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>값 추적</strong>
                          <br />
                          이전 props
                          <br />
                          변화량 계산
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 중요한 특징 강조 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '16px', color: '#eb2f96' }}
                    >
                      ⚠️ useRef의 중요한 특징
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
                        🚨 리렌더링을 발생시키지 않음
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
                        {`const countRef = useRef(0)

// 값이 변경되어도 화면이 업데이트되지 않음
countRef.current = countRef.current + 1

// 화면에는 이전 값이 그대로 표시됨
console.log(countRef.current) // 새로운 값은 콘솔에만 출력`}
                      </pre>
                      <Text style={{ fontSize: '11px', color: '#eb2f96' }}>
                        💡 주의: ref 값 변경은 화면을 업데이트하지 않으므로, UI 표시용 데이터는
                        useState를 사용해야 합니다
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
                        ✅ .current 속성으로 접근
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
                        {`const inputRef = useRef(null)

// DOM 요소에 접근
<input ref={inputRef} />

// 포커스 주기
inputRef.current.focus()

// 값 읽기/쓰기
inputRef.current.value = 'Hello World'`}
                      </pre>
                      <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                        💡 참고: ref 객체의 current 속성을 통해 실제 값이나 DOM 요소에 접근할 수
                        있습니다
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
                            🎯 언제 useRef를 사용해야 할까?
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
                              <strong>DOM 조작:</strong> focus, scroll, 크기 측정
                            </li>
                            <li>
                              <strong>타이머 저장:</strong> setInterval, setTimeout ID
                            </li>
                            <li>
                              <strong>이전 값 보관:</strong> props, state 변화 추적
                            </li>
                            <li>
                              <strong>라이브러리 인스턴스:</strong> 써드파티 라이브러리 객체
                            </li>
                            <li>
                              <strong>렌더링 최적화:</strong> 불필요한 리렌더링 방지
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
                            📚 기본 사용 패턴
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
                            {`// 1. 선언
const myRef = useRef(초기값)

// 2. DOM 연결
<div ref={myRef}>내용</div>

// 3. 값 접근
myRef.current.method()

// 4. 값 변경
myRef.current = 새로운값`}
                          </pre>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 실제 사용 예제 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '12px', color: '#13c2c2' }}
                    >
                      💡 실제 사용 예제
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
                            📝 DOM 접근 예제
                          </Text>
                          <pre
                            style={{
                              margin: 0,
                              fontSize: '11px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`// 1. useRef로 DOM 요소 참조
const inputRef = useRef(null)

// 2. JSX에서 ref 연결
<input ref={inputRef} />

// 3. 메서드에서 DOM 조작
const handleClick = () => {
  inputRef.current.focus()
  inputRef.current.select()
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
                            📋 타이머 관리 예제
                          </Text>
                          <pre
                            style={{
                              margin: 0,
                              fontSize: '11px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`// 1. 타이머 ID 저장용 ref
const timerRef = useRef(null)

// 2. 타이머 시작
const startTimer = () => {
  timerRef.current = setInterval(() => {
    // 작업 수행
  }, 1000)
}

// 3. 타이머 정리
const stopTimer = () => {
  clearInterval(timerRef.current)
}`}
                          </pre>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 1. DOM 요소 직접 접근 */}
        <DOMAccessDemo />

        {/* 2. 이전 값 저장 */}
        <PreviousValueDemo />

        {/* 3. 타이머 및 인터벌 관리 */}
        <TimerDemo />

        {/* 4. 스크롤 위치 추적 */}
        <ScrollTrackingDemo />

        {/* useRef 사용법 가이드 */}
        <Card
          title="useRef 사용법 가이드"
          style={{ backgroundColor: '#fff2e6', border: '1px solid #ffcc99' }}
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
                <pre>{`const myRef = useRef(initialValue)

// DOM 요소 접근
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current.focus()`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. 값 저장</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`const valueRef = useRef(0)

// 값 변경 (리렌더링 안됨)
valueRef.current = newValue

// 값 읽기
console.log(valueRef.current)`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 이전 값 추적</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`const prevValue = useRef()

useEffect(() => {
  prevValue.current = value
}, [value])

// 이전 값과 비교
const diff = value - prevValue.current`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>4. 타이머 관리</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`const timerRef = useRef(null)

// 타이머 시작
timerRef.current = setInterval(callback, 1000)

// 타이머 정리
clearInterval(timerRef.current)`}</pre>
              </div>
            </Col>
          </Row>

          <Alert
            message="useRef vs useState"
            description={
              <div>
                <p>
                  <strong>useRef</strong>: 값 변경시 리렌더링 없음, DOM 접근 가능, mutable 객체
                </p>
                <p>
                  <strong>useState</strong>: 값 변경시 리렌더링 발생, 상태 관리용, immutable 패턴
                </p>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Card>
      </Space>
    </div>
  );
};

// 컴포넌트를 기본 내보내기로 설정
export default UseRefPage;
