import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import HomePage from '../pages/counter/HomePage';
import TodosPage from '../pages/todos/TodosPage';
import AboutPage from '../pages/about/AboutPage';
import FCMPage from '../pages/fcm/FCMPage';
import HooksIndexPage from '../pages/hooks/index.jsx';
import UseStatePage from '../pages/hooks/useState.jsx';
import UseEffectPage from '../pages/hooks/useEffect.jsx';
import UseContextPage from '../pages/hooks/useContext.jsx';
import UseCallbackPage from '../pages/hooks/useCallback.jsx';
import UseParamsPage from '../pages/hooks/useParams.jsx';
import URLSearchParamsPage from '../pages/hooks/URLSearchParams.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'todos',
        element: <TodosPage />,
      },
      {
        path: 'fcm',
        element: <FCMPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'hooks',
        element: <HooksIndexPage />,
      },
      {
        path: 'hooks/useState',
        element: <UseStatePage />,
      },
      {
        path: 'hooks/useEffect',
        element: <UseEffectPage />,
      },
      {
        path: 'hooks/useContext',
        element: <UseContextPage />,
      },
      {
        path: 'hooks/useCallback',
        element: <UseCallbackPage />,
      },
      {
        path: 'hooks/useParams',
        element: <UseParamsPage />,
      },
      {
        path: 'hooks/url-search-params',
        element: <URLSearchParamsPage />,
      },
      {
        path: 'hooks/URLSearchParams', // alias
        element: <URLSearchParamsPage />,
      },
      {
        path: 'hooks/useParams/user/:id/:name',
        element: <UseParamsPage />,
      },
      {
        path: 'hooks/useParams/shop/:category',
        element: <UseParamsPage />,
      },
      {
        path: 'hooks/useParams/shop/:category/product/:productId',
        element: <UseParamsPage />,
      },
    ],
  },
]);
