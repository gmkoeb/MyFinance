import { CircleDollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import { api } from '../../api/axios'
import BillTable from '../components/Home/BillTable'
import calculateMonthlyValue from '../lib/calculateMonthlyValue'
import { BRL } from '../lib/formatToBRL'
import { handleDeleteBill } from '../lib/handleDeleteBill'
import type { Bill, Company } from './Home'
import PageHeader from '../components/PageHeader'

type BillEntry = [string, {}]
type BillData = BillEntry[]
type Stats = {
  [key: string]: number
}

export default function History() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(-1)
  const [bills, setBills] = useState<Bill[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('default')
  const [months, setMonths] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [billStats, setBillStats] = useState<BillData>([])
  const [paymentStatus, setPaymentStatus] = useState<string>('all')
  const [change, setChange] = useState<boolean>(false)

  async function getBillsYears(company_id: number) {
    const result = await api.get(`/companies/${company_id}/bills_years`)
    setYears(result.data.years)
  }

  function handleCompanySelection(company_id: number) {
    if (company_id === -1) {
      setSelectedCompanyId(-1)
      setBills([])
      setYears([])
    } else {
      setSelectedCompanyId(company_id)
      getBillsYears(company_id)
    }
  }

  function handleYearSelection(year: string) {
    if (selectedYear === year) {
      setSelectedYear('default')
    } else {
      setSelectedYear(year)
    }
  }

  async function getBillsHistory(company_id: number) {
    const result = await api.get(
      `/companies/${company_id}/bills_history/${selectedYear}?query=${paymentStatus}`
    )
    setSelectedCompany(result.data.company)
    setBills(result.data.bills)
    setMonths(result.data.months)
  }

  async function getBillsStatistics(company_id: number) {
    const result = await api.get(
      `/companies/${company_id}/bills_statistics/${selectedYear}?query=${paymentStatus}`
    )
    const stats: Stats = result.data.stats
    setBillStats(
      Object.entries(stats).map(([key, value]) => [
        key,
        { v: value, f: `R$ ${value.toLocaleString('pt-BR')}` },
      ])
    )
  }
  useEffect(() => {
    if (selectedCompanyId !== -1) setSelectedYear('default')
  }, [selectedCompanyId])

  useEffect(() => {
    if (selectedYear !== 'default') {
      getBillsHistory(selectedCompanyId)
      getBillsStatistics(selectedCompanyId)
    } else setBills([])
  }, [selectedYear, selectedCompanyId, paymentStatus])

  useEffect(() => {
    if (change === true) {
      getBillsHistory(selectedCompanyId)
      getBillsStatistics(selectedCompanyId)
    }
  }, [change, selectedCompanyId])

  useEffect(() => {
    async function getCompanies() {
      const result = await api.get('/companies')
      setCompanies(result.data)
    }
    getCompanies()
  }, [])

  return (
    <div>
      <PageHeader title='Histórico'/>
      {companies.length > 0 ? (
        <>
          <div>
            <h2 className="text-2xl mx-28 mb-6 font-semibold mt-5">
              Escolha uma empresa e um ano
            </h2>
            <div className="ml-28 border-b border-neutral-400 relative" />
            <div className="mx-28 mt-6">
              <select
                className="rounded-l-lg py-1 border-r border-t-2 border-b-2 border-l-2 border-neutral-300 px-2"
                onChange={e => handleCompanySelection(Number(e.target.value))}
              >
                <option value={-1}>Escolha uma empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                className="py-1 border-r border-t-2 border-b-2 border-neutral-300 px-2"
                onChange={e => handleYearSelection(e.target.value)}
              >
                <option value="default">Escolha um ano</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                className="rounded-r-lg py-1 border-r-2 border-t-2 border-b-2 border-neutral-300 px-2"
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value)}
              >
                <option value="all">Todas</option>
              </select>
            </div>
          </div>
          <div>
            {selectedCompanyId && (
              <div className="flex flex-col items-center">
                <>
                  {selectedYear !== 'default' && bills.length > 0 ? (
                    <>
                      <h3 className="text-2xl text-blue-500 font-bold">
                        Histórico de {selectedYear} -{' '}
                        <span>{selectedCompany}</span>
                      </h3>
                      {(() => {
                        const data = [
                          ['Bill', 'Value Spent'],
                          ...billStats.map(entry => entry),
                        ]
                        const options = {
                          title: 'Despesas anuais',
                          backgroundColor: '#E4E4E4',
                        }

                        return (
                          <div className="mx-auto w-1/2 bg-neutral-400">
                            <Chart
                              chartType="PieChart"
                              data={data}
                              options={options}
                              width={'100%'}
                              height={'400px'}
                              legendToggle
                            />
                          </div>
                        )
                      })()}
                    </>
                  ) : (
                    selectedYear !== 'default' && (
                      <h1>Nenhuma conta encontrada</h1>
                    )
                  )}
                  {months.map(month => {
                    const monthlyBills = bills.filter(
                      bill => bill.month === month
                    )
                    return monthlyBills.length > 0 ? (
                      <div className="mb-10" key={month}>
                        <h2 className="capitalize font-bold">{month}</h2>
                        <div>
                          <table className="mx-auto table-container min-[1380px]:w-[950px]">
                            <thead>
                              <tr>
                                <th>Nome da conta</th>
                                <th>Empresa cobradora</th>
                                <th>Valor</th>
                                <th>Data de pagamento</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthlyBills.map(bill => (
                                <BillTable
                                  setChange={setChange}
                                  key={bill.id}
                                  bill={bill}
                                  handleDeleteBill={() =>
                                    handleDeleteBill(bill.id, setChange)
                                  }
                                />
                              ))}
                            </tbody>
                          </table>
                          <h4 className="flex justify-center bg-white border font-bold py-1 gap-2 text-red-600 mb-5">
                            <CircleDollarSign /> Valor Total Pago: R${' '}
                            {BRL.format(calculateMonthlyValue(monthlyBills))}
                          </h4>
                        </div>
                      </div>
                    ) : null
                  })}
                </>
              </div>
            )}
          </div>
        </>
      ) : (
        <h1 className="text-center">
          Você não possui nenhuma empresa cadastrada
        </h1>
      )}
    </div>
  )
}
