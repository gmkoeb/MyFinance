class Users::RegistrationsController < ApplicationController
  def sign_up
    user = User.new(user_params)

    if user.save
      return render status: 201, json: { user: }
    else
      return render status: 400, json: { user: user.errors.full_messages } 
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end