const movieDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movieData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawTreeMap = () => {
    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node["children"];
    }).sum((node) => {
        return node["value"];
    }).sort((node1, node2) => {
        return node2["value"] - node1["value"];
    })

    const createTreeMap = d3.treemap().size([1000, 600]);

    createTreeMap(hierarchy);

    // console.log(hierarchy);

    const movieTiles = hierarchy.leaves();
    let block = canvas.selectAll("g")
                        .data(movieTiles)
                        .enter()
                        .append("g")
                        .attr("transform", (node) => {
                            return "translate(" + node.x0 + "," + node.y0 + ")";
                        } );
    
    block.append("rect")
            .attr("class", "tile")
            .attr("fill", (node) => {
                let category = node.data.category;
                if (category === "Action") {
                    return "orange";
                } else if (category === "Drama") {
                    return "lightgreen";
                } else if (category === "Adventure") {
                    return "lightblue";
                } else if (category === "Family") {
                    return "pink";
                } else if (category === "Animation") {
                    return "yellow";
                } else if (category === "Comedy") {
                    return "red";
                } else if (category === "Biography") {
                    return "purple";
                }
                } )
            .attr("data-name", (node) => {
                return node.data.name;
                } )
            .attr("data-category", (node) => {
                return node.data.category;
                } )
            .attr("data-value", (node) => {
                return node.data.value;
                } )
            .attr("width", (node) => {
                return node.x1 - node.x0;
                } )
            .attr("height", (node) => {
                return node.y1 - node.y0;
                } )
            .on("mouseover", (node) => {
                tooltip.transition()
                        .style("visibility", "visible");

                let revenue = node.data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                tooltip.html("$ " + revenue + "<hr />" + node.data.name);
                tooltip.attr("data-value", node.data.value);
            })
            .on("mouseout", (node) => {
                tooltip.transition()
                        .style("visibility", "hidden");
            })
    
    block.append("text")
            .text((node) => {
                return node.data.name;
            })
            .attr("x", 5)
            .attr("y", 20)

}

d3.json(movieDataUrl).then(
    (data, error) => {
        if (error) {
            console.log(error);
        } else {
            movieData = data;
            console.log(movieData);
            drawTreeMap();
        }
    }
)