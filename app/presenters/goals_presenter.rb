class GoalsPresenter

  def initialize(user)
    @user = user
  end

  def life_goals
    reflection_words
  end

  def reflection_words
    life_goals = @user.life["nodes"]
    life_goals.collect { |g| g["reflection"] }.reject!(&:empty?)
  end

  def title_words
    life_goals = @user.life["nodes"]
    life_goals = life_goals.select{ |g| g["title"] if !g["title"].blank? }
    life_goals.collect {|g| g["title"].rstrip}
  end

  def title_string
    title_words.join(" ").lstrip
  end
end