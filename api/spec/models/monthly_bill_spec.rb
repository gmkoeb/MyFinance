require 'rails_helper'

RSpec.describe MonthlyBill, type: :model do
  describe '#valid' do
    context 'presence' do
      it 'all attributes must be present' do
        user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
        company = user.companies.create(name: 'Test')
        monthly_bill = company.monthly_bills.build(name: '', billing_company: '', value: '', payment_date: '')

        expect(monthly_bill.valid?).to eq false
        expect(monthly_bill.errors.full_messages).to include 'Nome da conta não pode ficar em branco'
        expect(monthly_bill.errors.full_messages).to include 'Empresa cobradora não pode ficar em branco'
        expect(monthly_bill.errors.full_messages).to include 'Valor não pode ficar em branco'
      end
    end
  end
end
