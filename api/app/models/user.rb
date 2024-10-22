class User < ApplicationRecord
  validates :email, uniqueness: true
  validates :name, :email, :password, :password_confirmation, presence: true
  validates :email, format: {with: URI::MailTo::EMAIL_REGEXP}
  validates :password, length: { in: 6..20 }
  has_secure_password
  attr_accessor :password_digest
end
