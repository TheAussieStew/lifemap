import { testPrint } from "../utils/Utils";
import { GraphObj, GraphOps, Order } from "./LifeGraphModel";

let go = GraphOps;

test(GraphObj.name, () => {
  let g = new GraphObj();
  testPrint(GraphObj, g);
  // expect(g).toHaveType(Graph)
});

test(GraphOps.createQi.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Grass");
  g = go.createQi(g, "Rocks");
  g = go.createQi(g, "Plants");
  g = go.createQi(g, "Trees");
  g = go.createQi(g, "Flowers");
  testPrint(GraphOps.createQi, g);
});

test(GraphOps.queryQi.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Grass");
  let qi = go.queryQi(g, 0);
  testPrint(GraphOps.queryQi, qi);
});

test(GraphOps.delete.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Grass");
  let qi = go.queryQi(g, 0);
  g = go.delete(g, qi);
  expect(g.nodes).toHaveLength(0);
  // what is the node is attached to another node?
  testPrint(GraphOps.delete, g);
});

test(GraphOps.createLink.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Rocks");
  g = go.createQi(g, "Plants");
  let from = go.queryQi(g, 0);
  let to = go.queryQi(g, 1);
  go.createLink(g, from, to);
  testPrint(GraphOps.createLink, g);
});

test(GraphOps.queryQiLink.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Rocks");
  g = go.createQi(g, "Plants");
  let from = go.queryQi(g, 0);
  let to = go.queryQi(g, 1);
  go.createLink(g, from, to);
  let link = go.queryQiLink(g, 0);
  testPrint(GraphOps.queryQiLink, link);
});

test(GraphOps.createNeighbour.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Rocks");
  let from = go.queryQi(g, 0);
  g = go.createNeighbour(g, from, "Pebble");
  testPrint(GraphOps.createNeighbour, g);
});

test(GraphOps.changeQi.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Rocks");
  let qi = go.queryQi(g, 0);
  g = go.changeQi(g, "Sand", qi);
  testPrint(GraphOps.createNeighbour, g);
});

test(GraphOps.changeQiLink.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Rocks");
  g = go.createQi(g, "Plants");
  let from = go.queryQi(g, 0);
  let to = go.queryQi(g, 1);
  go.createLink(g, from, to);
  let link = go.queryQiLink(g, 0);
  let order: Order = undefined;
  g = go.changeQiLink(g, 100, order, link);
  testPrint(GraphOps.changeQiLink, g);
  expect(g.links[0].tong).toBe(100);
});

test(GraphOps.pick.name, () => {});

test(GraphOps.popPicks.name, () => {});

test(GraphOps.neighbours.name, () => {
  let g = new GraphObj();
  g = go.createQi(g, "Rocks");
  let from = go.queryQi(g, 0);
  // note that these links are one directional
  g = go.createNeighbour(g, from, "Soil");
  g = go.createNeighbour(g, from, "Flowers");
  from = go.queryQi(g, 1);
  g = go.createNeighbour(g, from, "Worms");
  g = go.createNeighbour(g, from, "Minerals");
  from = go.queryQi(g, 0);
  let neighbours = go.neighbours(g, from, 2);
  testPrint(GraphOps.neighbours, neighbours);
  expect(neighbours).toHaveLength(4);
  neighbours = go.neighbours(g, from, 1);
  testPrint(GraphOps.neighbours, neighbours);
  expect(neighbours).toHaveLength(2);
});
