import { useEffect, useState } from "react";
import { Bill, Company } from "./Home";
import { api } from "../../api/axios";
import BillTable from "../components/BillTable";
import { CircleDollarSign } from "lucide-react";
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
  const [selectedYear, setSelectedYear] = useState<string>('default')
  
  async function getCompanies(){
    const result = await api.get('/companies')
    setCompanies(result.data)
  }

  async function getBillsHistory(company_id: number){
    const result = await api.get(`/companies/${company_id}/bills_history`)
    setBillHash(Object.fromEntries(Object.entries(result.data) as [string, YearData][]));
  }

  function toggleCompanyBills(company_id: number){
    if(company_id === -1){
      setCompanyOpen(-1)
      setBillHash({})
    } else {
      getBillsHistory(company_id)
      setCompanyOpen(company_id)
    }
  }

  function toggleYear(year: string){
    if(selectedYear === year){
      setSelectedYear('default')
    } else {
      setSelectedYear(year)
    }
  }

  useEffect(() => {
    setSelectedYear('default') 
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
          <div>
            <h2 className="text-4xl mx-28 mb-6 font-bold">Histórico</h2>
            <div className="ml-28 border-b border-neutral-400 relative"></div>
            <div className="mx-28 mt-6">
              <select className="rounded-l-lg py-1 border-r border-t-2 border-b-2 border-l-2 border-neutral-300 text-lg font-bold px-2" onChange={(e) => toggleCompanyBills(Number(e.target.value))}>
                <option value={-1}>Escolha uma empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
              <select value={selectedYear} className="rounded-r-lg py-1 border-r-2 border-t-2 border-b-2 border-neutral-300 text-lg px-2" onChange={(e) => toggleYear(e.target.value)}>
                <option value="default">Escolha um ano</option>
                {Object.entries(billHash).map(([year]) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            {companyOpen && (
              <>
                <div className="flex flex-col items-center">
                  {Object.entries(billHash).map(([year, data]) => (
                    <div key={year}>
                      {selectedYear === year && (
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
        </>
      ) : (
        <><h1 className="text-3xl text-center">Você não possui empresas cadastradas.</h1></>
      )}
    </div>
  )
}