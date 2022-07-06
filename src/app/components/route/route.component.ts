import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalculateService } from 'app/shared/services/calculate.service';
import { Dijkstra, Vertex } from 'app/shared/services/dijkstra';
import { Vertexes } from 'app/shared/node/vertex';
import { Edge } from 'app/shared/node/edge';
import { bellman } from 'app/shared/services/bellmanFord';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})

export class RouteComponent implements OnInit {
  focus: any;
  focus1: any;
  Graph = require('node-dijkstra')
  graph: any;
  trains: any;
  showData = false;
  timeTaken: any;
  source: any;
  station: any;
  algorithmLoading = false
  destination: any;
  checkboxable = true;
  algorithm = true;
  resultData: any = [];
  bellmanFordResult: any = [];
  directResultData: any;
  loading = true;
  shortestPath: any;
  shortestPathTrains: any = {};

  constructor(private readonly httpClient: HttpClient,
    private readonly calService: CalculateService) { }

  ngOnInit() {
    // this.createGraph();
    this.getTrains();
  }

  getTrains() {
    this.httpClient.get("assets/trains.json").subscribe(tData => {
      let trainData = JSON.stringify(tData);
      this.trains = JSON.parse(trainData)?.features;
      this.httpClient.get("assets/mockStations.json").subscribe(sData => {
        let stationData = JSON.stringify(sData);
        this.station = JSON.parse(stationData)?.stationData;
        this.loading = false;
      });
    });
  }

  create(start: any, end: any) {
    let dijkstra = new Dijkstra();
    this.station.forEach(elementStation => {
      let points: any = [];
      this.station.forEach(element => {
        if (element !== elementStation) {
          if (!((elementStation?.properties?.code === start && element?.properties?.code === end) ||
            (elementStation?.properties?.code === end && element?.properties?.code === start))) {
            if (this.searchBetweenTwo(elementStation?.properties?.code, element?.properties?.code).length) {
              points.push({
                nameOfVertex: element?.properties?.code, weight: Math.round(this.calService.coordinatesDistance({
                  lat: elementStation?.geometry?.coordinates[0],
                  lng: elementStation?.geometry?.coordinates[1]
                },
                  {
                    lat: element?.geometry?.coordinates[0],
                    lng: element?.geometry?.coordinates[1]
                  }) / 1000)
              });
            }
          }
        }
      });
      dijkstra.addVertex(new Vertex(elementStation?.properties?.code, points, 1));
    });
    let initialTime = performance.now();
    this.shortestPath = dijkstra.findShortestWay(start, end);
    let finalTime = performance.now();
    console.log("initialTime = " + (finalTime-initialTime));
    let arr = this.shortestPath.pop();
    this.resultData = this.callTrains(this.shortestPath);
    console.log(this.resultData);
  }

  callTrains(path) {
    let i = 0;
    let j = 2;
    let array: any;
    let localValue: any = [];
    while (j <= path.length) {
      array = path.slice(i, j);
      localValue.push({ from: array[0], to: array[1], trains: this.searchBetweenTwo(array[0], array[1]) });
      i++;
      j++;
    }
    return localValue;
  }

  searchBetweenTwo(first: any, second: any) {
    let local: any = [];
    this.trains.forEach(element => {
      // if (element?.properties?.from_station_code === 'TATA' && element?.properties?.to_station_code === 'PURI') {
      //   console.log(element?.properties);
      // }
      if (element?.properties?.from_station_code === first && element?.properties?.to_station_code === second) {
        local.push(element?.properties);
      }
    });
    return local;
  }

  // createGraph() {
  //   var gg = new this.Graph();
  //   var g = new this.Graph();
  //   g.addVertex('TATA', { BBS: 100 });
  //   g.addVertex('BBS', { TATA: 100, RNC: 200, DHD: 400 });
  //   g.addVertex('RNC', { BBS: 200, DHD: 100 });
  //   g.addVertex('DHD', { RNC: 100, BBS: 400 });

  //   console.log(g);
  //   console.log(g.shortestPath('DHD', 'TATA'));
  //   this.httpClient.get("assets/mockStations.json").subscribe(sData => {
  //     let stationData = JSON.stringify(sData);
  //     let station = JSON.parse(stationData)?.stationData;
  //     station.forEach(elementStation => {
  //       let points: any = {};
  //       station.forEach(element => {
  //         if (element !== elementStation) {
  //           points[element?.properties?.code] = Math.round(this.calService.coordinatesDistance({
  //             lat: elementStation?.geometry?.coordinates[0],
  //             lng: elementStation?.geometry?.coordinates[1]
  //           },
  //             {
  //               lat: element?.geometry?.coordinates[0],
  //               lng: element?.geometry?.coordinates[1]
  //             }) / 1000);
  //         }
  //       });
  //       gg.addVertex(elementStation?.properties?.code, points);
  //     });
  //     console.log(gg);
  //     console.log(gg.shortestPath('TATA', 'BBS'));
  //   });

  //   console.log(newGraph);
  //   console.log(newGraph.findShortestWay("BBS","TATA"));
  // }

