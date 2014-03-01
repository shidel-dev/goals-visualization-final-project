class LifeController < ApplicationController

  def save
    debugger
    @user = User.find(session[:user_id])
    @life = Life.find(@user.life_id)
    # debugger
    @life.update(params["person]"])
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

  def permit_params
    params["person"].require(:life).permit(:maxId, :nodes, :connections)
  end
end
