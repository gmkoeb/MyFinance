class AddUniquenessIndexToCompany < ActiveRecord::Migration[7.1]
  def change
    add_index :companies, [:user_id, :name], unique: true
  end
end
