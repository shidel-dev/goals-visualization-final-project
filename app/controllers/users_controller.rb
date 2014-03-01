class UsersController < ApplicationController
  def index
    redirect_to root_path # ??
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(create_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path
    else
      render new_user_path
    end
  end

  def show
    redirect_to root_path
  end

  private
  def create_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
