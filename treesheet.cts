/*
 * Treesheet
 * ---------
 * 
 * This file enables your Cloudstitch app to be injected into 
 * a page as a widget. To do so, simply include cloudstitch.js 
 * in the web page HEAD: 
 * 
 *   <script src="http://cloudstitch.io/release/cloudstitch.js></script>
 * 
 * And then invoke the widget like this:
 *
 *   <div widget="visualizations/shaded-usa-map"></div>
 *
 */

@html shaded-usa-map //apps.cloudstitch.io/visualizations/shaded-usa-map/index.html;
@css relative(map.css);
@js relative(geometry.js);
@js relative(d3.min.js);
@js relative(map.js);
@gsheet shadedUsaMapDatasource http://cloudstitch.io/visualizations/shaded-usa-map/datasource/shadedUsaMapDatasource;

body|*[widget="visualizations/shaded-usa-map"] {"after": "shadedUsaMapWidget_PreInit"} :graft shaded-usa-map|#shaded-usa-map;
