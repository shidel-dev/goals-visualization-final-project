class LifeController < ApplicationController
  respond_to :json

  def save
    @life = Life.find(current_user.life_id)
    @life.update(params[:life_data])
    @life.save!
    render nothing: true
  end

  def load
    @life = Life.find(current_user.life_id)
    render json: @life
  end

  def permit_params
    params["person"].require(:life).permit(:maxId, :nodes, :connections)
  end
end
