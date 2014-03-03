class SessionsController < ApplicationController

  def new
    landing_page
  end

  def create
    user = User.find_by(email: params[:session][:email])

    if user && user.authenticate(params[:session][:password])
      session[:user_id] = user.id
      redirect_to user_path(user)
    else
      flash[:signin_error] = "Invalid Email or Password. Please try again."
      redirect_to new_session_path
    end

  end

  def destroy
    session.clear
    redirect_to root_path
  end

  def landing_page
    @disable_nav = true
  end

  private
  def create_params
    params.require(:user).permit(:email, :password)
  end

end
