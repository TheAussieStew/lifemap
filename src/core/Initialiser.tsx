import { GraphImp, GraphOpsImp } from "./LifeGraphModel";

export const initialisedGraph = () => {
    let g = new GraphImp();
    GraphOpsImp.createQi(g, "Red");
    GraphOpsImp.createQi(g, "Blue");
    GraphOpsImp.createQi(g, "Purple");
    GraphOpsImp.createQi(g, "White");
    const fst = GraphOpsImp.queryQi(g, 0);
    const snd = GraphOpsImp.queryQi(g, 0);
    GraphOpsImp.createLink(g, fst, snd);
    GraphOpsImp.createNeighbour(g, fst, "Red White");
    return g;
}