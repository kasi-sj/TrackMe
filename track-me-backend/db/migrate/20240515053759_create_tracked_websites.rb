class CreateTrackedWebsites < ActiveRecord::Migration[7.1]
  def change
    create_table :tracked_websites do |t|
      t.references :user, null: false, foreign_key: true
      t.string :websiteurl
      t.datetime :time

      t.timestamps
    end
  end
end
