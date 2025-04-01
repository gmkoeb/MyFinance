require 'rails_helper'

RSpec.describe MonthlyLimit, type: :model do
  describe '#presence' do
    it 'all field must be present' do
      user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
      monthly_limit = user.build_monthly_limit(name: '', limit: '')

      expect(monthly_limit.valid?).to eq false
      expect(monthly_limit.errors.full_messages).to include 'Nome do limite não pode ficar em branco'
      expect(monthly_limit.errors.full_messages).to include 'Valor limite não pode ficar em branco'
    end
  end
  describe '#set_original_limit' do
    it 'sets original limit automatically after creation' do
      user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
      monthly_limit = user.create_monthly_limit(name: 'Limite da academia', limit: 450)

      expect(monthly_limit.original_limit).to eq 450
    end
  end
end
