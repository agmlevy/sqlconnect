console.log('Hello world');
var _ = require("underscore");
var d3 = require("d3");
var topoj = require("topojson");
var sql = require("mssql");
var parse = require("wellknown");
var ogr = require("ogr2ogr");
var wkt = require("terraformer-wkt-parser");
var wkx = require("wkx");
//var stringify = parse().stringify()
//var doc = require("jsdom").jsdom();
var selectAll = "select  ogr_fid as fid, ogr_geometry.STAsText() as geom, sovereignt as sovereign from testdb.dbo.countries_10m";
var dbConfig = {
    driver: 'msnodesqlv8',
    server: "agm",
    database: "testDB",
    parseJSON: true,
    //user: "bonehead77",
    //password: "bonehead77",
    //port: 1433
    options: {
        trustedConnection: true
    }
};

var features = {
    "type": "Feature",
    "geometry": null,
    "properties": {
        "id": null,
        "admin": null
    }
}
var featureCollection = {
    type: "FeatureCollection",
    features: []
};

var width = 960,
    height = 500;

//var projection = d3.geo.mercator()
//    .center([0, 5])
//    .scale(900)
//    .rotate([-180, 0]);

//var svg = d3.select(doc.body).append("svg")
//    .attr("width", width)
//    .attr("height", height);

//var path = d3.geo.path()
//    .projection(projection);

//var g = svg.append("g");

function getEmp() {
    var conn = new sql.Connection(dbConfig);
    var req = new sql.Request(conn);

    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        req.query(selectAll, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            else {
                //var myid = _.chain(recordset).map(function (i) {
                //    return i.id
                //}).value()
                //features.properties.id = myid

                //console.log( recordset[0])
                for (i = 0; i < recordset.length; i++) {
                    var wktGeom = recordset[i].geom
                    var sov = recordset[i].sovereign
                    var id = recordset[i].fid

                    if (typeof wktGeom == 'string') {
                        //console.log(wktGeom)
                        var toGeoJSON = parse(wktGeom);
                        features.properties.id = id;
                        features.properties.admin = sov;
                        features.geometry = toGeoJSON;
                        featureCollection.features.push(features)
                    }
                    else if (typeof wktGeom == 'object') {
                        var stringJSON = wktGeom.toString()
                        var geoJSON = parse(stringJSON)

                        if (geoJSON != null) {
                            //console.log(toGeoJSON)
                            features.properties.id = id;
                            features.properties.admin = sov;
                            features.geometry = toGeoJSON;
                            featureCollection.features.push(features)
                        }
                    }
                    console.log(featureCollection)
                }
                //var topo = topoj.topology({ collection: featureCollection })
                //var topoData = topo.objects.collection.geometries
                //console.log(featureCollection.features.properties.id)
                //console.log(topo.objects.collection.geometries)
                //console.log(topo.objects.collection.geometries)
            }
            conn.close();
        });
    })
}

getEmp();