import { Formik, type FormikHelpers } from 'formik'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios'
import { FormInput } from '../components/Form/form-input'
import { FormRoot } from '../components/Form/form-root'

interface ApiResponse {
  user: {
    email: string
    name: string
  }
}

interface SignUpFormValues {
  email: string
  name: string
  password: string
  password_confirmation: string
}

export default function SignUp() {
  const navigate = useNavigate()
  const initialValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }
  const [apiErrors, setApiErrors] = useState<string[]>([])

  async function handleSubmit(
    values: SignUpFormValues,
    actions: FormikHelpers<SignUpFormValues>
  ) {
    try {
      const userData = { user: values }
      await api.post<ApiResponse>('/users/sign_up', userData)
      actions.setSubmitting(false)
      navigate('/sign_in')
    } catch (error: any) {
      setApiErrors(error.response.data.message)
      actions.setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-flow-col grid-cols-2">
      <img
        alt="Business men writing on a paper with graphs."
        className="h-[80dvh] ml-10 rounded-lg -mt-5"
        src="/assets/sign_up.jpg"
      />
      <Formik
        initialValues={initialValues}
        validate={values => {
          const errors: Partial<SignUpFormValues> = {}
          if (!values.name) {
            errors.name = 'Campo obrigatório'
          }
          if (!values.email) {
            errors.email = 'Campo obrigatório'
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Email inválido'
          }
          if (!values.password) {
            errors.password = 'Campo obrigatório'
          }
          if (!values.password_confirmation) {
            errors.password_confirmation = 'Campo Obrigatório'
          } else if (values.password_confirmation !== values.password) {
            errors.password_confirmation = 'As senhas não coincidem'
          }
          return errors
        }}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions)
        }}
      >
        <FormRoot
          className="flex flex-col items-center justify-center gap-2"
          apiErrors={apiErrors}
        >
          <h1 className="text-xl font-bold">Crie sua conta</h1>
          <FormInput
            className="w-96 mt-1 border rounded py-1 border-neutral-400 px-1"
            name="name"
            inputLabel="Nome"
            type="text"
          />
          <FormInput
            className="w-96 mt-1 border rounded py-1 border-neutral-400 px-1"
            name="email"
            inputLabel="Email"
            type="email"
          />
          <FormInput
            className="w-96 mt-1 border rounded py-1 border-neutral-400 px-1"
            name="password"
            inputLabel="Senha"
            type="password"
          />
          <FormInput
            className="w-96 border rounded mt-1 py-1 border-neutral-400 px-1"
            name="password_confirmation"
            inputLabel="Confirmar Senha"
            type="password"
          />
          <button
            className="border bg-blue-500 text-neutral-100 w-96 rounded-lg py-1 hover:opacity-80 duration-300 mt-2"
            type="submit"
          >
            Cadastrar
          </button>
          <Link
            className="w-96 text-sm text-neutral-600 underline"
            to={'/sign_in'}
          >
            Já possui uma conta? Entre aqui
          </Link>
        </FormRoot>
      </Formik>
    </div>
  )
}
