class User < ActiveRecord::Base

  validates :email, presence: true, uniqueness: true
  validates :password, length: { in: 6..20 }
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create

  has_secure_password

  before_create :create_life_id

  def create_life_id
    @life = Life.create
    self.life_id = @life.id.to_s
  end

  def reflection_words
    @life_goals = Life.where(id: self.life_id).to_a
    @life_goals = @life_goals[0]["nodes"]
    arr = @life_goals.collect { |x| x["reflection"] if !x["reflection"].blank? }.compact
  end

  def goal_words
    @life_goals = Life.where(id: self.life_id).to_a
    @life_goals = @life_goals[0]["nodes"]
    arr = @life_goals.collect { |x| x["title"] }.reject {|x| x == "\n    "}.compact
  end

end
