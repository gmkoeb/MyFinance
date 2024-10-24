module Users
  class AuthenticationsController < ApplicationController
    def sign_in
      user = User.find_by(email: authentication_params[:email])

      if user&.authenticate(authentication_params[:password])
        token = JsonWebToken.encode(user_id: user.id)
        render json: { token: { code: token, exp: 24.hours.to_i },
                       user: { name: user.name } }, status: :ok
      else
        render json: { message: ['Wrong password or email.'] }, status: :unauthorized
      end
    end

    private

    def authentication_params
      params.require(:user).permit(:email, :password)
    end
  end
end
