class GoalsController < ApplicationController

  def index
    if current_user
      @goals = GoalsPresenter.new(current_user)
      @titles = @goals.title_words
      @reflections = @goals.reflection_words
      @title_string = @goals.title_string
      render "index"
    else
      redirect_to root_path
    end
  end

end