require 'rails_helper'

describe 'Monthly Limits API' do
  context 'post /monthly_limits' do
    it 'creates monthly limit' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      token = login_as(user)

      post api_v1_monthly_limits_path, headers: { Authorization: token },
                                       params: { monthly_limit: { name: 'Limite da Academia', limit: 4000 } }

      json_response = JSON.parse(response.body)
      monthly_limit = MonthlyLimit.last

      expect(response.status).to eq 201
      expect(json_response['message']).to eq 'Limite mensal criado com sucesso'
      expect(monthly_limit.user).to eq user
      expect(monthly_limit.name).to eq 'Limite da Academia'
      expect(monthly_limit.user).to eq user
      expect(monthly_limit.limit).to eq 4000
    end

    it 'cant create another monthly limit if already has one' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      user.create_monthly_limit(name: 'Limite da academia', limit: 450)
      token = login_as(user)

      post api_v1_monthly_limits_path, headers: { Authorization: token },
                                       params: { monthly_limit: { name: 'Limite da Academia', limit: 4000 } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 400
      expect(json_response['message']).to include 'Usuário já possui um limite mensal cadastrado'
    end
  end

  context 'get /monthly_limits' do
    it 'returns user monthly limit' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      monthly_limit = user.create_monthly_limit(name: 'Limite da academia', limit: 450)
      token = login_as(user)

      get api_v1_monthly_limits_path, headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['name']).to eq monthly_limit.name
      expect(json_response['limit']).to eq '450.0'
    end

    it 'resets user limit if there are no bills on current month' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      monthly_limit = user.create_monthly_limit(name: 'Limite da academia', limit: 450)
      token = login_as(user)
      
      monthly_limit.update(limit: 450 - 200);

      get api_v1_monthly_limits_path, headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['name']).to eq monthly_limit.name
      expect(json_response['limit']).to eq '450.0'
    end
  end

  context 'delete /monthly_limits/:id' do
    it 'deletes specified monthly limit' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      monthly_limit = user.create_monthly_limit(name: 'Limite da academia', limit: 450)
      token = login_as(user)

      delete api_v1_monthly_limit_path(monthly_limit), headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response['message']).to eq 'Limite mensal excluído com sucesso'
      expect(MonthlyLimit.last).to eq nil
    end
  end

  context 'patch /monthly_limits/:id' do
    it 'updates specified monthly limit' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      monthly_limit = user.create_monthly_limit(name: 'Limite da academia', limit: 450)
      token = login_as(user)

      patch api_v1_monthly_limit_path(monthly_limit), headers: { Authorization: token },
                                                      params: { monthly_limit: { name: 'Limite da Casa', limit: 2000 } }

      json_response = JSON.parse(response.body)
      monthly_limit.reload
      expect(response.status).to eq 200
      expect(json_response['message']).to eq 'Limite mensal atualizado com sucesso'
      expect(monthly_limit.name).to eq 'Limite da Casa'
      expect(monthly_limit.limit).to eq 2000
    end
  end

  context 'get /monthly_limits/bills' do
    it 'gets all bills with monthly limits for the current month' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      other_user = User.create(name: 'Gabriel', email: 'test2@test.com', password: '123456', password_confirmation: '123456')
      user.create_monthly_limit(name: 'Limite da academia', limit: 450)
      company = user.companies.create(name: 'Casa')
      other_user_company = other_user.companies.create(name: 'Casa')
      other_user.create_monthly_limit(name: 'Limite da academia', limit: 450)

      other_user_company.bills.create(name: 'Conta de luz do outro usuário', billing_company: 'Copel', value: 200,
                                      payment_date: Time.zone.now, use_limit: true)

      company.bills.create(name: 'Conta de luz', billing_company: 'Copel', value: 200,
                           payment_date: Time.zone.now - 1.month, use_limit: true)

      company.bills.create(name: 'Conta de agua', billing_company: 'Sanepar', value: 100,
                           payment_date: Time.zone.now, use_limit: true)

      token = login_as(user)

      get '/api/v1/monthly_limit_bills', headers: { Authorization: token }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response[0]["name"]).to eq "Conta de agua"
      expect(json_response.length).to eq 1
    end
  end
end
