class UsersController < ApplicationController
  def index
    landing_page
    redirect_to root_path # ??
  end

  def new
    @user = User.new
    landing_page
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

  def find_goals
    @life_goals = current_user.reflection_words
    @all_words = @life_goals.join(" ").split(" ")
    @all_titles = current_user.goal_words
    @all_titles_arr = @all_titles.join(" ").lstrip
    render "goals"
  end

  def landing_page
    @disable_nav = true
  end

  private
  def create_params
    params.require(:user).permit(:email, :password, :password_confirmation, :birthday)
  end
end
