class User < ApplicationRecord
  include ActiveModel::SecurePassword

  has_secure_password
  has_many :companies, dependent: :destroy

  validates :email, uniqueness: true
  validates :name, :email, :password, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { in: 6..20 }
end
