Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post '/users/sign_up', to: 'users/registrations#sign_up', controller: 'users/registrations'
      post '/users/sign_in', to: 'users/authentications#sign_in', controller: 'users/authentications'
      get '/users/validate_user', to: 'users/authentications#validate_user', controller: 'users/authentications'

      resources :companies do
        resources :monthly_bills, only: %w[index create]
        post '/create_bill', to: 'monthly_bills#create_bill', controller: 'monthly_bills'
        resources :bills, only: %w[index create]
        get '/bills_history/:year', to: 'bills#history', controller: 'bills', as: 'bills_history'
        get '/bills_statistics/:year', to: 'bills#statistics', controller: 'bills', as: 'bills_statistics'
        get '/bills_years', to: 'bills#years', controller: 'bills', as: 'bills_years'
      end
      resources :bills, only: %w[update destroy]
      resources :monthly_bills, only: %w[update destroy]
    end
  end

  get '*path', to: 'application#frontend', constraints: ->(req) { !req.xhr? && req.format.html? }
end
