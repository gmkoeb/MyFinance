import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../api/axios";
import { FormikHelpers } from "formik";
import CompanyForm from "../components/CompanyForm";

interface HomeProps {
  isSignedIn: boolean
}

interface Company{
  id: number,
  name: string
}

export default function Home({ isSignedIn }: HomeProps){
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false)
  const [errors, setCompanyErrors] = useState<string[]>([])
  
  function handleShowCompanyForm(){
    if(showCompanyForm){
      setShowCompanyForm(false)
    }else{
      setShowCompanyForm(true)
    }
  }

  async function getCompanies(){
    const result = await api.get('/companies')
    setCompanies(result.data)
  }

  async function handleCompanyCreation(values: {name: string}, actions: FormikHelpers<{ name: string }> ){
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

  useEffect(() => {
    if (isSignedIn){
      getCompanies()
    }
  }, [])
  
  return(
    <div>
        {isSignedIn ? (
          <>
            <h3 onClick={handleShowCompanyForm}>Cadastrar Empresa +</h3>
            {showCompanyForm && (
              <>
                <CompanyForm errors={errors} handleSubmit={handleCompanyCreation} />
              </>
            )}
            {companies.length > 0 &&
              <div>
                {companies.map(company => (
                  <p key={company.id}>{company.name}</p>
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