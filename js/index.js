// CONFIGURATION

const rootName = "Portfolio";


// CATEGORIES

// since we change the type of categories later to array we need to use "let"!
let categories = {
  "Kommunikation": {
    backgroundColor: am5.color("#fce0a2"), // gelb
    children: {
      "Wissenschaftliche Kommunikation":  {
        backgroundColor: am5.color("#fce0a2") // gelb
      },
      "Technische Kommunikation": {
        backgroundColor: am5.color("#fce0a2") // gelb
      },
      "Social Media": {
        backgroundColor: am5.color("#fce0a2") // gelb
      }
    }
  },
  "Webentwicklung": {
    backgroundColor: am5.color("#A3A3A3"), // grau
    children: {
      "Technische Kommunikation": {
        backgroundColor: am5.color("#A3A3A3") // grau
      },
      "Social Media": {
        backgroundColor: am5.color("#A3A3A3") // grau
      },
      "Datenvisualisierung": {
        backgroundColor: am5.color("#A3A3A3") // grau
      },
      "UI-Design": {
        backgroundColor: am5.color("#A3A3A3") // grau
      }
    },
  },  
  "Visualisierung": {
    backgroundColor: am5.color("#91AD8F"), // grün
    children: {
      "Illustration": {
        backgroundColor: am5.color("#91AD8F") // grün
      },
      "Datenvisualisierung": {
        backgroundColor: am5.color("#91AD8F") // grün
      },
      "Typografie": {
        backgroundColor: am5.color("#91AD8F") // grün
      }
    }
  },
  "Print": {
    backgroundColor: am5.color("#FC8888"), // rot
    children: {
      "Technische Kommunikation": {
        backgroundColor: am5.color("#FC8888") // rot
      },
      "Logo-Design": {
        backgroundColor: am5.color("#FC8888") // rot
      }
    }
  }
};



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
    image:           "img/WissPlakat.png",
    backgroundColor: am5.color("#c1d0ce"),
    isParentcolor:   "Kommunikation"
  },
  {
    categories:  ["Webentwicklung"],
    type:        "UI-Design",
    name:        "Prototyping für Web-App",
    image:       "img/UIDesign.png",
    backgroundColor: am5.color("#f7f7f7")
  },
  {
    categories:  ["Kommunikation", "Webentwicklung"],
    type:        "Social Media",
    name:        "Podcast-Produktion & Webauftritt",
    image:       "img/SocialMedia.png",
    backgroundColor: am5.color("#70a6b2")
  },
  {
    categories:  ["Visualisierung"],
    type:        "Illustration",
    name:        "2D/3D Interieur",
    image:       "img/Illustration.png",
    backgroundColor: am5.color("#92ad90")
  },
  {
    categories:  ["Kommunikation", "Webentwicklung", "Print"],
    type:        "Technische Kommunikation",
    name:        "Spracharme Kurzanleitung Print & Web-App",
    image:       "img/ExoAnleitung.png",
    backgroundColor: am5.color("#729ba6")
  },
  {
    categories:  ["Visualisierung", "Webentwicklung"],
    type:        "Datenvisualisierung",
    name:        "Javascript Charts und Animationen",
    image:       "img/Datenvis.png",
    backgroundColor: am5.color("#5a407a")
  },
  {
    categories:  ["Kommunikation", "Print"],
    type:        "Technische Kommunikation",
    name:        "Techniklexikon: Layout & Visualisierung",
    image:       "img/TechnikLexikon.png",
    backgroundColor: am5.color("#fce0a2")
  },
  {
    categories:  ["Visualisierung"],
    type:        "Typografie",
    name:        "Binnenräume & Specimen Poster",
    image:       "img/Typografie.png",
    backgroundColor: am5.color("#e9605d")
  },
  {
    categories:  ["Print"],
    type:        "Logo-Design",
    name:        "Monogramm & Visitenkarten",
    image:       "img/LogoDesign.png",
    backgroundColor: am5.color("#e8e8e8")
  }
];

// END CONFIGURATION





