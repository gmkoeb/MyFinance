import { Bill } from "../pages/Home";

export default function calculateMonthlyValue(filteredBills: Bill[]){
  let totalValue: number = 0

  filteredBills.forEach(bill => {
    totalValue += Number(bill.value)
  })
  return totalValue
}