import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../../api/axios'
import Dropdown from '../components/Monthly/Dropdown'
import { MonthlyBillEditForm } from '../components/Monthly/MonthlyBillEditForm'
import { MonthlyBillForm } from '../components/Monthly/MonthlyBillForm'
import { BRL } from '../lib/formatToBRL'
import type { Bill, Company } from './Home'
import PageHeader from '../components/PageHeader'

export default function Monthly() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(-1)
  const [companies, setCompanies] = useState<Company[]>([])
  const [monthlyBills, setMonthlyBills] = useState<Bill[]>([])
  const [billValue, setBillValue] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<number>(-1)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [clickedId, setClickedId] = useState<number>(-1)
  const [filter, setFilter] = useState<string | null>('')
  const [allBills, setAllBills] = useState<Bill[]>([...monthlyBills])

  useEffect(() => {
    getCompaniesAndBills()
  }, [])

  useEffect(() => {
    if (filter && filter.length > 0) {
      setMonthlyBills(() =>
        allBills.filter(bill =>
          bill.name.toLowerCase().includes(filter.toLowerCase())
        )
      )
    } else {
      setMonthlyBills(allBills)
    }
  }, [filter, allBills])

  async function payMonthlyBill(companyId: number, bill: Partial<Bill>) {
    if (billValue) {
      const billData = {
        bill: {
          name: bill.name,
          billing_company: bill.billing_company,
          value: billValue.toString().replace(',', '.'),
          paid: true,
        },
      }
      await api.post(`/companies/${companyId}/create_bill`, billData)
      getMonthlyBills(companies)
    }
  }

  async function getMonthlyBills(companies: Company[]) {
    const result = await Promise.all(
      companies.map(company =>
        api.get(`/companies/${company.id}/monthly_bills`)
      )
    )
    const monthlyBills = result.map(response => response.data)
    const flattenedBills = monthlyBills.flat()
    setMonthlyBills(flattenedBills)
    setAllBills(flattenedBills)
  }

  async function getCompaniesAndBills() {
    const result = await api.get('/companies')
    const companies = result.data
    setCompanies(companies)
    getMonthlyBills(companies)
  }

  async function handleDeleteMonthlyBill(billId: number) {
    await api.delete(`/monthly_bills/${billId}`)
    getMonthlyBills(companies)
  }

  function handleShowEdit(id: number) {
    setClickedId(id)
    setShowEdit(true)
    setShowDropdown(-1)
  }

  return (
    <div>
      <PageHeader title='Mensalidades'/>
      {companies.length > 0 ? (
        <div className="mb-20 flex flex-col">
          <div className="bg-neutral-100 text-center border-b border-neutral-600 mb-10">
            <h2 className="text-lg">Adicionar Mensalidade</h2>
            <select
              className="border rounded-lg text-center my-5"
              value={selectedCompanyId}
              onChange={e => setSelectedCompanyId(Number(e.target.value))}
            >
              <option value={-1}>Selecione uma empresa</option>
              {companies.map(company => (
                <option value={company.id} key={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCompanyId !== -1 && (
            <div>
              <div className="relative">
                <X
                  onClick={() => setSelectedCompanyId(-1)}
                  className="text-red-500 border rounded-full size-6 p-1 hover:bg-red-400 border-neutral-400 cursor-pointer absolute left-1/4 -top-10 m-3 duration-300"
                />
              </div>
              <MonthlyBillForm
                companies={companies}
                getMonthlyBills={getMonthlyBills}
                companyId={selectedCompanyId}
              />
            </div>
          )}
          <div className="mx-auto w-96 flex flex-col">
            <label className='px-1' htmlFor="search">
              Buscar mensalidade
            </label>
            <input
              className="p-1 rounded-lg border border-neutral-400 mb-10"
              name="search"
              onChange={event => setFilter(event.target.value)}
              placeholder="Buscar mensalidade"
              type="text"
            />
          </div>
          {companies.map(company => {
            const filteredBills = monthlyBills.filter(
              bill => company.id === bill.company_id
            )
            return filteredBills.length > 0 ? (
              <div
                key={company.id}
                className="flex flex-col items-center w-full border-b-2"
              >
                <h1 className="text-3xl">{company.name}</h1>
                <div className="flex flex-wrap gap-2 my-5 justify-center">
                  {filteredBills.map(bill => (
                    <div
                      key={bill.id}
                      className={
                        bill.paid
                          ? 'flex flex-col border gap-1 items-center border-black rounded-lg w-40 h-fit justify-center text-center bg-slate-100'
                          : 'flex flex-col gap-1 items-center border border-black rounded-lg bg-white w-40 h-fit justify-center text-center'
                      }
                    >
                      <div>
                        <Dropdown
                          showDropdown={showDropdown}
                          setShowDropdown={setShowDropdown}
                          billId={bill.id}
                        >
                          <button
                            type="button"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 text-center w-full"
                            role="menuitem"
                            tabIndex={-1}
                            onClick={() => handleShowEdit(bill.id)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 text-center w-full"
                            role="menuitem"
                            tabIndex={-1}
                            onClick={() => handleDeleteMonthlyBill(bill.id)}
                          >
                            Remover
                          </button>
                        </Dropdown>
                      </div>
                      {showEdit && clickedId === bill.id && (
                        <div className="text-neutral-600 bg-white w-80 z-10 border border-neutral-600 rounded-lg absolute">
                          <div className="relative">
                            <X
                              onClick={() => setShowEdit(false)}
                              className="text-red-500 border rounded-full size-6 p-1 hover:bg-red-400 border-neutral-400 cursor-pointer absolute m-2 duration-300 hover:text-white"
                            />
                          </div>
                          <MonthlyBillEditForm
                            setShowEdit={setShowEdit}
                            companies={companies}
                            getMonthlyBills={getMonthlyBills}
                            monthlyBillId={bill.id}
                            monthlyBill={bill}
                          />
                        </div>
                      )}
                      <div className="w-full">
                        <div className={bill.paid ? 'opacity-45' : ''}>
                          <h3 className="text-center text-md font-bold">
                            {bill.name}
                          </h3>
                          <p>{bill.billing_company}</p>
                          {bill.paid && <p>{BRL.format(Number(bill.value))}</p>}
                        </div>
                        {bill.paid ? (
                          <div className="w-full">
                            <button
                              disabled
                              type="button"
                              onClick={() => payMonthlyBill(company.id, bill)}
                              className="bg-slate-500 mt-[7px] p-1 rounded-b-lg text-sm w-full text-white"
                            >
                              Pago
                            </button>
                          </div>
                        ) : (
                          <div className="w-full">
                            <input
                              className="w-28 mb-1 border border-black rounded-lg text-center invalid:Field"
                              placeholder="Valor"
                              type="text"
                              required
                              onChange={e => setBillValue(e.target.value)}
                            />
                            <button
                              type="submit"
                              onClick={() => payMonthlyBill(company.id, bill)}
                              className="bg-green-600 p-1 rounded-b-lg text-sm w-full hover:opacity-90 duration-300 text-white"
                            >
                              Pagar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filter?.length === 0 ? (
              <div
                key={company.id}
                className="flex flex-col w-1/2 items-center mb-10 mx-auto"
              >
                <h1 className="text-3xl">{company.name}</h1>
                <h2>Empresa ainda não possui mensalidades cadastradas</h2>
              </div>
            ) : undefined
          })}
        </div>
      ) : (
        <h1 className="text-center">
          Você não possui nenhuma empresa cadastrada
        </h1>
      )}
    </div>
  )
}
