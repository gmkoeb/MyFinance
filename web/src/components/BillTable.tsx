import { Trash2 } from "lucide-react";
import { Bill } from "../pages/Home";

interface BillTableProps {
  bill: Bill,
  handleDeleteBill?: (billId: number) => void,
  isHome: boolean
}

export default function BillTable( { bill, handleDeleteBill, isHome }: BillTableProps){
  return(
    <tbody>
      <tr key={bill.id} className={bill.paid ? "bg-white" : "bg-neutral-300"}>
        <td>{bill.name}</td>
        <td>{bill.billing_company}</td>
        <td>R$ {bill.value}</td>
        <td>{bill.paid ? "Efetuado" : "Não Efetuado"}</td>
          <td 
            className="flex justify-between">{bill.payment_date ? new Date(bill.payment_date).toLocaleDateString('pt-BR') : 'N/A'} 
            {isHome && handleDeleteBill && (
              <Trash2 className="hover:cursor-pointer" onClick={() => handleDeleteBill(bill.id)} color="#ff1321"/>
            )}
          </td>
      </tr>
    </tbody>
  )
}