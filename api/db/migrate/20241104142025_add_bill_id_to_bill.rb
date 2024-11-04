class AddBillIdToBill < ActiveRecord::Migration[7.1]
  def change
    add_column :bills, :bill_id, :integer
  end
end
