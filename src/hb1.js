import React, { Component } from "react";
import * as d3 from "d3";
import styled, { injectGlobal } from "styled-components";
import { top100 } from "data/json";
import { Hexagon } from "./hexagon";
import { Info } from "./info";
import {
  drawSpiral,
  formatLabel,
  createDisjointPaths,
  stringToInt
} from "./hb1-utils";

injectGlobal`
  body, #app {
    padding: 0;
    margin: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
`;

const InputContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Svg = styled.svg`
  overflow: auto;
  background-color: black;
  padding: 0;
  margin: 0;
`;

const Header = styled.text`
  font-family: sans-serif;
  color: white;
`;

const H3 = styled.h3`
  margin:0;
`;

export default class HB1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      color: "#197278",
      height: 2400,
      width: 1400,
      hexagonRadiusLowerBound: 55,
      hexagonRadiusUpperBound: 120,
      spiralRadiusLowerBound: 0,
      spiralRadiusUpperBoundExtra: 100 // full upper bound is calucated with addition of radius
    }
  }

  componentDidMount() {
    let data = top100.data;
    this.setState({ data: data })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }


  // draw hexagon svg
  drawHexagon({ x, y, r, fill, index, company, salary, noLCA, callback }) {
    const label = formatLabel(company, noLCA, salary);
    return <Hexagon key={ "hexagon-"+index }
                    label={ label }
                    fill={ fill }
                    x={ x }
                    y={ y }
                    callback={ callback }
                    r={ r }/>
  }

  drawHexagons(paths, data, scaleHex) {

    let hexagons = [];
    let c = d3.hsl(this.state.color);

    paths.shift();
    for(let path of paths) {

     let points = path.slice(1, path.length)
                 .split(",")
                 .map(str => parseFloat(str)),
         index = paths.indexOf(path),
         rank = parseInt(data[index].rank),
         x = points[0] + 800,
         y = points[1] + 800,
         className = "hex";

     let numLCA = stringToInt(data[index].number_of_lca);

     let r = scaleHex(numLCA);
     c.h += 0.5;

     let callback = () => {}

     let hex = this.drawHexagon({
       x: x, y: y,
       r:r, fill: c + "",
       index: data[index].rank,
       className: className,
       company: data[index].hb1_visa_sponsor,
       salary: data[index].average_salary,
       noLCA: data[index].number_of_lca,
       callback: callback
     });
     hexagons.push(hex);
    }
    return hexagons;
  }

  drawLayout(data, width, height) {

    let curve = d3.curveCardinal;

    let a = ( d3.min([ parseInt(this.state.width), parseInt(this.state.height) ]) ),
        // pull lca data from set
        points = data.map(d => stringToInt(d.number_of_lca)),
        // get max and min lca
        extent = d3.extent(points),

        // get the full path of the spiral
        path = drawSpiral(points, curve),
        // get sub path
        paths = createDisjointPaths(path),
        // map # of LCA per company -> smaller range
        scaleHexagonRadius = d3.scaleLinear()
                               .domain(extent)
                               .range([ this.state.hexagonRadiusLowerBound,
                                        this.state.hexagonRadiusUpperBound ]);
    return this.drawHexagons(paths, data, scaleHexagonRadius);
  }

  render() {
    return this.state.data.length > 0 ? <Svg
           width="100vw"
           height="180vh">
                        { this.drawLayout(this.state.data) }
          </Svg> : <div>loading...</div>
  }
}
