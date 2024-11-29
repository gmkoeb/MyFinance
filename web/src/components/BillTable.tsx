import { SquarePen, Trash2 } from "lucide-react";
import { Bill } from "../pages/Home";
import { useState } from "react";
import EditBillForm from "./EditBillForm";
import { FormikHelpers } from "formik";
import { api } from "../../api/axios";

interface BillTableProps {
  setChange: React.Dispatch<React.SetStateAction<boolean>>,
  bill: Bill,
  handleDeleteBill: (billId: number) => void
}

export default function BillTable( { setChange, bill, handleDeleteBill }: BillTableProps){
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  async function handleBillUpdate(billId: number, values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>){
    try{
      const billData = { bill: {
        name: values.billName,
        billing_company: values.billing_company,
        value: values.value,
        paid: values.paid,
        payment_date: values.payment_date,
        recurrent: values.recurrent
      }}
      setChange(true)
      setShowEdit(false)
      await api.patch(`/bills/${billId}`, billData)
      actions.setSubmitting(false)
    } catch(error: any){
      actions.setSubmitting(false)
      setErrors(error)
    } 
  }

  return(
    <tr key={bill.id} className={bill.paid ? "bg-white" : "bg-neutral-300"}>
      {!showEdit ? (
        <>
          <td>{bill.name}</td>
          <td>{bill.billing_company}</td>
          <td>{Number(bill.value).toFixed(2)?.toLocaleString()?.replace(".", ",")}</td>
          <td>{bill.paid ? "Efetuado" : "Não Efetuado"}</td>
        </>
      ): (
        <td colSpan={5}>
          <EditBillForm isMonthly={false} setShowEdit={setShowEdit} bill={bill} errors={errors} handleSubmit={handleBillUpdate} bill_id={bill.id} />
        </td>
      )}
      {!showEdit &&
        <td 
          className="flex justify-between">{bill.payment_date ? new Date(bill.payment_date).toLocaleDateString('pt-BR') : 'N/A'} 
          <div className="flex gap-3">
            <SquarePen onClick={() => showEdit ? setShowEdit(false) : setShowEdit(true)} width={22} height={22} className="hover:cursor-pointer mt-[2.4px]" />
            <Trash2 className="hover:cursor-pointer" onClick={() => handleDeleteBill(bill.id)} color="#ff1321"/>
          </div>
        </td>
      }
    </tr>
  )
}