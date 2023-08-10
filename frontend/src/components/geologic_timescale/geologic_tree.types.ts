export type GeoID = number
export type Name = string
export type ExpID = string
export type GeoData = {
  name: Name
  exp_id?: ExpID
  lvl: number
  color: string
  age_span: {
    from: number
    to: number
  }
}

export type GeoBranch = {
  parent_id: GeoID
  left_id : GeoID | undefined
  right_id : GeoID | undefined
  id: GeoID
  data: GeoData
  branches: Map<GeoID, GeoBranch> // if size==0 => leaf
}

export type GeoTree = {
  root: {
    id: GeoID
    data: GeoData
    branches: Map<GeoID, GeoBranch>
  }
  leafs: Map<
    Name,
    {
      path: GeoID[]
      id: GeoID
      data: GeoData
      branches: GeoID[]
    }
  >
  exp_ids_binder: Map<ExpID, GeoID>
  __auto_increment: number
}

export type GeoTreeRepr = {
  [key: string]: {
    age_span: {
      from: number
      to: number
    }
    lvl: number
    color: string
    branches?: GeoTreeRepr | {}
  }
}

function newBranch(parent_id: GeoID, id: GeoID,left_id:GeoID|undefined,right_id:GeoID|undefined, data: GeoData): GeoBranch {
  return {
    parent_id,
    id,
    left_id,
    right_id,
    data,
    branches: new Map(),
  }
}
function newTree(root_data: GeoData): GeoTree {
  const __auto_increment = 0
  const leafs = new Map()
  leafs.set(root_data.name, {
    path: [],
    id: __auto_increment,
    data: root_data,
    branches: [],
  })
  const exp_ids_binder = new Map()
  if (root_data.exp_id) {
    exp_ids_binder.set(root_data.exp_id, __auto_increment)
  }
  return {
    root: {
      id: __auto_increment,
      data: root_data,
      branches: new Map(),
    },
    leafs,
    exp_ids_binder,
    __auto_increment,
  }
}
export function buildTree(tree_repr: GeoTreeRepr): GeoTree {
  const root_name = Object.keys(tree_repr)[0]
  const root_extracted_data = tree_repr[root_name]
  const root_data: GeoData = {
    age_span: root_extracted_data.age_span,
    name: root_name,
    color : root_extracted_data.color,
    lvl : root_extracted_data.lvl
  }
  const tree = newTree(root_data)
  for(let [name,extracted_data] of Object.entries(root_extracted_data.branches!)) {
    const data: GeoData = {
        age_span: extracted_data.age_span,
        name: name,
        color : extracted_data.color,
        lvl : extracted_data.lvl
      }
    push(tree,root_name,data)
    populate(tree,name,extracted_data)
  }
  return tree
}

function populate(tree:GeoTree,name:Name,extracted_data:{
    age_span: {
      from: number
      to: number
    }
    lvl: number
    color: string
    branches?: GeoTreeRepr
  }) {
    if(!extracted_data.branches ){
        return
    }
    for(let [sub_name,sub_extracted_data] of Object.entries(extracted_data.branches!)) {
        const data: GeoData = {
            age_span: sub_extracted_data.age_span,
            name: sub_name,
            color : sub_extracted_data.color,
            lvl : sub_extracted_data.lvl
            }
        push(tree,name,data)
        populate(tree,sub_name,sub_extracted_data)
    }
}

export function push(tree: GeoTree, to: Name, data: GeoData) {
    tree.__auto_increment+= 1
  const id = tree.__auto_increment
  const leaf = tree.leafs.get(to)
  if (!leaf) return
  if (leaf.path.length === 0) {
    // root
    const {left_id,left_value} = lastOf<GeoID,GeoBranch>(tree.root.branches)
    if(left_value) {
        left_value.right_id = id
    }
    tree.root.branches.set(id, newBranch(tree.root.id,id,left_id,undefined, data))
    // complete root leaf
    tree.leafs.get(tree.root.data.name)?.branches.push(id)
    // add new leaf
    tree.leafs.set(data.name, {
      path: [tree.root.id],
      id,
      data,
      branches: [],
    })
    if (data.exp_id) {
      tree.exp_ids_binder.set(data.exp_id, id)
    }
    return
  }
  // follow path
  const path = [...leaf.path]
  path.push(leaf.id)
  const branch = descend(tree, path)
  
  if (!branch) return

  const {left_id,left_value} = lastOf<GeoID,GeoBranch>(branch.branches)
  if(left_value) {
      left_value.right_id = id
  }
  branch.branches.set(id, newBranch(leaf.id, id,left_id,undefined, data))
  tree.leafs.get(branch.data.name)?.branches.push(id)
  tree.leafs.set(data.name, {
    path: [...leaf.path, branch.id],
    id,
    data,
    branches: [],
  })
  if (data.exp_id) {
    tree.exp_ids_binder.set(data.exp_id, id)
  }
}

function descend(tree: GeoTree, path: GeoID[]) {
  let branch = undefined
  let branches = tree.root.branches

  for (let id of path) {
    if(id === tree.root.id) continue
    branch = branches.get(id)
    if (!branch) return undefined
    branches = branch.branches
  }
  return branch
}

function lastOf<K, V>(map: Map<K, V>): {left_id:K|undefined,left_value:V|undefined} {
    const entriesArray = Array.from(map.entries());
    const entry = entriesArray[entriesArray.length - 1];
    if(entry) {
        return {
            left_id : entry[0],
            left_value : entry[1]
        }
    }
    else {
        return {
            left_id : undefined,
            left_value : undefined
        }
    }
  }