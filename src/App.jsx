import {
  Layout,
  Typography,
  Card,
  Button,
  List,
  Space,
  Spin,
  Alert,
  Avatar,
  Statistic,
} from 'antd';
import { MinusOutlined, PlusOutlined, ReloadOutlined, RocketOutlined } from '@ant-design/icons';
import useCounterStore from './store/counterStore';
import { useTodos } from './customHooks/useTodos';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  // Zustand store 사용
  const { count, increment, decrement, reset } = useCounterStore();

  // React Query 사용
  const { data: todos, isLoading, error } = useTodos();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          <RocketOutlined /> Vite + React + Ant Design + React Query + Zustand
        </Title>
      </Header>

      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Zustand Counter */}
          <Card title="Zustand Counter" style={{ textAlign: 'center' }}>
            <Space size="large" align="center">
              <Button type="primary" icon={<MinusOutlined />} onClick={decrement} size="large">
                감소
              </Button>

              <Statistic
                title="현재 카운트"
                value={count}
                valueStyle={{ color: '#1890ff', fontSize: '32px' }}
              />

              <Button type="primary" icon={<PlusOutlined />} onClick={increment} size="large">
                증가
              </Button>

              <Button icon={<ReloadOutlined />} onClick={reset} size="large">
                리셋
              </Button>
            </Space>
          </Card>

          {/* React Query Todos */}
          <Card title="React Query Todos" style={{ textAlign: 'center' }}>
            {isLoading && (
              <div style={{ padding: '50px' }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: '16px' }}>할 일 목록을 불러오는 중...</Paragraph>
              </div>
            )}

            {error && (
              <Alert message="오류 발생" description={error.message} type="error" showIcon />
            )}

            {todos && (
              <List
                dataSource={todos}
                renderItem={(todo) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: todo.completed ? '#52c41a' : '#1890ff' }}>
                          {todo.id}
                        </Avatar>
                      }
                      title={
                        <span
                          style={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? '#999' : '#000',
                          }}
                        >
                          {todo.title}
                        </span>
                      }
                      description={todo.completed ? '완료됨' : '진행중'}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Space>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Paragraph>
          React Query로 서버 상태를, Zustand로 클라이언트 상태를, Ant Design으로 UI를 관리합니다.
        </Paragraph>
      </Footer>
    </Layout>
  );
}

export default App;
