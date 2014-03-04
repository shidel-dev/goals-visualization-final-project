class User < ActiveRecord::Base

  validates :email, presence: true, uniqueness: true
  validates :password, length: { in: 6..20 }
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create

  has_secure_password

  before_create :create_life

  def create_life
    @life = Life.create
    self.life_id = @life.id.to_s
  end

  def life
    Life.find(self.life_id)
  end

  # move to presenter
  def reflection_words
    @life_goals = life["nodes"]
    arr = @life_goals.collect { |x| x["reflection"] if !x["reflection"].blank? }.compact
    # or
    @life_goals.reject { |x| x["reflection"].blank? }
    @life_goals.select { |x| !x["reflection"].blank? }
  end

  # move to presenter
  def goal_words
    @life_goals = life["nodes"]
    arr = @life_goals.collect { |x| x["title"] }.reject {|x| x == "\n    "}.compact
    @life_goals.map(&:title).select{ |t| !t.blank? }
  end

end
