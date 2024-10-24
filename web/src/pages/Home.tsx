import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../api/axios";
import { Form, ErrorMessage, Field, Formik } from "formik";

interface HomeProps {
  isSignedIn: boolean
}

interface Company{
  id: number,
  name: string
}

interface CompanyFormValues{
  name: string
}

export default function Home({ isSignedIn }: HomeProps){
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false)
  const [companyErrors, setCompanyErrors] = useState<string[]>([])

  function handleCompanyForm(){
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

  async function handleCompanyCreation(values: any, actions: any ){
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
            <h3 onClick={handleCompanyForm}>Cadastrar Empresa +</h3>
            {showCompanyForm && (
              <>
                <Formik
                  initialValues={{ name: '' }}
                  validate={(values) => {
                    const errors: Partial<CompanyFormValues> = {}
                    if (!values.name) {
                      errors.name = "Campo obrigatório";
                    }
                    return errors
                  }} 
                  onSubmit={(values, actions) => {
                    handleCompanyCreation(values, actions)
                  }}
                  >
                  <Form>
                    <label htmlFor="name">Nome</label>
                    <Field id="name" name="name" placeholder="Nome da empresa"/>
                    <ErrorMessage name="name" component={'div'}></ErrorMessage>
                    <button type="submit">Enviar</button>
                    {companyErrors &&
                      (
                        <div>
                          {companyErrors.map(error => (
                            <p key={error}>{error}</p>
                          ))}
                        </div>
                      )
                    }
                  </Form>
                </Formik>
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