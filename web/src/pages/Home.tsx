import {
  CircleDollarSign,
  HousePlus,
  NotebookPen,
  Store,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { api } from '../../api/axios'
import BillForm from '../components/Home/BillForm'
import BillTable from '../components/Home/BillTable'
import CompanyForm from '../components/Home/CompanyForm'
import calculateMonthlyValue from '../lib/calculateMonthlyValue'
import { BRL } from '../lib/formatToBRL'
import { handleDeleteBill } from '../lib/handleDeleteBill'
interface HomeProps {
  isSignedIn: boolean
}

export interface Bill {
  id: number
  name: string
  billName: string
  billing_company: string
  company_id: number
  value: number | string
  paid: boolean
  month: string
  payment_date: Date
  recurrent: number | string
}

export interface Company {
  id: number
  name: string
}

export default function Home({ isSignedIn }: HomeProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false)
  const [bills, setBills] = useState<Bill[]>([])
  const [change, setChange] = useState<boolean>(false)
  const [showBillForm, setShowBillForm] = useState<number>(-1)
  const companyFormRef = useRef(null)
  const billFormRef = useRef(null)

  function handleShowCompanyForm() {
    setShowBillForm(-1)
    if (showCompanyForm) {
      setShowCompanyForm(false)
    } else {
      setShowCompanyForm(true)
    }
  }

  function handleShowBillForm(companyId: number) {
    setShowCompanyForm(false)
    if (showBillForm !== -1) {
      setShowBillForm(-1)
    } else {
      setShowBillForm(companyId)
    }
  }

  async function getCompanies() {
    const result = await api.get('/companies')
    await getBills(result.data)
    setCompanies(result.data)
  }

  async function getBills(companies: Company[]) {
    const result = await Promise.all(
      companies.map(company => api.get(`/companies/${company.id}/bills`))
    )
    const bills = result.map(response => response.data)
    const flattenedBills = bills.flat()
    setBills(flattenedBills)
  }

  useEffect(() => {
    if (isSignedIn) {
      getCompanies()
    }
    setShowCompanyForm(false)
    setChange(false)
  }, [change])

  return (
    <div>
      {isSignedIn ? (
        <div>
          <h1 className="w-full text-left bg-neutral-100 h-20 mb-10 text-4xl font-bold items-center flex pl-10 border-b border-neutral-300 text-neutral-600">
            Página Inicial
          </h1>
          <div className="flex items-center justify-center gap-20 w-96 mx-auto mb-10">
            <div className="flex flex-col items-center">
              <button
                className="text-xl items-center border border-black p-3 bg-blue-500 text-white rounded-lg hover:opacity-80 duration-300 w-96 flex justify-center gap-3"
                onClick={handleShowCompanyForm}
                type="button"
              >
                <p>Cadastrar Empresa</p>
                <HousePlus className="size-6" />
              </button>
              <CSSTransition
                nodeRef={companyFormRef}
                in={showCompanyForm}
                timeout={200}
                classNames={{
                  enter: 'opacity-0',
                  enterActive:
                    'opacity-100 transition-opacity duration-200 ease-out',
                  exit: 'opacity-0 duration-200',
                }}
                unmountOnExit
              >
                <div
                  ref={companyFormRef}
                  className="absolute bg-white border border-neutral-400 rounded-lg mt-14"
                >
                  <div className="relative">
                    <X
                      onClick={() => setShowCompanyForm(false)}
                      className="text-red-500 border rounded-full size-6 p-1 hover:bg-red-400 border-neutral-400 cursor-pointer absolute m-1 duration-300"
                    />
                  </div>
                  <CompanyForm setChange={setChange} />
                </div>
              </CSSTransition>
            </div>
          </div>
          <div className="flex flex-col items-center border-t border-neutral-400">
            {companies.length > 0 && (
              <div>
                <h2 className="text-4xl font-bold text-center mb-10">
                  Empresas
                </h2>
                <div className="flex flex-col min-[1380px]:w-[950px]">
                  {companies.map(company => (
                    <div
                      key={company.id}
                      className="border border-black rounded mb-10 p-4 bg-neutral-100"
                    >
                      <div className="flex justify-between border-b border-neutral-400 pb-2">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Store className="mt-0.5 size-7" />
                          <h2 className="text-3xl">{company.name}</h2>
                        </div>
                        <button
                          onClick={() => handleShowBillForm(company.id)}
                          type="button"
                          className="text-lg text-neutral-100 bg-blue-500 gap-2 flex justify-center p-2 rounded-lg"
                        >
                          <NotebookPen className="size-6 mt-0.5" />
                          Cadastrar Despesa
                        </button>
                      </div>
                      <div>
                        <CSSTransition
                          in={showBillForm === company.id}
                          timeout={200}
                          nodeRef={billFormRef}
                          classNames={{
                            enter: 'opacity-0',
                            enterActive:
                              'opacity-100 transition-opacity duration-200 ease-out',
                            exit: 'opacity-0 duration-200',
                          }}
                          unmountOnExit
                        >
                          <div
                            ref={billFormRef}
                            className="h-fit w-[400px] bg-white border rounded-lg border-neutral-400 shadow-lg absolute left-1/2 right-1/2 -mt-40 -ml-10"
                          >
                            <div className="relative">
                              <X
                                onClick={() => setShowBillForm(-1)}
                                className="text-red-500 border rounded-full size-7 p-1 hover:bg-red-400 border-neutral-400 cursor-pointer absolute m-4 duration-300"
                              />
                            </div>
                            <BillForm
                              companyName={company.name}
                              companyId={company.id}
                              setChange={setChange}
                            />
                          </div>
                        </CSSTransition>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold capitalize my-4 month">
                          {new Date().toLocaleString('pt-BR', {
                            month: 'long',
                          })}
                        </h3>
                        {bills.filter(bill => bill.company_id === company.id)
                          .length > 0 && (
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
                              <tbody>
                                {bills
                                  .filter(
                                    bill => bill.company_id === company.id
                                  )
                                  .map(bill => (
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
                            <h4 className="flex justify-center bg-white border font-bold p-1 gap-2 text-red-600 total-price">
                              <CircleDollarSign /> Valor Total Pago: R${' '}
                              {BRL.format(
                                calculateMonthlyValue(
                                  bills.filter(
                                    bill => bill.company_id === company.id
                                  )
                                )
                              )}
                            </h4>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-center text-3xl">
            Boas vindas ao{' '}
            <span className="text-blue-500 font-bold">MinhasFinanças</span>.
            <br />{' '}
            <Link className="text-blue-500 underline" to="/sign_up">
              Crie uma conta agora
            </Link>{' '}
            para começar a gerenciar suas despesas de forma fácil e prática.
          </h2>
        </>
      )}
    </div>
  )
}
