class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :name
      t.string :password
      t.boolean :verified
      t.string :imageUrl

      t.timestamps
    end
  end
end
