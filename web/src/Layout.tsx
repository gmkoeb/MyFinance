import { Outlet } from "react-router-dom";
import Header from "./components/Header";

interface LayoutProps {
  isSignedIn: boolean;
}

export default function Layout({ isSignedIn }: LayoutProps){
  return(
    <>
      <main>
        <Header isSignedIn={isSignedIn}/>
        <Outlet/>
      </main>
    </>
  )
}