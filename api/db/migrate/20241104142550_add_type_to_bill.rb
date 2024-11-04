class AddTypeToBill < ActiveRecord::Migration[7.1]
  def change
    add_column :bills, :type, :string
  end
end
