require "test_helper"

class RestrictedWebsitesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @restricted_website = restricted_websites(:one)
  end

  test "should get index" do
    get restricted_websites_url
    assert_response :success
  end

  test "should get new" do
    get new_restricted_website_url
    assert_response :success
  end

  test "should create restricted_website" do
    assert_difference("RestrictedWebsite.count") do
      post restricted_websites_url, params: { restricted_website: { isblocked: @restricted_website.isblocked, limitedtime: @restricted_website.limitedtime, user_id: @restricted_website.user_id, websiteurl: @restricted_website.websiteurl } }
    end

    assert_redirected_to restricted_website_url(RestrictedWebsite.last)
  end

  test "should show restricted_website" do
    get restricted_website_url(@restricted_website)
    assert_response :success
  end

  test "should get edit" do
    get edit_restricted_website_url(@restricted_website)
    assert_response :success
  end

  test "should update restricted_website" do
    patch restricted_website_url(@restricted_website), params: { restricted_website: { isblocked: @restricted_website.isblocked, limitedtime: @restricted_website.limitedtime, user_id: @restricted_website.user_id, websiteurl: @restricted_website.websiteurl } }
    assert_redirected_to restricted_website_url(@restricted_website)
  end

  test "should destroy restricted_website" do
    assert_difference("RestrictedWebsite.count", -1) do
      delete restricted_website_url(@restricted_website)
    end

    assert_redirected_to restricted_websites_url
  end
end
