import { Layout as AntLayout, Menu, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  FunctionOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '홈',
    },
    {
      key: '/todos',
      icon: <UnorderedListOutlined />,
      label: '할 일 목록',
    },
    {
      key: '/hooks',
      icon: <FunctionOutlined />,
      label: 'React Hooks',
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: '소개',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3} style={{ color: 'white', margin: 0, flex: 1 }}>
          <RocketOutlined /> React App
        </Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ flex: 'none', minWidth: 0 }}
        />
      </Header>

      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          React + Vite + Ant Design + React Query + Zustand + React Router
        </Typography.Paragraph>
      </Footer>
    </AntLayout>
  );
};

export default Layout;
