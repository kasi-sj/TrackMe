class TokensController < ApplicationController
  before_action :authenticate_user!

  def decrypt
    token = params[:token]
    raise ActionController::BadRequest, 'Token is missing' unless token.present?

    puts token
    decoded_token = decode_token(token)
    email = decoded_token[0]['email']
    # Avoid including sensitive information like passwords in the response
    # password = decoded_token[0]['password']

    render json: { email: email }
  rescue JWT::DecodeError => e
    render json: { error: e.message }, status: :unprocessable_entity
  rescue ActionController::BadRequest => e
    render json: { error: e.message }, status: :bad_request
  end

  private

  def authenticate_user!
    # Implement authentication logic to ensure only authenticated users can access this endpoint
    # This method can be implemented using Devise, JWT tokens, or any other authentication mechanism
  end

  def decode_token(token)
    JWT.decode(token, Rails.application.credentials.secret_key_base)
  end
end
