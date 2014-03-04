class Life
  include Mongoid::Document

  # what in the world is this?
  field :maxId,       type: Integer

  # {
  #   :title
  #   :reflection
  #   :x
  #   :y
  #   :id
  #   :completed
  # }
  # Call this 'goals' or 'nodes' ?
  field :nodes,       type: Array

  # {
  #   :to (id of node)
  #   :from (id of node)
  # }
  field :connections, type: Array
end
