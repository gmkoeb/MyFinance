require 'rails_helper'

describe 'Bills API' do
  context 'POST /bills' do
    it 'creates a bill with success' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)

      post bills_path, headers: { Authorization: token },
                       params: { bill: { name: 'Conta de luz', billing_company: 'Enel', value: 200,
                                         paid: true, payment_date: Time.zone.now,
                                         company_id: company.id } }

      bill = Bill.last
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 201
      expect(json_response['message']).to eq 'Bill created with success'
      expect(bill.company.user).to eq user
      expect(bill.name).to eq 'Conta de luz'
      expect(bill.billing_company).to eq 'Enel'
      expect(bill.value).to eq 200
      expect(bill.paid).to eq true
      expect(bill.payment_date.day).to eq Time.zone.now.day
    end

    it 'cant create a bill while not authenticated' do
      post bills_path, params: { bill: { name: 'Conta de luz', billing_company: 'Enel', value: 200,
                                         paid: true, payment_date: Time.zone.now, company_id: 1 } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq "Couldn't find an active session."
    end
  end
end
