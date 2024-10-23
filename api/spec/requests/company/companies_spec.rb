require 'rails_helper'

describe 'Companies API' do
  context 'POST /companies' do
    it 'creates a bill with success' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456', password_confirmation: '123456')
      token = login_as(user)

      post companies_path, headers: { Authorization: token }, params: { company: { name: 'Casa' } }

      company = Company.last
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 201
      expect(json_response['message']).to eq 'Company created with success'
      expect(company.user).to eq user
      expect(company.name).to eq 'Casa'
    end

    it 'cant create a company while not authenticated' do
      post companies_path, params: { bill: { name: 'Academia' } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq "Couldn't find an active session."
    end
  end
end
