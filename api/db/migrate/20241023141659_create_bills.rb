class CreateBills < ActiveRecord::Migration[7.1]
  def change
    create_table :bills do |t|
      t.string :name
      t.string :billing_company
      t.integer :value
      t.boolean :paid
      t.datetime :payment_date
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end
