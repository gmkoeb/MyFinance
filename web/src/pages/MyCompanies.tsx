import { useEffect, useState } from "react";
import { Bill, Company } from "./Home";
import { api } from "../../api/axios";
import BillTable from "../components/BillTable";
import { Building, Building2, ChevronDown, ChevronUp, CircleDollarSign, House, Info } from "lucide-react";
import calculateMonthlyValue from "../lib/calculateMonthlyValue";

interface YearData {
  months: string[];
  bills: Bill[];
}

type BillHash = Record<string, YearData>;

export default function MyCompanies(){
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyOpen, setCompanyOpen] = useState<number>(-1)
  const [billHash, setBillHash] = useState<BillHash>({})
  const [yearOpen, setYearOpen] = useState<string>('')
  
  async function getCompanies(){
    const result = await api.get('/companies')
    setCompanies(result.data)
  }

  async function getBillsHistory(company_id: number){
    const result = await api.get(`/companies/${company_id}/bills_history`)
    setBillHash(Object.fromEntries(Object.entries(result.data) as [string, YearData][]));
  }

  function toggleCompanyBills(company_id: number){
    if(companyOpen === company_id){
      setCompanyOpen(-1)
    }else{
      getBillsHistory(company_id)
      setCompanyOpen(company_id)
    }
  }

  function toggleYear(year: string){
    if(yearOpen === year){
      setYearOpen('')
    } else {
      setYearOpen(year)
    }
  }

  useEffect(() => {
    setYearOpen('') 
  }, [companyOpen])

  useEffect(() => {
    getCompanies()
  }, [])

  return(
    <div>
      {companies.length > 0 ? (
        <>
          <div className="flex justify-center items-center">
            <h1 className="text-4xl text-center font-bold text-neutral-600 mb-4">Minhas Empresas</h1>
          </div>
          {companies.map(company => (
            <div key={company.id}>
              <div 
                onClick={() => toggleCompanyBills(company.id)} 
                className="flex gap-1 text-blue-500 items-center hover:cursor-pointer hover:opacity-80 duration-300 w-fit mx-auto">
                <h2 className="text-2xl italic ml-5">{company.name}</h2>
                {companyOpen === company.id ? (
                  <ChevronUp className="mt-2" />
                ) : (
                  <ChevronDown className="mt-2" />
                )}
              </div>
              {companyOpen === company.id && (
                <>
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl mb-1">Histórico</h2>
                    {Object.entries(billHash).map(([year, data]) => (
                      <div key={year}>
                        <h2 onClick={() => toggleYear(year)} className="text-xl capitalize text-blue-500 underline hover:cursor-pointer hover:opacity-85 duration-300 text-center">{year}</h2>
                        {yearOpen === year && (
                          <>
                            <h3 className="text-xl">Histórico de {year}</h3>
                            {data.months.map(month  => (
                              <div key={month}>
                                <h2 className="capitalize font-bold">{month}</h2>
                                  <div>
                                    <table className="mx-auto table-container w-full">
                                      <thead>
                                        <tr>
                                          <th>Nome da conta</th>
                                          <th>Empresa cobradora</th>
                                          <th>Valor</th>
                                          <th>Pagamento</th>
                                          <th>Data de pagamento</th>
                                        </tr>
                                      </thead>
                                      {data.bills.filter(bill => bill.month === month).map(bill => (
                                        <BillTable key={bill.id} bill={bill} isHome={false}/>
                                      ))}
                                    </table>
                                    <h4 className="flex justify-center bg-white border font-bold py-1 gap-2 text-red-600 mb-5"><CircleDollarSign /> Valor Total Pago: R$ {calculateMonthlyValue(data.bills.filter(bill => bill.month === month))}</h4>
                                  </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )
            }
            </div>
          ))}
        </>
      ) : (
        <><h1 className="text-3xl text-center">Você não possui empresas cadastradas.</h1></>
      )}
    </div>
  )
}