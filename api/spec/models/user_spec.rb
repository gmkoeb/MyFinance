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
        expect(second_user.errors.full_messages).to include 'Email has already been taken'
      end
    end

    context 'format' do
      it 'email must have a valid format' do
        user = User.new(name: 'Gabriel', email: 'testtest.com', password: '123456',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Email is invalid'
      end
    end

    context 'length' do
      it 'password must have at least 6 characters' do
        user = User.new(name: 'Gabriel', email: 'testtest.com', password: '12345',
                        password_confirmation: '12345')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Password is too short (minimum is 6 characters)'
      end

      it 'password must have a maximum of 20 characters' do
        user = User.new(name: 'Gabriel', email: 'testtest.com', password: '1234512345123451234512345',
                        password_confirmation: '1234512345123451234512345')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include 'Password is too long (maximum is 20 characters)'
      end
    end

    context 'presence' do
      it 'name cant be blank' do
        user = User.new(name: '', email: 'test@test.com', password: '123456',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include "Name can't be blank"
      end

      it 'name cant be blank' do
        user = User.new(name: 'Test', email: '', password: '123456',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include "Email can't be blank"
      end

      it 'password cant be blank' do
        user = User.new(name: 'Test', email: 'test@test.com', password: '',
                        password_confirmation: '123456')

        expect(user.valid?).to eq false
        expect(user.errors.full_messages).to include "Password can't be blank"
      end
    end
  end
end
