require 'rails_helper'

describe 'Validate user' do
  context 'get /users/validate_user' do
    it 'with invalid token' do
      get '/users/validate_user', headers: { Authorization: '123456' }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq 'Não foi possível encontrar uma sessão ativa'
    end

    it 'with a valid token' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      token = login_as(user)

      get '/users/validate_user', headers: { Authorization: token }

      expect(response.status).to eq 204
    end
  end
end
