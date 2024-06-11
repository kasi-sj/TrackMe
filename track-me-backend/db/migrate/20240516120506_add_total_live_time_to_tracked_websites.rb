class AddTotalLiveTimeToTrackedWebsites < ActiveRecord::Migration[7.1]
  def change
    add_column :tracked_websites, :total_live_time, :integer
  end
end
