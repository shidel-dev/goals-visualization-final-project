class LifeController < ApplicationController

  def save
    @life = Life.find(current_user.life_id)
    @life.update(params["person"])
    @life.save!
  end

  def load
    @life = Life.find(current_user.life_id)
    respond_to do |format|
      format.json { render json: @life.to_json }
    end
  end

  def permit_params
    params["person"].require(:life).permit(:maxId, :nodes, :connections)
  end
end
