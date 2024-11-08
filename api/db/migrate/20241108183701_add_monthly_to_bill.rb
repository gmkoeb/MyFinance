class AddMonthlyToBill < ActiveRecord::Migration[7.1]
  def change
    add_column :bills, :monthly, :boolean
  end
end
