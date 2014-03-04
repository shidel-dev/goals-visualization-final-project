class UsersController < ApplicationController

  # remove this if not in use (also, drop from config/routes.rb)
  def index
    landing_page
    redirect_to root_path # ??
  end

  def new
    @user = User.new
    # duplicated method from sessions_controller and this view related, can you remove it
    # from the controller?
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

  # used? delete if not
  def show
    redirect_to root_path
  end

  # Create a GoalsController, this is the index
  # action (requiring a current_user for it to work)
  def find_goals
    # all this is very presentation related
    # create a helper or presenter for this kind
    # of work
    @life_goals = current_user.reflection_words
    @all_words = @life_goals.join(" ").split(" ")
    @all_titles = current_user.goal_words
    @all_titles_arr = @all_titles.join(" ").lstrip
    # @goals = GoalsPresenter.new(current_user)

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
