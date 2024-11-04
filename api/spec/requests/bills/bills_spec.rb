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
      expect(json_response['message']).to eq 'Conta criada com sucesso'
      expect(bill.company.user).to eq user
      expect(bill.name).to eq 'Conta de luz'
      expect(bill.billing_company).to eq 'Enel'
      expect(bill.value).to eq 200
      expect(bill.paid).to eq true
      expect(bill.payment_date.day).to eq Time.zone.now.day
    end

    it 'creates a recurrent bill with success' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)

      post company_bills_path(company), headers: { Authorization: token },
                                        params: { bill: { name: 'Cartão de crédito', billing_company: 'Nubank', value: 200,
                                                          paid: true, payment_date: Time.zone.now, recurrent: 12 } }

      bill = Bill.first
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 201
      expect(json_response['message']).to eq 'Conta criada com sucesso'
      expect(bill.company.user).to eq user
      expect(bill.name).to eq 'Cartão de crédito'
      expect(bill.billing_company).to eq 'Nubank'
      expect(bill.value).to eq 200
      expect(bill.paid).to eq true
      expect(bill.payment_date.day).to eq Time.zone.now.day
    end

    it 'cant create a bill while not authenticated' do
      post company_bills_path(1), params: { bill: { name: 'Conta de luz', billing_company: 'Enel', value: 200,
                                                    paid: true, payment_date: Time.zone.now } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq 'Não foi possível encontrar uma sessão ativa'
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
      expect(json_response['message']).to include 'Nome da conta não pode ficar em branco'
      expect(json_response['message']).to include 'Empresa cobradora não pode ficar em branco'
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
      expect(json_response['message']).to eq 'Conta atualizada com sucesso'
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
      expect(json_response['message']).to eq 'Permissão negada'
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
      expect(json_response['message']).to include 'Nome da conta não pode ficar em branco'
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
      expect(json_response['message']).to eq 'Permissão negada'
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
      json_response = JSON.parse(response.body)
      expect(response.status).to eq 200
      expect(company.bills.length).to eq 1
      expect(json_response['message']).to eq 'Conta excluída com sucesso'
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
      expect(json_response['message']).to eq 'Permissão negada'
    end
  end

  context 'GET /companies/:company_id/bills_history/:year' do
    it 'returns all company bills for specified year' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      past_bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                                       payment_date: Time.zone.now - 1.month)
      present_bill = company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                                          payment_date: Time.zone.now)

      get company_bills_history_path(company, '2024'), headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['bills']).to include past_bill.as_json
      expect(json_response['bills']).to include present_bill.as_json
      expect(json_response['months']).to include I18n.t('date.month_names')[(Time.zone.now - 1.month).month]
      expect(json_response['months']).to include I18n.t('date.month_names')[Time.zone.now.month]
      expect(json_response['company']).to eq 'Casa'
    end
  end

  context 'GET /companies/:company_id/bills_history/:year?query=paid' do
    it 'returns all paid company bills for specified year' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      past_bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200, 
                                       paid: true, payment_date: Time.zone.now - 1.month)
      present_bill = company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                                          paid: true, payment_date: Time.zone.now)
      unpaid_bill = company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                                         paid: false, payment_date: Time.zone.now)

      get '/companies/1/bills_history/2024?query=paid', headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['bills']).to include past_bill.as_json
      expect(json_response['bills']).to include present_bill.as_json
      expect(json_response['bills']).to_not include unpaid_bill.as_json
      expect(json_response['months']).to include I18n.t('date.month_names')[(Time.zone.now - 1.month).month]
      expect(json_response['months']).to include I18n.t('date.month_names')[Time.zone.now.month]
      expect(json_response['company']).to eq 'Casa'
    end
  end

  context 'GET /companies/:company_id/bills_history/:year?query=unpaid' do
    it 'returns all unpaid company bills for specified year' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      paid_bill = company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200, 
                                       paid: true, payment_date: Time.zone.now - 1.month)
      second_paid_bill = company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                                          paid: true, payment_date: Time.zone.now)
      unpaid_bill = company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                                         paid: false, payment_date: Time.zone.now)

      get '/companies/1/bills_history/2024?query=unpaid', headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['bills']).to_not include paid_bill.as_json
      expect(json_response['bills']).to_not include second_paid_bill.as_json
      expect(json_response['bills']).to include unpaid_bill.as_json
      expect(json_response['months']).to include I18n.t('date.month_names')[Time.zone.now.month]
      expect(json_response['company']).to eq 'Casa'
    end
  end

  context 'GET /companies/:company_id/bills_years' do
    it 'returns all company bills for specified year' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                           payment_date: Time.zone.now - 1.month)
      company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                           payment_date: Time.zone.now)

      get company_bills_years_path(company), headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['years']).to include 2024
    end
  end

  context 'GET /companies/:company_id/bills_statistics/:year' do
    it 'returns all company bills for specified year' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                           payment_date: Time.zone.now - 1.month)
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 300,
                           payment_date: Time.zone.now)
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 3400,
                           payment_date: Time.zone.now - 1.year)
      company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                           payment_date: Time.zone.now)

      get company_bills_statistics_path(company, '2024'), headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['stats']).to include 'Conta de luz'
      expect(json_response['stats']).to include 'Conta de agua'
      expect(json_response['stats']['Conta de agua']).to eq 100
      expect(json_response['stats']['Conta de luz']).to eq 500
    end
  end

  context 'GET /companies/:company_id/bills_statistics/:year?query=paid' do
    it 'returns all company bills for specified year' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                           payment_date: Time.zone.now - 1.month, paid: true)
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 300,
                           payment_date: Time.zone.now, paid: true)
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 3400,
                           payment_date: Time.zone.now, paid: false)
      company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                           payment_date: Time.zone.now, paid: false)

      get '/companies/1/bills_statistics/2024?query=paid', headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['stats']).to include 'Conta de luz'
      expect(json_response['stats']).to_not include 'Conta de agua'
      expect(json_response['stats']['Conta de luz']).to eq 500
    end
  end

  context 'GET /companies/:company_id/bills_statistics/:year?query=unpaid' do
    it 'returns all company bills for specified year' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)
      company = user.companies.create(name: 'Casa')
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                           payment_date: Time.zone.now - 1.month, paid: true)
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 300,
                           payment_date: Time.zone.now, paid: true)
      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 3400,
                           payment_date: Time.zone.now, paid: false)
      company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                           payment_date: Time.zone.now, paid: false)

      get '/companies/1/bills_statistics/2024?query=unpaid', headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['stats']).to include 'Conta de luz'
      expect(json_response['stats']).to include 'Conta de agua'
      expect(json_response['stats']['Conta de luz']).to eq 3400
      expect(json_response['stats']['Conta de agua']).to eq 100
    end
  end
end
