class Company < ApplicationRecord
  belongs_to :user

  has_many :bills, dependent: :destroy
  has_many :recurring_bills, dependent: :destroy
  has_many :monthly_bills, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id }

  def as_json(options = {})
    super(options).merge({
                           'bills_count' => bills.count,
                           'total_value' => bills.map(&:value).sum
                         })
  end
end
