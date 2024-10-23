class BillsController < ApplicationController
  before_action :authorize_user
  before_action :set_company_and_check_user, only: %w[create]
  before_action :set_bill_and_check_user, only: %w[update]

  def create
    bill = @company.bills.build(bill_params)
    
    return render status: :created, json: { message: 'Bill created with success' } if bill.save

    render status: :bad_request,
           json: { message: "Couldn't create bill. Check the errors #{bill.errors.full_messages}" }
  end

  def update
    if @bill.update(bill_params)
      return render status: :ok, json: { message: 'Bill updated with success' }
    else
      render status: :bad_request,
             json: { message: "Couldn't update bill. Check the errors #{bill.errors.full_messages}" }
    end
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
    return render status: :unauthorized, json: { message: 'Permission denied.' } if @bill.company.user != @current_user
  end
end
