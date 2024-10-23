require 'rails_helper'

describe 'User creates an account' do
  it 'with success' do
    post users_sign_up_path, params: { user: { name: 'Gabriel', email: 'test@test.com', password: '123456',
                                               password_confirmation: '123456' } }

    json_response = JSON.parse(response.body)

    expect(response.status).to eq 201
    expect(json_response['user']['name']).to eq 'Gabriel'
    expect(json_response['user']['email']).to eq 'test@test.com'
  end

  it 'wrong password confirmation' do
    post users_sign_up_path, params: { user: { name: 'Gabriel', email: 'test@test.com', password: '1234567',
                                               password_confirmation: '123456' } }

    json_response = JSON.parse(response.body)

    expect(response.status).to eq 400
    expect(json_response['user']).to include "Password confirmation doesn't match Password"
  end

  it 'with missing parameters' do
    post users_sign_up_path, params: { user: { name: '', email: '', password: '',
                                               password_confirmation: '' } }

    json_response = JSON.parse(response.body)

    expect(response.status).to eq 400
    expect(json_response['user']).to include "Name can't be blank"
  end
end
