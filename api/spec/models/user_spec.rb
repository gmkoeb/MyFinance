require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#password validations' do
    it 'password must match confirm password' do
      user = User.new(name: 'Gabriel', email: 'test@test.com', password: '123456',
                      password_confirmation: '123456')
      user.password_confirmation = '450294'
      expect(user.valid?).to be false
    end

    it 'user is not authenticated if passwords dont match' do
      user = User.new(name: 'Gabriel', email: 'test@test.com', password: '123456',
                      password_confirmation: '123456')

      result = user.authenticate('654321')

      expect(result).to be false
    end

    it 'user is authenticated if passwords match' do
      user = User.new(name: 'Gabriel', email: 'test@test.com', password: '123456')

      result = user.authenticate('123456')

      expect(user).to be result
    end
  end

  describe '#valid?' do
    context 'uniqueness' do
      it 'email must be unique' do
        User.create(name: 'Gabriel', email: 'test@test.com', password: '123456',
                    password_confirmation: '123456')
        second_user = User.new(name: 'Gabriel', email: 'test@test.com', password: '123456')

        expect(second_user.valid?).to eq false
        expect(second_user.errors.full_messages).to include 'Email já está em uso'
      end
    end

    context 'format' do
      it 'email must have a valid format' do
        user = User.new(name: 'Gabriel', email: 'testtest.com', password: '123456',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Email não é válido'
      end
    end

    context 'length' do
      it 'password must have at least 6 characters' do
        user = User.new(name: 'Gabriel', email: 'testtest.com', password: '12345',
                        password_confirmation: '12345')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Senha é muito curta (mínimo: 6 caracteres)'
      end

      it 'password must have a maximum of 20 characters' do
        user = User.new(name: 'Gabriel', email: 'testtest.com', password: '1234512345123451234512345',
                        password_confirmation: '1234512345123451234512345')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Senha é muito longa (máximo: 20 caracteres)'
      end
    end

    context 'presence' do
      it 'name cant be blank' do
        user = User.new(name: '', email: 'test@test.com', password: '123456',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Nome não pode ficar em branco'
      end

      it 'name cant be blank' do
        user = User.new(name: 'Test', email: '', password: '123456',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Email não pode ficar em branco'
      end

      it 'password cant be blank' do
        user = User.new(name: 'Test', email: 'test@test.com', password: '',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Senha não pode ficar em branco'
      end
    end
  end
end
