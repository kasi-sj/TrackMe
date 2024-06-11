class CreateRestrictedWebsites < ActiveRecord::Migration[7.1]
  def change
    create_table :restricted_websites do |t|
      t.references :user, null: false, foreign_key: true
      t.string :websiteurl
      t.datetime :limitedtime
      t.boolean :isblocked

      t.timestamps
    end
  end
end
