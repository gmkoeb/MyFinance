class Company < ApplicationRecord
  belongs_to :user
  has_many :bills, dependent: :destroy
  validates :name, presence: true, uniqueness: { scope: :user_id }
end
