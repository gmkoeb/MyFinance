class AddUniquenessIndexToCompany < ActiveRecord::Migration[7.1]
  def change
    add_index :companies, %i[user_id name], unique: true
  end
end
