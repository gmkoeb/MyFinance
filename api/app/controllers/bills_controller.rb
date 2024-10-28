class BillsController < ApplicationController
  before_action :authorize_user
  before_action :set_company_and_check_user, only: %w[index create history]
  before_action :set_bill_and_check_user, only: %w[update destroy]

  def index
    bills = @company.bills.where(payment_date: Time.zone.now.at_beginning_of_month..Time.zone.now.at_end_of_month)
    render status: :ok, json: bills
  end

  def history
    unique_years = @company.bills.map(&:payment_date).map(&:year).uniq.sort.reverse
    bills = format_bill_hash(unique_years)
    render status: :ok, json: bills
  end

  def create
    bill = @company.bills.build(bill_params)

    return render status: :created, json: { message: 'Bill created with success' } if bill.save

    render status: :bad_request,
           json: { message: bill.errors.full_messages }
  end

  def update
    return render status: :ok, json: { message: 'Bill updated with success' } if @bill.update(bill_params)

    render status: :bad_request,
           json: { message: "Couldn't update bill. Check the errors #{@bill.errors.full_messages}" }
  end

  def destroy
    return render status: :ok, json: { message: 'Bill deleted with success' } if @bill.destroy
  end
  
  private

  def set_company_and_check_user
    @company = Company.find(params[:company_id])
    render status: :unauthorized, json: { message: 'Permission denied.' } if @company.user != @current_user
  end

  def bill_params
    params.require(:bill).permit(:name, :billing_company, :value, :paid, :payment_date)
  end

  def set_bill_and_check_user
    @bill = Bill.find(params[:id])
    render status: :unauthorized, json: { message: 'Permission denied.' } if @bill.company.user != @current_user
  end

  def format_bill_hash(years)
    bill_hash = {}
    years.each do |year|
      bills = Bill.where("cast(strftime('%Y', payment_date) as int) = ?", year)
      unique_months = bills.map(&:payment_date).map(&:month).uniq
      months = unique_months.map { |month_number| I18n.t("date.month_names")[month_number] }
      bill_hash[year] = {
        months:,
        bills: bills.as_json
      }
    end
    bill_hash
  end
end
