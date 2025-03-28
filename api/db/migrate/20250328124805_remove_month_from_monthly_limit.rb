class RemoveMonthFromMonthlyLimit < ActiveRecord::Migration[7.1]
  def change
    remove_column :monthly_limits, :month, :string
  end
end
