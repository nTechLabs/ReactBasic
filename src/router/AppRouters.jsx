import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  DashboardOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import IndexPage from '../pages/index';
import HomePage from '../pages/counter/HomePage';
import TodosPage from '../pages/todos/TodosPage';
import AboutPage from '../pages/about/AboutPage';
import HooksIndexPage from '../pages/hooks/index';
import UseStatePage from '../pages/hooks/useState';
import UseEffectPage from '../pages/hooks/useEffect';
import UseContextPage from '../pages/hooks/useContext';
import UseCallbackPage from '../pages/hooks/useCallback';
import UseMemoPage from '../pages/hooks/useMemo';
import UseFormPage from '../pages/hooks/useForm';
import UseRefPage from '../pages/hooks/useRef';
import UseLocalStoragePage from '../pages/hooks/useLocalStorage';
import UseLocationPage from '../pages/hooks/useLocation';
import UseParamsPage from '../pages/hooks/useParams';
import UseNavigatePage from '../pages/hooks/useNavigate';
import URLSearchParamsPage from '../pages/hooks/URLSearchParams';
import ExamsIndexPage from '../pages/exams/index';
import UseStateExamPage from '../pages/exams/useState';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '대시보드',
    },
    {
      key: '/counter',
      icon: <HomeOutlined />,
      label: '카운터',
    },
    {
      key: '/todos',
      icon: <UnorderedListOutlined />,
      label: '할 일 목록',
    },
    {
      key: '/hooks',
      icon: <ApiOutlined />,
      label: 'Hooks',
    },
    {
      key: '/exams',
      icon: <RocketOutlined />,
      label: '시험',
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
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0, flex: 1 }}>
          <RocketOutlined /> React App
        </Title>
        <NavigationMenu />
      </Header>

      <Content style={{ padding: '24px' }}>{children}</Content>

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
          <Route path="/" element={<IndexPage />} />
          <Route path="/counter" element={<HomePage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/hooks" element={<HooksIndexPage />} />
          <Route path="/hooks/useState" element={<UseStatePage />} />
          <Route path="/hooks/useEffect" element={<UseEffectPage />} />
          <Route path="/hooks/useContext" element={<UseContextPage />} />
          <Route path="/hooks/useCallback" element={<UseCallbackPage />} />
          <Route path="/hooks/useMemo" element={<UseMemoPage />} />
          <Route path="/hooks/useForm" element={<UseFormPage />} />
          <Route path="/hooks/useRef" element={<UseRefPage />} />
          <Route path="/hooks/useLocation" element={<UseLocationPage />} />
          <Route path="/hooks/useLocalStorage" element={<UseLocalStoragePage />} />
          <Route path="/hooks/useParams" element={<UseParamsPage />} />
          <Route path="/hooks/useParams/user/:id/:name" element={<UseParamsPage />} />
          <Route path="/hooks/useParams/shop/:category" element={<UseParamsPage />} />
          <Route
            path="/hooks/useParams/shop/:category/product/:productId"
            element={<UseParamsPage />}
          />
          <Route path="/hooks/useNavigate" element={<UseNavigatePage />} />
          <Route path="/hooks/url-search-params" element={<URLSearchParamsPage />} />
          <Route path="/hooks/URLSearchParams" element={<URLSearchParamsPage />} />
          <Route path="/exams" element={<ExamsIndexPage />} />
          <Route path="/exams/useState" element={<UseStateExamPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default AppRouters;
