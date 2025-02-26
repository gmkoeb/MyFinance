require 'rails_helper'

describe 'User creates an account' do
  it 'with success' do
    post api_v1_users_sign_up_path, params: { user: { name: 'Gabriel', email: 'test@test.com', password: '123456',
                                                      password_confirmation: '123456' } }

    json_response = JSON.parse(response.body)

    expect(response.status).to eq 201
    expect(json_response['user']['name']).to eq 'Gabriel'
    expect(json_response['user']['email']).to eq 'test@test.com'
  end

  it 'wrong password confirmation' do
    post api_v1_users_sign_up_path, params: { user: { name: 'Gabriel', email: 'test@test.com', password: '1234567',
                                                      password_confirmation: '123456' } }

    json_response = JSON.parse(response.body)

    expect(response.status).to eq 400
    expect(json_response['message']).to include 'Confirmar senha não é igual a Senha'
  end

  it 'with missing parameters' do
    post api_v1_users_sign_up_path, params: { user: { name: '', email: '', password: '',
                                                      password_confirmation: '' } }

    json_response = JSON.parse(response.body)

    expect(response.status).to eq 400
    expect(json_response['message']).to include 'Nome não pode ficar em branco'
  end
end
