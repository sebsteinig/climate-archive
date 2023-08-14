
export type SpanData = {
    idx : number,
    exp_id : string
}

type Span = {
    low : number
    high : number
    data : SpanData
} 
  

type SpanNode = {
    span : Span
    max : number
    left_branch ?: SpanNode
    right_branch ?: SpanNode
}

export type SpanTree = {
    root : SpanNode | undefined
}

export function insert(tree:SpanTree,low:number,high:number,data:SpanData){
    tree.root = insertRec(tree.root,{
        low,
        high,
        data,
    })
}

export function query(tree:SpanTree,value:number): Span | undefined {
    return queryRec(tree.root, value,undefined);
}

function queryRec(node:SpanNode | undefined,value:number,closest : Span | undefined) : Span | undefined {
    if(!node) return undefined
    if (node.span.low <= value && value <= node.span.high) {
        return node.span;
    }
    if (!closest || Math.abs(node.span.low - value) < Math.abs(closest.low - value)) {
        closest = node.span;
    }

    if (value < node.span.low && node.left_branch) {
        return queryRec(node.left_branch, value, closest);
      } else if (node.right_branch) {
        return queryRec(node.right_branch, value, closest);
      }
    
      return closest;
}

function insertRec(node:SpanNode | undefined, span : Span) : SpanNode {
    if(!node) return {
        span,
        max : span.high
    }
    
    if (span.low <= node.span.low) {
        node.left_branch = insertRec(node.left_branch , span);
    } else {
        node.right_branch  = insertRec(node.right_branch , span);
    }
    
    if (node.max < span.high) {
        node.max = span.high;
    }
    
    return node;
}

