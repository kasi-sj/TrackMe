require 'jwt'

class UsersController < ApplicationController
  include TokenHelper
  # before_action :verify_token, except: [:create, :verify , :signIn]
  before_action :set_user, only: %i[ show edit update destroy ]
  protect_from_forgery with: :null_session, only: [:create , :update , :destroy]

  def verify_token
    token = request.headers['Authorization']&.split(' ')&.last || params[:token]
    @decoded_token = decode_verification_token(token)

    unless @decoded_token
      render json: { error: 'Invalid token' }, status: :unprocessable_entity
    end
  end

  # GET /users or /users.json
  def index
      @users = User.all
      render json: @users
  end

  # GET /users/1 or /users/1.json
  def show
  @user = User.find(params[:id])
  render json: @user
end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
  @user = User.new(user_params)

  if @user.save
    @user.update(verification_token: SecureRandom.hex(10), verified: false)
      UserMailer.verification_email(@user).deliver_now
    render json: { user: @user }, status: :created
  else
    if @user.errors[:email].include?("has already been taken")
      render json: { error: "Email has already been taken" }, status: :unprocessable_entity
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
end
def verify
    user = User.find_by(verification_token: params[:token])

    if user && !user.verified
      user.update(verified: true, verification_token: nil)
      render json: { message: 'Your email has been verified successfully.' }, status: :ok
    else
      render json: { error: 'Invalid or expired token.' }, status: :unprocessable_entity
    end
  end

def signIn
  user = User.find_by(email: params[:email])
  puts user
    if user && user.password == params[:password] && user[:verified]
      token = generate_verification_token(user)
      # Sign in the user (e.g., set session or token)
      render json: { user: { id: user.id, email: user.email, name: user.name , token: token } }, status: :ok
    else
      render json: { error: "Invalid email or password or not verified" }, status: :unauthorized
      end
end

  # PATCH/PUT /users/1 or /users/1.json
  def update
  if @user.update(user_params)
    render json: @user, status: :ok
  else
    if @user.errors[:email].include?("has already been taken")
      render json: { error: "Email has already been taken" }, status: :unprocessable_entity
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
end



  # DELETE /users/1 or /users/1.json
  def destroy
  @user.destroy!

  head :no_content
rescue ActiveRecord::RecordNotFound
  render json: { error: 'User not found' }, status: :not_found
end

def generate_verification_token(user)
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secrets.secret_key_base)
  end

  def decode_verification_token(token)
    decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
    HashWithIndifferentAccess.new(decoded_token)
  rescue
    nil
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:email, :name, :password, :verified, :imageUrl)
    end
end
