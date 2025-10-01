import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  FunctionOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import HomePage from '../pages/counter/HomePage';
import TodosPage from '../pages/todos/TodosPage';
import AboutPage from '../pages/about/AboutPage';
import HooksIndexPage from '../pages/hooks/index.jsx';
import UseStatePage from '../pages/hooks/useState.jsx';
import UseEffectPage from '../pages/hooks/useEffect.jsx';
import UseContextPage from '../pages/hooks/useContext.jsx';
import UseCallbackPage from '../pages/hooks/useCallback.jsx';
import UseParamsPage from '../pages/hooks/useParams.jsx';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const NavigationMenu = () => {
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
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{ flex: 'none', minWidth: 0 }}
    />
  );
};

const AppLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3} style={{ color: 'white', margin: 0, flex: 1 }}>
          <RocketOutlined /> React App
        </Title>
        <NavigationMenu />
      </Header>

      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          React + Vite + Ant Design + React Query + Zustand + React Router
        </Typography.Paragraph>
      </Footer>
    </Layout>
  );
};

const AppRouters = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/hooks" element={<HooksIndexPage />} />
          <Route path="/hooks/useState" element={<UseStatePage />} />
          <Route path="/hooks/useEffect" element={<UseEffectPage />} />
          <Route path="/hooks/useContext" element={<UseContextPage />} />
          <Route path="/hooks/useCallback" element={<UseCallbackPage />} />
          <Route path="/hooks/useParams" element={<UseParamsPage />} />
          <Route path="/hooks/useParams/user/:id/:name" element={<UseParamsPage />} />
          <Route path="/hooks/useParams/shop/:category" element={<UseParamsPage />} />
          <Route
            path="/hooks/useParams/shop/:category/product/:productId"
            element={<UseParamsPage />}
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default AppRouters;
