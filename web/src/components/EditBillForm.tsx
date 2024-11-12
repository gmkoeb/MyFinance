import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik"
import { Bill } from "../pages/Home"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import React from "react";
import { X } from "lucide-react";

interface BillFormProps{
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>,
  bill_id: number,
  bill: Bill,
  handleSubmit: (billId: number, values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>) => void,
  errors: string[],
  isMonthly: boolean
}

interface BillFormValues{
  billName?: string,
  billing_company?: string,
  value?: string,
  payment_date?: string,
  paid?: boolean
}

export default function EditBillForm({setShowEdit, bill, bill_id, handleSubmit, errors, isMonthly}: BillFormProps){
  return(
    <Formik
      initialValues={{ billName: bill.name, billing_company: bill.billing_company, value: bill.value, paid: bill.paid, payment_date: new Date() }}
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
        handleSubmit(bill_id, values, actions)
      }}
    >
    {({ setFieldValue, values }) => (
      <Form className={isMonthly ? "flex flex-col gap-3 edit-bill-form z-10 border px-4 bg-white rounded-lg py-2 absolute" : "flex gap-3 edit-bill-form"}>
        <div className="flex flex-col">
          <label htmlFor={`billName-${bill_id}`}>Nome</label>
          <Field className="rounded p-1 border border-black" id={`billName-${bill_id}`} name="billName" placeholder="Nome da conta"/>
          <ErrorMessage className="text-red-500" name="billName" component={'div'}></ErrorMessage>
        </div>

        <div className="flex flex-col">
          <label htmlFor={`billing_company-${bill_id}`}>Empresa Cobradora</label>
          <Field className="rounded p-1 border border-black" id={`billing_company-${bill_id}`} name="billing_company" placeholder="Nome do cobrador"/>
          <ErrorMessage className="text-red-500" name="billing_company" component={'div'}></ErrorMessage>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor={`value-${bill_id}`}>Valor da conta</label>
          <Field className="rounded p-1 border border-black" type="number" id={`value-${bill_id}`} name="value" placeholder="R$" />
          <ErrorMessage className="text-red-500" name="value" component={'div'}></ErrorMessage>
        </div>
        {!isMonthly && 
          <>
            <div className="flex flex-col">
              <label htmlFor="date">Data de pagamento</label>
              <DatePicker
                name="date"
                className="rounded p-1 border border-black"
                selected={values.payment_date}
                onChange={(date: Date | null) => setFieldValue("payment_date", date)}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2" htmlFor={`paid-${bill_id}`}>Pago</label>
              <Field 
                className="h-4" id={`paid-${bill_id}`} type="checkbox" 
                name="paid" />
            </div>
          </>
        }
        <div className="flex flex-row justify-center items-center gap-3 ml-10">
          <button type="submit" className="w-20 rounded-xl h-8 text-center bg-violet-600 mt-5 text-white hover:opacity-80 duration-300">Editar</button>
          <X height={28} width={26} color="red" className="hover:cursor-pointer mt-5 hover:opacity-60 duration-300" onClick={() => setShowEdit(false)}/>
        </div>
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