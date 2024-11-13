class CompaniesController < ApplicationController
  before_action :authorize_user
  before_action :find_company_and_check_user, only: %w[update destroy]

  def index
    render status: :ok, json: @current_user.companies.order(:name)
  end

  def create
    company = Company.new(company_params)
    company.user = @current_user

    if company.save
      render status: :created, json: { message: I18n.t('company.crud.create_success') }
    else
      render status: :bad_request,
             json: { message: company.errors.full_messages }
    end
  end

  def update
    if @company.update(company_params)
      return render status: :ok,
                    json: { message: I18n.t('company.crud.update_success') }
    end

    render status: :bad_request, json: { message: @company.errors.full_messages }
  end

  def destroy
    render status: :ok if @company.destroy  
  end

  private

  def find_company_and_check_user
    @company = Company.find(params[:id])
    render status: :unauthorized, json: { message: I18n.t('auth.wrong_user') } if @company.user != @current_user
  end

  def company_params
    params.require(:company).permit(:name)
  end
end
