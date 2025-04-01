import { SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { BRL } from '../../lib/formatToBRL'
import type { Bill } from '../../pages/Home'
import EditBillForm from './EditBillForm'

interface BillTableProps {
  setChange: React.Dispatch<React.SetStateAction<boolean>>
  bill: Bill
  handleDeleteBill: (billId: number) => void
}

export default function BillTable({
  bill,
  handleDeleteBill,
  setChange,
}: BillTableProps) {
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const numericalValue = Number(bill.value)

  const fixedValue = BRL.format(numericalValue)
  return (
    <tr key={bill.id} className={bill.use_limit ? "bg-yellow-200" : "bg-white"}>
      {!showEdit ? (
        <>
          <td>{bill.name}</td>
          <td>{bill.billing_company}</td>
          <td>{fixedValue}</td>
        </>
      ) : (
        <td colSpan={5}>
          <EditBillForm
            setShowEdit={setShowEdit}
            setChange={setChange}
            bill={bill}
            billId={bill.id}
          />
        </td>
      )}
      {!showEdit && (
        <td className="flex justify-between">
          {bill.payment_date
            ? new Date(bill.payment_date).toLocaleDateString('pt-BR')
            : 'N/A'}
          <div className="flex gap-3">
            <SquarePen
              onClick={() =>
                showEdit ? setShowEdit(false) : setShowEdit(true)
              }
              width={22}
              height={22}
              className="hover:cursor-pointer mt-[2.4px]"
            />
            <Trash2
              className="hover:cursor-pointer"
              onClick={() => handleDeleteBill(bill.id)}
              color="#ff1321"
            />
          </div>
        </td>
      )}
    </tr>
  )
}
