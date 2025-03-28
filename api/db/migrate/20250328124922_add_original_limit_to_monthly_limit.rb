class AddOriginalLimitToMonthlyLimit < ActiveRecord::Migration[7.1]
  def change
    add_column :monthly_limits, :original_limit, :decimal, precision: 10, scale: 2
  end
end
