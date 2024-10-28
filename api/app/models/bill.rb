class Bill < ApplicationRecord
  belongs_to :company

  validates :name, :billing_company, :value, :payment_date, presence: true

  def as_json(options = {})
    super(options).merge({
      'month' => payment_date.month
    })
  end
end
