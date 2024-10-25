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

    it 'doesnt create a bill with wrong parameters' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)

      post company_bills_path(company), headers: { Authorization: token },
                                        params: { bill: { name: '', billing_company: '', value: 200, 
                                                          payment_date: Time.zone.now } }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 400
      expect(json_response['message']).to include "Name can't be blank"
      expect(json_response['message']).to include "Billing company can't be blank"
    end
  end

  context 'PATCH /bills/:id' do
    it 'updates a specific bill with success' do
      user = User.create(name: 'Gabriel', email: 'gabriel@gabriel.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Academia')
      bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel',
                                  value: 240, payment_date: Time.zone.now)

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
                                  value: 240, payment_date: Time.zone.now)

      patch bill_path(bill), headers: { Authorization: token }, params: { bill: { name: 'New Name', paid: 'true' } }
      bill.reload
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq 'Permission denied.'
      expect(bill.name).to_not eq 'New Name'
    end

    it 'doesnt update bill with wrong parameters' do
      user = User.create(name: 'Gabriel', email: 'gabriel@gabriel.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Academia')
      bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel',
                                  value: 240, payment_date: Time.zone.now)

      patch bill_path(bill), headers: { Authorization: token }, params: { bill: { name: '', paid: 'true' } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 400
      expect(json_response['message']).to eq "Couldn't update bill. Check the errors [\"Name can't be blank\"]"
    end
  end

  context 'GET /companies/:company_id/bills' do
    it 'returns all bills for specific company for the current month' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      first_company = user.companies.create(name: 'Casa')
      second_company = user.companies.create(name: 'Academia')
      first_company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200, 
                                 payment_date: Time.zone.now - 1.month)
      first_company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100, 
                                 payment_date: Time.zone.now)
      second_company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200, 
                                  payment_date: Time.zone.now)
      second_company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100, 
                                  payment_date: Time.zone.now)
      
      get company_bills_path(first_company), headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response.length).to eq 1
      expect(json_response[0]['name']).to eq 'Conta de agua'
    end

    it 'blocks user from seeing other user bills' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      second_user = User.create(name: 'Gabriel', email: 'test2@test.com', password: '123456')

      token = login_as(second_user)
      company = user.companies.create(name: 'Casa')

      get company_bills_path(company), headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq 'Permission denied.'
    end
  end

  context 'DELETE /bills/:id' do
    it 'user deletes a bill with success' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200, 
                                  payment_date: Time.zone.now - 1.month)
      company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100, 
                                 payment_date: Time.zone.now)
      
      delete bill_path(bill), headers: { Authorization: token }

      expect(response.status).to eq 200
      expect(company.bills.length).to eq 1
    end

    it 'user cant delete another user bill' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      second_user = User.create(name: 'Gabriel', email: 'test2@test.com', password: '123456')

      token = login_as(second_user)
      company = user.companies.create(name: 'Casa')
      bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200, 
                                  payment_date: Time.zone.now - 1.month)

      delete bill_path(bill), headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq 'Permission denied.'
    end
  end
end
