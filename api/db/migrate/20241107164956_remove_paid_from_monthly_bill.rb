class RemovePaidFromMonthlyBill < ActiveRecord::Migration[7.1]
  def change
    remove_column :monthly_bills, :paid, :boolean
  end
end
