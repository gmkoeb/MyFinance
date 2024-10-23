Rails.application.routes.draw do
  post '/users/sign_up', to: 'users/registrations#sign_up', controller: 'users/registrations'
  post '/users/sign_in', to: 'users/authentications#sign_in', controller: 'users/authentications'

  resources :companies do
    resources :bills, only: %w[index create]
  end
  resources :bills, only: %w[update destroy]
end