// create a hierarchical categories object from our items
items.forEach (item => {
  
  item.value = 1;
  item.categories.forEach((categoryName, i) => {

    if(!categories.hasOwnProperty(categoryName)){
      categories[categoryName] = {
        name:     categoryName,
        children: {}
      };
    }
    else {

      if(!categories[categoryName].hasOwnProperty("name"))
        categories[categoryName].name = categoryName;

      if(!categories[categoryName].hasOwnProperty("children"))
        categories[categoryName].children = {};
    }

    if(item.hasOwnProperty("type")) {
      if(!categories[categoryName].children.hasOwnProperty(item.type)){
        categories[categoryName].children[item.type] = {
          name:     item.type,
          children: {}
        };
      }
      else {
        if(!categories[categoryName].children[item.type].hasOwnProperty("name"))
          categories[categoryName].children[item.type].name = item.type;

        if(!categories[categoryName].children[item.type].hasOwnProperty("children"))
          categories[categoryName].children[item.type].children = {};
      }
      categories[categoryName].children[item.type].children[item.name] = item;
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

  if(category.hasOwnProperty("children")) {

    category.children = Object.values(category.children); // again. changing object into array.

    // do the magic: 
    // put an item in an extra category if there are multiple items in the same level 
    // this way we're able to see the details only on click
    category.children.forEach(type => {
      if(type.hasOwnProperty("children")) {

        type.children = Object.values(type.children);

        if(type.children.length > 1) {
          type.children.forEach((item,index) => {
            type.children[index] = {
              name:     item.name,
              children: [item]
            }
          });
        } else {
          // ToDo: customize this behaviour?
          // type.name += ": " + type.children[0].name;
          //type.children[0].name = type.name + ": " + type.children[0].name;
          // type.name = type.children[0].name; 
          type.name = type.name;
          // Example: UI-Design: Prototyping für Web-App
          // Example: type.name = UI-Design | type.children[0].name = Prototyping für Web-App
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
  }
  data.children.push(category);
});



// custom functions

function getValues(propName, dataContext) {
  
  if(!dataContext)
    dataContext = series.dataItems[0].dataContext;
  
  const values = [];
  if(dataContext.hasOwnProperty(propName))
     values.push(dataContext[propName]);

  if(dataContext.hasOwnProperty("children")) {
    for(const child of dataContext.children) {
      values.push(...getValues(propName, child));
    }
  }

  return values;
}


function getValue(propName, dataContext, defaultValue, recurse = true, random = true) {
  
  if(dataContext.hasOwnProperty(propName))
    return dataContext[propName];

  const rndPropName = "random_" + propName;

  if(!dataContext.hasOwnProperty(rndPropName)) {
    if(typeof defaultValue !== "undefined")
      dataContext[rndPropName] = defaultValue;
    
    if(recurse) {
      const values = getValues(propName, dataContext);
      let i = 0;
      if(random)
        i = Math.floor(Math.random() * values.length);
      if(values.length > 0)
        dataContext[rndPropName] = values[i];
    }
  }
  return dataContext[rndPropName];
}


function getLabelHTML(dataContext, uid)
{
  let className = "lbl";
  if(dataContext.hasOwnProperty("children"))
    className += " parent";
  else
    className += " child";
  
  let bgColor = getValue("backgroundColor", dataContext);
  let image   = getValue("image", dataContext);
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


function setTemplateSettings(item, settingName, settingTargetName) {
  const value = getValue(settingName, item);
  
  if(!settingTargetName)
    settingTargetName = settingName;

  if(value) {
    if(!item.hasOwnProperty("templateSettings"))
      item.templateSettings = {};
    item.templateSettings[settingTargetName]= value;
  }
  if(item.hasOwnProperty("children")) {
    item.children.forEach(child => {
      setTemplateSettings(child, settingName,settingTargetName);
    });
  }
}

//---



// set backgroundcolors (templateSettings are kinda useless since templateField is not working on rectangels/treemaps)
data.children.forEach(child => {
  setTemplateSettings(child, "backgroundColor", "fill");
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
      topDepth:         0,
      initialDepth:     1,
      valueField:      "value",
      categoryField:   "name",
      childDataField:  "children",
      nodePaddingOuter: 10,
      nodePaddingInner: 0
    }
  )
);


/*
series.rectangles.template.setAll({
  templateField: "templateSettings" // not working!
});
*/

/* THIS IS SOME BULLSHIT! (templateField is not working on rectangles/treemap) */
// adapter makes fill accessable like: fill = function(fill, target)
series.rectangles.template.adapters.add(
  "fill", 
  function(fill, target)
  {
    return getValue("backgroundColor", target.dataItem.dataContext, fill);
  }
);


/*
series.polygons.template.setAll({
  templateField: "templateSettings"
});
*/


// set the data to the series object
series.data.setAll([data]);


// hide tooltips
series.set(
  "tooltip",
  am5.Tooltip.new(root, {
    forceHidden: true,
  })
);


// set the labels to be the html content of each node
series.labels.each(function(label) {

  label.set("fontSize", 24);

  const bgColor = getValue("backgroundColor", label.parent.dataItem.dataContext);
  
  if(bgColor)
  {
    const colorValue = (bgColor.r * 0.299 + bgColor.g * 0.587 + bgColor.b * 0.114) > 150 ? 0 : 255;
    label.set("fill", am5.Color.fromRGB(colorValue,colorValue,colorValue));
  }

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
series.appear(1000, 300).then(result => {
  
});


series.events.on("dataitemselected", e => {
  
  const node        = e.target;
  const dataContext = e.dataItem.dataContext;
  
  //console.log(e.dataItem.get("rectangle"));

  //if(dataContext.name == rootName) {
  //  document.querySelectorAll(".lbl").forEach(elm => {
  //    elm.classList.remove("hidden");
  //  });
  //  return;
  //}
  //
  //document.querySelectorAll(".lbl").forEach(elm => {
  //  elm.classList.add("hidden");
  //});
  //
  //if(dataContext.children) {
  //  e.dataItem.get("children").forEach(child => {
  //    document.getElementById('lbl_' + child.uid).classList.remove('hidden');
  //  });
  //}
  
});