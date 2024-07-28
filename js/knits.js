
const rootName = "knits";

// ITEMS
/*
{
  nodeName:    "Name des Knoten",
  categories:  ["category1", "category2" , "..."],
  image:       "img/Plakat.jpg"
}
*/

const data = {
  "nodeName": "knits",
  "children": [
    {
      "nodeName": "body",
      "children": [
      {
        "nodeName": "jumpers",
        "image": "img/jumpers.jpg",
        "value": 5
      },
      {
        "nodeName": "cardigans",
        "image": "img/cardigans.jpg",
        "value": 6
      }]    
    },
    {
      "nodeName": "accessories",
      "children": [
      {
        "nodeName": "hats",
        "image": "img/hat",
        "value": 8
      },
      {
        "nodeName": "shawls",
        "image": "img/corvid",
        "value": 8
      },
      {
        "nodeName": "hands",
        "image": "img/hands",
        "value": 4
      },
      {
        "nodeName": "socks",
        "image": "img/socks",
        "value": 12
      }]
    }
  ]        
}

// here starts the main part...

am5.ready(function() {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element

var root = am5.Root.new("chartdiv");


// set the theme
root.setThemes([
  am5themes_Dark.new(root)
]);


// Create wrapper container
// one container can hold multiple children-charts
// const container = root.container.children.push(
//   am5.Container.new(root, {
//     width: am5.percent(100),
//     height: am5.percent(100),
//     layout: root.verticalLayout
//   })
// );

// above is the short code for two seperate actions:
var treemapChart = am5.Container.new(root, {});
root.container.children.push(treemapChart);

var treemapSeries = treemapChart.series.push(am5hierarchy.Treemap.new(root,{}));
treemapSeries.set("valueField", "value");
treemapSeries.set("categoryField", "category");

treemapSeries.data.setAll([data]);



// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
// const series = root.container.children.push(
//   am5hierarchy.Treemap.new(root, {
//     singleBranchOnly: true,
//     downDepth:        1,            // the number of child elemets to open when clicking on a node
//     upDepth:         -1,
//     topDepth:        -1,
//     initialDepth:     1,
//     categoryField:    "nodeName",   // A field in data that holds string-based identificator for node.
//     valueField:       "value",      // A field in data that holds numeric value for the node.
//     childDataField:   "children",   // A field in data that holds an array of child node data.
//     userData:         "image",      // A storage for any custom user data that needs to be associated with the element.
//     nodePaddingOuter: 10,
//     nodePaddingInner: 0
//   })
// );

// Generate and set data:
// It's a good practice to make sure that setting data happens as late into code as possible. 
// Once you set data, all related objects are created, 
// so any configuration settings applied afterwards might not carry over.
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data

// data in die series packen
// series.data.setAll([data]);
// start-node setzen 
// series.set("selectedDataItem", series.dataItems[0]);


// breadcrumb navigation
const breadCrumbs = container.children.unshift(
  am5hierarchy.BreadcrumbBar.new(root, {
    series: treemapSeries
  })
);

// container.children.unshift(
//   am5hierarchy.BreadcrumbBar.new(root, {
//     series: series
//   })
// );




}); // end am5.ready()