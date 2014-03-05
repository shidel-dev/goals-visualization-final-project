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

end
