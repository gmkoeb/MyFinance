# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_03_28_124922) do
  create_table "bills", force: :cascade do |t|
    t.string "name"
    t.string "billing_company"
    t.decimal "value", precision: 10, scale: 2
    t.datetime "payment_date"
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "recurrent"
    t.integer "bill_id"
    t.string "type"
    t.boolean "monthly"
    t.boolean "use_limit"
    t.index ["company_id"], name: "index_bills_on_company_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "name"], name: "index_companies_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_companies_on_user_id"
  end

  create_table "monthly_bills", force: :cascade do |t|
    t.integer "company_id", null: false
    t.string "name"
    t.string "billing_company"
    t.decimal "value", precision: 10, scale: 2
    t.datetime "payment_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id", "name"], name: "index_monthly_bills_on_company_id_and_name", unique: true
    t.index ["company_id"], name: "index_monthly_bills_on_company_id"
  end

  create_table "monthly_limits", force: :cascade do |t|
    t.decimal "limit", precision: 10, scale: 2
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.decimal "original_limit", precision: 10, scale: 2
    t.index ["user_id"], name: "index_monthly_limits_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", default: "", null: false
    t.string "password", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "bills", "companies"
  add_foreign_key "companies", "users"
  add_foreign_key "monthly_bills", "companies"
  add_foreign_key "monthly_limits", "users"
end
