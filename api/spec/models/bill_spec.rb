require 'rails_helper'

RSpec.describe Bill, type: :model do
  describe '#valid' do
    context 'presence' do
      it 'all attributes must be present' do
        user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
        company = user.companies.create(name: 'Test')
        bill = company.bills.build(name: '', billing_company: '', value: '', payment_date: '')

        expect(bill.valid?).to eq false
        expect(bill.errors.full_messages).to include 'Nome da conta não pode ficar em branco'
        expect(bill.errors.full_messages).to include 'Empresa cobradora não pode ficar em branco'
        expect(bill.errors.full_messages).to include 'Valor não pode ficar em branco'
        expect(bill.errors.full_messages).to include 'Data de pagamento não pode ficar em branco'
      end
    end
  end

  describe '#deduct_from_monthly_limit' do
    it 'creating a bill with use_limit deducts from user monthly limit' do
      user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
      company = user.companies.create(name: 'Test')
      monthly_limit = user.create_monthly_limit(name: 'Limite da academia', limit: 450)

      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                           payment_date: Time.zone.now, use_limit: true)

      expect(monthly_limit.limit).to eq 250
    end
  end

  it 'cannot be created if user have not set a monthly limit' do
    user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
    company = user.companies.create(name: 'Test')

    bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                                payment_date: Time.zone.now, use_limit: true)

    expect(bill.errors.full_messages).to include 'Você não cadastrou um limite mensal'
  end
end
