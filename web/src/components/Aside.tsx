import Cookies from 'js-cookie'
import { CalendarClock, History, Home, LogOut, Store, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AsideLink } from './AsideLink'

export default function Aside() {
  const [userName, setUserName] = useState<string>('')

  async function handleLogout() {
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

  return (
    <aside className="bg-neutral-100 text-neutral-500 py-5 flex flex-col col-span-1 h-dvh w-80 px-6 justify-between border-r border-neutral-300 fixed">
      <div className="flex flex-col border-b border-neutral-400">
        <NavLink to="/" className={'text-4xl font-bold text-black'}>
          <span className="text-blue-500">Minhas</span> Finanças
        </NavLink>
        <h3 className="text-lg mt-10 mb-3 px-3">Menu</h3>
        <AsideLink to="/">
          <Home className="mt-0.5 size-6" />
          Página Inicial
        </AsideLink>
        <AsideLink to="/monthly">
          <CalendarClock className="mt-0.5 size-6" />
          Mensalidades
        </AsideLink>
        <AsideLink to="/history">
          <History className="mt-0.5 size-6" />
          Histórico
        </AsideLink>
        <AsideLink to="/companies">
          <Store className="mt-0.5 size-6" />
          Minhas Empresas
        </AsideLink>
        <AsideLink to="/monthly_limit">
          <Wallet className="mt-0.5 size-6" />
          Limite Mensal
        </AsideLink>
      </div>
      <div className="flex flex-col justify-center gap-2 text-center">
        <h3 className="text-xl">{userName}</h3>
        <button
          type="button"
          className="border text-red-500 w-16 justify-center mx-auto hover:opacity-85 duration-300 border-red-500 flex items-center gap-1 hover:bg-red-500 hover:text-neutral-200 rounded-md"
          onClick={handleLogout}
        >
          <LogOut width={19} />
          Sair
        </button>
      </div>
    </aside>
  )
}
