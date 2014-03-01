class User < ActiveRecord::Base
  has_secure_password

  before_create :create_life_id

  def create_life_id
    @life = Life.create
    self.life_id = @life.id.to_s
  end
end
