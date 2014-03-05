class Life
  include Mongoid::Document
  field :maxId,       type: Integer
  field :goals,       type: Array
  field :connections, type: Array
end
