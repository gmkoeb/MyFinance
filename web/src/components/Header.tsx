import { NavLink } from "react-router-dom";

export default function Header(){
  return(
    <header className="bg-neutral-100 py-5 border-b border-neutral-400 px-4 mb-20 font-heading">
      <nav className="flex justify-between">
        <NavLink to='/' className={'text-4xl font-bold'}><span className="text-blue-500">Minhas</span> Finanças</NavLink>
        <div className="flex gap-3">
          <NavLink className={'border p-2 w-32 text-center rounded-lg border-black hover:text-white hover:bg-blue-500 duration-300'} to='/sign_up'>Criar Conta</NavLink>
          <NavLink className={'border p-2 w-32 text-center bg-blue-500 text-white rounded-lg'} to='/sign_in'>Entrar</NavLink>
        </div>
      </nav>
    </header>
  )
}