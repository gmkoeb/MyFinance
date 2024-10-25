class ChangeBillValueToDecimal < ActiveRecord::Migration[7.1]
  def change
    change_column :bills, :value, :decimal, precision: 10, scale: 2
  end
end
