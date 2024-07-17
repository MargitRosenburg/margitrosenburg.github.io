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
    name:        "Die Macht der Autorenschaft",
    type:        "Wissenschaftsplakat & Studie",
    categories:  ["Wissenschaftskommunikation"],
    description: "",
    image:       "img/WissPlakat.png"
  },
  {
    name:        "BODIUM - DER BODENDINGS",
    type:        "TEST SUBCATEGORY!",
    categories:  ["Wissenschaftskommunikation"],
    description: "Kern dieser Arbeit ... mit dem Ziel ... erfolgreich durchgeführt ... anschaulich präsentiert ... toll!",
    image:       "img/UIDesign.png"
  },
  {
    name:        "Datenvisualisierung",
    type:        "Javascript Charts",
    categories:  ["Datenvisualisierung"],
    description: "Kern dieser Arbeit ... mit dem Ziel ... erfolgreich ... anschaulich ... usw",
    image:       "img/Datenvis.png"
  },
  {
    name:        "Wolle? Rose? Kaufen?",
    type:        "Prototyping WebApp",
    categories:  ["UI/UX Design"],
    description: "Kern dieser Arbeit ... mit dem Ziel ... "
    //image:       "img/Plakat.jpg"
  },
  {
    name:        "Interieur",
    type:        "2D/3D",
    categories:  ["Illustration"],
    description: "Kern dieser Arbeit ... ",
    image:       "img/Illustration.png"
  },
  {
    name:        "CrayX - Exoskelett",
    type:        "Spracharme Kurzanleitung (Print & WebApp)",
    categories:  ["Technische Kommunikation"],
    description: "...",
    image:       "img/ExoAnleitung.png"
  },
  {
    name:        "Techniklexikon",
    type:        "Layout & Visualisierung",
    categories:  ["Technische Kommunikation"],
    description: "...",
    image:       "img/TechnikLexikon.png"
  },
  {
    name:        "Binnenräume & Schriftplakat",
    type:        "Makro- & Mikrotypografie",
    categories:  ["Typografie"],
    description: "...",
    image:       "img/Typografie.png"
  },
  {
    name:        "Monogramm & Visitenkarten",
    type:        "Mockup",
    categories:  ["Logodesign"],
    description: "...",
    image:       "img/LogoDesign.png"
  },
  {
    name:        "Wartungsarbeiten",
    type:        "Podcast-Produktion & Webauftritt",
    categories:  ["Social Media"],
    description: "...",
    image:       "img/SocialMedia.png"
  },
  {
    name:        "Hanfgenuss",
    type:        "Logo & Verpackung",
    categories:  ["Corporate Design"],
    description: "...",
    image:       "img/CorporateDesign.png"
  }
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

//---





// override some template stuff (doesn't work with VoronoiTreemap)
/*
series.rectangles.template.setAll({
  cornerRadiusTL: 10,
  cornerRadiusTR: 10,
  cornerRadiusBL: 10,
  cornerRadiusBR: 10
});

// VoronoiTreemap
series.polygons.template.setAll({
  strokeWidth: 5,
  strokeRadius:10
});
*/

// Custom Tooltip text
//series.nodes.template.set("tooltipText", "[bold]{name}[/]");
//series.labels.template.set("html", '<img src="img/Plakat.jpg"/>');


// set the data to the series object
series.data.setAll([data]);



series.set(
  "tooltip",
  am5.Tooltip.new(root, {
    forceHidden: true,
  })
);


function getImages(dataContext) {
  
  if(!dataContext)
    dataContext = series.dataItems[0].dataContext;
  
  const images = [];
  !dataContext.image || images.push(dataContext.image);

  if(dataContext.children) {
    for(const child of dataContext.children) {
      images.push(...getImages(child));
    }
  }

  return images;
}

function getRandomImage(dataContext) {
  const images = getImages(dataContext);
  const i      = Math.floor(Math.random() * images.length );
  return images[i];
}

series.labels.each(function(label) {
  label.adapters.add("html", function (html, label) {
    
    const dataContext = label.parent.dataItem.dataContext;
    if(dataContext.name == rootName)
      return html;

    let className = "lbl";
    if(dataContext.children)
      className += " parent";
    else
      className += " child";

    return '<div class="' + className + '" style="background:url(' + getRandomImage(dataContext) + ') no-repeat center"></div>';

  });

  //label.set("html", '<div class="labelContent" style="background:url(\'{image}\') no-repeat center"></div>');
  label.set("width", am5.percent(100));
  label.set("height", am5.percent(100));
});

// set the default active item (select root to be active to show its children)
series.set("selectedDataItem", series.dataItems[0]);

// breadcrumbs
container.children.moveValue(
  am5hierarchy.BreadcrumbBar.new(root, {
    series: series,
    isMeasured:  true,
  }), 0
);

// display toolTip without mouseover
//series.nodes.getIndex(1).showTooltip();

// Make stuff animate on load
series.appear(1000, 300);
