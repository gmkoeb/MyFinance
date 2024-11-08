class AddUniqunessToMonthlyBills < ActiveRecord::Migration[7.1]
  def change
    add_index :monthly_bills, [:company_id, :name], unique: true
  end
end
