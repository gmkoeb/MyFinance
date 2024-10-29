class ApplicationController < ActionController::API
  def authorize_user
    token = request.headers['Authorization']
    return render_unauthorized if token.blank?

    begin
      user_id = JsonWebToken.decode(token)['user_id']
      @current_user = User.find(user_id)
    rescue JWT::DecodeError
      render_unauthorized
    end
  end

  private

  def render_unauthorized
    render json: { message: "Couldn't find an active session." }, status: :unauthorized
  end
end
