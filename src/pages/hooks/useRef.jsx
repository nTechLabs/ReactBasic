// React hooks와 DOM 조작을 위한 import
import { useState, useRef, useEffect, useCallback } from 'react'
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Input, Slider, Alert, Progress, Statistic, Divider } from 'antd'
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
  FocusOutlined
} from '@ant-design/icons'

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography

// =====================================
// 1. DOM 요소 직접 접근 예제
// =====================================
const DOMAccessDemo = () => {
  const inputRef = useRef(null)
  const textareaRef = useRef(null)
  const videoRef = useRef(null)
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      setInputValue('')
      inputRef.current.focus()
    }
  }

  const focusTextarea = () => {
    textareaRef.current?.focus()
  }

  const selectAllText = () => {
    if (textareaRef.current) {
      textareaRef.current.select()
    }
  }

  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }

  return (
    <Card title="DOM 요소 직접 접근 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
                    icon={<FocusOutlined />}
                    type="primary"
                    size="small"
                  >
                    포커스
                  </Button>
                  <Button 
                    onClick={clearInput}
                    icon={<ReloadOutlined />}
                    size="small"
                  >
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
                    icon={<FocusOutlined />}
                    type="primary"
                    size="small"
                  >
                    포커스
                  </Button>
                  <Button 
                    onClick={selectAllText}
                    icon={<EyeOutlined />}
                    size="small"
                  >
                    전체 선택
                  </Button>
                  <Button 
                    onClick={scrollToBottom}
                    icon={<FileTextOutlined />}
                    size="small"
                  >
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
  )
}

// =====================================
// 2. 이전 값 저장 예제
// =====================================
const PreviousValueDemo = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('홍길동')
  const prevCountRef = useRef()
  const prevNameRef = useRef()

  useEffect(() => {
    prevCountRef.current = count
  }, [count])

  useEffect(() => {
    prevNameRef.current = name
  }, [name])

  return (
    <Card title="이전 값 저장 및 비교 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="카운터 이전 값 추적">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Statistic
                    title="현재 값"
                    value={count}
                    precision={0}
                  />
                  <Text type="secondary">
                    이전 값: {prevCountRef.current ?? '없음'}
                  </Text>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <Button 
                      onClick={() => setCount(c => c + 1)}
                      type="primary"
                    >
                      증가
                    </Button>
                    <Button 
                      onClick={() => setCount(c => c - 1)}
                    >
                      감소
                    </Button>
                    <Button 
                      onClick={() => setCount(0)}
                      danger
                    >
                      리셋
                    </Button>
                  </Space>
                </div>
                
                {prevCountRef.current !== undefined && (
                  <Alert
                    message={`변화량: ${count - prevCountRef.current}`}
                    type={count > prevCountRef.current ? 'success' : count < prevCountRef.current ? 'error' : 'info'}
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
  )
}

// =====================================
// 3. 타이머 및 인터벌 관리 예제
// =====================================
const TimerDemo = () => {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [renderCount, setRenderCount] = useState(0)
  const intervalRef = useRef(null)
  const renderCountRef = useRef(0)

  // 렌더링 횟수 추적 (useRef 사용)
  renderCountRef.current = renderCountRef.current + 1

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
      }, 1000)
    }
  }

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  const resetTimer = () => {
    stopTimer()
    setSeconds(0)
  }

  const forceRerender = () => {
    setRenderCount(prev => prev + 1)
  }

  // 컴포넌트 언마운트시 타이머 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card title="타이머 및 인터벌 관리 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="스톱워치">
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: isRunning ? '#52c41a' : '#666' }}>
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
                  <Button 
                    onClick={stopTimer}
                    disabled={!isRunning}
                    icon={<PauseCircleOutlined />}
                  >
                    정지
                  </Button>
                  <Button 
                    onClick={resetTimer}
                    icon={<ReloadOutlined />}
                    danger
                  >
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
                
                <Button 
                  onClick={forceRerender}
                  icon={<ReloadOutlined />}
                  type="dashed"
                  block
                >
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
  )
}

// =====================================
// 4. 스크롤 위치 추적 예제
// =====================================
const ScrollTrackingDemo = () => {
  const scrollContainerRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isAtTop, setIsAtTop] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100
      
      setScrollPosition(Math.round(scrollPercent))
      setIsAtTop(scrollTop === 0)
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1)
    }
  }, [])

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ 
        top: scrollContainerRef.current.scrollHeight, 
        behavior: 'smooth' 
      })
    }
  }

  const scrollToMiddle = () => {
    if (scrollContainerRef.current) {
      const middle = scrollContainerRef.current.scrollHeight / 2
      scrollContainerRef.current.scrollTo({ top: middle, behavior: 'smooth' })
    }
  }

  // 더미 콘텐츠 생성
  const dummyContent = Array.from({ length: 50 }, (_, i) => (
    <div key={i} style={{ 
      padding: '16px', 
      margin: '8px 0', 
      backgroundColor: i % 2 === 0 ? '#f6f6f6' : '#ffffff',
      borderRadius: '4px',
      border: '1px solid #e8e8e8'
    }}>
      <Text strong>아이템 {i + 1}</Text>
      <br />
      <Text type="secondary">
        이것은 스크롤 테스트용 더미 콘텐츠입니다. useRef를 사용하여 스크롤 위치를 추적할 수 있습니다.
      </Text>
    </div>
  ))

  return (
    <Card title="스크롤 위치 추적 및 제어 (useRef)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
                  <Button 
                    onClick={scrollToTop}
                    disabled={isAtTop}
                    size="small"
                    block
                  >
                    맨 위로
                  </Button>
                  <Button 
                    onClick={scrollToMiddle}
                    size="small"
                    block
                  >
                    중간으로
                  </Button>
                  <Button 
                    onClick={scrollToBottom}
                    disabled={isAtBottom}
                    size="small"
                    block
                  >
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
                  padding: '8px'
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
  )
}

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
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const myRef = useRef(initialValue)

// DOM 요소 접근
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current.focus()`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. 값 저장</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const valueRef = useRef(0)

// 값 변경 (리렌더링 안됨)
valueRef.current = newValue

// 값 읽기
console.log(valueRef.current)`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 이전 값 추적</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
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
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
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
                <p><strong>useRef</strong>: 값 변경시 리렌더링 없음, DOM 접근 가능, mutable 객체</p>
                <p><strong>useState</strong>: 값 변경시 리렌더링 발생, 상태 관리용, immutable 패턴</p>
              </div>
            }
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
export default UseRefPage
