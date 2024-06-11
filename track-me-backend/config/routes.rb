Rails.application.routes.draw do
  root 'home#index' 
  resources :restricted_websites
  resources :tracked_websites
  resources :users do
    collection do
      get 'verify'
    end
  end

  post '/decrypt_token', to: 'tokens#decrypt'

  post 'signIn' , to: 'users#signIn'

  get 'tracked_websites/user/:user_id', to: 'tracked_websites#index_by_user'

  get 'tracked_websites/user/:user_id/today', to: 'tracked_websites#index_by_user_today'

  get 'tracked_websites/user/:user_id/week', to: 'tracked_websites#index_by_user_week'

  get 'tracked_websites/user/:user_id/month', to: 'tracked_websites#index_by_user_month'

  get 'tracked_websites/user/:user_id/year', to: 'tracked_websites#index_by_user_year'

    get 'tracked_websites/user/:user_id/all', to: 'tracked_websites#index_all_by_user'

  get 'tracked_websites/user/:user_id/total_live_time', to: 'tracked_websites#total_live_time_by_user'

    get 'tracked_websites/user/:user_id/today_active_time', to: 'tracked_websites#today_active_time_by_user'

      post 'tracked_websites/user/:user_id/domain', to: 'tracked_websites#by_domain'
  post 'tracked_websites/user/:user_id/sum_by_date', to: 'tracked_websites#sum_by_date'

get 'tracked_websites/user/:user_id/sum_active_time_by_date', to: 'tracked_websites#sum_active_time_by_date'

  get 'restricted_websites/user/:user_id', to: 'restricted_websites#index_by_user'

  get 'restricted_websites/user/:user_id/exceeded', to: 'restricted_websites#exceeded_time'



  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
