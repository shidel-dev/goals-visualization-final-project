class LifeController < ApplicationController

  def save
    @user = User.find(session[:user_id])
    @life = Life.find(@user.life_id)
    @life[:person] = params["person"]
    @life.save!
  end

  def load
    puts params
    @user = User.find(session[:user_id])
    @life = Life.find(@user.life_id)
    respond_to do |format|
      format.json { render json: @life[:person].to_json }
    end
  end
end
