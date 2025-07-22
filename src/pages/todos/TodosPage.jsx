import { Card, List, Spin, Alert, Avatar, Typography, Space } from 'antd'
import { useTodos } from '../../customHooks/useTodos'

const { Title } = Typography

const TodosPage = () => {
  const { data: todos, isLoading, error } = useTodos()

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>할 일 목록</Title>
      
      <Card title="React Query Todos" style={{ textAlign: 'center' }}>
        {isLoading && (
          <div style={{ padding: '50px' }}>
            <Spin size="large" />
            <Typography.Paragraph style={{ marginTop: '16px' }}>
              할 일 목록을 불러오는 중...
            </Typography.Paragraph>
          </div>
        )}
        
        {error && (
          <Alert
            message="오류 발생"
            description={error.message}
            type="error"
            showIcon
          />
        )}
        
        {todos && (
          <List
            dataSource={todos}
            renderItem={(todo) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ 
                      backgroundColor: todo.completed ? '#52c41a' : '#1890ff' 
                    }}>
                      {todo.id}
                    </Avatar>
                  }
                  title={
                    <span style={{ 
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#999' : '#000'
                    }}>
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
  )
}

export default TodosPage
