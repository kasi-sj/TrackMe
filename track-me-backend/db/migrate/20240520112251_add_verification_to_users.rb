class AddVerificationToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :verification_token, :string
  end
end
