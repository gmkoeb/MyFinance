require 'rails_helper'

describe 'Monthly Bills API' do
  context 'post /companies/:company_id/monthly_bills' do
    it 'creates monthly bill' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)

      post api_v1_company_monthly_bills_path(company), headers: { Authorization: token },
                                                       params: { monthly_bill: { name: 'Conta de luz', billing_company: 'Enel', value: 200,
                                                                                 payment_date: Time.zone.now } }

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

      get api_v1_company_monthly_bills_path(company), headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response.length).to eq 2
      expect(json_response).to eq company.monthly_bills.as_json
    end
  end

  context 'post /companies/:company_id/create_bill' do
    it 'creates a paid bill for current month' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      monthly_bill = company.monthly_bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 300,
                                                  payment_date: Time.zone.now - 1.month)

      post api_v1_company_create_bill_path(company), headers: { Authorization: token },
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

  context 'patch /monthly_bills/:monthly_bill_id' do
    it 'updates monthly bill' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      monthly_bill = company.monthly_bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 300,
                                                  payment_date: Time.zone.now - 1.month)

      patch api_v1_monthly_bill_path(monthly_bill), headers: { Authorization: token },
                                                    params: { monthly_bill: { name: 'Conta de água', billing_company: 'Sanepar',
                                                                              value: 133 } }

      monthly_bill.reload

      expect(response.status).to eq 200
      expect(monthly_bill.name).to eq 'Conta de água'
      expect(monthly_bill.billing_company).to eq 'Sanepar'
      expect(monthly_bill.value).to eq 133
    end

    context 'delete /monthly_bills/:monthly_bill_id' do
      it 'removes monthly bill' do
        user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
        token = login_as(user)
        company = user.companies.create(name: 'Casa')
        monthly_bill = company.monthly_bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 300,
                                                    payment_date: Time.zone.now - 1.month)

        delete api_v1_monthly_bill_path(monthly_bill), headers: { Authorization: token }

        expect(response.status).to eq 200
        expect(MonthlyBill.all.count).to eq 0
        expect(MonthlyBill.last).to be nil
      end
    end
  end
end
