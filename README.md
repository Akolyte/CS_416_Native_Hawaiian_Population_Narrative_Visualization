# CS_416_Native_Hawaiian_Population_Narrative_Visualization

This visualizatino was created as the final project for CS416 Data Visualization at UIUC. The link to the actual visualization is [here](https://akolyte.github.io/CS_416_Native_Hawaiian_Population_Narrative_Visualization/). It was created using vanilla JavaScript, D3, and the D3-annotation library. 

Messaging
The message that I am trying to communicate with the narrative visualization is the trajectory of the Native Hawaiian population in Hawai’i over time. I was inspired to do this due to a trip I took recently there. Prior to European contact the native population was massive, was devastated by disease, and then slowly recovered over time. I wanted to communicate those events to others through visualization. 

Narrative Structure
The structure my narrative visualization was designed to follow was the interactive slide show. My narrative visualization follows that structure by having numbered slides, indicating a clear linear order of information to be communicated to the user. The opportunity to “drill-down” and explore in my visualization is filtering the x-axis (years) to different ranges. 

Visual Structure
The visual structure that is used for each scene is a combination of a line chart and a scatterplot. The line chart highlights the overall trend of the data, and the scatterplot highlights the individual data points. 
It helps the viewer transition to other scenes by keeping a distinct visual structure that carries through all the slides. This includes having the same x-axis and y-axis types (year and population respectively), line chart, and scatterplot. Additionally, the color of the data points, annotations, and line chart stays the same (blue, pink, blue respectively) to keep visual consistency. This only changes for the 1850 – 1950 chart, because native Hawaiian population splits into two categories. (Whole and part native Hawaiian) which are denoted as blue and red respectively. 

Scenes
The scenes of my narrative visualization are ranges of years. These ranges are mainly separated by their sources. These sources include models, tables from a primary source, and data from the U.S. 2020 Census. The scenes are ordered by time ranges from least to greatest to keep a narrative structure of following data over time from beginning to end. The scenes are ranges 500 – 1778, 1796 – 1836, 1850 – 1950, 1960 – 2020, and the entire timeline not including 500 – 1778 since those data points came from a model and not from recorded data. 

Annotations
The templates followed for the annotations were d3.annotationCalloutElbow and d3.annotationXYThreshold. 
I chose d3.annotationCalloutElbow because I wanted to point at trends in the scene that could use additional context. In the 1796 – 1836 scene, I wanted to point out a specific change in population between two data points, so I used the template to point it out and add a description to it. In the 1960 – 2020 scene I pointed out a specific data point that was the first to move in the positive direction on the y-axis to point the user to a description which stated why the data points would start to move in that direction. 
I chose d3.annotationXYThreshold because I wanted to show separation between data points, and also have some visual carryover from one scene to another. I accomplished this in the 1850 – 1950 scene by adding a horizontal line across the chart where the last data point left off in the previous chart. I also added a vertical line to separate points that had different data sources. Each had their own description to communicate to the user what the lines were and why they were there. 

Parameters
The parameter of the narrative visualization is year. The states of the visualization are the range of years. Each scene is defined by a different state or range of years. This captures the information into separate sections that make it easier to highlight specific trends or events in the data.  This also allows for a clear ordering that lends itself well to the interactive slideshow narrative structure. 

Triggers
The triggers that connect user actions to changes of state in the narrative visualization are the dropdown menus for Start Year and End Year, and the navigation bar to move between scenes. 
The chart titles communicate what options are available to them for these variables by indicating the default start and end years. This implies that year options will range between these two values.
If either variable is selected from a dropdown, the values in the other variable will be filtered so that any further selections still make sense semantically. An example of this would be selecting a start year, and all end year options being filtered to be greater than that start year. 
A reset button is also included, not only to reset the chart but to also reset the dropdown options as they are filtered after each selection. 
The navigation bar allows the user to navigate between scenes. The options are numbered, to indicate to the user that there is a clear order in which to view scenes. The options are labeled with the year range, so the user understands what range of years each scene presents. 
