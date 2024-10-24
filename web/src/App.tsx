import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import SignUp from './pages/SignUp'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/sign_up', element: <SignUp /> },
    ],
    }
  ])
  return (<RouterProvider router={router} />)
}

export default App
