window.onload = function() {

  d3.queue()
    .defer(d3.json, 'buurten.topojson')
    .await(makeAmsterdam);


    var margin = { top: 10, right: 10, bottom: 10, left: 10 }
    var h = 700 - margin.top - margin.bottom
    var w = 900 - margin.left - margin.right


    var color = d3.scaleOrdinal(d3.schemeCategory10);


    function makeAmsterdam(error, data) {
      if (error) throw error;

        console.log(data);

      var stadsdelen = topojson.feature(data, data.objects.buurten).features;

      console.log(stadsdelen)

      // svg for map
      var svg = d3.select('#map')
        .append('svg')
        .attr('height', h + margin.top + margin.bottom)
        .attr('width', w + margin.left + margin.right)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var projection = d3.geoMercator()
                         .center([4.9, 52.35])
                         .translate([w/2, h/2])
                         .scale(115500)

      var path = d3.geoPath()
                   .projection(projection)


      svg.selectAll('.stadsdelen')
        .data(stadsdelen)
        .enter().append('path')
        .attr('class', 'stadsdelen')
        .attr('d', path)
        .style('fill', function(d, i) {return color(i) })
        .on('mouseover', function(d) {
          d3.select(this)
            .attr('opacity', 0.5)


        })
        .on('mouseout', function(d) {
          d3.select(this)
            .attr('opacity', 100)
        })






    }

}
