class LivesController < ApplicationController

  def save
    # @life = Life.find_by(session[:user_id])
    @life = params(person)
    @life = save!
  end

  def load
  end
end
