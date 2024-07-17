// CONFIGURATION

const rootName = "Portfolio";

// ITEMS

/*
{
  name:        "name of the product",
  type:        "type of work",
  categories:  ["category1", "category2" , "..."],
  description: "some more text",
  image:      "img/Plakat.jpg"
}
*/

const items = [
  {
    categories:      ["Kommunikation"],
    type:            "Wissenschaftliche Kommunikation",
    name:            "Wissenschaftsplakat & Studie",
    description:     "",
    image:           "img/WissPlakat.png",
    backgroundColor: am5.Color.fromString("#c1d0ce")
  },
  {
    categories:  ["Webentwicklung"],
    type:        "UI-Design",
    name:        "Prototyping für Web-App",
    description: "Kern dieser Arbeit ... mit dem Ziel ... erfolgreich durchgeführt ... anschaulich präsentiert ... toll!",
    image:       "img/UIDesign.png",
    backgroundColor: am5.Color.fromString("#f7f7f7")
  },
  {
    categories:  ["Visualisierung", "Webentwicklung"],
    type:        "Datenvisualisierung",
    name:        "Javascript Charts und Animationen",
    description: "Kern dieser Arbeit ... mit dem Ziel ... erfolgreich ... anschaulich ... usw",
    image:       "img/Datenvis.png",
    backgroundColor: am5.Color.fromString("#5a407a")
  },
  {
    categories:  ["Visualisierung"],
    type:        "Illustration",
    name:        "2D/3D Interieur",
    description: "Kern dieser Arbeit ... ",
    image:       "img/Illustration.png",
    backgroundColor: am5.Color.fromString("#92ad90")
  },
  {
    categories:  ["Kommunikation", "Webentwicklung", "Print"],
    type:        "Technische Kommunikation",
    name:        "Spracharme Kurzanleitung Print & Web-App",
    description: "...",
    image:       "img/ExoAnleitung.png",
    backgroundColor: am5.Color.fromString("#729ba6")
  },
  {
    categories:  ["Kommunikation", "Print"],
    type:        "Technische Kommunikation",
    name:        "Techniklexikon: Layout & Visualisierung",
    description: "...",
    image:       "img/TechnikLexikon.png",
    backgroundColor: am5.Color.fromString("#fce0a2")
  },
  {
    categories:  ["Visualisierung"],
    type:        "Typografie",
    name:        "Binnenräume & Specimen Poster",
    description: "...",
    image:       "img/Typografie.png",
    backgroundColor: am5.Color.fromString("#e9605d")
  },
  {
    categories:  ["Print"],
    type:        "Logo-Design",
    name:        "Monogramm & Visitenkarten",
    description: "...",
    image:       "img/LogoDesign.png",
    backgroundColor: am5.Color.fromString("#e8e8e8")
  },
  {
    categories:  ["Kommunikation", "Webentwicklung"],
    type:        "Social Media ",
    name:        "Podcast-Produktion & Webauftritt",
    description: "...",
    image:       "img/SocialMedia.png",
    backgroundColor: am5.Color.fromString("#70a6b2")
  },
];

// END CONFIGURATION



// create a hierarchical categories object from our items
// since we change the type of categories later to array we need to use "let"!
let categories = {};

items.forEach (item => {
  item.value = 1;
  item.categories.forEach((categoryName, i) => {
    if(!categories.hasOwnProperty(categoryName)){
      categories[categoryName] = {
        name:     categoryName,
        children: {}
      };
    }
    if(item.hasOwnProperty("type")) {
      if(!categories[categoryName].children.hasOwnProperty(item.type)){
        categories[categoryName].children[item.type] = {
          name:     item.type,
          children: []
        };
      }
      categories[categoryName].children[item.type].children.push(item);
    }
    else {
      categories[categoryName].children[item.name] = item;
    }
  })
});

categories = Object.values(categories); // <-- there! you see? now it is an array. (just for convenience to be able to use forEach)


// generate amCharts data object from categories
const data = {
  name:     rootName,
  children: []
};

