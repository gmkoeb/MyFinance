class Users::AuthenticationsController < ApplicationController
  def sign_in
    
    @user = User.find_by_email(user_params[:email])
    
    if @user&.authenticate(user_params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      render json: { token: {code: token, exp: 24.hours.to_i},
                     user: {name: @user.name } }, status: :ok
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end