class SetDefaultValueForBillPaid < ActiveRecord::Migration[7.1]
  def change
    change_column :bills, :paid, :boolean, :default => false
  end
end
