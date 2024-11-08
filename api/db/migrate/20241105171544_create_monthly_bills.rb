class CreateMonthlyBills < ActiveRecord::Migration[7.1]
  def change
    create_table :monthly_bills do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name
      t.string :billing_company
      t.decimal :value, precision: 10, scale: 2
      t.datetime :payment_date
      t.boolean :paid

      t.timestamps
    end
  end
end
