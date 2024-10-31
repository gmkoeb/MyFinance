class AddRecurrentToBill < ActiveRecord::Migration[7.1]
  def change
    add_column :bills, :recurrent, :integer
  end
end
