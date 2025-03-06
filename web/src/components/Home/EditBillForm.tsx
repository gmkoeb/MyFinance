import { Formik, type FormikHelpers } from 'formik'
import 'react-datepicker/dist/react-datepicker.css'
import { X } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { api } from '../../../api/axios'
import type { Bill } from '../../pages/Home'
import { FormInput } from '../Form/form-input'
import { FormRoot } from '../Form/form-root'

interface BillUpdateFormProps {
  bill: Bill
  billId: number
  setChange: React.Dispatch<React.SetStateAction<boolean>>
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>
}

interface BillFormValues {
  billName?: string
  billing_company?: string
  value?: string
  payment_date?: string
  paid?: boolean
}

export default function EditBillForm({
  bill,
  billId,
  setChange,
  setShowEdit,
}: BillUpdateFormProps) {
  const [apiErrors, setApiErrors] = useState<string[]>([])
  async function handleBillUpdate(
    billId: number,
    values: Partial<Bill>,
    actions: FormikHelpers<Partial<Bill>>
  ) {
    try {
      const billData = {
        bill: {
          name: values.billName,
          billing_company: values.billing_company,
          value: values.value,
          paid: values.paid,
          payment_date: values.payment_date,
          recurrent: values.recurrent,
        },
      }
      setChange(true)
      setShowEdit(false)
      await api.patch(`/bills/${billId}`, billData)
      actions.setSubmitting(false)
    } catch (error: any) {
      actions.setSubmitting(false)
      setApiErrors(error)
    }
  }
  return (
    <Formik
      initialValues={{
        billName: bill.name,
        billing_company: bill.billing_company,
        value: Number(bill.value).toLocaleString('pt-BR'),
        paid: bill.paid,
        payment_date: new Date(),
      }}
      validate={values => {
        const errors: Partial<BillFormValues> = {}

        if (!values.billName) {
          errors.billName = 'Campo obrigatório'
        }

        if (!values.billing_company) {
          errors.billing_company = 'Campo obrigatório'
        }

        if (!values.value) {
          errors.value = 'Campo obrigatório'
        } else if (!/^\d+(\.\d{2,})?$/.test(values.value)) {
          errors.value = 'Formato inválido.'
        }

        return errors
      }}
      onSubmit={(values, actions: any) => {
        handleBillUpdate(billId, values, actions)
      }}
    >
      {({ setFieldValue, values }) => (
        <FormRoot
          className="flex gap-3 items-center w-full"
          apiErrors={apiErrors}
        >
          <FormInput
            type="text"
            id={`billName-${billId}`}
            placeholder="Nome da conta"
            inputLabel="Nome da conta"
            className="w-full border p-1 border-neutral-600 rounded"
            name="billName"
          />
          <FormInput
            inputLabel="Empresa Cobradora"
            className="w-full border p-1 border-neutral-600 rounded"
            id={`billing_company-${billId}`}
            name="billing_company"
          />
          <FormInput
            inputLabel="Valor"
            className="w-full p-1 border border-neutral-600 rounded"
            name="value"
            id={`value-${billId}`}
          />
          <div className="flex flex-col">
            <label htmlFor="date">Data de pagamento</label>
            <DatePicker
              name="date"
              id="date"
              className="rounded p-1 border border-black w-40"
              selected={values.payment_date}
              onChange={(date: Date | null) =>
                setFieldValue('payment_date', date)
              }
            />
          </div>
          <FormInput
            id={`paid-${billId}`}
            inputLabel="Pago"
            type="checkbox"
            name="paid"
            className="h-4"
          />
          <div className="flex items-center gap-3 mt-4">
            <button
              type="submit"
              className="p-1 w-16 rounded-lg text-sm h-8 text-center bg-violet-600 text-white hover:opacity-80 duration-300"
            >
              Editar
            </button>
            <X
              className="text-red-500 border rounded-full size-6 px-1 hover:bg-red-300 border-neutral-400 cursor-pointer duration-300"
              onClick={() => setShowEdit(false)}
            />
          </div>
        </FormRoot>
      )}
    </Formik>
  )
}
