class User < ActiveRecord::Base
  has_secure_password

  before_create :create_life_id

  def create_life_id
    @life = Life.create
    self.life_id = @life.id.to_s
  end

  def create_birthday(birthdayhash)
    self.update(birthday: birthdayhash.map{|k,v| v}.join("-").to_date)
  end
end
