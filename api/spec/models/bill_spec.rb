require 'rails_helper'

RSpec.describe Bill, type: :model do
  describe '#valid' do
    context 'presence' do
      it 'all attributes must be present' do
        user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
        company = user.companies.create(name: 'Test')
        bill = company.bills.build(name: '', billing_company: '', value: '', payment_date: '')

        expect(bill.valid?).to eq false
        expect(bill.errors.full_messages).to include "Nome da conta não pode ficar em branco"
        expect(bill.errors.full_messages).to include "Empresa cobradora não pode ficar em branco"
        expect(bill.errors.full_messages).to include "Valor não pode ficar em branco"
        expect(bill.errors.full_messages).to include "Data de pagamento não pode ficar em branco"
      end
    end
  end
end
