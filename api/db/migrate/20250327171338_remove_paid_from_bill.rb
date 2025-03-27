class RemovePaidFromBill < ActiveRecord::Migration[7.1]
  def change
    remove_column :bills, :paid, :boolean
  end
end
