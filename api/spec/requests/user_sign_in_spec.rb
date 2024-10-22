require 'rails_helper'

describe 'User logs in' do
  it 'with success' do
    User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
    allow(JsonWebToken).to receive(:encode).with(user_id: 1).and_return('123456')
    post users_sign_in_path, params: { user: { email: 'test@test.com', password: '123456'} } 

    json_response = JSON.parse(response.body)
    expect(response.status).to eq 200
    expect(json_response['token']['code']).to eq '123456'
    expect(json_response['token']['exp']).to eq 24.hours.to_i
    expect(json_response['user']['name']).to eq 'Gabriel'
  end
end