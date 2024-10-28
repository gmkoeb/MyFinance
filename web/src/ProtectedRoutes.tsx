import { Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";

interface LayoutProps {
  isSignedIn: boolean;
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
      <Header isSignedIn={ isSignedIn } />
      <main>
        <Outlet />
      </main>
    </>
  )
}