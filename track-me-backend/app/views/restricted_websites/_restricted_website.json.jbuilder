json.extract! restricted_website, :id, :user_id, :websiteurl, :limitedtime, :isblocked, :created_at, :updated_at
json.url restricted_website_url(restricted_website, format: :json)
