import { useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { api } from '../api/axios'
import Layout from './Layout'
import ProtectedRoutes from './ProtectedRoutes'
import Companies from './pages/Companies'
import History from './pages/History'
import Home from './pages/Home'
import Monthly from './pages/Monthly'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import MonthlyLimit from './pages/MonthlyLimit'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkTokenValidity() {
      const response = await api.get('/users/validate_user')
      if (response.status === 401) {
        return false
      }

      return true
    }
    checkTokenValidity()
      .then(valid => {
        setIsSignedIn(valid)
        setLoading(false)
      })
      .catch(() => {
        setIsSignedIn(false)
        setLoading(false)
      })
  }, [])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout isSignedIn={isSignedIn} />,
      children: [
        { index: true, element: <Home isSignedIn={isSignedIn} /> },
        { path: '/sign_up', element: <SignUp /> },
        { path: '/sign_in', element: <SignIn setIsSignedIn={setIsSignedIn} /> },
      ],
    },
    {
      element: <ProtectedRoutes isSignedIn={isSignedIn} />,
      children: [
        { path: '/history', element: <History /> },
        { path: '/monthly', element: <Monthly /> },
        { path: '/monthly_limit', element: <MonthlyLimit /> },
        { path: '/companies', element: <Companies /> },
      ],
    },
  ])

  if (loading) {
    return <p>Loading...</p>
  }

  return <RouterProvider router={router} />
}

export default App
