require 'rails_helper'

RSpec.describe Company, type: :model do
  describe '#valid' do
    context 'uniqueness' do
      it 'name must be unique for each user' do
        user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
        user.companies.create(name: 'Test')

        company = user.companies.build(name: 'Test')

        expect(company.valid?).to eq false
        expect(company.errors.full_messages).to include 'Nome já está em uso'
      end

      it 'name must be unique for each user (success)' do
        first_user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
        second_user = User.create(name: 'Test', email: 'test2@email.com', password: '123456')

        first_user.companies.create(name: 'Test')
        company = second_user.companies.build(name: 'Test')

        expect(company.valid?).to eq true
      end
    end

    context 'presence' do
      it 'name cant be blank' do
        user = User.create(name: 'Test', email: 'test@email.com', password: '123456')
        company = user.companies.build(name: '')

        expect(company.valid?).to eq false
        expect(company.errors.full_messages).to include "Nome não pode ficar em branco"
      end
    end
  end
end
