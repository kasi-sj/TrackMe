class ModifyTrackedWebsites < ActiveRecord::Migration[7.1]
  def change
    add_column :tracked_websites, :date, :date
    change_column :tracked_websites, :time, :datetime, array: true, default: [], using: "(ARRAY[]::timestamp[])"
  end
end
