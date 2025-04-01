import { Formik, type FormikHelpers } from 'formik'
import type { Bill } from '../../pages/Home'
import 'react-datepicker/dist/react-datepicker.css'
import { type ComponentProps, useState } from 'react'
import DatePicker from 'react-datepicker'
import { api } from '../../../api/axios'
import { FormInput } from '../Form/form-input'
import { FormRoot } from '../Form/form-root'

interface BillFormProps extends ComponentProps<'form'> {
  companyId: number
  companyName?: string
  isLimitPage?: boolean
  setChange: React.Dispatch<React.SetStateAction<boolean>>
}

interface BillFormValues {
  billName?: string
  billing_company?: string
  value?: string
  payment_date?: string
  isRecurrentField?: boolean
  useLimit?: boolean
  recurrent?: string
}

export default function BillForm({
  companyId,
  setChange,
  companyName,
  isLimitPage,
}: BillFormProps) {
  const [apiErrors, setApiErrors] = useState<string[]>([])
  async function handleBillCreation(
    values: Partial<Bill>,
    actions: FormikHelpers<Partial<Bill>>
  ) {
    try {
      const billData = {
        bill: {
          name: values.billName,
          billing_company: values.billing_company,
          value: values.value,
          payment_date: values.payment_date,
          recurrent: values.recurrent,
          use_limit: values.useLimit,
        },
      }
      await api.post(`/companies/${companyId}/bills`, billData)
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
      initialValues={{
        billName: '',
        billing_company: '',
        value: '',
        payment_date: new Date(),
        isRecurrentField: false,
        recurrent: '',
        useLimit: false,
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
          errors.value = 'Formato inválido. Exemplo de formato válido: 133.20'
        }

        return errors
      }}
      onSubmit={(values, actions: any) => {
        handleBillCreation(values, actions)
      }}
    >
      {({ values, setFieldValue }) => (
        <div className="mt-2 text-neutral-600">
          <FormRoot
            apiErrors={apiErrors}
            className="flex flex-col justify-center gap-4 items-center w-full text-center"
          >
            {companyName && 
              <h2 className="text-center text-lg">
                Adicionar despesa em <br />
                <span className="font-semibold">{companyName}</span>
              </h2>
            }
            <FormInput
              name="billName"
              id={`billName-${companyId}`}
              type="text"
              className="p-1 rounded border"
              placeholder="Nome da despesa"
              inputLabel="Nome da despesa"
            />
            <FormInput
              inputLabel="Empresa Cobradora"
              className="p-1 rounded border"
              id={`billing_company-${companyId}`}
              name="billing_company"
              placeholder="Nome do cobrador"
            />
            <FormInput
              type="text"
              className="p-1 rounded border"
              inputLabel="Valor da conta"
              id={`value-${companyId}`}
              name="value"
              placeholder="R$ 0.00"
            />
            <div className="flex flex-col">
              <label htmlFor="date">Data de pagamento</label>
              <DatePicker
                name="date"
                className="rounded p-1 border text-center"
                selected={values.payment_date}
                onChange={(date: Date | null) =>
                  setFieldValue('payment_date', date)
                }
              />
            </div>
            {!isLimitPage && 
              <div className="flex gap-4 items-center">
                <FormInput
                  checked={values.useLimit}
                  onChange={(e) => setFieldValue('useLimit', e.target.checked)}
                  inputLabel="Utilizar Limite Mensal"
                  className="h-4"
                  id={`useLimit-${companyId}`}
                  type="checkbox"
                  name="useLimit"
                />
                <FormInput
                  checked={values.isRecurrentField}
                  onChange={() =>
                    setFieldValue('isRecurrentField', !values.isRecurrentField)
                  }
                  inputLabel="Parcelado"
                  className="h-4"
                  id={`isRecurrentField-${companyId}`}
                  type="checkbox"
                  name="isRecurrentField"
                />
                {values.isRecurrentField && (
                  <div className="relative">
                    <FormInput
                      inputLabel=""
                      className="rounded p-1 border border-black absolute z-10 mt-6 -right-16"
                      type="number"
                      id={`recurrent-${companyId}`}
                      name="recurrent"
                      placeholder="Número de parcelas"
                    />
                  </div>
                )}
              </div>
            }
            <button
              className="bg-blue-500 h-8 rounded-lg text-neutral-100 mt-4 hover:opacity-80 duration-300 w-44"
              type="submit"
            >
              Criar
            </button>
          </FormRoot>
        </div>
      )}
    </Formik>
  )
}
