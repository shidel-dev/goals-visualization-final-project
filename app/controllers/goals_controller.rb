class GoalsController < ApplicationController

  def index
    @goals = GoalsPresenter.new(current_user)
    @titles = @goals.title_words
    @reflections = @goals.reflection_words
    @title_string = @goals.title_string
    @themes = "My Goal Themes:"
    render "index"
  end

end