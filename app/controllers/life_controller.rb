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

  # Refactor to include this method so we can re-enanble strong pararms
  def permit_params
    params[:life_data].require(:life).permit(:maxId, :goals, :connections)
  end
end
