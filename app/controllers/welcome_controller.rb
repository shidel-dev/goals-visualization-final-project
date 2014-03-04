class WelcomeController < ApplicationController
  def index
    # OH NO.
    @current_user = current_user
  end
end
