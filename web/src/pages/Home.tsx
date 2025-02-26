import type { FormikHelpers } from 'formik'
import { CircleDollarSign, HousePlus, NotebookPen, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/axios'
import BillForm from '../components/BillForm'
import BillTable from '../components/BillTable'
import CompanyForm from '../components/CompanyForm'
import calculateMonthlyValue from '../lib/calculateMonthlyValue'
import { handleDeleteBill } from '../lib/handleDeleteBill'

interface HomeProps {
  isSignedIn: boolean
}

export interface Company {
  id: number
  name: string
}

export interface Bill {
  id: number
  name: string | undefined
  billName: string | undefined
  billing_company: string | undefined
  company_id: number | undefined
  value: number | string | undefined
  paid: boolean | undefined
  month: string
  payment_date: Date | null | undefined
  recurrent: number | string | undefined
}

export default function Home({ isSignedIn }: HomeProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false)
  const [companyErrors, setCompanyErrors] = useState<string[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [billErrors, setBillErrors] = useState<string[]>([])
  const [change, setChange] = useState<boolean>(false)

  function handleShowCompanyForm() {
    if (showCompanyForm) {
      setShowCompanyForm(false)
    } else {
      setShowCompanyForm(true)
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

  async function handleCompanyCreation(
    values: Omit<Company, 'id'>,
    actions: FormikHelpers<{ name: string }>
  ) {
    try {
      const companyData = {
        company: {
          name: values.name,
        },
      }
      await api.post('/companies', companyData)
      actions.setSubmitting(false)
      setChange(true)
      actions.resetForm()
    } catch (error: any) {
      actions.setSubmitting(false)
      setCompanyErrors(error.response.data.message)
    }
  }

  async function handleBillCreation(
    company_id: number,
    values: Partial<Bill>,
    actions: FormikHelpers<Partial<Bill>>
  ) {
    try {
      const billData = {
        bill: {
          name: values.billName,
          billing_company: values.billing_company,
          value: values.value?.toString().replace(',', '.'),
          paid: values.paid,
          payment_date: values.payment_date,
          recurrent: values.recurrent,
        },
      }
      await api.post(`/companies/${company_id}/bills`, billData)
      actions.setSubmitting(false)
      setChange(true)
      actions.resetForm()
    } catch (error: any) {
      actions.setSubmitting(false)
      setBillErrors(error.response.data.message)
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      getCompanies()
    }
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
                className="text-xl items-center border border-black p-3 font-bold bg-blue-500 text-white rounded-full hover:opacity-80 duration-300 w-96 flex justify-center gap-3"
                onClick={handleShowCompanyForm}
                type="button"
              >
                <p>Cadastrar Empresa </p>
                <HousePlus width={26} height={26} />
              </button>
              {showCompanyForm && (
                <div className="mb-3 flex flex-col">
                  <CompanyForm
                    errors={companyErrors}
                    handleSubmit={handleCompanyCreation}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center border-t border-neutral-400">
            {companies.length > 0 && (
              <div>
                <h2 className="text-4xl font-bold text-center mb-10">
                  Empresas
                </h2>
                <div className="flex flex-col w-[1100px] max-2xl:w-[780px]">
                  {companies.map(company => (
                    <div
                      key={company.id}
                      className="border border-black rounded mb-10 p-4 bg-neutral-100"
                    >
                      <h3 className="text-3xl font-semibold text-neutral-600 flex items-center justify-center gap-2 mb-4 border-b border-neutral-600 pb-2">
                        <Store className="mt-0.5 size-7" />
                        {company.name}
                      </h3>
                      <div id="bill-form-container">
                        <h3 className="text-2xl text-blue-600 font-bold gap-2 mb-2 flex justify-center my-2">
                          <NotebookPen className="size-7 mt-0.5" />
                          Cadastrar Despesa
                        </h3>
                        <BillForm
                          isMonthly={false}
                          company_id={company.id}
                          errors={billErrors}
                          handleSubmit={(values, actions) =>
                            handleBillCreation(company.id, values, actions)
                          }
                        />
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
                              {calculateMonthlyValue(
                                bills.filter(
                                  bill => bill.company_id === company.id
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
