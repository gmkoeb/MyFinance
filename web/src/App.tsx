import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/sign_up', element: <SignUp /> },
        { path: '/sign_in', element: <SignIn /> }
    ],
    }
  ])
  return (<RouterProvider router={router} />)
}

export default App
