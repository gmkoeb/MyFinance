import { Navigate, Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'

interface LayoutProps {
  isSignedIn: boolean
}

export default function ProtectedRoutes({ isSignedIn }: LayoutProps) {
  if (!isSignedIn) {
    return (
      <>
        <div>Loading...</div>
        <Navigate to="/sign_in" replace />
      </>
    )
  }

  return (
    <>
      <main>
        {isSignedIn ? (
          <div className="grid grid-cols-4">
            <Aside />
            <div className="col-span-4 ml-80">
              <Outlet />
            </div>
          </div>
        ) : (
          <>
            <Header />
            <Outlet />
          </>
        )}
      </main>
    </>
  )
}
