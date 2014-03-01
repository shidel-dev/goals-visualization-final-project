class LifeController < ApplicationController

  def save
    @user = User.find(session[:user_id])
    @life = Life.find(@user.life_id)
    # debugger
    @life = params["person"]
    @life.save!
  end

  def load
    puts params
    @user = User.find(session[:user_id])
    @life = Life.find(@user.life_id)
    respond_to do |format|
      format.json { render json: @life.to_json }
    end
  end
end
