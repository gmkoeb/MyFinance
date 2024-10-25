import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik"
import { Bill } from "../pages/Home"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface BillFormProps{
  handleSubmit: (values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>) => void,
  errors: string[]
}

interface BillFormValues{
  name?: string,
  billing_company?: string,
  value?: string,
  payment_date?: string
}

export default function BillForm({ handleSubmit, errors}: BillFormProps){
  return(
    <Formik
      initialValues={{ name: '', billing_company: '', value: 0, paid: false, payment_date: new Date() }}
      validate={(values)=>{
        const errors: Partial<BillFormValues> = {}

        if (!values.name) {
          errors.name = "Campo obrigatório";
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
      <Form>
        <div>
          <label htmlFor="name">Nome</label>
          <Field id="name" name="name" placeholder="Nome da conta"/>
          <ErrorMessage name="name" component={'div'}></ErrorMessage>
        </div>
        <div>
          <label htmlFor="billing_company">Empresa Cobradora</label>
          <Field id="billing_company" name="billing_company" placeholder="Nome da empresa cobradora"/>
          <ErrorMessage name="billing_company" component={'div'}></ErrorMessage>
        </div>
        <div>
          <label htmlFor="value">Valor da conta</label>
          <Field id="value" name="value" placeholder="R$"/>
          <ErrorMessage name="value" component={'div'}></ErrorMessage>
        </div>
        <div>
          <label htmlFor="paid">Pago</label>
          <Field type="checkbox" name="paid" />
        </div>
        <div>
        <DatePicker
          selected={values.payment_date}
          onChange={(date: Date | null) => setFieldValue("payment_date", date)}
        />
        </div>
        <button type="submit">Enviar</button>
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