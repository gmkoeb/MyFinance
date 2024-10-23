require 'rails_helper'

describe 'Bills API' do
  context 'POST /companies/:company_id/bills' do
    it 'creates a bill with success' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)

      post company_bills_path(company), headers: { Authorization: token },
                                        params: { bill: { name: 'Conta de luz', billing_company: 'Enel', value: 200,
                                                          paid: true, payment_date: Time.zone.now } }

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
      post company_bills_path(1), params: { bill: { name: 'Conta de luz', billing_company: 'Enel', value: 200,
                                         paid: true, payment_date: Time.zone.now } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq "Couldn't find an active session."
    end
  end

  context 'PATCH /bills/:id' do
    it 'updates a specific bill with success' do
      user = User.create(name: 'Gabriel', email: 'gabriel@gabriel.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Academia')
      bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel',
                                  value: 240, payment_date: Time.now)
      
      patch bill_path(bill), headers: { Authorization: token }, params: { bill: { name: 'New Name', paid: 'true' } }

      json_response = JSON.parse(response.body)
      bill.reload

      expect(response.status).to eq 200
      expect(json_response['message']).to eq 'Bill updated with success'
      expect(bill.name).to eq 'New Name'
      expect(bill.paid).to eq true
    end

    it 'cant update another user bill' do
      first_user = User.create(name: 'Gabriel', email: 'gabriel@gabriel.com', password: '123456')
      second_user = User.create(name: 'Test', email: 'test@email.com', password: '123456')

      token = login_as(second_user)
      company = first_user.companies.create(name: 'Academia')
      bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel',
                                  value: 240, payment_date: Time.now)
      
      patch bill_path(bill), headers: { Authorization: token }, params: { bill: { name: 'New Name', paid: 'true' } }
      bill.reload
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq 'Permission denied.'
      expect(bill.name).to_not eq 'New Name'
    end
  end
end
