require "test_helper"

class TrackedWebsitesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tracked_website = tracked_websites(:one)
  end

  test "should get index" do
    get tracked_websites_url
    assert_response :success
  end

  test "should get new" do
    get new_tracked_website_url
    assert_response :success
  end

  test "should create tracked_website" do
    assert_difference("TrackedWebsite.count") do
      post tracked_websites_url, params: { tracked_website: { time: @tracked_website.time, user_id: @tracked_website.user_id, websiteurl: @tracked_website.websiteurl } }
    end

    assert_redirected_to tracked_website_url(TrackedWebsite.last)
  end

  test "should show tracked_website" do
    get tracked_website_url(@tracked_website)
    assert_response :success
  end

  test "should get edit" do
    get edit_tracked_website_url(@tracked_website)
    assert_response :success
  end

  test "should update tracked_website" do
    patch tracked_website_url(@tracked_website), params: { tracked_website: { time: @tracked_website.time, user_id: @tracked_website.user_id, websiteurl: @tracked_website.websiteurl } }
    assert_redirected_to tracked_website_url(@tracked_website)
  end

  test "should destroy tracked_website" do
    assert_difference("TrackedWebsite.count", -1) do
      delete tracked_website_url(@tracked_website)
    end

    assert_redirected_to tracked_websites_url
  end
end
