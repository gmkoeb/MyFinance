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
end
