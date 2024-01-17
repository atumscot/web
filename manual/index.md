# NPT Manual


## Introduction


Welcome to the Network Planning Tool (NPT) for Scotland, a cutting-edge web application designed for strategic cycle network planning. Funded by Transport Scotland and developed by the University of Leeds in collaboration with Sustrans Scotland. It builds on the functionality of the [Propensity to Cycle Tool](https://www.pct.bike/) for England and Wales, offering a detailed nationwide cycling potential analysis for Scotland, down to the street level ([Lovelace et al. 2017](https://www.jtlu.org/index.php/jtlu/article/view/862)). We invite users to explore its comprehensive features and contribute feedback for continuous improvement.

### NPT Essentials

The NPT is Scotland’s nationwide web-based strategic network planning tool that estimates cycling potential down to the street level.

The NPT includes:

1.  the [map user interface](https://www.npt.scot/), 
2.  a series of open access [data downloads](https://www.npt.scot/data) that can be analysed in GIS software or statistical software, 
3.  the [code base](https://github.com/nptscot/) that can be modified to fix bugs, add new features, and develop new scenarios.

The NPT is an open-source tool, meaning the source code is transparent and in the public domain for others to learn from and build on. The code underlying the project is available to be copied and improved by the community.

The online interface can serve many needs, including gaining insight into the network of routes where cycling potential is highest and quantifying the benefits of cycling uptake. However, we recommend that intermediate and advanced users download data on zones, routes and route networks for in-house analysis.

The NPT allows users to visualise results baseline data and how cycling would change under different scenarios. The journey purposes and scenarios are described in detail below.


## Accessing the NPT 


The easiest way to access the NPT website is hosted at [www.npt.scot](http://www.npt.scot).

### Progressive Web App

The NPT is a Progressive Web App (PWA), which can be installed on many devices, including your smartphone. The App provides the same features as the website. Still, it includes additional benefits such as pining the App to your device’s home screen and full-screen support.

How to install the NPT App

#### Android

1.  Visit [www.npt.scot](http://www.npt.scot) using Google Chrome
2.  Click the “Add NPT to Home screen” and follow the instructions

If the “Add NPT to Home screen” option does not appear, you can also select the “Install app” option from the main chrome menu (…)

#### Windows 10 & 11 and Linux

1.  Visit [www.npt.scot](http://www.npt.scot) using Microsoft Edge or Chrome
2.  In the address bar, click the App install button
3.  Click install

#### iOS

1.  Visit [www.npt.scot](http://www.npt.scot) using Safari
2.  In the bottom menu bar, click the share button (middle button)
3.  Click “Add to Home Screen”
4.  Click “Add”

#### macOS

1.  Visit [www.npt.scot](http://www.npt.scot) using Safari
2.  In the address bar, click the App install button
3.  Click install


## NPT User Interface Guide

The NPT's user interface is intuitive, featuring map controls for easy navigation and layer controls to customize data visibility. Whether you're interested in the baseline cycling data or exploring various "what-if" scenarios like "Go Dutch" or ebike adoption, the tool provides a flexible platform for in-depth analysis.

### Map Controls

![Map controls](/images/map_controls.png)

The map can be navigated using map controls on the top left of the screen.

The NPT provides different basemaps. The example below shows the basemap selection options with the satellite basemap with 3D terrain enabled. You can hide the basemap selection option by clicking the change basemap button again.

![Basemap controls](/images/basemaps.png)

The Anti-alias option enables advanced rendering options that make the map look smoother and clearer. However, performance on low-end devices may be impaired when using anti-aliasing.

### Layer Controls

![Layer Controls](/images/layer_controls.png)

The layer controls on the right side of the map control what information is shown on the map.


## Map Layers

The NPT allows you to view a broad range of data about cycling by manipulating filters to showcase specific data points. This section describes each layer and its features.

### Route Network

The Route Network is the primary layer in the NPT and the only one that is on by default when the tool loads. The route network estimates the number of cyclists on each road. It is designed to emphasise roads with lots of cycling potential and so aid planners in deciding where cycling infrastructure is needed.

The route network provides a range of options and filters to allow you to view different networks based on different journey purposes and assumptions. Whether you're considering daily commutes or leisurely excursions, the Route Network layer adapts to reflect different cycling possibilities and planning assumptions.

<!-- #purpose -->

#### Trip purpose

People have many reasons to travel, and their reasons for travel often change their choice of destinations and routes. Therefore, a cycling network designed for commuters may look very different to a network designed for children to travel to school. The trip purpose drop-down allows you to view different networks based on different trip purposes.

##### All

This is the default view that displays all journey purposes that are part of the NPT (travel to work, travel to school, and other everyday journeys) combined, offering an overview of total cycling potential.

##### Commute

The commute network, as the second option in the travel purpose dropdown list, is based on the 2011 Census travel to work data. Commuters tend to favour radial routes from suburban residential areas into town and city centres where most jobs are concentrated. This layer can help identify the core arterial network.

##### Primary School

The primary school network, as the third option in the travel purpose dropdown list, shows cycling potential for children cycling to primary schools, whether by e-cargo, accompanied by adults, or including as part of 'cycle buses' or travelling independently. It provides insights into the routes that could be taken by children and carers. Recognising these patterns is important for urban planners, enabling them to emphasize and develop infrastructure that prioritises the safety of young people. Schools tend to be located in residential areas, so the resulting primary and secondary networks tend to favour denser orbital routes that could be supported by modal filters and traffic management.

##### Secondary School

The secondary school network is the fourth option in the travel purpose dropdown menu. It offers insights into the networks that could enable young people safe cycling options to get to and from secondary school.

##### Other Everyday

Other Everyday trips include trips for three individual purposes; shopping, to access leisure facilities and personal trips. Each trip purpose is described below, with this network being the combination of these three journey purposes.

Shopping trips account for cycling behaviours of individuals travelling to shops, including for food shopping, providing insights into the most popular routes for these types of trips.

Trips to access leisure facilities captures the cycling patterns of individuals travelling to social hubs, parks, and recreational destinations (e.g. leisure centres, cinemas).

Personal trips captures the cycling patterns of individuals visiting friends and family.

##### What’s missing from the NPT

The NPT does not currently consider recreational cycling. This is more complex to model as cyclists may not have a specific destination in mind.

The NPT currently only considers direct journeys where the whole trip is by bicycle. It does not consider mixed-mode journeys such as cycling to the station and then taking a train to your final destination. This means that the NPT slightly underestimates cycling potential overall and may significantly underestimate cycling potential in specific places (such as around train stations).

<!-- /#purpose -->

<!-- #scenario -->

#### Scenarios

The scenarios drop-down allows you to view different levels of cycling and other information about the road network

##### Baseline 

The baseline scenario represents the current level of cycling. As such, it is intended to show where there is an existing demand for cycling infrastructure.

##### Go Dutch

The Go Dutch scenario imagines a future with a high level of cycling, where people in Scotland are as likely to travel by cycle as people in the Netherlands while accounting for differences in trip distance and hilliness between locations. People in the Netherlands make 28.4% of trips by bicycle, greater than twenty times higher than the figure of 1.2% in Scotland in 2019 ().The Go Dutch scenario scales up the baseline scenario to a Dutch modal share for cycling in Scotland. This is not produced by scaling up baseline trips by a uniform factor, rather it takes account of trip distance and hilliness. So for example, in flatter areas the Go Dutch scenario will show a greater increase over baseline than equivalent more hilly areas. As such, this network shows how a Dutch modal share for cycling could be distributed across Scotland.

Planners should seek to design cycle networks that meet the needs of both current and future cyclists. But they may phase the construction to prioritise roads that will meet the needs of current cyclists and enable new people to cycle.

##### EBikes

The Ebike scenario models the additional increase in cycling that would be achieved on top of the Go Dutch scenario, through the widespread uptake of electric cycles The scenarios alters both the assumptions around cycling uptake and the routes choices made by cyclists, for example a reduced penalty for going up hills. Pedal cyclists incur a significant time and effort penalty from going uphill. Hence, a longer but flatter route is often faster. A good ebike can enable cyclists to ride uphill at 15 mph without breaking a sweat. Thus ebike riders may choose shorter but hillier routes than pedal cyclists.

As ebikes increase a cyclist’s range and carrying capacity while reducing effort and journey times, a world with many ebikes would expect higher levels of cycling than one with only pedal cycles.

<!-- /#scenario -->

<!-- #type -->

#### Network type

The 'network type' reflects route choices cyclists make. There is strong evidence that cyclists prefer the most direct route, and it reduces journey times and the physical effort of cycling.

The need to prioritise creation of a network of safe & direct cycle routes, is central to Transport Scotland's Cycling Framework for Active Travel and Active Travel Strategy Guidance. Cycling By Design defines how to achieve a high level of service for cycling, either through providing cycling facilities physically separated from traffic or on carriageway where traffic speed and volume is sufficiently low.

However, until such a safe & direct network is created, cyclists may make detours away from roads that are (or are perceived to be) dangerous. There is strong evidence that safety concerns are the main barrier to more people cycling.

Cyclestreets calculate the routes taken by cyclists, and each network type is based on one of their routeing [algorithms](https://www.cyclestreets.net/help/journey/howitworks/). The route choices are based on the current road infrastructure and don't account for planned improvements or missing links.

![Route network types](/images/rnet_types.png)

Examples of the two network types in Edinburgh show how different assumptions about the routes cyclists take affect where the busiest parts (pink) of the network are predicted to be.

Note that the choice of network type does not just change the routes cyclists take but also the number of cyclists predicted under each scenario. This is because quieter routes are typically longer and hillier than the direct route which discourages cycling.

##### Fast/Direct (preferred)

This network type should be treated as the default.

The fastest network is based on cyclists taking the most direct (legal) routes. While cyclists prefer direct routes, this will often bring them onto busy and dangerous major roads, which are a barrier to cycling without the provision of cycle infrastructure separated from traffic. Planners seeking to maximise cycling will build high-quality cycle infrastructure along main roads, which form part of the fastest cycle route network.

High quality cycle network plans, particularly in urban areas, will be based on joining up the fast/direct routes with the highest predicted numbers of cyclists to create a dense & coherent network. Supplementary guidance on how the tool should be used to generate these dense & coherent cycle networks will be developed to support cycle network planning.

##### Quiet/indirect

The quiet network assumes that cyclists will avoid busy roads and be willing to take significant detours. While directing cyclists away from busy roads and onto quieter back streets may seem like a good idea, it can have significant downsides. Quiet routes are often longer and more challenging to navigate as they weave around the back streets. Even if the roads are safe, longer and more complex journeys discourage cycling. The NPT captures this effect, and the total number of cyclists on the quiet route network is less than on the fast route network.

The most likely application of the 'Quiet/Indirect' network type is to:

* Identify potential low cost/high impact 'quick wins' where meaningful additions to the cycle network can be made in the very short term e.g. by filtering residential streets parallel to main roads.
* Supporting the design of Low Traffic or 20-minute Neighbourhoods.

Quiet networks work best when the directness penalty is small. For example, a city with a grid layout could alternate between roads designed for cars and streets designed for active travel.

![Amsterdam car and cycle networks](/images/amsterdam_networks.JPG)

The image above ([source](https://maps.amsterdam.nl/plushoofdnetten/)) shows how Amsterdam uses its grid layout to have parallel but separate networks for cars (red, orange, black) and bicycles (green). Notice how the cycling network is much denser than the car network, ensuring that cyclists almost always benefit from a more direct route.

<!-- /#type -->

<!-- #colour -->

#### Line Colour

The line colour option allows you to visualise different characteristics of the route network. Below the line colour option is a contextual legend which shows the meaning of the colours on the map.

##### Number of cyclists

![Number of cyclists](/images/number_of_cyclists.png)

The number of cyclists is the default view. It shows an estimate of the number of cyclists on each road for the selected trip purpose, network type, and scenario. The thickness of the lines in the route network is also defined by the number of cyclists, with thicker lines representing more cyclists.

##### Cycle friendliness

![Cycle friendliness](/images/cycle_friendliness.png)

Cycle friendliness is a subjective measure representing the quality of a route segment (a section of road or path) for cycling, with a score between 0 (very low quality) and 100 (very high quality). It considers a [range of factors](https://www.cyclestreets.net/api/v1/journey/), using data derived from OpenStreetMap.

Factors that contribute to a higher score of cycle friendliness include (as appropriate):

* Whether the cycleway is shared with motor vehicles or pedestrians,
* The type of road
* Presence of cycle infrastructure
* Speed limit
* Surface quality
* Cycle signage, 
* Any barriers or obstructions
* Path width
* Route legibility

See [CycleStreets](https://www.cyclestreets.net/help/journey/howitworks/) for further information, the term ‘quietness’ is used for the same measure that we call ‘cycle friendliness’.

##### Gradient

![Gradient](/images/gradient.png)

The average gradient of the road is shown as a percentage. Steeper roads are a barrier to cycling and affect route choice and the uptake of cycling in the scenarios. Please note in some locations where the network does follow the land contours, e.g. some bridges, the gradient will incorrectly show flat sections of network as steep. This is something we are working to resolve.

<!-- /#colour -->

<!-- #simplified_rnet -->

#### Simplified Route Network

The NPT includes a 'Simplified' toggle that streamlines the route network display. Major road corridors can be complex with multiple carriageways, cycle paths, and footways. It can be confusing to judge overall demand if the cyclists are split across multiple overlapping routes. The simplified network attempts to address this problem by combining parallel routes into a single line. However, this consolidation is intricate and may lead to a loss of detail. For a comprehensive analysis, it's advisable to consider both the simplified and the full route networks in tandem when evaluating cycling demand. This dual approach helps balance the big-picture overview with the nuanced details of specific routes.

![Simplified Network](/images/simplified.png)

<!-- /#simplified_rnet -->

#### Popup

Clicking on any segment within the route network on the map will display a pop-up window.

![Popup](/images/rnet_popup.png)

The popup provides a summary table for all the information available about the route network. The table displays the number of cyclists for each scenarioâ€”such as baseline, Go Dutch, and e-bikesâ€”and distinguishes between the Fast/Direct and Quiet/Indirect network types. Below the table, the average gradient of the road and its cycle friendliness score are shown, which assesses the suitability of the road for cycling. Additionally, there's an option to directly access the Google Street View of the road, if available, for a more grounded perspective.

<!-- #filters -->

### Route Network Filters

![Route network filters](/images/rnet_filters.png)

The sliders allow you to show/hide parts of the route network. You can filter on three variables:

#### Numbers of cyclists

Tailor the map to display routes with a particular range of predicted cycling traffic, reflecting the selected scenario and route type.

#### Gradient

Set the maximum and minimum gradient of roads that are visible. Gradient measures the average gradient of the road segment as a percentage. E.g. 0% = flat, 100% = vertical cliff.

#### Cycle friendliness

Set the maximum and minimum quietness of roads that are visible. Quietness measures how cycle friendly the existing road is, from hostile (least friendly) to quiet (most friendly).

<!-- /#filters -->

<!-- #data_zones -->

### Data Zones

Data Zones are small statistical neighbourhoods created for the Census. In the NPT, they are used to provide contextual area-based information.

![Data zones](/images/data_zones.png)

The data zone options are:

* % commuter cycling (baseline)
* % commuter cycling (Go Dutch)
* Population density (per hectare)
* Index of Multiple Deprivation (2020)
* Drive time to a petrol station
* Drive time to GP
* Drive time to post office
* Drive time to a retail centre
* Drive time to primary school
* Drive time to secondary school
* Public transport time to GP
* Public transport time to a post office
* Public transport time to a retail centre
* % without superfast broadband

**Dasymetric mode**

By default, the data zones are shown as a [dasymetric map](https://en.wikipedia.org/wiki/Dasymetric_map). This means that the buildings within a zone are coloured to display information. If you turn off dasymetric mode, a simple [choropleth map](https://en.wikipedia.org/wiki/Choropleth_map) is shown where the whole Data Zone is coloured. Note that the same underlying data is being visualised in both modes, and the differences between modes are merely aesthetic. However, dasymetric maps are intended to better represent the data by emphasising the true locations of people who are not uniformly distributed across the Data Zone. 

![Dasymetric maps](/images/dasymetric.png)

Dasymetric map (left) and choropleth map (right) for the Index of Multiple Deprivation in Edinburgh.

<!-- /#data_zones -->

#### Data Zone popup

Clicking on any Data Zone shows the popup report for that zone. Ten graphs are presented

##### Commuters leaving

The bar chart shows estimated mode shares under different scenarios for people leaving this zone to go to work. (i.e. they live here and commute to another zone).

##### Commuters arriving

The bar chart shows estimated mode shares under different scenarios for people arriving in this zone at work. (i.e. they work here and live in another zone).

##### Primary school children

The bar chart shows estimated mode shares under different scenarios for primary school children that live in this zone.

##### Secondary school children

The bar chart shows estimated mode shares under different scenarios for secondary school children that live in this zone.

##### Shoppers leaving

The bar chart shows estimated mode shares of shopping trips under different scenarios for trips leaving this zone.

##### Shoppers arriving

The bar chart shows estimated mode shares of shopping trips under different scenarios for trips arriving this zone.

##### People leaving to travel to a Leisure facility

The bar chart shows estimated mode shares of leisure trips under different scenarios for trips leaving this zone.

##### People arriving at a Leisure facility

The bar chart shows estimated mode shares of leisure trips under different scenarios for trips arriving this zone.

##### People leaving to visit friends and family

The bar chart shows estimated mode shares of trips for visiting friends and family under different scenarios for trips leaving this zone.

##### People arriving to visit friends and family

The bar chart shows estimated mode shares of trips for visiting friends and family under different scenarios for trips arriving this zone.

### Other Layers

The NPT provides several supplementary map layers that enhance the contextual understanding of the cycling network

* Schools (click on a school to see current and potential future mode split data): Revealing the locations of primary, secondary, and other educational institutions, this layer allows users to click on individual schools to review the present and potential future distribution of travel modes among students
* Wards: This layer overlays the boundaries of local electoral wards onto the map
* Scottish Parliamentary Constituencies: Users can display the geographic divisions for Scottish parliamentary representation
* Scottish Parliament Regions: This adds another political layer, showing the larger regions that make up the Scottish parliamentary electoral system.
* Local Authority: Highlight the administrative areas within Scotland, aiding in planning and analysis at a local government level.

<!--

#### Schools popup

Clicking on any school shows the schools popup

### Trip ends

Travel data can be summarised by origins or destinations. Consider work travel; typically, people travel from many residential areas at the edge of cities into a few city centre areas where most jobs are concentrated. So mapping cycling by origins shows information about residents. But mapping by destination shows information about workers.

-->