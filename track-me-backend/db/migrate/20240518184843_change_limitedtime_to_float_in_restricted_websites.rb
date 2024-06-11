class ChangeLimitedtimeToFloatInRestrictedWebsites < ActiveRecord::Migration[7.1]
  def change
    change_column :restricted_websites, :limitedtime, :float, using: 'EXTRACT(EPOCH FROM limitedtime)'
  end
end
