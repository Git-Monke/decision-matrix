import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import Dashboard from './pages/Dashboard.tsx'
import MatrixView from './pages/MatrixView.tsx'
import NewMatrix from './pages/NewMatrix.tsx'
import Templates from './pages/Templates.tsx'
import ImportMatrix from './pages/ImportMatrix.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'new',
        element: <NewMatrix />,
      },
      {
        path: 'templates',
        element: <Templates />,
      },
      {
        path: 'import',
        element: <ImportMatrix />,
      },
      {
        path: ':matrixId',
        element: <MatrixView />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
