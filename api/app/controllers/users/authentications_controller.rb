module Users
  class AuthenticationsController < ApplicationController
    before_action :authorize_user, only: %w[validate_user]

    def sign_in
      user = User.find_by(email: authentication_params[:email])

      if user&.authenticate(authentication_params[:password])
        token = JsonWebToken.encode(user_id: user.id)
        render json: { token: { code: token, exp: 24.hours.to_i },
                       user: { name: user.name } }, status: :ok
      else
        render json: { message: [I18n.t('auth.wrong_data')] }, status: :unauthorized
      end
    end

    def validate_user; end

    private

    def authentication_params
      params.require(:user).permit(:email, :password)
    end
  end
end
