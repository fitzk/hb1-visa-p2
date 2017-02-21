import * as d3 from 'd3';

/*
 * truncates a company name to
 * wraps if > 10 len and inserts
 * hyphen (-)
 */
const formatLabel = (company, noLCA, salary) => {

	let _company = company.split(" ");
	let stack = [];

	while(_company.length > 0) {
		let word = _company.shift();
		if(word.length > 10) {
			let partA = word.slice(0, 5);
			let partB = word.slice(5, word.length);
			stack.push(partA + "-");
			stack.push(partB);
		} else {
			stack.push(word);
		}
	}
	return [...stack, noLCA, salary];
}

/*
* createDisjointPaths
* @param spiral - string representation of spiral
* @return an array of paths
*/
const createDisjointPaths = spiral => {
	let paths = spiral.split('C').map((subPath, i) => {
		if(i === 0) {
			return subPath;
		}
		let newSubPath = "";
		let points = subPath.split(',').map(str => parseFloat(str)
												.toFixed(2)).slice(0,2);
		let otherPoints = subPath.split(',')
														 .map(str => parseFloat(str).toFixed(2))
														 .slice(3, subPath.length-1).join(',');
		// this is the new path with updated move and curve
		newSubPath = `M${ points[0] },${ points[1] }C${ otherPoints }`;
		return newSubPath;
		});
	return paths;
}

const drawInnerSpiral = () => {}
const drawSpiral = (data, curve) => {

	let angle = d3.scaleLinear().domain([0, 99]).range([0, 360*5]);
	console.log('data[0]: ' + data[0] + "data[1]: " + data[data.length-1])
	let extent = d3.extent(data);
	console.log('extent: ', extent);


	let radius = d3.scaleLog().domain(extent)
      .range([150, 600]);

	let spiral = d3.radialLine()
	.radius(d => radius(d))
	.angle(( d, i ) =>  angle(i))
	.curve(curve)
	return spiral(data)
}

/*
 * stringToInt - helper function
 */
const stringToInt = d => parseInt(d.split(',').join(''));

export { drawSpiral, formatLabel, createDisjointPaths, stringToInt }
