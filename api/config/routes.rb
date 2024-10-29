Rails.application.routes.draw do
  post '/users/sign_up', to: 'users/registrations#sign_up', controller: 'users/registrations'
  post '/users/sign_in', to: 'users/authentications#sign_in', controller: 'users/authentications'

  resources :companies do
    resources :bills, only: %w[index create]
    get '/bills_history/:year', to: 'bills#history', controller: 'bills', as: 'bills_history'
    get '/bills_years', to: 'bills#years', controller: 'bills', as: 'bills_years'
  end
  resources :bills, only: %w[update destroy]
end
