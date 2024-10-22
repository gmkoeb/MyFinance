class User < ApplicationRecord
  validates :email, uniqueness: true
  has_secure_password
  attr_accessor :password_digest
end
