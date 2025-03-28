class MonthlyLimit < ApplicationRecord
  belongs_to :user

  after_validation :set_original_limit, on: [:create, :update]
  validates :name, :limit, presence: true
  private

  def set_original_limit
    self.original_limit = limit
  end
end
