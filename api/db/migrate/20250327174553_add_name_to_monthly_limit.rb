class AddNameToMonthlyLimit < ActiveRecord::Migration[7.1]
  def change
    add_column :monthly_limits, :name, :string
  end
end
