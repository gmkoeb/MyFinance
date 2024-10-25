import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../api/axios";
import { FormikHelpers } from "formik";
import CompanyForm from "../components/CompanyForm";
import BillForm from "../components/BillForm";
import { HousePlus, Trash } from "lucide-react";
import calculateMonthlyValue from "../lib/calculateMonthlyValue";

interface HomeProps {
  isSignedIn: boolean
}

export interface Company{
  id: number,
  name: string
}

export interface Bill{
  id: number,
  name: string | undefined,
  billName: string | undefined,
  billing_company: string | undefined,
  company_id: number | undefined,
  value: number | string | undefined,
  paid: boolean | undefined,
  payment_date: Date | undefined
}

export default function Home({ isSignedIn }: HomeProps){
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false)
  const [companyErrors, setCompanyErrors] = useState<string[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [billErrors, setBillErrors] = useState<string[]>([])
  const date = new Date()
  const monthNamePt = date.toLocaleString('pt-BR', { month: 'long' });

  function handleShowCompanyForm(){
    if(showCompanyForm){
      setShowCompanyForm(false)
    }else{
      setShowCompanyForm(true)
    }
  }

  async function getCompanies(){
    const result = await api.get('/companies')
    await getBills(result.data)
    setCompanies(result.data)
  }

  async function getBills(companies: Company[]){
    const result = await Promise.all(companies.map(company => api.get(`/companies/${company.id}/bills`)));
    const bills = result.map(response => response.data);
    const flattenedBills = bills.flat();
    setBills(flattenedBills)
  }

  async function handleDeleteBill(billId: number){
    try {
      await api.delete(`/bills/${billId}`)
      getBills(companies)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCompanyCreation(values: Omit<Company, 'id'>, actions: FormikHelpers<{ name: string }> ){
    try {
      const companyData = { company: {
        name: values.name
      }}
      await api.post('/companies', companyData)
      actions.setSubmitting(false);
      getCompanies()
      actions.resetForm()
    } catch(error: any){
      actions.setSubmitting(false);
      setCompanyErrors(error.response.data.message)
    }
  }

  async function handleBillCreation(company_id: number, values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>){
    try{
      const billData = { bill: {
        name: values.billName,
        billing_company: values.billing_company,
        value: values.value,
        paid: values.paid,
        payment_date: new Date()
      }}
      await api.post(`/companies/${company_id}/bills`, billData)
      actions.setSubmitting(false)
      getBills(companies)
      actions.resetForm()
    } catch(error: any){
      actions.setSubmitting(false)
      setBillErrors(error.response.data.message)
    }
  }

  useEffect(() => {
      if (isSignedIn) {
        getCompanies();
      }
  }, []); 
  
  return(
    <div>
        {isSignedIn ? (
          <div>
            <div className="flex flex-col items-center mb-4">
              <button 
                className="text-xl items-center border border-black p-3 font-bold bg-blue-500 text-white rounded-full hover:opacity-80 duration-300 w-96 flex justify-center gap-3" 
                onClick={handleShowCompanyForm}>
                  <p>Cadastrar Empresa </p>
                  <HousePlus width={26} height={26} />
              </button>
              {showCompanyForm && (
                <div className="mb-3 flex flex-col">
                  <CompanyForm errors={companyErrors} handleSubmit={handleCompanyCreation} />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center border-t border-neutral-400">
              {companies.length > 0 &&
                <div>
                  <h2 className="text-4xl font-bold text-center mb-10">Empresas</h2>
                  <div className="flex flex-col">
                    {companies.map(company => (
                      <div key={company.id} className="border border-black rounded mb-10 p-4">
                        <h3 className="text-3xl italic font-semibold text-neutral-600 text-center">{company.name}</h3>
                        <div>
                          <h3 className="text-2xl text-blue-500 font-bold">Cadastrar Conta</h3>
                          <BillForm company_id={company.id} errors={billErrors} handleSubmit={(values, actions) => handleBillCreation(company.id, values, actions)}/>
                        </div>
                        <div>
                          {bills.filter(bill => bill.company_id === company.id).length > 0 && 
                            <div>
                              <h3 className="capitalize text-xl font-bold mt-4">{monthNamePt}</h3>
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
                                  {bills.filter(bill => bill.company_id === company.id).map(bill => (
                                    <tr key={bill.id} className={bill.paid ? "bg-white" : "bg-neutral-300"}>
                                      <td>{bill.name}</td>
                                      <td>{bill.billing_company}</td>
                                      <td>R$ {bill.value}</td>
                                      <td>{bill.paid ? "Efetuado" : "Não Efetuado"}</td>
                                      <td 
                                        className="flex justify-between">{bill.payment_date ? new Date(bill.payment_date).toLocaleDateString('pt-BR') : 'N/A'} 
                                        <Trash onClick={() => handleDeleteBill(bill.id)} color="red"/>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <h4 className="text-center mx-auto bg-white border font-bold p-1">Total Pago: R$ {calculateMonthlyValue(bills.filter(bill => bill.company_id === company.id))}</h4>
                            </div>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-center text-3xl">Boas vindas ao <span className="text-blue-500 font-bold">MinhasFinanças</span>.<br></br> <Link className="text-blue-500 underline" to='/sign_up'>Crie uma conta agora</Link> para começar a gerenciar suas despesas de forma fácil e prática.</h2>
          </>
        )
      }
    </div>
  )
}