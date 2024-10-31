require 'rails_helper'

describe 'Companies API' do
  context 'POST /companies' do
    it 'creates a bill with success' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)

      post companies_path, headers: { Authorization: token }, params: { company: { name: 'Casa' } }

      company = Company.last
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 201
      expect(json_response['message']).to eq 'Empresa criada com sucesso'
      expect(company.user).to eq user
      expect(company.name).to eq 'Casa'
    end

    it 'doesnt create a company with wrong parameters' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      token = login_as(user)

      post companies_path, headers: { Authorization: token }, params: { company: { name: '' } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 400
      expect(json_response['message']).to include 'Nome não pode ficar em branco'
    end

    it 'cant create a company while not authenticated' do
      post companies_path, params: { bill: { name: 'Academia' } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq 'Não foi possível encontrar uma sessão ativa'
    end
  end

  context 'PATCH /company/:id' do
    it 'updates a specific company with success' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)
      patch company_path(company), headers: { Authorization: token },
                                   params: { company: { name: 'Academia' } }

      json_response = JSON.parse(response.body)
      company.reload
      expect(response.status).to eq 200
      expect(company.name).to eq 'Academia'
      expect(json_response['message']).to eq 'Empresa atualizada com sucesso'
    end

    it 'with invalid parameters' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      company = user.companies.create(name: 'Casa')
      token = login_as(user)
      patch company_path(company), headers: { Authorization: token },
                                   params: { company: { name: '' } }

      json_response = JSON.parse(response.body)

      expect(response.status).to eq 400
      expect(company.name).to eq 'Casa'
      expect(json_response['message']).to include 'Nome não pode ficar em branco'
    end

    it 'user can only update his own company' do
      first_user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      second_user = User.create(name: 'Test', email: 'email@email.com', password: '123456')
      company = first_user.companies.create(name: 'Casa')

      token = login_as(second_user)
      patch company_path(company), headers: { Authorization: token },
                                   params: { company: { name: 'Academia' } }

      json_response = JSON.parse(response.body)
      expect(response.status).to eq 401
      expect(json_response['message']).to eq 'Permissão negada'
    end
  end

  context 'GET /companies' do
    it 'returns a list with all user companies in alphabetical order' do
      user = User.create(name: 'Gabriel', email: 'test@test.com', password: '123456')
      user.companies.create(name: 'Casa')
      user.companies.create(name: 'Academia')
      user.companies.create(name: 'Empresa 1')

      token = login_as(user)
      get companies_path, headers: { Authorization: token }
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(json_response.length).to eq 3
      expect(json_response[0]['name']).to eq 'Academia'
      expect(json_response[1]['name']).to eq 'Casa'
      expect(json_response[2]['name']).to eq 'Empresa 1'
    end

    it 'user must be logged in to see his companies' do
      get companies_path
      json_response = JSON.parse(response.body)

      expect(response.status).to eq 401
      expect(json_response['message']).to eq 'Não foi possível encontrar uma sessão ativa'
    end
  end
end
