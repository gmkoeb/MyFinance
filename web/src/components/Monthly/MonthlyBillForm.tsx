import { Formik, type FormikHelpers } from 'formik'
import { useState } from 'react'
import { api } from '../../../api/axios'
import type { Company } from '../../pages/Home'
import { FormInput } from '../Form/form-input'
import { FormRoot } from '../Form/form-root'

interface MonthlyBillFormProps {
  getMonthlyBills: (companies: Company[]) => Promise<void>
  companies: Company[]
  companyId: number
}

export interface MonthlyBillValues {
  name: string
  billingCompany: string
  paymentDate?: string | Date
  value: number | string
}

export function MonthlyBillForm({
  companyId,
  getMonthlyBills,
  companies,
}: MonthlyBillFormProps) {
  const [apiErrors, setApiErrors] = useState<string[]>([])
  async function handleSubmit(
    companyId: number,
    values: MonthlyBillValues,
    actions: FormikHelpers<MonthlyBillValues>
  ) {
    try {
      const monthlyBillData = {
        monthly_bill: {
          name: values.name,
          billing_company: values.billingCompany,
          payment_date: '',
          value: 0,
        },
      }

      await api.post(`/companies/${companyId}/monthly_bills`, monthlyBillData)
      actions.setSubmitting(false)
      actions.resetForm()
      getMonthlyBills(companies)
    } catch (error: any) {
      actions.setSubmitting(false)
      setApiErrors(error.response.data.message)
    }
  }
  return (
    <Formik
      initialValues={{
        name: '',
        billingCompany: '',
        paymentDate: new Date(),
        value: 0,
      }}
      validate={values => {
        const errors: Partial<MonthlyBillValues> = {}

        if (!values.name) {
          errors.name = 'Campo obrigatório'
        }

        if (!values.billingCompany) {
          errors.billingCompany = 'Campo obrigatório'
        }

        return errors
      }}
      onSubmit={(values, actions: any) => {
        handleSubmit(companyId, values, actions)
      }}
    >
      <div className="text-neutral-600 bg-neutral-100 rounded-b-lg w-1/2 mx-auto border-x border-b -mt-10 border-neutral-600">
        <FormRoot
          apiErrors={apiErrors}
          className="flex flex-col justify-center gap-4 items-center w-full text-center"
        >
          <FormInput
            name="name"
            id={`billName-${companyId}`}
            type="text"
            className="p-1 rounded border"
            placeholder="Nome da mensalidade"
            inputLabel="Nome da mensalidade"
          />
          <FormInput
            inputLabel="Empresa Cobradora"
            className="p-1 rounded border"
            id={`billing_company-${companyId}`}
            name="billingCompany"
            placeholder="Nome do cobrador"
          />

          <button
            className="bg-blue-500 h-8 rounded-lg text-neutral-100 mt-4 hover:opacity-80 duration-300 w-44"
            type="submit"
          >
            Criar
          </button>
        </FormRoot>
      </div>
    </Formik>
  )
}
