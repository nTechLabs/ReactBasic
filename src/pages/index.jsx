import { Card, Button, Space, Typography, Row, Col, Divider } from 'antd'
import { useNavigate } from 'react-router-dom'
import { usePageStore } from '../store/pageStore'
import PageStatsComponent from '../components/PageStatsComponent'
import { 
  HomeOutlined, 
  UnorderedListOutlined, 
  InfoCircleOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  ApiOutlined,
  FireOutlined,
  ThunderboltOutlined,
  BgColorsOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  BarChartOutlined
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const IndexPage = () => {
  const navigate = useNavigate()
  const { addNotification, currentPage } = usePageStore()

  const pages = [
    {
      key: 'counter',
      title: '카운터 페이지',
      description: 'Zustand를 사용한 상태 관리 예제',
      path: '/counter',
      icon: <HomeOutlined />,
      color: '#1890ff'
    },
    {
      key: 'todos',
      title: '할 일 목록',
      description: 'React Query를 사용한 데이터 페칭 예제',
      path: '/todos',
      icon: <UnorderedListOutlined />,
      color: '#52c41a'
    },
    {
      key: 'hooks',
      title: 'React Hooks',
      description: 'React Hooks 사용법과 예제 모음',
      path: '/hooks',
      icon: <ApiOutlined />,
      color: '#fa8c16'
    },
    {
      key: 'about',
      title: '프로젝트 소개',
      description: '기술 스택 및 프로젝트 정보',
      path: '/about',
      icon: <InfoCircleOutlined />,
      color: '#722ed1'
    }
  ]

  const handleNavigate = (path) => {
    // 알림 추가
    addNotification({
      type: 'info',
      message: '페이지 이동',
      description: `${path} 페이지로 이동합니다.`
    })
    navigate(path)
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <RocketOutlined style={{ color: '#1890ff' }} /> 
          React 프로젝트 대시보드
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          각 페이지로 이동하여 다양한 기능을 탐색해보세요
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {pages.map((page) => (
          <Col xs={24} sm={12} lg={6} key={page.key}>
            <Card
              hoverable
              style={{ 
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              bodyStyle={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center'
              }}
            >
              <Space direction="vertical" size="middle" align="center">
                <div style={{ fontSize: '48px', color: page.color }}>
                  {page.icon}
                </div>
                <Title level={4} style={{ margin: 0 }}>
                  {page.title}
                </Title>
                <Paragraph style={{ margin: 0, color: '#666' }}>
                  {page.description}
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={() => handleNavigate(page.path)}
                  style={{ backgroundColor: page.color, borderColor: page.color }}
                >
                  이동하기
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: '32px', backgroundColor: '#f6f6f6' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '16px' }}>
          기술 스택
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Button 
              type="default" 
              size="large"
              icon={<ApiOutlined style={{ color: '#61DAFB', fontSize: '18px' }} />}
              onClick={() => window.open('https://react.dev/', '_blank')}
              style={{ 
                cursor: 'pointer',
                height: '48px',
                fontSize: '16px',
                padding: '0 20px'
              }}
            >
              React 19.1.0
            </Button>
          </Col>
          <Col>
            <Button 
              type="default" 
              size="large"
              icon={<ThunderboltOutlined style={{ color: '#646CFF', fontSize: '18px' }} />}
              onClick={() => window.open('https://vitejs.dev/', '_blank')}
              style={{ 
                cursor: 'pointer',
                height: '48px',
                fontSize: '16px',
                padding: '0 20px'
              }}
            >
              Vite
            </Button>
          </Col>
          <Col>
            <Button 
              type="default" 
              size="large"
              icon={<BgColorsOutlined style={{ color: '#1890ff', fontSize: '18px' }} />}
              onClick={() => window.open('https://ant.design/', '_blank')}
              style={{ 
                cursor: 'pointer',
                height: '48px',
                fontSize: '16px',
                padding: '0 20px'
              }}
            >
              Ant Design
            </Button>
          </Col>
          <Col>
            <Button 
              type="default" 
              size="large"
              icon={<DatabaseOutlined style={{ color: '#FF4154', fontSize: '18px' }} />}
              onClick={() => window.open('https://tanstack.com/query/latest', '_blank')}
              style={{ 
                cursor: 'pointer',
                height: '48px',
                fontSize: '16px',
                padding: '0 20px'
              }}
            >
              React Query
            </Button>
          </Col>
          <Col>
            <Button 
              type="default" 
              size="large"
              icon={<GlobalOutlined style={{ color: '#2D3748', fontSize: '18px' }} />}
              onClick={() => window.open('https://zustand.docs.pmnd.rs/', '_blank')}
              style={{ 
                cursor: 'pointer',
                height: '48px',
                fontSize: '16px',
                padding: '0 20px'
              }}
            >
              Zustand
            </Button>
          </Col>
          <Col>
            <Button 
              type="default" 
              size="large"
              icon={<ShareAltOutlined style={{ color: '#CA4245', fontSize: '18px' }} />}
              onClick={() => window.open('https://reactrouter.com/', '_blank')}
              style={{ 
                cursor: 'pointer',
                height: '48px',
                fontSize: '16px',
                padding: '0 20px'
              }}
            >
              React Router
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 페이지 상태 관리 정보 섹션 */}
      <Card 
        style={{ marginTop: '32px' }}
        title={
          <Space>
            <BarChartOutlined style={{ color: '#1890ff' }} />
            페이지 상태 관리 및 통계 (Zustand)
          </Space>
        }
      >
        <PageStatsComponent />
      </Card>
    </Space>
  )
}

export default IndexPage