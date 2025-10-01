import { Card, Typography, Space, Statistic, Button } from 'antd';
import { MinusOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import useCounterStore from '../../store/counterStore';

const { Title } = Typography;

const HomePage = () => {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>홈 페이지</Title>

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
    </Space>
  );
};

export default HomePage;
