import { Vertexes } from "./vertex";

export class Edge {
    from: Vertexes;
    to: Vertexes;
    distance: number;

    public constructor(e, v, distance) {
        this.from = e;
        this.to = v;
        this.distance = distance;
      };
}