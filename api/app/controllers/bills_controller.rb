class BillsController < ApplicationController
  before_action :authorize_user
  def create
    bill = Bill.new(bill_params)
    bill.company = find_company
    return render status: :created, json: { message: 'Bill created with success' } if bill.save

    render status: :bad_request,
           json: { message: "Couldnt't create bill. Check the errors #{bill.errors.full_messages}" }
  end

  private

  def find_company
    company_id = params.require(:bill).permit(:company_id)['company_id']
    Company.find(company_id)
  end

  def bill_params
    params.require(:bill).permit(:name, :billing_company, :value, :paid, :payment_date)
  end
end
