import { Card, Button, Space, Typography, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
  ApiOutlined,
  FunctionOutlined,
  ArrowRightOutlined,
  CodeOutlined
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const HooksIndexPage = () => {
  const navigate = useNavigate()

  const hooks = [
    {
      key: 'useState',
      title: 'useState Hook',
      description: '상태 관리를 위한 기본적인 React Hook',
      path: '/hooks/useState',
      icon: <FunctionOutlined />,
      color: '#1890ff',
      examples: ['기본 카운터', '문자열 상태', '불린 상태', '배열 상태', '객체 상태', '폼 데이터', '슬라이더']
    },
    {
      key: 'useEffect',
      title: 'useEffect Hook',
      description: '생명주기와 부수 효과를 관리하는 React Hook',
      path: '/hooks/useEffect',
      icon: <ApiOutlined />,
      color: '#52c41a',
      examples: ['컴포넌트 생명주기', '의존성 배열', '타이머 & Cleanup', 'API 호출', '이벤트 리스너', '로컬 스토리지', '실시간 시계']
    },
    {
      key: 'useContext',
      title: 'useContext Hook',
      description: '컴포넌트 간 상태를 공유하는 React Hook',
      path: '/hooks/useContext',
      icon: <CodeOutlined />,
      color: '#722ed1',
      examples: ['테마 관리', '사용자 정보', '장바구니 상태', '언어 설정', 'Provider 패턴', '전역 상태', '상태 공유']
    },
    {
      key: 'useCallback',
      title: 'useCallback Hook',
      description: '함수를 메모이제이션하여 성능을 최적화하는 React Hook',
      path: '/hooks/useCallback',
      icon: <FunctionOutlined />,
      color: '#fa8c16',
      examples: ['성능 최적화', '메모이제이션', '실시간 검색', '할일 목록', 'React.memo', '이벤트 핸들러', 'debounce 패턴']
    },
    {
      key: 'useMemo',
      title: 'useMemo Hook',
      description: '계산 결과를 메모이제이션하여 성능을 최적화하는 React Hook',
      path: '/hooks/useMemo',
      icon: <ApiOutlined />,
      color: '#52c41a',
      examples: ['복잡한 계산', '필터링 최적화', '정렬 최적화', '참조 동등성', '통계 계산', '데이터 변환', '객체 메모이제이션']
    },
    {
      key: 'useForm',
      title: 'useForm Hook',
      description: '폼 상태 관리와 유효성 검사를 위한 커스텀 React Hook',
      path: '/hooks/useForm',
      icon: <CodeOutlined />,
      color: '#722ed1',
      examples: ['폼 상태 관리', '유효성 검사', '회원가입 폼', '동적 폼 생성', '실시간 검증', '에러 처리', '폼 제출 관리']
    },
    {
      key: 'useLocalStorage',
      title: 'useLocalStorage Hook',
      description: '로컬스토리지를 활용한 데이터 저장과 관리를 위한 커스텀 React Hook',
      path: '/hooks/useLocalStorage',
      icon: <ApiOutlined />,
      color: '#1890ff',
      examples: ['데이터 저장', '사용자 설정', '할일 목록', '노트 관리', '자동 동기화', '에러 처리', 'SSR 지원']
    }
  ]

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <ApiOutlined style={{ color: '#1890ff' }} /> 
          React Hooks
        </Title>

        
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          textAlign: 'left',
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <Paragraph style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
            React Hooks는 React 16.8에서 도입된 혁신적인 기능으로, 함수형 컴포넌트에서도 클래스 컴포넌트의 
            상태(state)와 생명주기 메서드(lifecycle methods)를 사용할 수 있게 해주는 특별한 함수들입니다. 
            'use'로 시작하는 함수들로, React의 다양한 기능을 "갈고리(hook)" 처럼 연결하여 사용할 수 있습니다.
          </Paragraph>
          
          <Title level={4} style={{ color: '#52c41a', marginBottom: '16px' }}>
            주요 장점
          </Title>
          <Paragraph style={{ fontSize: '14px', lineHeight: '1.7', textAlign: 'justify' }}>
            React Hooks의 가장 큰 장점은 뛰어난 코드 재사용성입니다. 커스텀 훅(Custom Hook)을 통해 복잡한 상태 로직이나 
            비즈니스 로직을 별도의 함수로 분리하여 여러 컴포넌트에서 공유할 수 있습니다. 예를 들어, API 호출 로직, 
            폼 검증 로직, 로컬 스토리지 관리 등을 한 번 작성하면 프로젝트 전체에서 재사용이 가능하며, 이는 개발 효율성을 
            크게 향상시키고 코드 중복을 현저히 줄여줍니다.
            
            또한 간결하고 읽기 쉬운 코드 작성이 가능합니다. 클래스 컴포넌트에서 필요했던 constructor, this 바인딩, 
            render 메서드 등의 복잡한 보일러플레이트 코드가 전혀 필요 없습니다. 함수형 컴포넌트와 함께 사용하면 더 직관적이고 
            간결한 코드 작성이 가능하며, JavaScript의 함수형 프로그래밍 패러다임과 자연스럽게 결합되어 코드의 가독성과 
            유지보수성이 현저히 향상됩니다.
            
            React Hooks는 효과적인 관심사 분리를 가능하게 합니다. 관련된 상태와 로직을 하나의 훅으로 묶어서 관리할 수 있어 
            코드의 응집도가 크게 높아집니다. 클래스 컴포넌트에서는 componentDidMount, componentDidUpdate, 
            componentWillUnmount 등의 생명주기 메서드에 서로 다른 관심사가 섞여있어 코드를 이해하고 관리하기 어려웠습니다. 
            반면 Hooks를 사용하면 각각의 기능별로 로직을 분리하여 관리할 수 있고, 이는 단일 책임 원칙을 준수하여 
            코드의 유지보수성과 테스트 용이성을 크게 개선시킵니다.
            
            마지막으로 강력한 성능 최적화 기능을 제공합니다. useMemo와 useCallback 등의 성능 최적화 훅을 활용하여 
            불필요한 연산과 리렌더링을 효과적으로 방지할 수 있습니다. 의존성 배열을 통해 정확히 언제 재계산이나 
            리렌더링이 필요한지를 세밀하게 제어할 수 있으며, 이는 특히 대규모 애플리케이션에서 사용자 경험을 크게 
            향상시킵니다. React.memo와 함께 사용하면 컴포넌트 최적화를 더욱 정교하게 수행할 수 있어, 
            복잡한 UI에서도 최적의 성능을 유지할 수 있습니다.
          </Paragraph>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {hooks.map((hook) => (
          <Col xs={24} sm={12} lg={8} xl={6} xxl={4} key={hook.key}>
            <div style={{ height: '100%' }}>
              <Card
                hoverable
                style={{ 
                  minHeight: '320px',
                  height: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: '16px'
                }}
              >
                <Space direction="vertical" size="middle" style={{ flex: 1, height: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', color: hook.color, marginBottom: '16px' }}>
                      {hook.icon}
                    </div>
                    <Title level={3} style={{ margin: 0 }}>
                      {hook.title}
                    </Title>
                    <Paragraph style={{ margin: '8px 0', color: '#666' }}>
                      {hook.description}
                    </Paragraph>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Title level={5} style={{ margin: 0 }}>
                        <CodeOutlined /> 포함된 예제:
                      </Title>
                      <Button 
                        type="primary" 
                        size="small"
                        icon={<ArrowRightOutlined />}
                        onClick={() => handleNavigate(hook.path)}
                        style={{ 
                          backgroundColor: hook.color, 
                          borderColor: hook.color,
                          fontSize: '11px'
                        }}
                      >
                        예제 보기
                      </Button>
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {hook.examples.map((example, index) => (
                        <div key={index} style={{ 
                          padding: '6px 10px', 
                          margin: '3px 0',
                          backgroundColor: '#f6f6f6',
                          borderRadius: '4px',
                          color: '#666',
                          border: '1px solid #e8e8e8',
                          transition: 'all 0.2s ease'
                        }}>
                          • {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </Space>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: '32px', backgroundColor: '#f6f6f6' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: '16px' }}>
          React Hooks 학습 가이드
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <FunctionOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>useState</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <ApiOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>useEffect</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <CodeOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>useContext</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <FunctionOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>useCallback</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <ApiOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>useMemo</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <CodeOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>useForm</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <ApiOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>useLocalStorage</div>
            </div>
          </Col>
        </Row>
      </Card>
    </Space>
  )
}

export default HooksIndexPage