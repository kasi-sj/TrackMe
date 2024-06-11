class RestrictedWebsitesController < ApplicationController
  include TokenHelper
  # before_action :verify_token, except: [:exceeded_time]
  before_action :set_restricted_website, only: %i[ show edit update destroy ]
  protect_from_forgery with: :null_session, only: [:create , :update , :destroy]

  def verify_token
    token = request.headers['Authorization']&.split(' ')&.last || params[:token]
    @decoded_token = decode_verification_token(token)

    unless @decoded_token
      render json: { error: 'Invalid token' }, status: :unprocessable_entity
    end
  end

  # GET /restricted_websites or /restricted_websites.json
  def index
    @restricted_websites = RestrictedWebsite.all
    render json: @restricted_websites
  end

  # GET /restricted_websites/1 or /restricted_websites/1.json
  def show
  end

  # GET /restricted_websites/new
  def new
    @restricted_website = RestrictedWebsite.new
  end

  # GET /restricted_websites/1/edit
  def edit
  end

  # GET /restricted_websites/user/:user_id
  def index_by_user
    user_restricted_websites = RestrictedWebsite.where(user_id: params[:user_id]).order(created_at: :desc)

    render json: user_restricted_websites, status: :ok
  end

  # POST /restricted_websites or /restricted_websites.json
def create
  existing_record = RestrictedWebsite.find_by(user_id: restricted_website_params[:user_id], websiteurl: restricted_website_params[:websiteurl])

  if existing_record
      render json: { data: "Restricted website with this URL already exists for this user" }, status: :ok
      return
    end

  @restricted_website = RestrictedWebsite.new(restricted_website_params)

  if @restricted_website.save
      render json: { id: @restricted_website.id, websiteurl: @restricted_website.websiteurl, total_live_time: @restricted_website.limitedtime , data: "Added restricted website successfully" }, status: :created
    else
      render json: @restricted_website.errors, status: :unprocessable_entity
    end
end

def exceeded_time
    user_id = params[:user_id]
    today = Date.today

    # Fetch all restricted websites for the user
    restricted_websites = RestrictedWebsite.where(user_id: user_id)

    # Fetch all tracked websites for the user with today's date
    tracked_websites = TrackedWebsite.where(user_id: user_id, date: today)

    exceeded_websites = []

    restricted_websites.each do |restricted|
      matching_tracked_websites = tracked_websites.select { |tracked| tracked.websiteurl.include?(restricted.websiteurl) }

      total_live_time = matching_tracked_websites.sum(&:total_live_time)

      if total_live_time >= restricted.limitedtime*60*60
        exceeded_websites << {
          domain: restricted.websiteurl,
          type: restricted.isblocked ? "RESTICTED" : "TLE"
        }
      end
    end

    render json: exceeded_websites, status: :ok
  end


def update
  if @restricted_website.update(restricted_website_params)
    render :show, status: :ok, location: @restricted_website
  else
    render json: @restricted_website.errors, status: :unprocessable_entity
  end
end


def destroy
  @restricted_website.destroy!
  render json: { message: "Successfully deleted." }, status: :ok
end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_restricted_website
      @restricted_website = RestrictedWebsite.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def restricted_website_params
      params.require(:restricted_website).permit(:user_id, :websiteurl, :limitedtime, :isblocked)
    end
end
