// (function (exports) {
//     'use strict';
//     exports.Vertexes = require('../../data-structures/vertex').Vertexes;
//     exports.Edge = require('../../data-structures/edge').Edge;
//     /**
//      * Computes shortest paths from a single source
//      * vertex to all of the other vertices.
//      *
//      * @public
//      * @param {Array} vertexes Vertices of the graph.
//      * @param {Array} edges Edges of the graph.
//      * @param {Number} source Start vertex.
//      * @returns {Object} Object with two arrays (parents and distances)
//      *   with shortest-path information or undefined if the graph
//      *   has a negative cycle.
//      */
//     exports.bellmanFord = function (vertexes, edges, source) {
//         var distances = {};
//         var parents = {};
//         var c;
//         if (source) {
//             for (var i = 0; i < vertexes.length; i += 1) {
//                 distances[vertexes[i].id] = Infinity;
//                 parents[vertexes[i].id] = null;
//             }
//             distances[source.id] = 0;
//             for (i = 0; i < vertexes.length - 1; i += 1) {
//                 for (var j = 0; j < edges.length; j += 1) {
//                     c = edges[j];
//                     if (distances[c.from.id] + c.distance < distances[c.to.id]) {
//                         distances[c.to.id] = distances[c.from.id] + c.distance;
//                         parents[c.to.id] = c.from.id;
//                     }
//                 }
//             }
//             for (i = 0; i < edges.length; i += 1) {
//                 c = edges[i];
//                 if (distances[c.from.id] + c.distance < distances[c.to.id]) {
//                     return undefined;
//                 }
//             }
//         }
//         return { parents: parents, distances: distances };
//     };
// })(typeof window === 'undefined' ? module.exports : window);

export class bellman {

    bellmanFord(vertexes, edges, source) {
        var distances = {};
        let path = {};
        var parents = {};
        var c;
            for (var i = 0; i < vertexes.length; i += 1) {
                distances[vertexes[i].id] = Infinity;
                parents[vertexes[i].id] = null;
            }
            distances[source] = 0;
            for (i = 0; i < vertexes.length - 1; i += 1) {
                for (var j = 0; j < edges.length; j += 1) {
                    c = edges[j];
                    if ((distances[c.from] !== Infinity) && (distances[c.from] + c.distance < distances[c.to])) {
                        distances[c.to] = distances[c.from] + c.distance;
                        parents[c.to] = c.from;
                        path[c.to] = c.from;
                    }
                }
            }
            for (i = 0; i < edges.length; i += 1) {
                c = edges[i];
                if ((distances[c.from] !== Infinity) && distances[c.from] + c.distance < distances[c.to]) {
                    return undefined;
                }
            }
        return { parents: parents, distances: distances };
    }
}