import { useMemo } from "react";
import { buildTree } from "./geologic_tree.types";
import { GeoTreeRepr } from "./utils/geo_tree";


export function useGeologicTree() {
    const tree = useMemo(() => {
        return buildTree(GeoTreeRepr)
    },[])
    return tree
}
