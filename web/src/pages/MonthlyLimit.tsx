import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../../api/axios";
import { CalendarPlus } from "lucide-react";
import MonthlyLimitForm from "../components/MonthlyLimit/MonthlyLimitForm";
import { CSSTransition } from 'react-transition-group'
import { Bill, Company } from "./Home";
import { BRL } from "../lib/formatToBRL";
import BillForm from "../components/Home/BillForm";

interface MonthlyLimitObject{
  id: number
  name: string
  limit: number
  original_limit: number
}

export default function MonthlyLimit(){
  const [monthlyLimit, setMonthlyLimit] = useState<MonthlyLimitObject>()
  const [showMonthlyLimitForm, setShowMonthlyLimitForm] = useState<boolean>(false)
  const [change, setChange] = useState<boolean>(false)
  const [bills, setBills] = useState<Bill[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(-1)
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('')
  const monthlyFormRef = useRef(null)
  
  async function handleDeleteMonthlyLimit(id: number){
    await api.delete(`/monthly_limits/${id}`)
    getMonthlyLimit()
  }

  async function getMonthlyLimitBills(){
    const response = await api.get('/monthly_limit_bills')
    setBills(response.data)
  }

  async function getMonthlyLimit(){
    const response = await api.get('/monthly_limits')
    setMonthlyLimit(response.data)
  }

  async function getCompanies(){
    const response = await api.get('/companies')
    setCompanies(response.data)
  }

  function handleCompanySelection(companyId: number, companyName: string) {
    if (companyId === -1) {
      setSelectedCompanyId(-1)
      setSelectedCompanyName('')
    } else {
      setSelectedCompanyId(companyId)
      setSelectedCompanyName(companyName.replace('Escolha uma empresa', '').trim())
    }
  }

  useEffect(() => {
    getMonthlyLimit()
    getMonthlyLimitBills()
    getCompanies()
    setChange(false)
  }, [change])
  
  return (
    <div>
      <PageHeader title="Limite Mensal"/>
      {monthlyLimit && monthlyLimit.id !== 0 ?  
        (
          <div className="flex">
            <div className="w-1/3">
              <div className="border border-black bg-yellow-300 rounded-lg m-2">
                <h1 className="text-center text-3xl mt-2">{monthlyLimit.name}</h1>
                <div className="mt-5">
                  <h3 className="text-center text-xl">Valor do Limite</h3>
                  <h2 className="text-center text-xl font-bold">{BRL.format(monthlyLimit.original_limit)}</h2>
                </div>
                <div className="mt-5">
                  <div className="flex justify-center gap-10">
                    <div>
                      <h3 className="text-center text-xl">Restante</h3>
                      <h2 className="text-center text-xl font-bold">{BRL.format(monthlyLimit.limit)}</h2>
                    </div>
                    <div>
                      <h3 className="text-center text-xl">Total Gasto</h3>
                      <h2 className="text-center text-xl font-bold text-red-600">{BRL.format(monthlyLimit.original_limit - monthlyLimit.limit)}</h2>
                    </div>
                  </div>
                </div>
                <button 
                  className="flex w-full items-center justify-center bg-red-500 py-1.5 rounded-b-lg hover:opacity-85 duration-300 mt-5" 
                  onClick={() => handleDeleteMonthlyLimit(monthlyLimit.id)}
                >
                  Remover Limite
                </button>
              </div>
              <div className="bg-white m-2 rounded-lg flex flex-col gap-3">
                <h2 className="text-center text-lg">Cadastrar despesa no limite</h2>
                <select
                  className="rounded-lg py-1 w-1/2 border border-neutral-300 px-2 mx-auto" 
                  onChange={e => handleCompanySelection(Number(e.target.value), e.target.innerText)}
                >
                  <option value={-1}>Escolha uma empresa</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
                <BillForm companyName={selectedCompanyName} companyId={selectedCompanyId} setChange={setChange} isLimitPage={true} />
              </div>
            </div>
            {bills.length > 0 &&
              <div className="flex flex-col w-1/2 mt-2 gap-2">
                <h1 className="text-lg">Despesas utilizando meu limite</h1>
                {bills.map(bill => (
                  <div key={bill.id} className="bg-white text-center rounded-lg flex items-center justify-between px-10">
                    <h4 className="text-xl font-bold">{bill.name}</h4>
                    <div className="flex flex-col">
                      <p>{BRL.format(Number(bill.value))}</p>
                      <p>{new Date(bill.payment_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        ):(
          <div>
             <button
                className="mt-10 text-xl items-center border mx-auto border-black p-3 bg-blue-500 text-white rounded-lg hover:opacity-80 duration-300 w-96 flex justify-center gap-3"
                onClick={() => {showMonthlyLimitForm ? setShowMonthlyLimitForm(false) : setShowMonthlyLimitForm(true)}}
                type="button"
              >
                <p>Cadastrar Limite Mensal</p>
                <CalendarPlus className="size-6" />
              </button>
               <CSSTransition
                  in={showMonthlyLimitForm}
                  timeout={200}
                  nodeRef={monthlyFormRef}
                  classNames={{
                    enter: 'opacity-0',
                    enterActive:
                      'opacity-100 transition-opacity duration-200 ease-out',
                    exit: 'opacity-0 duration-200',
                  }}
                  unmountOnExit
                >
                <MonthlyLimitForm setChange={setChange}/>
              </CSSTransition>
          </div>
        )
      }
    </div>
  )
}