import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import type { Bill } from '../pages/Home'
import 'react-datepicker/dist/react-datepicker.css'
import { X } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-datepicker'

interface BillFormProps {
  company_id: number
  handleSubmit: (
    values: Partial<Bill>,
    actions: FormikHelpers<Partial<Bill>>
  ) => void
  errors: string[]
  isMonthly: boolean
  setSelectedCompanyId?: React.Dispatch<React.SetStateAction<number>>
}

interface BillFormValues {
  billName?: string
  billing_company?: string
  value?: string
  payment_date?: string
  paid?: boolean
  isRecurrentField?: boolean
  recurrent?: string
}

export default function BillForm({
  company_id,
  handleSubmit,
  errors,
  isMonthly,
  setSelectedCompanyId,
}: BillFormProps) {
  const [isRecurrent, setIsRecurrent] = useState(false)

  return (
    <Formik
      initialValues={{
        billName: '',
        billing_company: '',
        value: '',
        paid: true,
        payment_date: isMonthly ? null : new Date(),
        isRecurrentField: false,
        recurrent: '',
      }}
      validate={values => {
        const errors: Partial<BillFormValues> = {}

        if (!values.billName) {
          errors.billName = 'Campo obrigatório'
        }

        if (!values.billing_company) {
          errors.billing_company = 'Campo obrigatório'
        }

        if (!isMonthly && !values.value) {
          errors.value = 'Campo obrigatório'
        }

        return errors
      }}
      onSubmit={(values, actions: any) => {
        handleSubmit(values, actions)
      }}
    >
      {({ setFieldValue, values }) => (
        <Form
          className={
            isMonthly
              ? 'flex flex-col gap-3 items-center border border-black bg-white px-16 pt-5 rounded-lg mt-2'
              : 'flex flex-col'
          }
        >
          {isMonthly && setSelectedCompanyId && (
            <div className="flex">
              <h5 className="text-lg">Cadastrar Mensalidade</h5>
              <div className="relative">
                <X
                  className="-mt-2 absolute left-8 hover:cursor-pointer hover:opacity-60 duration-300"
                  color="red"
                  onClick={() => setSelectedCompanyId(-1)}
                />
              </div>
            </div>
          )}
          <div className="grid grid-flow-col w-fit mx-auto">
            <div>
              <div className="flex flex-col">
                <label htmlFor={`billName-${company_id}`}>Nome</label>
                <Field
                  className="rounded p-1 border border-black w-40"
                  id={`billName-${company_id}`}
                  name="billName"
                  placeholder="Nome da conta"
                />
                <ErrorMessage
                  className="text-red-500 text-center"
                  name="billName"
                  component={'div'}
                />
              </div>
            </div>
            {!isMonthly && (
              <div className="grid grid-flow-col w-fit">
                <div className="flex">
                  <div className="flex flex-col w-fit ml-4">
                    <label htmlFor={`value-${company_id}`}>
                      Valor da conta
                    </label>
                    <Field
                      className="rounded p-1 border border-black w-40"
                      type="text"
                      id={`value-${company_id}`}
                      name="value"
                      placeholder="R$"
                    />
                    <ErrorMessage
                      className="text-red-500 text-center"
                      name="value"
                      component={'div'}
                    />
                  </div>
                  <div className="flex flex-col ml-4">
                    <label htmlFor="date">Data de pagamento</label>
                    <DatePicker
                      name="date"
                      className="rounded p-1 border border-black w-40"
                      selected={values.payment_date}
                      onChange={(date: Date | null) =>
                        setFieldValue('payment_date', date)
                      }
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col ml-4 mb-4">
                    <label
                      className="mb-2 checkbox-label"
                      htmlFor={`paid-${company_id}`}
                    >
                      Pago
                    </label>
                    <Field
                      className="h-4"
                      id={`paid-${company_id}`}
                      type="checkbox"
                      name="paid"
                    />
                  </div>
                  <div className="flex flex-col ml-4">
                    <label
                      className="mb-2"
                      htmlFor={`isRecurrentField-${company_id}`}
                    >
                      Parcelado
                    </label>
                    <Field
                      checked={isRecurrent}
                      onChange={() =>
                        isRecurrent
                          ? setIsRecurrent(false)
                          : setIsRecurrent(true)
                      }
                      className="h-4"
                      id={`isRecurrentField-${company_id}`}
                      type="checkbox"
                      name="isRecurrentField"
                    />
                    <div>
                      {isRecurrent && (
                        <div className="relative">
                          <div className="absolute -left-12">
                            <Field
                              className="rounded p-1 border border-black mt-3"
                              type="number"
                              id={`recurrent-${company_id}`}
                              name="recurrent"
                              placeholder="Número de parcelas"
                            />
                            <ErrorMessage
                              className="text-red-500 text-center"
                              name="recurrent"
                              component={'div'}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {errors && (
            <div>
              {errors.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
          <div className="flex flex-col w-fit mx-auto">
            <label htmlFor={`billing_company-${company_id}`}>
              Empresa Cobradora
            </label>
            <Field
              className="rounded p-1 border border-black w-40"
              id={`billing_company-${company_id}`}
              name="billing_company"
              placeholder="Nome do cobrador"
            />
            <ErrorMessage
              className="text-red-500 text-center"
              name="billing_company"
              component={'div'}
            />
          </div>
          <button
            type="submit"
            className="border bg-blue-500 rounded-lg w-40 mx-auto py-1 my-2 text-white hover:opacity-80 duration-300"
          >
            Criar
          </button>
        </Form>
      )}
    </Formik>
  )
}