categories.forEach(category => {

  category.children = Object.values(category.children); // again. changing object into array.

  // do the magic: 
  // put an item in an extra category if there are multiple items in the same level 
  // this way we're able to see the details only on click
  category.children.forEach(type => {
    if(type.hasOwnProperty("children")) {
      if(type.children.length > 1) {
        type.children.forEach((item,index) => {
          type.children[index] = {
            name:     item.name,
            children: [item]
          }
        });
      } else {
        // ToDo: customize this behaviour?
        type.name += ": " + type.children[0].name;
        //type.children[0].name = type.name + ": " + type.children[0].name;
      }
    }
    else {
      type.children = [{ ...type }];
      delete type.value;
    }
  });

  // another magic trick: if there is only one item in the child category -> move its children up so we spare an extra click
  if(category.children.length == 1) {
    category.name    += ": " + category.children[0].name.split(":")[0];
    category.children = category.children[0].children;
  }

  data.children.push(category);
});



// CORE STUFF (no need to touch)

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
const root = am5.Root.new("chartdiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create wrapper container
const container = root.container.children.push(am5.Container.new(root, {
  width:  am5.percent(100),
  height: am5.percent(100),
  layout: root.verticalLayout
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
const series = container.children.push(
  am5hierarchy.Treemap.new(
    root, 
    {
      singleBranchOnly: true,
      downDepth:        1,
      upDepth:         -1,
      topDepth:        -1,
      initialDepth:     1,
      valueField:      "value",
      categoryField:   "name",
      childDataField:  "children",
      nodePaddingOuter: 10,
      nodePaddingInner: 0
    }
  )
);


// set the data to the series object
series.data.setAll([data]);


// hide tooltips
series.set(
  "tooltip",
  am5.Tooltip.new(root, {
    forceHidden: true,
  })
);


// custom functions
function getValues(propName, dataContext) {
  
  if(!dataContext)
    dataContext = series.dataItems[0].dataContext;
  
  const values = [];
  !dataContext[propName] || values.push(dataContext[propName]);

  if(dataContext.children) {
    for(const child of dataContext.children) {
      values.push(...getValues(propName, child));
    }
  }

  return values;
}

function getRandomValue(propName, dataContext) {
  const values = getValues(propName, dataContext);
  const i      = Math.floor(Math.random() * values.length );
  return values[i];
}

function getLabelHTML(dataContext, uid)
{
  let className = "lbl";
  if(dataContext.children)
    className += " parent";
  else
    className += " child";
  
  let bgColor = getRandomValue("backgroundColor", dataContext);
  let image   = getRandomValue("image", dataContext);
  let styles  = [];
  let style   = "";

  if(bgColor)
    styles.push("background-color: " + bgColor);

  if(image)
    styles.push('background-image:url(' + image + ')');
  
  if(styles.length > 0)
    style = ' style="' + styles.join(";") + '"';

  const name = image ? '' : dataContext.name;
  return '<div id="lbl_' + uid + '" class="' + className + '"' + style + '>' + name + '</div>';
}
//---

// set the labels to be the html content of each node
series.labels.each(function(label) {
  
  if(label.parent.dataItem.dataContext.children)
    return;

  label.set("html", getLabelHTML(
    label.parent.dataItem.dataContext, 
    label.parent.dataItem.uid
  ));

  label.set("width", am5.percent(100));
  label.set("height", am5.percent(100));
});



// set the default active item (select root to be active to show its children)
series.set("selectedDataItem", series.dataItems[0]);


// breadcrumbs
const breadCrumbs = container.children.unshift(
  am5hierarchy.BreadcrumbBar.new(root, {
    series: series
  })
);


// Make stuff animate on load
series.appear(1000, 300);


//series.events.on("dataitemselected", e => {
//  
//  const node        = e.target;
//  const dataContext = e.dataItem.dataContext;
//
//  if(dataContext.name == rootName) {
//    document.querySelectorAll(".lbl").forEach(elm => {
//      elm.classList.remove("hidden");
//    });
//    return;
//  }
//
//  document.querySelectorAll(".lbl").forEach(elm => {
//    elm.classList.add("hidden");
//  });
//
//  if(dataContext.children) {
//    e.dataItem.get("children").forEach(child => {
//      document.getElementById('lbl_' + child.uid).classList.remove('hidden');
//    });
//  }
//  
//});