def login_as(user)
  post api_v1_users_sign_in_path, params: { user: { email: user.email, password: user.password } }
  json_response = JSON.parse(response.body)
  json_response['token']['code']
end
