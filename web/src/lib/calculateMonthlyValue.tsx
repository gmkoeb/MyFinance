import type { Bill } from '../pages/Home'

export default function calculateMonthlyValue(filteredBills: Bill[]) {
  let totalValue = 0

  for (const bill of filteredBills) {
    totalValue += Number(bill.value)
  }
  return Number(totalValue)
}
