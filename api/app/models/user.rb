class User < ApplicationRecord
  include ActiveModel::SecurePassword

  has_secure_password
  has_many :companies, dependent: :destroy
  has_one :monthly_limit, dependent: :destroy
  has_many :bills, through: :companies
  validates :email, uniqueness: true
  validates :name, :email, :password, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { in: 6..20 }

  private

  def bills_using_limit
  end
end
