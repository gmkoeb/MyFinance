class AddUseLimitToBill < ActiveRecord::Migration[7.1]
  def change
    add_column :bills, :use_limit, :boolean
  end
end
