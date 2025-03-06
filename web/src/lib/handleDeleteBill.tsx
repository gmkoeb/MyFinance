import { api } from '../../api/axios'

export async function handleDeleteBill(
  billId: number,
  setChange: React.Dispatch<React.SetStateAction<boolean>>
) {
  await api.delete(`/bills/${billId}`)
  setChange(true)
}
