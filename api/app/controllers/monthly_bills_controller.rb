class MonthlyBillsController < ApplicationController
  before_action :authorize_user
  before_action :set_company_and_check_user, only: %w[index create create_bill]
  before_action :find_monthly_bill, only: %w[update destroy]

  def index
    render status: :ok, json: @company.monthly_bills
  end

  def create
    monthly_bill = @company.monthly_bills.build(monthly_bills_params)

    if monthly_bill.save
      render status: :created, json: { message: I18n.t('monthly_bill.crud.create_success') }
    else
      render status: :bad_request,
             json: { message: monthly_bill.errors.full_messages }
    end
  end

  def update
    return render status: :ok if @monthly_bill.update(monthly_bills_params)

    render status: :bad_request, json: { message: @monthly_bill.errors.full_messages }
  end

  def destroy
    render status: :ok if @monthly_bill.destroy
  end

  def create_bill
    bill = @company.bills.build(bill_params)
    set_bill_stats(bill)
    find_and_update_monthly_bill(@company, bill)

    if bill.save
      render status: :created
    else
      render status: :bad_request,
             json: { message: bill.errors.full_messages }
    end
  end

  private

  def find_monthly_bill
    @monthly_bill = MonthlyBill.find(params[:id])
  end

  def find_and_update_monthly_bill(company, bill)
    company.monthly_bills.find_by(name: bill.name).update(value: bill.value, payment_date: Time.zone.now)
  end

  def monthly_bills_params
    params.require(:monthly_bill).permit(:name, :billing_company, :value, :payment_date)
  end

  def set_company_and_check_user
    @company = Company.find(params[:company_id])
    render status: :unauthorized, json: { message: I18n.t('auth.wrong_user') } if @company.user != @current_user
  end

  def bill_params
    params.require(:bill).permit(:name, :value, :billing_company, :paid)
  end

  def set_bill_stats(bill)
    bill.payment_date = Time.zone.now
    bill.monthly = true
  end
end
