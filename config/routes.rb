Goals::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'

  # Are these 'shortcut' routes needed? Why go against the convention here?
  # (they aren't visible to the public like /signup)
  post '/load' => 'life#load'
  post '/save' => 'life#save'

  match '/signup',  to: 'users#new',            via: 'get'
  match '/signin',  to: 'sessions#new',         via: 'get'
  match '/signout', to: 'sessions#destroy',     via: 'get'

  get '/goals', to: 'users#find_goals'

  resources :sessions, only: [:new, :create]

  resources :users

end
