import { NavLink } from "react-router-dom";

export default function Header(){
  return(
    <header>
      <nav>
        <NavLink to='/'>Minhas Finanças</NavLink>
        <NavLink to='/sign_up'>Criar Conta</NavLink>
      </nav>
    </header>
  )
}