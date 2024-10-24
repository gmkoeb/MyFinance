class BillsController < ApplicationController
  before_action :authorize_user
  before_action :set_company_and_check_user, only: %w[index create]
  before_action :set_bill_and_check_user, only: %w[update]

  def index
    bills = @company.bills.where(payment_date: Time.zone.now.at_beginning_of_month..Time.zone.now.at_end_of_month)
    render status: :ok, json: bills
  end

  def create
    bill = @company.bills.build(bill_params)

    return render status: :created, json: { message: 'Bill created with success' } if bill.save

    render status: :bad_request,
           json: { message: "Couldn't create bill. Check the errors #{bill.errors.full_messages}" }
  end

  def update
    return render status: :ok, json: { message: 'Bill updated with success' } if @bill.update(bill_params)

    render status: :bad_request,
           json: { message: "Couldn't update bill. Check the errors #{@bill.errors.full_messages}" }
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
end
