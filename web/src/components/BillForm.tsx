import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik"
import { Bill } from "../pages/Home"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { X } from "lucide-react";

interface BillFormProps{
  company_id: number,
  handleSubmit: (values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>) => void,
  errors: string[],
  isMonthly: boolean,
  setSelectedCompanyId?: React.Dispatch<React.SetStateAction<number>>
}

interface BillFormValues{
  billName?: string,
  billing_company?: string,
  value?: string,
  payment_date?: string,
  paid?: boolean,
  isRecurrentField?: boolean,
  recurrent?: string
}

export default function BillForm({ company_id, handleSubmit, errors, isMonthly, setSelectedCompanyId }: BillFormProps){
  const [isRecurrent, setIsRecurrent] = useState(false)

  return(
    <Formik
      initialValues={{ billName: '', billing_company: '', value: '', paid: true, payment_date: isMonthly ? null : new Date(), isRecurrentField: false, recurrent: '' }}
      validate={(values)=>{
        const errors: Partial<BillFormValues> = {}

        if (!values.billName) {
          errors.billName = "Campo obrigatório";
        }

        if (!values.billing_company){
          errors.billing_company = "Campo obrigatório"
        }

        if (!isMonthly && !values.value){
          errors.value = "Campo obrigatório"
        }

        return errors
      }}
      
      onSubmit={(values, actions: any) => {
        handleSubmit(values, actions)
      }}
    >
    {({ setFieldValue, values }) => (
      <Form className={isMonthly ? "flex flex-col gap-3 items-center border border-black bg-white px-16 pt-5 rounded-lg" : "flex gap-3"}>
        {isMonthly && setSelectedCompanyId && 
          <div className="flex">
            <h1 className="text-center text-lg">Cadastrar Mensalidade</h1>
            <div className="relative">
              <X className="-mt-2 absolute left-8 hover:cursor-pointer hover:opacity-60 duration-300" color="red" onClick={() => setSelectedCompanyId(-1)}></X>
            </div>
          </div>
        }
        <div className="flex flex-col w-fit">
          <label htmlFor={`billName-${company_id}`}>Nome</label>
          <Field className="rounded p-1 border border-black" id={`billName-${company_id}`} name="billName" placeholder="Nome da conta"/>
          <ErrorMessage className="text-red-500" name="billName" component={'div'}></ErrorMessage>
        </div>
        <div className="flex flex-col w-fit">
          <label htmlFor={`billing_company-${company_id}`}>Empresa Cobradora</label>
          <Field className="rounded p-1 border border-black" id={`billing_company-${company_id}`} name="billing_company" placeholder="Nome do cobrador"/>
          <ErrorMessage className="text-red-500" name="billing_company" component={'div'}></ErrorMessage>
        </div>
        {!isMonthly && (
          <div className="flex gap-3">
            <div className="flex flex-col w-fit">
              <label htmlFor={`value-${company_id}`}>Valor da conta</label>
              <Field className="rounded p-1 border border-black" type="number" id={`value-${company_id}`} name="value" placeholder="R$" />
              <ErrorMessage className="text-red-500" name="value" component={'div'}></ErrorMessage>
            </div>
            <div className="flex flex-col w-fit">
              <label htmlFor="date">Data de pagamento</label>
              <DatePicker
                name="date"
                className="rounded p-1 border border-black"
                selected={values.payment_date}
                onChange={(date: Date | null) => setFieldValue("payment_date", date)}
              />
            </div>
            <div className="flex flex-col w-fit">
              <label className="mb-2 checkbox-label" htmlFor={`paid-${company_id}`}>Pago</label>
              <Field 
                className="h-4" id={`paid-${company_id}`} type="checkbox" 
                name="paid" />
            </div>
          </div>
        )}
        {!isMonthly && (
          <div className="flex flex-col align-middle items-center gap-3">
            <div className={isRecurrent ? "flex flex-col -mt-10" : "flex flex-col"}>
              <label className="mb-2" htmlFor={`isRecurrentField-${company_id}`}>Parcelado</label>
              <Field 
                checked={isRecurrent} 
                onChange={() => isRecurrent ? setIsRecurrent(false) : setIsRecurrent(true)}
                className="h-4" id={`isRecurrentField-${company_id}`} type="checkbox" 
                name="isRecurrentField" />
            </div>
              {isRecurrent && 
                <div>
                  <Field className="rounded p-1 border border-black" type="number" id={`recurrent-${company_id}`} name="recurrent" placeholder="Número de parcelas" />
                  <ErrorMessage className="text-red-500" name="recurrent" component={'div'}></ErrorMessage>
                </div>
              }
          </div>
        )}
        <button 
          type="submit" 
          className={isMonthly ? "w-full rounded-xl h-8 text-center bg-blue-500 mt-5 text-white hover:opacity-80 duration-300" : "w-20 rounded-xl h-8 text-center bg-blue-500 mt-5 text-white hover:opacity-80 duration-300"}>
            Criar
        </button>
        {errors &&
          (
            <div>
              {errors.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )
        }
      </Form>
    )}
    </Formik>
  )
}