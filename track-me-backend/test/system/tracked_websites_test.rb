require "application_system_test_case"

class TrackedWebsitesTest < ApplicationSystemTestCase
  setup do
    @tracked_website = tracked_websites(:one)
  end

  test "visiting the index" do
    visit tracked_websites_url
    assert_selector "h1", text: "Tracked websites"
  end

  test "should create tracked website" do
    visit tracked_websites_url
    click_on "New tracked website"

    fill_in "Time", with: @tracked_website.time
    fill_in "User", with: @tracked_website.user_id
    fill_in "Websiteurl", with: @tracked_website.websiteurl
    click_on "Create Tracked website"

    assert_text "Tracked website was successfully created"
    click_on "Back"
  end

  test "should update Tracked website" do
    visit tracked_website_url(@tracked_website)
    click_on "Edit this tracked website", match: :first

    fill_in "Time", with: @tracked_website.time
    fill_in "User", with: @tracked_website.user_id
    fill_in "Websiteurl", with: @tracked_website.websiteurl
    click_on "Update Tracked website"

    assert_text "Tracked website was successfully updated"
    click_on "Back"
  end

  test "should destroy Tracked website" do
    visit tracked_website_url(@tracked_website)
    click_on "Destroy this tracked website", match: :first

    assert_text "Tracked website was successfully destroyed"
  end
end
