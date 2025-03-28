class Bill < ApplicationRecord
  belongs_to :company

  validates :name, :billing_company, :value, :payment_date, presence: true
  validate :monthly_limit_existence
  after_create :handle_recurrent, :deduct_from_monthly_limit
  after_destroy :handle_recurrent_destroy, :handle_monthly_destroy

  def as_json(options = {})
    super(options).merge({
                           'month' => I18n.t('date.month_names')[payment_date.month]
                         })
  end

  private

  def handle_monthly_destroy
    return unless monthly

    monthly_bill = MonthlyBill.find_by(name:)

    return if monthly_bill.nil?

    MonthlyBill.find_by(name:).update(payment_date: nil)
  end

  def handle_recurrent_destroy
    return unless recurrent

    RecurringBill.where(bill_id: id).delete_all
  end

  def handle_recurrent
    return unless recurrent

    recurrent.times do |counter|
      RecurringBill.create!(name:, billing_company:, value:, bill_id: id,
                            company_id:, payment_date: payment_date + (counter + 1).month)
    end
  end

  def deduct_from_monthly_limit
    return unless use_limit

    monthly_limit = company.user.monthly_limit

    monthly_limit.update(limit: monthly_limit.limit - value)
  end

  def monthly_limit_existence
    return unless use_limit

    user = company.user
    errors.add(:base, 'Usuário não cadastrou um limite mensal') if user.monthly_limit.nil?
  end
end
