import { Card, Button, Space, Typography, Row, Col, Tag, Alert } from 'antd';
import {
  ExperimentOutlined,
  RocketOutlined,
  ApiOutlined,
  CodeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './exams.css';

const { Title, Paragraph, Text } = Typography;

const ExamsIndexPage = () => {
  const navigate = useNavigate();

  const examItems = [
    {
      key: 'useState',
      title: 'useState',
      description: '',
      path: '/exams/useState',
      icon: <ApiOutlined />,
      color: '#52c41a',
      topics: ['상태 관리', '이벤트 핸들링', '조건부 렌더링', '배열 상태', '객체 상태'],
    },
    {
      key: 'useCallback',
      title: 'useCallback',
      description: '',
      path: '/exams/useCallback',
      icon: <ApiOutlined />,
      color: '#52c41a',
      topics: ['주제는 여기에...'],
    },
  ];

  const handleExamClick = (path) => {
    navigate(path);
  };

  return (
    <Space direction="vertical" size="large" className="exams-container">
      <div className="exams-header">
        <Title level={2}>
          <ExperimentOutlined className="exams-title-icon" /> React Hook
        </Title>
        <Paragraph className="exams-description">React Hook TEST</Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {examItems.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
            <Card
              hoverable
              className="exam-card"
              style={{
                '--exam-color': item.color,
                '--exam-gradient': `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
              }}
              cover={
                <div className="exam-card-cover">
                  <div className="exam-card-icon">{item.icon}</div>
                </div>
              }
              actions={[
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleExamClick(item.path)}
                  className="exam-card-button"
                  style={{
                    '--exam-color': item.color,
                    backgroundColor: item.color,
                    borderColor: item.color,
                  }}
                >
                  Exams
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color={item.color}>{item.difficulty}</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small" className="full-width">
                    <Text type="secondary" className="exam-description-text">
                      {item.description}
                    </Text>
                    <div>
                      <Text strong className="exam-topics-label">
                        주요 주제:
                      </Text>
                      <div className="exam-topics-container">
                        {item.topics.map((topic, index) => (
                          <Tag key={index} size="small" className="exam-topic-tag">
                            {topic}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 추가 시험 예고 */}
      <Card
        title={
          <>
            <RocketOutlined /> 곧 추가될 시험들
          </>
        }
        className="upcoming-exams-card"
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="upcoming-exam-item" style={{ '--upcoming-color': '#1890ff' }}>
              <ApiOutlined className="upcoming-exam-icon" />
              <div className="upcoming-exam-name">useEffect</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="upcoming-exam-item" style={{ '--upcoming-color': '#52c41a' }}>
              <ApiOutlined className="upcoming-exam-icon" />
              <div className="upcoming-exam-name">useContext</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="upcoming-exam-item" style={{ '--upcoming-color': '#fa8c16' }}>
              <ApiOutlined className="upcoming-exam-icon" />
              <div className="upcoming-exam-name">useReducer</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="upcoming-exam-item" style={{ '--upcoming-color': '#eb2f96' }}>
              <ApiOutlined className="upcoming-exam-icon" />
              <div className="upcoming-exam-name">useMemo</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="upcoming-exam-item" style={{ '--upcoming-color': '#722ed1' }}>
              <ApiOutlined className="upcoming-exam-icon" />
              <div className="upcoming-exam-name">useCallback</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="upcoming-exam-item" style={{ '--upcoming-color': '#13c2c2' }}>
              <ApiOutlined className="upcoming-exam-icon" />
              <div className="upcoming-exam-name">useRef</div>
            </div>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default ExamsIndexPage;
