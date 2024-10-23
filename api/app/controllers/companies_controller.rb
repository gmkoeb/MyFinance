class CompaniesController < ApplicationController
  before_action :authorize_user

  def create
    company = Company.new(company_params)
    company.user = @current_user

    if company.save
      render status: :created, json: { message: 'Company created with success' }
    else
      render status: :bad_request,
             json: { message: "Couldnt't create company. Check the errors #{company.errors.full_messages}" }
    end
  end

  private

  def company_params
    params.require(:company).permit(:name)
  end
end
