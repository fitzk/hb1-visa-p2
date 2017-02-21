import React, { Component } from "react";
import * as d3 from "d3";
import styled from "styled-components";

const Text = styled.text`
	font-family: sans-serif;
	fill: white;
	font-size: ${ props => props.r / 100 }rem;
	word-break: normal;
`;

const Polygon = styled.polygon`
	fill: ${ props => props.fill };
	&:hover {
			opacity: 0.5;
	};
	margin: 25px;
`;

export class Hexagon extends Component {
	constructor(props){
		super(props);
		this.state = {
			x: 0,
			y: 0,
			transform: "",
			dragging: false,
		}
	}
	componentDidMount() {
		this.setXY(this.props.x, this.props.y);
	}
	// draws hexagon given starting coordinates
	// and a radius
  getCoordinates(x, y, r) {
    let n = 6;
    let path = ""
    for(let i = 0; i < n; i++){
    	if(i !== 0) path = path.concat(" ")
      path = path.concat(`${ (x + r * Math.cos(2 * Math.PI * i / n))
																 .toFixed(2) },${ (y + r * Math.sin(2 * Math.PI * i / n))
																	 									.toFixed(2) } `);
    }
    return path;
  }

	setPageXY(e) {
		e.preventDefault();
		if(this.state.dragging) {
			this.setXY(e.pageX, e.pageY);
		}
	}

	setXY(x, y) {
		this.setState({
			x: x,
			y: y
		});
	}

	drawText(x, y, r, offset, word, index) {

		return <Text key={ "text-" + index }
								 textAnchor="middle"
								 x={ x }
								 r={ r }
								 transform={ this.state.transform }
								 y={ y + offset }>
								{ word }
							</Text>
	}

	alertXY(e) {
		alert(`hexagon: ${ e.pageX }, ${ e.pageY }`);
	}

	render() {

	 let { r, fill, callback, label } = this.props;
	 let path = this.getCoordinates( this.state.x, this.state.y, r );

	 const x = this.state.x;
	 const y = this.state.y;

	 const _label =  label.map((word, index) => {
		 													let offset = ( index * r / 5);
		 													if(label.length > 4) {
																offset = ( index * r / 5) - r/3;
														 	}
															 return this.drawText(x, y, r, offset, word, index);
														 });

   return <g transform={this.state.transform} onMouseMove = { this.setPageXY.bind(this) }
		 					onMouseUp = { () => { this.setState({ dragging: false }); } }>
		 				<Polygon
							transform={ this.state.transform }
							fill={ fill }
							onClick={ callback }
							onDoubleClick = { (e) => { this.setState({ dragging: false }); this.alertXY(e); } }
						 	onMouseUp = { () => { this.setState({ dragging: false }); } }
						 	onMouseDown =  { () => { this.setState({ dragging: true }); } }
						 	points={ path }/>
							{_label}
					</g>
	}
}
