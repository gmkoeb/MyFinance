module Api
  module V1
    class BillsController < ApiController
      before_action :authorize_user
      before_action :set_company_and_check_user, only: %w[index create history years statistics]
      before_action :set_bill_and_check_user, only: %w[update destroy]
      before_action :set_year_bills, only: %w[history statistics]

      def index
        bills = @company.bills.where(payment_date: Time.zone.now.at_beginning_of_month..Time.zone.now.at_end_of_month)
        render status: :ok, json: bills
      end

      def years
        unique_years = @company.bills.map(&:payment_date).map(&:year).uniq.sort.reverse
        render status: :ok, json: { years: unique_years }
      end

      def history
        render status: :ok, json: { bills: @bills, months: months(@bills), company: @company.name }
      end

      def statistics
        render status: :ok, json: { stats: @bills.group('LOWER(name)')
                                                 .pluck('LOWER(name) AS name, SUM(value) AS total_value').to_h
                                                 .transform_keys(&:capitalize) }
      end

      def create
        bill = @company.bills.build(bill_params)
        bill.type = 'Bill'
        return render status: :created, json: { message: I18n.t('bill.crud.create_success') } if bill.save

        render status: :bad_request,
               json: { message: bill.errors.full_messages }
      end

      def update
        return render status: :ok, json: { message: I18n.t('bill.crud.update_success') } if @bill.update(bill_params)

        render status: :bad_request,
               json: { message: @bill.errors.full_messages }
      end

      def destroy
        render status: :ok, json: { message: I18n.t('bill.crud.delete') } if @bill.destroy
      end

      private
      def set_company_and_check_user
        @company = Company.find(params[:company_id])
        render status: :unauthorized, json: { message: I18n.t('auth.wrong_user') } if @company.user != @current_user
      end

      def bill_params
        params.require(:bill).permit(:name, :billing_company, :value, :payment_date, :recurrent)
      end

      def set_bill_and_check_user
        @bill = Bill.find(params[:id])
        return unless @bill.company.user != @current_user

        render status: :unauthorized, json: { message: I18n.t('auth.wrong_user') }
      end

      def months(bills)
        unique_months = bills.map(&:payment_date).map(&:month).uniq.sort
        unique_months.map { |month_number| I18n.t('date.month_names')[month_number] }
      end

      def set_year_bills
        query = params[:query]

        @bills = @company.bills.where("cast(strftime('%Y', payment_date) as int) = ?", params[:year])
      end
    end
  end
end
