import { Formik, type FormikHelpers } from 'formik'
import { useState } from 'react'
import { api } from '../../../api/axios'
import { FormInput } from '../Form/form-input'
import { FormRoot } from '../Form/form-root'

interface MonthlyLimitFormProps{
  setChange: React.Dispatch<React.SetStateAction<boolean>>
}

interface MonthlyLimitFormValues {
  name: string
  limit: string
}

export default function MonthlyLimitForm({setChange}:MonthlyLimitFormProps) {
  const [apiErrors, setApiErrors] = useState<string[]>([])

  async function handleSubmit(
    values: MonthlyLimitFormValues,
    actions: FormikHelpers<MonthlyLimitFormValues>
  ) {
    try {
      const monthlyLimitData = {
        monthly_limit: {
          name: values.name,
          limit: values.limit,
        },
      }
      await api.post('/monthly_limits', monthlyLimitData)
      actions.setSubmitting(false)
      actions.resetForm()
      setChange(true)
    } catch (error: any) {
      actions.setSubmitting(false)
      setApiErrors(error.response.data.message)
    }
  }
  return (
    <Formik
      initialValues={{ name: '', limit: '' }}
      validate={values => {
        const errors: Partial<MonthlyLimitFormValues> = {}
        if (!values.name) {
          errors.name = 'Campo obrigatório'
        }
        if (!values.limit) {
          errors.limit = 'Campo obrigatório'
        }
        return errors
      }}
      onSubmit={(values, actions) => {
        handleSubmit(values, actions)
      }}
    >
      <FormRoot
        className="flex flex-col gap-4 w-1/4 mx-auto px-4 py-2 text-center border bg-white border-neutral-300 rounded-lg mt-2"
        apiErrors={apiErrors}
      >
        <h2 className="text-lg font-semibold">Criar Limite Mensal</h2>
        <FormInput
          className="px-1 placeholder:text-center border rounded"
          inputLabel="Nome do limite"
          placeholder="Nome do limite"
          name="name"
        />
        <FormInput
          className="px-1 placeholder:text-center border rounded"
          inputLabel="Valor do limite"
          placeholder="Valor do limite"
          name="limit"
        />
        <button
          className="w-32 bg-green-500 rounded-md text-white mt-2 mx-auto"
          type="submit"
        >
          Criar
        </button>
      </FormRoot>
    </Formik>
  )
}
