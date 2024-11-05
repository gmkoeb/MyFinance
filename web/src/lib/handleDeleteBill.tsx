import { api } from "../../api/axios"

export async function handleDeleteBill(billId: number, setChange: React.Dispatch<React.SetStateAction<boolean>>){
  try {
    await api.delete(`/bills/${billId}`)
    setChange(true)
  } catch (error) {
    console.log(error)
  }
}