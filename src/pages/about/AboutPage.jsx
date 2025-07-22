import { Card, Typography, Space, Descriptions, Tag } from 'antd'
import { RocketOutlined, ApiOutlined, DatabaseOutlined, BgColorsOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const AboutPage = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>프로젝트 소개</Title>
      
      <Card title="기술 스택" icon={<RocketOutlined />}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Frontend Framework">
            <Tag color="blue">React 19.1.0</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Build Tool">
            <Tag color="green">Vite</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="UI Library">
            <Tag color="cyan">Ant Design</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="State Management">
            <Tag color="purple">Zustand</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Server State">
            <Tag color="orange">TanStack React Query</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Routing">
            <Tag color="red">React Router DOM</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="프로젝트 특징">
        <Space direction="vertical" size="middle">
          <Paragraph>
            <ApiOutlined style={{ color: '#1890ff' }} /> 
            <strong> React Query</strong>: 서버 상태 관리, 캐싱, 동기화
          </Paragraph>
          <Paragraph>
            <DatabaseOutlined style={{ color: '#722ed1' }} /> 
            <strong> Zustand</strong>: 간단하고 확장 가능한 클라이언트 상태 관리
          </Paragraph>
          <Paragraph>
            <BgColorsOutlined style={{ color: '#13c2c2' }} /> 
            <strong> Ant Design</strong>: 엔터프라이즈급 UI 컴포넌트와 디자인 시스템
          </Paragraph>
          <Paragraph>
            <RocketOutlined style={{ color: '#52c41a' }} /> 
            <strong> Modern Stack</strong>: JSX, ES6+, 함수형 컴포넌트, Hooks 패턴
          </Paragraph>
        </Space>
      </Card>
    </Space>
  )
}

export default AboutPage
