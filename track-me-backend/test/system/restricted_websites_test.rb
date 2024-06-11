require "application_system_test_case"

class RestrictedWebsitesTest < ApplicationSystemTestCase
  setup do
    @restricted_website = restricted_websites(:one)
  end

  test "visiting the index" do
    visit restricted_websites_url
    assert_selector "h1", text: "Restricted websites"
  end

  test "should create restricted website" do
    visit restricted_websites_url
    click_on "New restricted website"

    check "Isblocked" if @restricted_website.isblocked
    fill_in "Limitedtime", with: @restricted_website.limitedtime
    fill_in "User", with: @restricted_website.user_id
    fill_in "Websiteurl", with: @restricted_website.websiteurl
    click_on "Create Restricted website"

    assert_text "Restricted website was successfully created"
    click_on "Back"
  end

  test "should update Restricted website" do
    visit restricted_website_url(@restricted_website)
    click_on "Edit this restricted website", match: :first

    check "Isblocked" if @restricted_website.isblocked
    fill_in "Limitedtime", with: @restricted_website.limitedtime
    fill_in "User", with: @restricted_website.user_id
    fill_in "Websiteurl", with: @restricted_website.websiteurl
    click_on "Update Restricted website"

    assert_text "Restricted website was successfully updated"
    click_on "Back"
  end

  test "should destroy Restricted website" do
    visit restricted_website_url(@restricted_website)
    click_on "Destroy this restricted website", match: :first

    assert_text "Restricted website was successfully destroyed"
  end
end
