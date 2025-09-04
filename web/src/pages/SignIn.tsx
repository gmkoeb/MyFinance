import { Field, Formik, type FormikHelpers } from 'formik'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios'
import { FormInput } from '../components/Form/form-input'
import { FormRoot } from '../components/Form/form-root'

interface SignInFormValues {
  password: string
  email: string
  remember_me: boolean
}

interface ApiResponse {
  token: {
    code: string
  }
  user: {
    name: string
  }
}

interface SignInProps {
  setIsSignedIn: (isSignedIn: boolean) => void
}

export default function SignIn({ setIsSignedIn }: SignInProps) {
  const navigate = useNavigate()
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const initialValues = { email: '', password: '', remember_me: false }

  async function handleSubmit(
    values: SignInFormValues,
    actions: FormikHelpers<SignInFormValues>
  ) {
    try {
      const userData = { user: values }
      const result = await api.post<ApiResponse>('/users/sign_in', userData)
      Cookies.set('token', result.data.token.code)
      Cookies.set('currentUser', result.data.user.name)
      setIsSignedIn(true)
      actions.setSubmitting(false)
      navigate('/')
      window.location.reload()
    } catch (error: any) {
      setApiErrors(error.response.data.message)
      actions.setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-flow-col grid-cols-2">
      <img
        alt="Business man writing data on a paper."
        className="h-[80dvh] ml-10 rounded-lg -mt-5"
        src="/assets/sign_in.jpg"
      />
      <Formik
        initialValues={initialValues}
        validate={values => {
          const errors: Partial<SignInFormValues> = {}
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
          return errors
        }}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions)
        }}
      >
        <FormRoot
          className="flex flex-col justify-center items-center gap-4"
          apiErrors={apiErrors}
        >
          <h2 className="text-xl font-bold">Entrar</h2>
          <FormInput
            id="email"
            className="w-96 rounded p-1 mt-2 border-neutral-400 border"
            placeholder="Digite seu email"
            name="email"
            inputLabel="Email"
            type="email"
          />
          <FormInput
            id="password"
            className="w-96 rounded p-1 mt-2 border-neutral-400 border"
            placeholder="Digite sua senha"
            name="password"
            inputLabel="Senha"
            type="password"
          />
          <div className='flex items-center w-96'>
            <Field className='mr-3' name='remember_me' id='remember_me' type="checkbox" />
            <label htmlFor="remember_me">Lembrar-me</label>
          </div>
          <button
            className="border bg-blue-500 text-neutral-100 w-96 rounded-lg py-1 hover:opacity-80 duration-300"
            type="submit"
          >
            Entrar
          </button>
          <Link
            className="w-96 text-sm text-neutral-600 underline"
            to={'/sign_up'}
          >
            Não possui conta? Crie uma aqui
          </Link>
        </FormRoot>
      </Formik>
    </div>
  )
}
