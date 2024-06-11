class TrackedWebsitesController < ApplicationController
  include TokenHelper
  # before_action :verify_token, except: [:create]
  before_action :set_tracked_website, only: %i[ show edit update destroy ]
  protect_from_forgery with: :null_session, only: [:create , :update , :destroy]

  def verify_token
    token = request.headers['Authorization']&.split(' ')&.last || params[:token]
    @decoded_token = decode_verification_token(token)

    unless @decoded_token
      render json: { error: 'Invalid token' }, status: :unprocessable_entity
    end
  end
  # GET /tracked_websites or /tracked_websites.json
  def index
    @tracked_websites = TrackedWebsite.all
    render json: @tracked_websites
  end

  def index_by_user
    @tracked_websites = TrackedWebsite.where(user_id: params[:user_id])

    render json: @tracked_websites, only: [:id, :websiteurl, :total_live_time], status: :ok
  end

  # GET /tracked_websites/user/:user_id/today
  def index_by_user_today
    @tracked_websites = TrackedWebsite.where(user_id: params[:user_id], date: Date.today)

    render json: @tracked_websites, only: [:id, :websiteurl, :total_live_time], status: :ok
  end

  def index_by_user_week
    start_of_week = Date.today.at_beginning_of_week
    end_of_week = Date.today.at_end_of_week

    @tracked_websites = TrackedWebsite.where(user_id: params[:user_id], date: start_of_week..end_of_week)

    render json: @tracked_websites, only: [:id, :websiteurl, :total_live_time], status: :ok
  end

  def index_by_user_month
    start_of_month = Date.today.at_beginning_of_month
    end_of_month = Date.today.at_end_of_month

    @tracked_websites = TrackedWebsite.where(user_id: params[:user_id], date: start_of_month..end_of_month)

    render json: @tracked_websites, only: [:id, :websiteurl, :total_live_time], status: :ok
  end

  def index_by_user_year
    start_of_year = Date.today.at_beginning_of_year
    end_of_year = Date.today.at_end_of_year

    @tracked_websites = TrackedWebsite.where(user_id: params[:user_id], date: start_of_year..end_of_year)

    render json: @tracked_websites, only: [:id, :websiteurl, :total_live_time], status: :ok
  end


  # GET /tracked_websites/user/:user_id/all
  def index_all_by_user
    past_week = (0..6).map { |i| Date.today - i.days }.reverse
    tracked_websites = TrackedWebsite.where(user_id: params[:user_id])
                                     .where('date >= ?', past_week.first)
                                     .order(date: :desc)

    result = tracked_websites.group_by(&:websiteurl).map do |websiteurl, records|
      # Initialize a hash for dates with 0 total_live_time
      dates_hash = past_week.each_with_object({}) { |date, hash| hash[date] = 1 }

      # Populate the hash with actual data
      records.each do |record|
        dates_hash[record.date] += record.total_live_time
      end

      {
        websiteurl: websiteurl,
        dates: dates_hash.keys,
        total_live_times: dates_hash.values
      }
    end

    limited_result = result.take(10)  # Limit the result to 10 records

    render json: limited_result, status: :ok
  end

   def total_live_time_by_user
    total_time = TrackedWebsite.where(user_id: params[:user_id]).sum(:total_live_time)
    render json: { total_live_time: total_time }, status: :ok
  end

  def today_active_time_by_user
    today = Date.current
    total_time = TrackedWebsite.where(user_id: params[:user_id], date: today).sum(:total_live_time)
    render json: { total_live_time: total_time }, status: :ok
  end

  # POST /tracked_websites/user/:user_id/sum_active_time_by_date
  def sum_active_time_by_date
    user_id = params[:user_id]

    # Fetch and group by date, summing the total_live_time for each date
    tracked_websites = TrackedWebsite.where(user_id: user_id)
                                     .group(:date)
                                     .sum(:total_live_time)

    result = tracked_websites.map do |date, total_live_time|
      { date: date, total_live_time: total_live_time }
    end

    render json: result, status: :ok
  end


  def by_domain
    user_id = params[:user_id]
    domain = params[:domain]

    # Fetch all tracked websites for the user that contain the domain in the website URL
    tracked_websites = TrackedWebsite.where(user_id: user_id)
                                     .where("websiteurl LIKE ?", "%#{domain}%")
                                     .order(:date)
                                     .pluck(:websiteurl, :total_live_time)

    render json: tracked_websites, status: :ok
  end

  def sum_by_date
    user_id = params[:user_id]
    domain = params[:domain]

    # Fetch and group by date, summing the total_live_time for each date
    tracked_websites = TrackedWebsite.where(user_id: user_id)
                                     .where("websiteurl LIKE ?", "%#{domain}%")
                                     .group(:date)
                                     .sum(:total_live_time)

    result = tracked_websites.map do |date, total_live_time|
      { date: date, total_live_time: total_live_time }
    end

    render json: result, status: :ok
  end

  # GET /tracked_websites/1 or /tracked_websites/1.json
  def show
  end

  # GET /tracked_websites/new
  def new
    @tracked_website = TrackedWebsite.new
  end

  # GET /tracked_websites/1/edit
  def edit
  end

  # POST /tracked_websites.json
def create
  existing_record = TrackedWebsite.find_by(date: tracked_website_params[:date],
                                            websiteurl: tracked_website_params[:websiteurl],
                                            user_id: tracked_website_params[:user_id])

  if existing_record
    existing_record.time << tracked_website_params[:time][0]
    existing_record.total_live_time += tracked_website_params[:total_live_time].to_i
    if existing_record.save
      render json: { id: existing_record.id, websiteurl: existing_record.websiteurl, total_live_time: existing_record.total_live_time }, status: :ok
    else
      render json: existing_record.errors, status: :unprocessable_entity
    end
  else
    # Create new record
    @tracked_website = TrackedWebsite.new(tracked_website_params)
    if @tracked_website.save
      render json: { id: @tracked_website.id, websiteurl: @tracked_website.websiteurl, total_live_time: @tracked_website.total_live_time }, status: :created
    else
      render json: @tracked_website.errors, status: :unprocessable_entity
    end
  end
end



  # PATCH/PUT /tracked_websites/1 or /tracked_websites/1.json
  def update
    respond_to do |format|
      if @tracked_website.update(tracked_website_params)
        format.html { redirect_to tracked_website_url(@tracked_website), notice: "Tracked website was successfully updated." }
        format.json { render :show, status: :ok, location: @tracked_website }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @tracked_website.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tracked_websites/1 or /tracked_websites/1.json
  def destroy
    @tracked_website.destroy!

    respond_to do |format|
      format.html { redirect_to tracked_websites_url, notice: "Tracked website was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tracked_website
      @tracked_website = TrackedWebsite.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def tracked_website_params
    params.require(:tracked_website).permit(:user_id, :websiteurl, :date,:total_live_time ,time: [])
  end
end
