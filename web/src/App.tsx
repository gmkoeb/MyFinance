import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import { useState } from 'react'
import Cookies from 'js-cookie'
import ProtectedRoutes from './ProtectedRoutes'
import MyCompanies from './pages/MyCompanies'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(Cookies.get('token') ? true : false)
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout isSignedIn={isSignedIn}/>,
      children: [
        { index: true, element: <Home isSignedIn={isSignedIn}/> },
        { path: '/sign_up', element: <SignUp /> },
        { path: '/sign_in', element: <SignIn setIsSignedIn={setIsSignedIn}/> }
      ],
    },
    {
      element: <ProtectedRoutes isSignedIn={isSignedIn}/>,
      children: [
        {path: '/my_companies', element: <MyCompanies />}
      ]
    }
  ])
  return (<RouterProvider router={router} />)
}

export default App
