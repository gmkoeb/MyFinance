module Api
  module V1
    class MonthlyLimitsController < ApiController
      before_action :authorize_user
      before_action :can_only_have_one_monthly_limit, only: %w[create]

      def index
        render status: :ok, json: @current_user.monthly_limit
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
        return unless monthly_limit.update(monthly_limit_params)

          render status: :ok,
                 json: { message: I18n.t('monthly_limit.crud.update_success') }
      end

      private

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
