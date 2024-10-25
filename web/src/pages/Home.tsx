import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../api/axios";
import { FormikHelpers } from "formik";
import CompanyForm from "../components/CompanyForm";
import BillForm from "../components/BillForm";

interface HomeProps {
  isSignedIn: boolean
}

interface Company{
  id: number,
  name: string
}

export interface Bill{
  id: number,
  name: string | undefined,
  billing_company: string | undefined,
  company_id: number | undefined,
  value: number | undefined,
  paid: boolean | undefined,
  payment_date: Date | undefined
}

export default function Home({ isSignedIn }: HomeProps){
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false)
  const [companyErrors, setCompanyErrors] = useState<string[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [billErrors, setBillErrors] = useState<string[]>([])

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
        name: values.name,
        billing_company: values.billing_company,
        value: values.value,
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
          <>
            <h3 onClick={handleShowCompanyForm}>Cadastrar Empresa +</h3>
            {showCompanyForm && (
              <>
                <CompanyForm errors={companyErrors} handleSubmit={handleCompanyCreation} />
              </>
            )}
            {companies.length > 0 &&
              <div>
                {companies.map(company => (
                  <div key={company.id}>
                    <p>{company.name}</p>
                    <BillForm errors={billErrors} handleSubmit={(values, actions) => handleBillCreation(company.id, values, actions)}/>
                    <div>
                      {bills.length > 0 && 
                        <div>
                          {bills.filter(bill => bill.company_id === company.id).map(bill => (
                            <div key={bill.id}>
                              <p>{bill.name}</p>
                              <p>{bill.billing_company}</p>
                              <p>{bill.value}</p>
                              <p>{bill.paid}</p>
                              <p>{bill.payment_date?.toString()}</p>
                            </div>
                          ))}
                        </div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            }
          </>
        ) : (
          <>
            Boas vindas ao MinhasFinanças. <Link to='/sign_up'>Crie uma conta agora</Link> para começar a gerenciar suas despesas de forma fácil e prática.
          </>
        )
      }
    </div>
  )
}