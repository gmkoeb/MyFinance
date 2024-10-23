require 'rails_helper'

RSpec.describe Bill, type: :model do
  describe '#valid' do
    context 'presence' do
      it 'all attributes must be present' do
        user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
        company = user.companies.create(name: 'Test')
        bill = company.bills.build(name: '', billing_company: '', value: '', payment_date: '')

        expect(bill.valid?).to eq false
        expect(bill.errors.full_messages).to include "Name can't be blank"
        expect(bill.errors.full_messages).to include "Billing company can't be blank"
        expect(bill.errors.full_messages).to include "Value can't be blank"
        expect(bill.errors.full_messages).to include "Payment date can't be blank"
      end
    end
  end
end
