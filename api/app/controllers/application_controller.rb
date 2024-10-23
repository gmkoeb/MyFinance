class ApplicationController < ActionController::API
  def authorize_user
    return render_unauthorized unless request.headers['Authorization'].present?

    begin 
      user_id = JsonWebToken.decode(token)['user_id']
      @current_user = User.find(user_id)
    rescue JWT::DecodeError
      render_unauthorized
    end
  end

  private

  def token
    params.require(:token).permit(:code)
  end

  def render_unauthorized
    render json: { status: 401, message: "Couldn't find an active session." }, status: :unauthorized
  end
end
