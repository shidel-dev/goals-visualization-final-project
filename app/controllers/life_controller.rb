class LifeController < ApplicationController

  def save
    # switch to current_user helper method. keep code DRY
    @user = User.find(session[:user_id])
    @life = Life.find(@user.life_id)
    # @life = current_user.life

    # debugger
    # whhhhhhaaaat????
    @life.update(params["person"])
    @life.save!
  end

  def load
    puts params
    # current_user please
    @user = User.find(session[:user_id])
    @life = Life.find(@user.life_id)

    # If we don't offer any other format, no need for the block, just render json ALL THE TIME
    respond_to do |format|
      format.json { render json: @life.to_json }
    end
  end

  # using this?
  def permit_params
    params.require(:person).require(:life).permit(:maxId, :nodes, :connections)
  end
end
