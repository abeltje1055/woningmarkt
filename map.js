window.onload = function() {

  d3.queue()
    .defer(d3.json, 'buurten.topojson')
    .defer(d3.json, 'info.json')
    .await(makeAmsterdam);


  var margin = { top: 10, right: 10, bottom: 10, left: 10 }
  var h = 700 - margin.top - margin.bottom
  var w = 800 - margin.left - margin.right


  var color = d3.scaleOrdinal(d3.schemeCategory10);


  function makeAmsterdam(error, data, info) {
    if (error) throw error;

      console.log(data);

    var stadsdelen = topojson.feature(data, data.objects.buurten).features;

    transDict = {}
    prijsDict = {}
    bewDict = {}
    verkochtDict = {}
    info.forEach(function(d) {return transDict[d.Stadsdeel] = +d.Transprijs})
    info.forEach(function(d) {return prijsDict[d.Stadsdeel] = +d.Prijsm2})
    info.forEach(function(d) {return bewDict[d.Stadsdeel] = +d.Bewoners})
    info.forEach(function(d) {return verkochtDict[d.Stadsdeel] = +d.Verkocht})

    console.log(bewDict)

    console.log(stadsdelen)
    console.log(info)

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
      .on('mouseover', mouseover)
      .on('mouseout', function(d) {
        d3.select(this)
          .attr('opacity', 100)
        d3.select('#tip').classed('hidden', true)
      })
      .on('mousemove', mousemove)

      function mouseover(d) {
        d3.select(this)
          .attr('opacity', 0.5)
          console.log(d)
          if(d.properties.Stadsdeel == "Westpoort") {
            document.getElementById('tip').innerHTML = "<strong>Wijk: </strong><span class='tiptext'>"
            + d.properties.Stadsdeel + "<br>Cijfers zijn onderverdeeld in de <br> stadsdelen West en Nieuw-West</span>"
          var xPos = parseFloat(d3.event.pageX) - 100;
          var yPos = parseFloat(d3.event.pageY) - 80;
          d3.select('#tip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
          d3.select('#tip').classed('hidden', false)
          } else {
          document.getElementById('tip').innerHTML = "<strong>Wijk: \
    </strong><span class='tiptext'>" + d.properties.Stadsdeel +  "</span><br>" + "<strong>Transactieprijs Q1 2018 (mediaan): </strong> \
    <span class='tiptext'>" + transDict[d.properties.Stadsdeel] + '</span><br> \
    ' + "<strong>Prijs m2 prijs Q1 2018 (mediaan): </strong><span class='tiptext'>" + prijsDict[d.properties.Stadsdeel] +
    '</span><br>' + "<strong>Aantal bewoners 1 januari 2018: </strong><span class='tiptext'>" + bewDict[d.properties.Stadsdeel] + "</span><br>" +
    "<strong>Aantal verkochte woningen Q1 2018*: </strong><span class='tiptext'>" + verkochtDict[d.properties.Stadsdeel] + "</span>"

      var xPos = parseFloat(d3.event.pageX) - 120;
      var yPos = parseFloat(d3.event.pageY) - 110;
      d3.select('#tip')
        .style('left', xPos + 'px')
        .style('top', yPos + 'px')
        d3.select('#tip').classed('hidden', false)
      }
    }

    function mousemove(d) {
      d3.select(this)
      if(d.properties.Stadsdeel == "Westpoort") {
        var xPos = parseFloat(d3.event.pageX) - 100;
        var yPos = parseFloat(d3.event.pageY) - 80;
        d3.select('#tip')
          .style('left', xPos + 'px')
          .style('top', yPos + 'px')
        d3.select('#tip').classed('hidden', false)
      } else {
      var xPos = parseFloat(d3.event.pageX) - 120;
      var yPos = parseFloat(d3.event.pageY) - 110;
      d3.select('#tip')
        .style('left', xPos + 'px')
        .style('top', yPos + 'px')
      d3.select('#tip').classed('hidden', false)
      }
    }

    height = 500
    width = 500
    radius = Math.min(width, height) / 2
    d3.select('#pie').append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('radius', radius)
      .append('g')
      .attr('transform', 'translate('+ width / 2 + ',' + height / 2 + ')')


    color = d3.scaleOrdinal(['#98abc5', '#6b486b', '#a05d56'])

    var pie = d3.pie()
      .sort(null)
      .value(function(d) {return d.Amsterdam})

    var path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    var label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    d3.csv('pie.csv', function(d) {
      d.Amsterdam = +d.Amsterdam;
      return d;

      var arc = g.selectAll('.arc')
        .data(pie(data))
        .enter()
          .attr('class', 'arc')
      arc.append('path')
         .attr('d', path)
         .attr('fill', function(d) {return d.Deel})

      arc.append('text')
         .attr("transform", function(d) {return "translate(" + label.centroid(d) + ')'; })
         .attr('dy', "0.35em")
         .text(function(d) {console.log(d.Deel)})


    })




  }

}
