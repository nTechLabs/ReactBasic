import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import HomePage from '../pages/counter/HomePage'
import TodosPage from '../pages/todos/TodosPage'
import AboutPage from '../pages/about/AboutPage'
import HooksIndexPage from '../pages/hooks/index.jsx'
import UseStatePage from '../pages/hooks/useState.jsx'
import UseEffectPage from '../pages/hooks/useEffect.jsx'
import UseContextPage from '../pages/hooks/useContext.jsx'
import UseCallbackPage from '../pages/hooks/useCallback.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'todos',
        element: <TodosPage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'hooks',
        element: <HooksIndexPage />
      },
      {
        path: 'hooks/useState',
        element: <UseStatePage />
      },
      {
        path: 'hooks/useEffect',
        element: <UseEffectPage />
      },
      {
        path: 'hooks/useContext',
        element: <UseContextPage />
      },
      {
        path: 'hooks/useCallback',
        element: <UseCallbackPage />
      }
    ]
  }
])
