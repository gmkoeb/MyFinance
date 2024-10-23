class CompaniesController < ApplicationController
  before_action :authorize_user
  before_action :find_company_and_check_user, only: %w[update]
  def create
    company = Company.new(company_params)
    company.user = @current_user

    if company.save
      render status: :created, json: { message: 'Company created with success' }
    else
      render status: :bad_request,
             json: { message: "Couldn't create company. Check the errors #{company.errors.full_messages}" }
    end
  end

  def update
    if @company.update(company_params)
      render status: :ok, json: { message: 'Company updated with success.' }
    else
      render status: :bad_request,
             json: { message: "Couldn't update company. Check the errors #{@company.errors.full_messages}" }
    end
  end

  private

  def find_company_and_check_user
    @company = Company.find(params[:id])
    render status: :unauthorized, json: { message: 'Permission denied.' } if @company.user != @current_user
  end

  def company_params
    params.require(:company).permit(:name)
  end
end
