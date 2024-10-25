import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik"
import { Bill } from "../pages/Home"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface BillFormProps{
  company_id: number,
  handleSubmit: (values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>) => void,
  errors: string[]
}

interface BillFormValues{
  billName?: string,
  billing_company?: string,
  value?: string,
  payment_date?: string,
  paid?: boolean
}

export default function BillForm({company_id, handleSubmit, errors}: BillFormProps){
  return(
    <Formik
      initialValues={{ billName: '', billing_company: '', value: '', paid: true, payment_date: new Date() }}
      validate={(values)=>{
        const errors: Partial<BillFormValues> = {}

        if (!values.billName) {
          errors.billName = "Campo obrigatório";
        }

        if (!values.billing_company){
          errors.billing_company = "Campo obrigatório"
        }

        if (!values.value){
          errors.value = "Campo obrigatório"
        }

        return errors
      }}
      
      onSubmit={(values, actions: any) => {
        handleSubmit(values, actions)
      }}
    >
    {({ setFieldValue, values }) => (
      <Form className="flex gap-3">
        <div className="flex flex-col">
          <label htmlFor={`billName-${company_id}`}>Nome</label>
          <Field className="rounded p-1" id={`billName-${company_id}`} name="billName" placeholder="Nome da conta"/>
          <ErrorMessage className="text-red-500" name="billName" component={'div'}></ErrorMessage>
        </div>
        <div className="flex flex-col">
          <label htmlFor={`billing_company-${company_id}`}>Empresa Cobradora</label>
          <Field className="rounded p-1" id={`billing_company-${company_id}`} name="billing_company" placeholder="Nome do cobrador"/>
          <ErrorMessage className="text-red-500" name="billing_company" component={'div'}></ErrorMessage>
        </div>
        <div className="flex flex-col">
          <label htmlFor={`value-${company_id}`}>Valor da conta</label>
          <Field className="rounded p-1" type="number" id={`value-${company_id}`} name="value" placeholder="R$" />
          <ErrorMessage className="text-red-500" name="value" component={'div'}></ErrorMessage>
        </div>
        <div className="flex flex-col">
          <label htmlFor="date">Data de pagamento</label>
          <DatePicker
            name="date"
            className="rounded p-1"
            selected={values.payment_date}
            onChange={(date: Date | null) => setFieldValue("payment_date", date)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2" htmlFor={`paid-${company_id}`}>Pago</label>
          <Field 
            className="h-4" id={`paid-${company_id}`} type="checkbox" 
            name="paid" />
        </div>
        <button type="submit" className="w-20 rounded-lg h-8 text-center bg-blue-500 mt-5 text-white hover:opacity-80 duration-300">Criar</button>
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