  startPoint(event) {
    this.source = event?.target?.value.toUpperCase().trim();
  }


  endPoint(event) {
    this.destination = event?.target?.value.toUpperCase().trim();
  }

  checkPoints() {
    let value1 = this.station.filter(element => element?.properties?.code === this.source);
    let value2 = this.station.filter(element => element?.properties?.code === this.destination);
    if (value1.length && value2.length) {
      return true
    } else {
      return false
    }
  }

  directTrains(start: any, end: any) {
    this.directResultData = this.searchBetweenTwo(start, end);
  }

  // bell() {
  //   var bellmanFord = new bellman();
  //   var edges = [];
  //   var vertexes = [
  //     new Vertexes('1'),
  //     new Vertexes('2'),
  //     new Vertexes('3'),
  //     new Vertexes('4')
  //   ];

  //   edges.push(new Edge('3', '2', -10));
  //   edges.push(new Edge('4', '3', 3));
  //   edges.push(new Edge('1', '4', 5));
  //   edges.push(new Edge('1', '2', 4));

  //   edges.push(new Edge(0, 1, -1));
  //   edges.push(new Edge(0, 2, 4));
  //   edges.push(new Edge(1, 2, 3));
  //   edges.push(new Edge(1, 3, 2));
  //   edges.push(new Edge(3, 1, 1));
  //   edges.push(new Edge(4, 3, -3));
  //   edges.push(new Edge(1, 4, 2));
  //   edges.push(new Edge(3, 2, 5));

  //   {
  //     parents:   { '0': null, '1':  0, '2': 1, '3':  4, '4': 1 },
  //     distances: { '0': 0,    '1': -1, '2': 2, '3': -2, '4': 1 }
  //   }
  //   var pathInfo = bellmanFord.bellmanFord(vertexes, edges, 1);
  //   console.log(pathInfo);
  // }

  createBellmanFord(start: any, end: any) {
    this.resultData = [];
    var bellmanFord = new bellman();
    let bellPath =[];
    var edges = [];
    var vertexes = [];
    this.station.forEach(elementSt => {
      vertexes.push(new Vertexes(elementSt?.properties?.code));
    });
    console.log(vertexes);

    this.station.forEach(elementStation => {
      this.station.forEach(element => {
        if (element !== elementStation) {
          if (!((elementStation?.properties?.code === start && element?.properties?.code === end) ||
            (elementStation?.properties?.code === end && element?.properties?.code === start))) {
            if (this.searchBetweenTwo(elementStation?.properties?.code, element?.properties?.code).length) {
              edges.push(new Edge(elementStation?.properties?.code, element?.properties?.code,
                Math.round(this.calService.coordinatesDistance({
                  lat: elementStation?.geometry?.coordinates[0],
                  lng: elementStation?.geometry?.coordinates[1]
                },
                  {
                    lat: element?.geometry?.coordinates[0],
                    lng: element?.geometry?.coordinates[1]
                  }) / 1000)))
            }
          }
        }
      });
    });
    let initial = performance.now();
    var pathInfo = bellmanFord.bellmanFord(vertexes, edges, "TATA");
    let final = performance.now();
    console.log("initialTime = " + (final-initial));
    console.log(initial);
    var foundFlag = 0;
    let value = end;
    bellPath.push(end);
    while (!foundFlag) {
      bellPath.push(pathInfo.parents[value]);
      value = pathInfo.parents[value];
      if (value === start) {
        foundFlag = 1;
      }
    }
    bellPath.reverse();
    console.log(pathInfo);
    this.resultData = this.callTrains(bellPath);
    console.log(this.resultData);

  }

  onSubmit() {
    this.resultData = [];
    if (this.checkboxable) {
      if (this.algorithm) {
        if (this.checkPoints()) {
          this.algorithmLoading = true;
          this.directTrains(this.source, this.destination);
          this.create(this.source, this.destination);
          this.showData = true;
          this.algorithmLoading = false;
        }
      } else {
        if (this.checkPoints()) {
          this.algorithmLoading = true;
          this.directTrains(this.source, this.destination);
          this.createBellmanFord(this.source, this.destination);
          this.showData = true;
          this.algorithmLoading = false;
        }
      }
    }
    // console.log(this.calService.coordinatesDistance({ lat: 86.20056000000001, lng: 22.768954 },
    //   { lat: 85.33352, lng: 23.348811 }))
    // this.httpClient.get("assets/stations.json").subscribe(sData => {
    //   let stationData = JSON.stringify(sData);
    //   let station = JSON.parse(stationData)?.features;
    //   station.forEach(elementStation => {
    //     if(elementStation?.properties?.code === 'DHN'){
    //     console.log(elementStation);
    //     }
    // this.httpClient.get("assets/trains.json").subscribe(data => {
    //   let stringData = JSON.stringify(data);
    //   let trains = JSON.parse(stringData)?.features;
    //   trains.forEach(element => {
    //     if (element?.properties?.from_station_code === 'PNBE') {
    //       console.log(element);
    //     }
    //   });

    //   });
    // });
    // });
  }

  calculate() {
    let value = '';
  }

}
