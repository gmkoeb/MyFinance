import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'

interface LayoutProps {
  isSignedIn: boolean
}

export default function Layout({ isSignedIn }: LayoutProps) {
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
