class AddMonthToMonthlyLimit < ActiveRecord::Migration[7.1]
  def change
    add_column :monthly_limits, :month, :datetime
  end
end
