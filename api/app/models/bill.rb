class Bill < ApplicationRecord
  belongs_to :company

  validates :name, :billing_company, :value, :payment_date, presence: true

  def as_json(options = {})
    super(options).merge({
      'month' => I18n.t("date.month_names")[payment_date.month]
    })
  end
end
