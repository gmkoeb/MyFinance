import { Formik, type FormikHelpers } from 'formik'
import { useState } from 'react'
import { api } from '../../../api/axios'
import type { Bill, Company } from '../../pages/Home'
import { FormInput } from '../Form/form-input'
import { FormRoot } from '../Form/form-root'
import type { MonthlyBillValues } from './MonthlyBillForm'

interface MonthlyBillEditFormProps {
  monthlyBillId: number
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>
  companies: Company[]
  getMonthlyBills: (companies: Company[]) => Promise<void>
  monthlyBill: Partial<Bill>
}

export function MonthlyBillEditForm({
  getMonthlyBills,
  setShowEdit,
  companies,
  monthlyBillId,
  monthlyBill,
}: MonthlyBillEditFormProps) {
  const [apiErrors, setApiErrors] = useState<string[]>([])

  async function handleSubmit(
    monthlyBillId: number,
    values: Partial<MonthlyBillValues>,
    actions: FormikHelpers<MonthlyBillValues>
  ) {
    try {
      const monthlyBillData = {
        monthly_bill: {
          name: values.name,
          billing_company: values.billingCompany,
        },
      }
      await api.patch(`/monthly_bills/${monthlyBillId}`, monthlyBillData)
      actions.setSubmitting(false)
      getMonthlyBills(companies)
      setShowEdit(false)
    } catch (error: any) {
      actions.setSubmitting(false)
      setApiErrors(error.response.data.message)
    }
  }
  return (
    <Formik
      initialValues={{
        name: monthlyBill.name,
        billingCompany: monthlyBill.billing_company,
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
        handleSubmit(monthlyBillId, values, actions)
      }}
    >
      <FormRoot
        apiErrors={apiErrors}
        className="w-40 mx-auto flex flex-col items-center my-4"
      >
        <FormInput
          name="name"
          id="name"
          type="text"
          className="p-1 rounded border text-center"
          placeholder="Nome da mensalidade"
          inputLabel="Nome da mensalidade"
        />
        <FormInput
          inputLabel="Empresa Cobradora"
          className="p-1 rounded border text-center"
          id="billingCompany"
          name="billingCompany"
          placeholder="Nome do cobrador"
        />
        <button
          className="bg-purple-600 h-8 rounded-lg text-neutral-100 mt-4 hover:opacity-80 duration-300 w-full"
          type="submit"
        >
          Editar
        </button>
      </FormRoot>
    </Formik>
  )
}
