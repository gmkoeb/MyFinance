class MonthlyBill < ApplicationRecord
  belongs_to :company
  validates :name, :billing_company, :value, presence: true
  validates :name, uniqueness: { scope: :company_id }

  def as_json(options = {})
    super(options).merge({
                           'paid' => already_paid?
                         })
  end

  def already_paid?
    return true if paid_this_month(self)

    false
  end

  private

  def paid_this_month(bill)
    return false if bill.payment_date.nil?
    
    return true if bill.payment_date.year == Time.zone.now.year && bill.payment_date.month == Time.zone.now.month

    false
  end
end
