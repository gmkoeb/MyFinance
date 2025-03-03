import { Formik, type FormikHelpers } from 'formik'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { api } from '../../../api/axios'
import { FormInput } from '../Form/form-input'
import { FormRoot } from '../Form/form-root'
import type { MonthlyBillValues } from './MonthlyBillForm'

interface MonthlyBillUpdateFormProps {
  setChange: React.Dispatch<React.SetStateAction<boolean>>
  monthlyBillId: number
}

export function MonthlyBillFormEdit({
  setChange,
  monthlyBillId,
}: MonthlyBillUpdateFormProps) {
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
          payment_date: values.paymentDate,
          value: values.value?.toString().replace(',', '.'),
        },
      }
      api.patch(`/monthly_bills/${monthlyBillId}`, monthlyBillData)
      actions.setSubmitting(false)
      setChange(true)
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

        if (!values.value) {
          errors.value = 'Campo obrigatório'
        }

        if (!values.paymentDate) {
          errors.paymentDate = 'Campo obrigatório'
        }
        return errors
      }}
      onSubmit={(values, actions: any) => {
        handleSubmit(monthlyBillId, values, actions)
      }}
    >
      {({ values, setFieldValue }) => (
        <FormRoot
          apiErrors={apiErrors}
          className="w-40 mx-auto flex flex-col items-center my-4"
        >
          <FormInput
            name="name"
            id="name"
            type="text"
            className="p-1 rounded border"
            placeholder="Nome da mensalidade"
            inputLabel="Nome da mensalidade"
          />
          <FormInput
            inputLabel="Empresa Cobradora"
            className="p-1 rounded border"
            id="billingCompany"
            name="billingCompany"
            placeholder="Nome do cobrador"
          />
          <FormInput
            inputLabel="Valor"
            className="p-1 rounded border"
            id="value"
            name="value"
            placeholder="Nome do cobrador"
          />
          <div className="flex flex-col">
            <label htmlFor="date">Data de pagamento</label>
            <DatePicker
              name="date"
              id="date"
              className="rounded p-1 border border-black"
              selected={values.paymentDate}
              onChange={(date: Date | null) =>
                setFieldValue('payment_date', date)
              }
            />
          </div>
          <button
            className="bg-purple-600 h-8 rounded-lg text-neutral-100 mt-4 hover:opacity-80 duration-300 w-full"
            type="submit"
          >
            Editar
          </button>
        </FormRoot>
      )}
    </Formik>
  )
}
