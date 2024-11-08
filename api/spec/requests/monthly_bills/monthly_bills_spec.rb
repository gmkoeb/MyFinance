require 'rails_helper'

describe 'Monthly Bills API' do
  context 'post /companies/:company_id/monthly_bills' do
    it 'creates monthly bill' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)

      post company_monthly_bills_path(company), headers: { Authorization: token },
                                                params: { monthly_bill: { name: 'Conta de luz', billing_company: 'Enel', value: 200,
                                                                          paid: true, payment_date: Time.zone.now } }

      bill = MonthlyBill.last
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 201
      expect(json_response['message']).to eq 'Mensalidade criada com sucesso'
      expect(bill.company.user).to eq user
      expect(bill.name).to eq 'Conta de luz'
      expect(bill.billing_company).to eq 'Enel'
      expect(bill.value).to eq 200
      expect(bill.payment_date.day).to eq Time.zone.now.day
    end
  end

  context 'get /companies/:company_id/monthly_bills' do
    it 'returns list of all company monthly bills' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      company.monthly_bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                                   payment_date: Time.zone.now - 1.month)
      company.monthly_bills.create(name: 'Conta de água 2', billing_company: 'Copel', value: 300,
                                   payment_date: Time.zone.now)

      company.bills.create(name: 'Conta de água 2', billing_company: 'Copel', value: 300,
                           payment_date: Time.zone.now)

      get company_monthly_bills_path(company), headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response.length).to eq 2
      expect(json_response).to eq company.monthly_bills.as_json
      expect(json_response[0]['paid']).to eq false
      expect(json_response[1]['paid']).to eq true
    end
  end

  context 'post /companies/:company_id/create_bill' do
    it 'creates a paid bill for current month' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      monthly_bill = company.monthly_bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 300,
                                                  payment_date: Time.zone.now - 1.month)

      post company_create_bill_path(company), headers: { Authorization: token },
                                              params: { bill: { name: 'Conta de luz', billing_company: 'Copel',
                                                                value: 233 } }

      bill = Bill.last
      monthly_bill.reload

      expect(monthly_bill.payment_date.month).to eq Time.zone.now.month
      expect(response.status).to eq 201
      expect(bill.name).to eq 'Conta de luz'
      expect(bill.billing_company).to eq 'Copel'
      expect(bill.value).to eq 233
    end
  end
end
