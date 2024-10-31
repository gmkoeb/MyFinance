class Bill < ApplicationRecord
  belongs_to :company

  validates :name, :billing_company, :value, :payment_date, presence: true

  after_create :handle_recurrent

  def as_json(options = {})
    super(options).merge({
                           'month' => I18n.t('date.month_names')[payment_date.month]
                         })
  end

  private

  def handle_recurrent
    if self.recurrent 
      (self.recurrent - 1).times do |counter|
        self.company.bills.create(name: self.name, billing_company: self.billing_company, value: self.value, 
                                  paid: self.paid, payment_date: self.payment_date + (counter + 1).month)
      end
    end
  end
end
