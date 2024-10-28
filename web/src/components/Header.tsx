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
      const userName: string | undefined = Cookies.get('currentUser')
      setUserName(userName ?? '')
    }
  }, [])
  
  return(
    <header className="bg-neutral-100 py-5 border-b border-neutral-400 px-4 mb-20">
      <nav className="flex justify-between">
        <NavLink to='/' className={'text-4xl font-bold'}><span className="text-blue-500">Minhas</span> Finanças</NavLink>
        {isSignedIn && (
          <div className="flex items-center -ml-24">
            <NavLink className={'text-2xl font-bold text-blue-600 hover:opacity-80 duration-300'} to='/my_companies'>Minhas Empresas</NavLink>
          </div>
        )}
        <div>
          {isSignedIn ? (
            <div className="flex items-center gap-20">
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-blue-600 text-xl">{userName}</h3>
                <button className="border rounded-xl bg-red-500 text-white w-16 py-[1px] mx-auto hover:opacity-85 duration-300" onClick={handleLogout}>Sair</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <NavLink className={'border p-2 w-32 text-center rounded-lg border-black hover:text-white hover:bg-blue-500 duration-300'} to='/sign_up'>Criar Conta</NavLink>
              <NavLink className={'border p-2 w-32 text-center bg-blue-500 text-white rounded-lg'} to='/sign_in'>Entrar</NavLink>
            </div>
          ) 
        }
        </div>
      </nav>
    </header>
  )
}