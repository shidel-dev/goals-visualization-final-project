class LifeController < ApplicationController

  def save
    # @life = Life.find_by(session[:user_id])
    puts params
    @life = Life.new
    @life[:person] = params["person"]
    @life.save!
  end

  def load
  end
end
