class Bill < ApplicationRecord
  belongs_to :company

  validates :name, :billing_company, :value, :payment_date, presence: true

  after_create :handle_recurrent

  after_destroy :handle_recurrent_destroy

  def as_json(options = {})
    super(options).merge({
                           'month' => I18n.t('date.month_names')[payment_date.month]
                         })
  end

  private

  def handle_recurrent_destroy
    return unless recurrent

    company.bills.where(name: name).where(payment_date: payment_date..(payment_date + recurrent.month)).delete_all
  end

  def handle_recurrent
    return unless recurrent

    recurrent.times do |counter|
      BillCreationJob.set(wait: (2 + 2 * counter).seconds).perform_later(self, counter)
    end
  end
end
