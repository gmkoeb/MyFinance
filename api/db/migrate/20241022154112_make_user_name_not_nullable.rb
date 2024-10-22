class MakeUserNameNotNullable < ActiveRecord::Migration[7.1]
  def change
    change_column :users, :name, :string, null: false
  end
end
