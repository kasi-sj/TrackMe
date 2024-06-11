json.extract! tracked_website, :id, :user_id, :websiteurl, :time, :created_at, :updated_at
json.url tracked_website_url(tracked_website, format: :json)
