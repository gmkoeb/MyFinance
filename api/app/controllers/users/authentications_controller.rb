module Users
  class AuthenticationsController < ApplicationController
    def sign_in
      @user = User.find_by(email: auth_params[:email])

      return unless @user&.authenticate(auth_params[:password])

      token = JsonWebToken.encode(user_id: @user.id)
      render json: { token: { code: token, exp: 24.hours.to_i },
                     user: { name: @user.name } }, status: :ok
    end

    private

    def auth_params
      params.require(:user).permit(:email, :password)
    end
  end
end
