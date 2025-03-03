import { Formik, type FormikHelpers } from 'formik'
import { useState } from 'react'
import { api } from '../../../api/axios'
import { FormInput } from '../Form/form-input'
import { FormRoot } from '../Form/form-root'

interface CompanyFormProps {
  setChange: React.Dispatch<React.SetStateAction<boolean>>
}

interface CompanyFormValues {
  name: string
}

export default function CompanyForm({ setChange }: CompanyFormProps) {
  const [apiErrors, setApiErrors] = useState<string[]>([])

  async function handleSubmit(
    values: CompanyFormValues,
    actions: FormikHelpers<CompanyFormValues>
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
      setApiErrors(error.response.data.message)
    }
  }
  return (
    <Formik
      initialValues={{ name: '' }}
      validate={values => {
        const errors: Partial<CompanyFormValues> = {}
        if (!values.name) {
          errors.name = 'Campo obrigatório'
        }
        return errors
      }}
      onSubmit={(values, actions) => {
        handleSubmit(values, actions)
      }}
    >
      <FormRoot
        className="flex flex-col gap-4 text-center px-4 py-2"
        apiErrors={apiErrors}
      >
        <h2 className="text-lg font-semibold">Criar empresa</h2>
        <FormInput
          className="px-1 placeholder:text-center border rounded"
          inputLabel="Nome da empresa"
          placeholder="Nome da empresa"
          name="name"
        />
        <button
          className="w-32 bg-green-500 rounded-md text-white mt-2 mx-auto"
          type="submit"
        >
          Cadastrar
        </button>
      </FormRoot>
    </Formik>
  )
}
