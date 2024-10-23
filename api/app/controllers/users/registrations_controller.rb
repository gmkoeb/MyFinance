module Users
  class RegistrationsController < ApplicationController
    def sign_up
      user = User.new(user_params)

      return render status: :created, json: { user: } if user.save

      render status: :bad_request, json: { user: user.errors.full_messages }
    end

    private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
  end
end
