import { useEffect, useState } from "react";
import { Bill, Company } from "./Home";
import { api } from "../../api/axios";
import BillTable from "../components/BillTable";
import { CircleDollarSign } from "lucide-react";
import calculateMonthlyValue from "../lib/calculateMonthlyValue";
import Chart from "react-google-charts";

type BillEntry = [string, {}];
type BillData = BillEntry[];
type Stats = {
  [key: string]: number;
};

export default function History(){
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(-1)
  const [bills, setBills] = useState<Bill[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('default')
  const [months, setMonths] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [billStats, setBillStats] = useState<BillData>([])

  async function getCompanies(){
    const result = await api.get('/companies')
    setCompanies(result.data)
  }

  async function getBillsYears(company_id: number){
    const result = await api.get(`/companies/${company_id}/bills_years`)
    setYears(result.data.years)
  }

  async function getBillsHistory(company_id: number){
    const result = await api.get(`/companies/${company_id}/bills_history/${selectedYear}`)
    setSelectedCompany(result.data.company)
    setBills(result.data.bills);
    setMonths(result.data.months);
  }

  async function getBillsStatistics(company_id: number){
    const result = await api.get(`/companies/${company_id}/bills_statistics/${selectedYear}`)
    const stats: Stats = result.data.stats
    setBillStats(Object.entries(stats).map(([key, value]) => [key, { v: value, f: `R$ ${value.toLocaleString()}` }]));
  }

  function handleCompanySelection(company_id: number){
    if(company_id === -1){
      setSelectedCompanyId(-1)
      setBills([])
      setYears([])
    } else {
      setSelectedCompanyId(company_id)
      getBillsYears(company_id)
    }
  }

  function handleYearSelection(year: string){
    if(selectedYear === year){
      setSelectedYear('default')
    } else {
      setSelectedYear(year)
    }
  }

  useEffect(() => {
    setSelectedYear('default') 
  }, [selectedCompanyId])

  useEffect(() => {
    if (selectedYear !== 'default'){
      getBillsHistory(selectedCompanyId)
      getBillsStatistics(selectedCompanyId)
    } else (
      setBills([])
    )
  }, [selectedYear])

  useEffect(() => {
    getCompanies()
  }, [])

  return(
    <div>
      {companies.length > 0 ? (
        <>
          <div className="flex justify-center items-center">
            <h1 className="text-4xl text-center font-bold text-neutral-600 mb-4">Histórico</h1>
          </div>
          <div>
            <h2 className="text-4xl mx-28 mb-6 font-bold">Histórico</h2>
            <div className="ml-28 border-b border-neutral-400 relative"></div>
            <div className="mx-28 mt-6">
              <select className="rounded-l-lg py-1 border-r border-t-2 border-b-2 border-l-2 border-neutral-300 text-lg font-bold px-2" onChange={(e) => handleCompanySelection(Number(e.target.value))}>
                <option value={-1}>Escolha uma empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
              <select value={selectedYear}
                className="rounded-r-lg py-1 border-r-2 border-t-2 border-b-2 border-neutral-300 text-lg px-2" 
                onChange={(e) => handleYearSelection(e.target.value)}>
                <option value="default">Escolha um ano</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            {selectedCompanyId && (
            <>
              <div className="flex flex-col items-center">
                <>
                  {selectedYear !== 'default' && (
                      <>
                        <h3 className="text-2xl text-blue-500 font-bold">
                          Histórico de {selectedYear} - <span className="italic">{selectedCompany}</span>
                        </h3>
                        {(() => {
                          const data = [
                            ["Bill", "Value Spent"],
                            ...billStats.map(entry => entry)
                          ];
                          const options = {
                            title: "Despesas anuais",
                            backgroundColor: '#E4E4E4',
                            is3D: true
                          };
                          
                          return (
                            <div className="mx-auto w-1/2 bg-neutral-400">
                              <Chart
                                chartType="PieChart"
                                data={data}
                                options={options}
                                width={"100%"}
                                height={"400px"}
                                legendToggle
                              />
                            </div>
                          );
                        })()}
                      </>
                    )}
                    {months.map(month  => {
                      const monthlyBills = bills.filter(bill => bill.month === month)
                      
                      return monthlyBills.length > 0 ? (
                        <div key={month}>
                          
                          <h2 className="capitalize font-bold">{month}</h2>
                            <div>
                              <table className="mx-auto table-container w-[50rem] max-md:w-[20rem]">
                                <thead>
                                  <tr>
                                    <th>Nome da conta</th>
                                    <th>Empresa cobradora</th>
                                    <th>Valor</th>
                                    <th>Pagamento</th>
                                    <th>Data de pagamento</th>
                                  </tr>
                                </thead>
                                {monthlyBills.map(bill => (
                                  <BillTable key={bill.id} bill={bill} isHome={false}/>
                                ))}
                              </table>
                              <h4 className="flex justify-center bg-white border font-bold py-1 gap-2 text-red-600 mb-5"><CircleDollarSign /> Valor Total Pago: R$ {calculateMonthlyValue(monthlyBills)}</h4>
                            </div>
                        </div>
                      ) : null
                    })}
                  </>
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