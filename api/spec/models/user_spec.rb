require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#uniqueness' do
    it 'email must be unique' do
      User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      second_user = User.new(name: 'Gabriel', email: 'test@test.com', password: '123456')

      expect(second_user.valid?).to eq false
      expect(second_user.errors.full_messages[0]).to eq 'Email has already been taken'
    end
  end
end
