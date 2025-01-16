class AddUniqunessToMonthlyBills < ActiveRecord::Migration[7.1]
  def change
    add_index :monthly_bills, %i[company_id name], unique: true
  end
end
