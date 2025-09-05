module Api
  module V1
    class MonthlyLimitsController < ApiController
      before_action :authorize_user
      before_action :can_only_have_one_monthly_limit, only: %w[create]
      before_action :update_limit, only: %w[index]

      def index
        if @current_user.monthly_limit
          render status: :ok, json: @current_user.monthly_limit
        else
          render status: :ok, json: { id: 0 }
        end
      end

      def create
        monthly_limit = @current_user.build_monthly_limit(monthly_limit_params)

        if monthly_limit.save
          render status: :created, json: { message: I18n.t('monthly_limit.crud.create_success') }
        else
          render status: :bad_request,
                 json: { message: monthly_limit.errors.full_messages }
        end
      end

      def destroy
        monthly_limit = MonthlyLimit.find(params[:id])
        render status: :ok, json: { message: I18n.t('monthly_limit.crud.delete') } if monthly_limit.destroy
      end

      def update
        monthly_limit = MonthlyLimit.find(params[:id])
        monthly_limit.original_limit = monthly_limit_params[:limit] if monthly_limit_params[:limit]

        return unless monthly_limit.update(monthly_limit_params)

        render status: :ok,
               json: { message: I18n.t('monthly_limit.crud.update_success') }
      end

      def monthly_limit_bills
        bills = current_month_limited_bills

        render status: :ok, json: bills
      end

      private

      def current_month_limited_bills
        @current_user.bills
                     .using_limit
                     .where(payment_date: Time.zone.now.at_beginning_of_month..Time.zone.now.at_end_of_month)
                     .order(payment_date: :asc)
      end

      def update_limit
        monthly_limit = @current_user.monthly_limit
        return unless monthly_limit

        original_limit = monthly_limit.original_limit
        bills = current_month_limited_bills
        if bills.empty?
          monthly_limit.update(limit: original_limit)
        else
          total_value = bills.map(&:value).sum
          monthly_limit.update(limit: original_limit - total_value) if monthly_limit.limit == original_limit
        end
      end

      def can_only_have_one_monthly_limit
        return if @current_user.monthly_limit.blank?

        render status: :bad_request,
               json: { message: 'Usuário já possui um limite mensal cadastrado' }
      end

      def monthly_limit_params
        params.require(:monthly_limit).permit(:name, :limit, :month)
      end
    end
  end
end
