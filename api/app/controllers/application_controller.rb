class ApplicationController < ActionController::Base
  def frontend
    render file: Rails.root.join('public/index.html'), layout: false
  end
end
