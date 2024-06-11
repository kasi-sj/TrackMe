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

ActiveRecord::Schema[7.1].define(version: 2024_05_20_112251) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "restricted_websites", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "websiteurl"
    t.float "limitedtime"
    t.boolean "isblocked"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_restricted_websites_on_user_id"
  end

  create_table "tracked_websites", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "websiteurl"
    t.datetime "time", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "total_live_time"
    t.date "date"
    t.index ["user_id"], name: "index_tracked_websites_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.string "password"
    t.boolean "verified"
    t.string "imageUrl"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "verification_token"
  end

  add_foreign_key "restricted_websites", "users"
  add_foreign_key "tracked_websites", "users"
end
