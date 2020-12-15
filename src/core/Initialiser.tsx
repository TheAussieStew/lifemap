import { GraphObj, GraphOps } from "./LifeGraphModel";

export const initialisedGraph = () => {
    let g = new GraphObj();
    GraphOps.createQi(g, "Red");
    GraphOps.createQi(g, "Blue");
    GraphOps.createQi(g, "Purple");
    GraphOps.createQi(g, "White");
    const fst = GraphOps.queryQi(g, 0);
    const snd = GraphOps.queryQi(g, 0);
    GraphOps.createLink(g, fst, snd);
    GraphOps.createNeighbour(g, fst, "Red White");
    return g;
}