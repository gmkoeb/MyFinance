class CreateMonthlyLimits < ActiveRecord::Migration[7.1]
  def change
    create_table :monthly_limits do |t|
      t.decimal :limit, precision: 10, scale: 2
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
