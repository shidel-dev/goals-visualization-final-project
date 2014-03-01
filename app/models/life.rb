class Life
  include Mongoid::Document
  field :maxId,       type: Integer
  field :nodes,       type: Array
  field :connections, type: Array
end
