json.extract! user, :id, :email, :name, :password, :verified, :imageUrl, :created_at, :updated_at
json.url user_url(user, format: :json)
