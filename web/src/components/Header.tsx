import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

interface HeaderProps {
  isSignedIn: boolean;
}

export default function Header({ isSignedIn }: HeaderProps){
  const [userName, setUserName] = useState<string>('')

  async function handleLogout(){
    Cookies.remove('token')
    Cookies.remove('currentUser')
    window.location.reload()
  }

  useEffect(() => {
    if (Cookies.get('token')) {
      const userName: string | undefined = Cookies.get('userName')
      setUserName(userName ?? '')
    }
  }, [])
  
  return(
    <header>
      <nav>
        <NavLink to='/'>Minhas Finanças</NavLink>
        {isSignedIn ? (
          <>
            <h3>{userName}</h3>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <NavLink to='/sign_up'>Criar Conta</NavLink>
            <NavLink to='/sign_in'>Entrar</NavLink>
          </>
        ) 
      }
      </nav>
    </header>
  )
}