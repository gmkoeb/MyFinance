class BillCreationJob < ApplicationJob
  retry_on SQLite3::BusyException, wait: 10.seconds, attempts: 5

  def perform(bill, counter)
    bill.company.bills.create!(name: bill.name, billing_company: bill.billing_company, value: bill.value,
                               paid: bill.paid, payment_date: bill.payment_date + counter.month)
  end
end
