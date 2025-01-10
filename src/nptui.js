// NPT UI implementation code

/*jslint browser: true, white: true, single: true, for: true, unordered: true, long: true */
/*global alert, console, window, maplibregl, pmtiles, MaplibreGeocoder, noUiSlider, tippy */


/* Expectations in HTML:

- Layer toggles, to enable/disable a layer by a checkbox:
	Should be as follows, specifying the layerId in the data attribute, e.g.:
	<input type="checkbox" class="showlayer" data-layer="foo">
	
- Layer attributes, to set values for a layer:
	Should be as follows, specifying the layerId in the data attribute, and a name for the field, e.g.:
	<select name="purpose" class="updatelayer" data-layer="rnet" aria-label="Route network trip purpose">

- Legends:
	Should be as follows, specifying the layerId followed by -legend in the id:
	<div id="clos-legend" class="legend"></div>
	
- Slider UI:
	Sliders should have .slider-styled, with a name for the field, and an ID that matches a datalist name, e.g.:
	<div id="slider-gradient-ui" class="slider-styled" data-name="gradient"></div>
	<datalist name="slider-gradient-ui">...</datalist>
	<input type="hidden" name="gradient" class="updatelayer slider" data-layer="foo" />
	
- Modal dialogs:
	Modals should be defined as a <template> with an id ending -modal, include an X in a span.modal-close
	
- Popups:
	Popups should be defined as a <template> with an id ending -popup
	They should have placeholders like {some_field} which will be matched to the data properties
	Predefined placeholders {_streetViewUrl} and {_osmUrl} can be used for links to these services

- Charts popups:
	To create automatic chart popups, add an entry in the charts section of datasets.js.
	The key should be the layer name. The data should be as per the other examples present in the file.
	
- Help buttons:
	Help buttons should have .helpbutton and a data-help="..." value which matches a comment marker
	The comment marker in the .md file should be added around the relevant lines to be displayed, e.g.:
	<!-- #scenario -->...<!-- /#scenario -->
*/


const nptUi = (function () {
	
	'use strict';
	
	
	// Settings
	let _settings = {};		// Will be populated by constructor
	let _datasets = {};		// Will be populated by constructor
	
	// Properties
	let _map;
	let _hashComponents = {layers: '/', map: ''};
	
	// State
	const _state = {};
	
	
	// Functions
	return {
		
		// Main function
		initialise: function (settings, datasets)
		{
			// Populate the settings and datasets class properties
			_settings = settings;
			_datasets = datasets;
			
			// Parse URL hash state
			nptUi.parseUrl ();
			
			// Initialise the state
			nptUi.initialiseState ();
			
			// Create welcome screen
			nptUi.welcomeScreen ();
			
			// Enable the accordion functionality for the layer controls box and popups
			nptUi.accordion ();
			
			// Layer controls box UI
			nptUi.layerControlsBoxUi ();
			
			// General GUI topnav function
			nptUi.topnav ();
			
			// Create the map UI
			_map = nptUi.createMap ();
			
			// Manage layers
			nptUi.manageLayers ();
			
			// Create popups
			nptUi.createPopups ();
			
			// Create charts for the defined map layers
			nptUi.charts ();
			
			// Handler for help buttons which have a data-help attribute indicating there is a manual section
			nptUi.handleHelpButtons ();
			
			// Create sliders
			nptUi.createSliders ();
			
			// Tooltip support
			nptUi.tooltips ();
			
			// UI specialised function callback, if defined
			if (typeof _settings.uiCallback === 'function') {
				_settings.uiCallback ();
			}
			
			// Manage analytics cookie setting
			nptUi.manageAnalyticsCookie ();
		},
		
		
		// Welcome screen
		welcomeScreen: function ()
		{
			// Show only first time
			const cookieName = 'welcomescreen';
			if (nptUi.getCookie (cookieName)) {return;}
			
			// Create modal
			const welcomeModal = nptUi.newModal ('welcome-modal');
			welcomeModal.show ();
			
			// Set OSM and update dates in the text, if present
			if (document.getElementById ('osmupdatedate')) {
				document.getElementById ('osmupdatedate').innerHTML = _settings.osmDate;
			}
			if (document.getElementById ('updatedate')) {
				document.getElementById ('updatedate').innerText = nptUi.formatAsUKDate (document.lastModified);
			}
			
			// Set cookie
			nptUi.setCookie (cookieName, 'true');
		},
		
		
		// Function to manage an accordion
		accordion: function ()
		{
			// Listen for accordion clicks
			document.querySelectorAll ('button.accordion').forEach  (function (button) {
				button.addEventListener ('click', function () {
					
					// Toggle between adding and removing the 'active' class, to highlight the button that controls the panel
					button.classList.toggle ('active');
					
					// Toggle between hiding and showing the active panel
					const panel = button.nextElementSibling;
					panel.style.display = (panel.style.display == 'block' ? 'none' : 'block');
				});
			});
		},	
		
		
		// Function to manage the layer controls box UI
		layerControlsBoxUi: function ()
		{
			// Show the layer controls box
			showlayercontrols (true);
			
			// Auto-open initial layer sections if required
			let accordionButtons = [];
			const enabledLayers = Object.keys (_state.layers).filter (function (layerId) {return _state.layers[layerId].enabled;});
			enabledLayers.forEach (function (layerId) {
					accordionButtons.push (document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').closest ('div.panel').previousElementSibling);
			});
			accordionButtons = Array.from (new Set (accordionButtons));	// Remove duplicates - may have more than one layer within a button
			accordionButtons.forEach (function (accordionButton) {
				accordionButton.click ();
			});
			
			// Show layer control box when button clicked on
			document.querySelector('#showrightbox button').addEventListener('click', function () {
				showlayercontrols(true);
			});
			
			// Close layer control box when X clicked on
			document.querySelector('#rightbox button.close-button').addEventListener('click', function () {
				showlayercontrols(false);
			});
			
			/* Show and hide UI */
			function showlayercontrols(show)
			{
				// Toggle box
				const box = document.getElementById ('rightbox');
				box.style.display = (show ? 'block' : 'none');
				
				const boxbutton = document.getElementById ('showrightbox');
				boxbutton.style.display = (show ? 'none' : 'block');
			}
		},
		
		
		// Main menu responsive display
		topnav: function ()
		{
			document.getElementById ('expandtopnav').addEventListener ('click', function (e) {
				const nav = document.querySelector ('nav');
				if (!nav.classList.contains ('responsive')) {
					nav.classList.add ('responsive');
				} else {
					nav.classList.remove ('responsive');
				}
				e.preventDefault ();
			});
		},
		
		
		// Function to parse the URL hash state
		parseUrl: function ()
		{
			// Get the hash, e.g. "/layer1,layer2/#8/55.953/-3.138" would be extracted from https://example.com/#/layer1,layer2/#8/55.953/-3.138
			const hash = window.location.hash.replace (/^#/, '');
			
			// Split path component from map compoment
			const hashComponents = hash.split ('#');
			
			// End if not the intended format of /layers/#map , thus retaining the default state of the _hashComponents property
			if (hashComponents.length != 2) {return;}
			
			// Register the change in the hash components (for URL) state
			_hashComponents.layers = hashComponents[0];
			_hashComponents.map = hashComponents[1];
			//console.log (_hashComponents);
		},
		
		
		// Function to initialise the state
		initialiseState: function ()
		{
			// Initialise layer state structure
			_state.layers = {};
			Object.keys (_datasets.layers).forEach (function (layerId) {
				_state.layers[layerId] = {
					enabled: false
				};
			});
			
			// Listen for layer state changes
			document.addEventListener ('@state/change', function () {
				nptUi.layerStateUrl ();
			});
			
			// Determine initial layers, preferring URL state if any layers enabled over settings default
			const initialLayersUrlString = _hashComponents.layers.replace (new RegExp ('^/'), '').replace (new RegExp ('/$'), '');		// Trim start/end slash(es)
			const initialLayersUrl = (initialLayersUrlString.length ? initialLayersUrlString.split (',') : []);
			const initialLayers = (initialLayersUrl.length ? initialLayersUrl : _settings.initialLayersEnabled);
			
			// Write initial layers specified in the URL, if any, into the state
			Object.keys (_datasets.layers).forEach (layerId => {
				_state.layers[layerId].enabled = (initialLayers.includes (layerId));
			});
			
			// Trigger state change
			document.dispatchEvent (new Event ('@state/change', {'bubbles': true}));
		},
		
		
		// Function to manage layer state URL
		layerStateUrl: function ()
		{
			// Determine enabled layers
			const enabledLayers = Object.keys (_state.layers).filter (function (key) {return _state.layers[key].enabled;});
			
			// Compile the layer state URL
			const enabledLayersHash = '/' + enabledLayers.join (',') + (enabledLayers.length ? '/' : '');
			
			// Register a state change for the URL
			nptUi.registerUrlStateChange ('layers', enabledLayersHash);
		},
		
		
		// Function to register a state change, adjusting the URL
		registerUrlStateChange: function (component, value)
		{
			// Update the registry
			_hashComponents[component] = value;
			//console.log (_hashComponents);
			
			// Construct the new hash state
			const hashState = '#' + _hashComponents.layers + _hashComponents.map;
			
			// Update the hash state in the browser history
			const location = window.location.href.replace (/(#.+)?$/, hashState);	// Does correctly work from the first hash onwards (when multiple)
			window.history.replaceState (window.history.state, null, location);
		},
		
		
		// Function to set up the map UI and controls
		createMap: function ()
		{
			// Create the layer switcher
			nptUi.layerSwitcherHtml ();
			
			// Manage anti-aliasing
			nptUi.antiAliasing ();
			
			// Determine initial centre/zoom location, based on the hash if present, else the settings location
			const initialPosition = (nptUi.parseMapHash () || _settings.initialPosition);
			
			// Main map setup
			const map = new maplibregl.Map({
				container: 'map',
				style: 'tiles/style_' + nptUi.getBasemapStyle() + '.json',
				center: initialPosition.center,
				zoom: initialPosition.zoom,
				maxZoom: _settings.maxZoom,
				minZoom: _settings.minZoom,
				maxPitch: 85,
				hash: false,	// Emulating the hash manually for now; see layerStateUrl
				attributionControl: false,	// Created manually below
				antialias: document.getElementById('antialiascheckbox').checked
			});
			
			// Manage hash manually, while we need full control of hashes to contain layer state
			nptUi.manageMapHash (map);
			
			// pmtiles
			let protocol = new pmtiles.Protocol();
			maplibregl.addProtocol('pmtiles', protocol.tile);
			
			// Add geocoder control
			nptUi.addGeocoder (map, 'top-left');
			
			// Add +/- buttons
			map.addControl(new maplibregl.NavigationControl(), 'top-left');
			
			// Add terrain control
			map.addControl(new maplibregl.TerrainControl({
				source: 'terrainSource',
				exaggeration: 1.25
			}), 'top-left');
			
			// Add buildings; note that the style/colouring may be subsequently altered by data layers
			nptUi.addBuildings(map);
			document.getElementById('basemapform').addEventListener('change', function (e) {
				nptUi.addBuildings(map);
			});
			
			// Add placenames support, loading at start and on basemap change
			map.once ('idle', function () {
				nptUi.placenames (map);
			});
			
			// Add geolocation control
			map.addControl(new maplibregl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			}), 'top-left');
			
			// Add full-screen control
			map.addControl(new maplibregl.FullscreenControl(), 'top-left');
			
			// Add basemap change control
			nptUi.basemapUi (map, 'top-left');
			
			// Add attribution once settings are loaded
			const addAttribution = () => {
				if (!map.hasControl('AttributionControl')) {  // Prevent duplicate controls
					map.addControl(new maplibregl.AttributionControl({
						compact: true,
						customAttribution: 'Contains OS data © Crown copyright 2025, Satelite map © ESRI 2025, © OpenStreetMap contributors (data: ' + _settings.osmDate + ')'
					}), 'bottom-left');
				}
			};

			// If settings already loaded, add attribution immediately
			if (_settings && _settings.osmDate) {
				addAttribution();
			} else {
				// Otherwise wait for settings to be loaded
				const checkInterval = setInterval(() => {
					if (_settings && _settings.osmDate) {
						addAttribution();
						clearInterval(checkInterval);
					}
				}, 100);
				// Clear interval after 5 seconds to prevent infinite checking
				setTimeout(() => clearInterval(checkInterval), 5000);
			}
			
			// Add scale
			map.addControl(new maplibregl.ScaleControl({
				maxWidth: 80,
				unit: 'metric'
			}), 'top-left');
			
			// Fire map ready when ready, which layer-enabling can be picked up
			map.once('idle', function () {
				document.dispatchEvent(new Event('@map/ready', {
					'bubbles': true
				}));
			});
			
			// Return the map handle
			return map;
		},
		
		
		// Function to manage the map hash manually; this is a minimal implementation covering only what we need
		// Covers zoon,lat,lon; no support for bearing or pitch
		// Based on the native implementation at: https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/hash.ts#L11
		manageMapHash: function (map)
		{
			// Function to determine the map hash
			function mapHash (map)
			{
				// Assemble the map hash from the map position
				const center = map.getCenter ();
				const zoom = Math.round (map.getZoom () * 100) / 100;
				// derived from equation: 512px * 2^z / 360 / 10^d < 0.5px
				const precision = Math.ceil ((zoom * Math.LN2 + Math.log (512 / 360 / 0.5)) / Math.LN10);
				const m = Math.pow (10, precision);
				const lng = Math.round (center.lng * m) / m;
				const lat = Math.round (center.lat * m) / m;
				const mapHash = `#${zoom}/${lat}/${lng}`;
				
				// Update the hash state
				nptUi.registerUrlStateChange ('map', mapHash);
			}
			
			// In initial state and after moving the map, set the hash in the URL
			mapHash (map);
			map.on ('moveend', function () {
				mapHash (map);
			});
			
			// Function to determine the map state
			function setLocationFromHash (map) {
				const location = nptUi.parseMapHash ();
				if (location) {
					map.jumpTo (location);
				}
			}
			
			// On hash change, set the map location; initial is set in map initialisation for efficiency
			addEventListener ('hashchange', function () {
				setLocationFromHash (map);
			});
		},
		
		
		// Function to parse a map hash location to center and zoom components
		parseMapHash: function ()
		{
			// Extract the hash and split by /
			const mapHash = _hashComponents.map.replace (new RegExp ('^#'), '');	// Do not read window.location.hash directly, as that will contain layer state
			const parts = mapHash.split ('/');
			
			// If three parts, parse out
			if (parts.length == 3) {
				return {
					center: [parts[2], parts[1]],
					zoom: parts[0]
				};
			}
			
			// Else return false
			return false;
		},
		
		
		// Generate layer switcher HTML
		layerSwitcherHtml: function ()
		{
			// Create each switcher button
			const options = [];
			Object.entries(_settings.basemapStyles).forEach(([id, basemap]) => {
				let option = `<input type="radio" name="basemap" id="${id}-basemap" value="${id}"` + (id == _settings.basemapStyleDefault ? ' checked="checked"' : '') + ' />';
				option += `<label for="${id}-basemap"><img src="images/basemaps/${id}.png" title="${basemap.title}" /></label>`;
				options.push(option);
			});
			
			// Insert radiobuttons into form
			document.getElementById('basemapform').innerHTML = options.join(' ');
		},
		
		
		// Generate layer switcher HTML
		antiAliasing: function ()
		{
			// Get the cookie value
			const cookieName = 'antialias';
			let cookieValue = nptUi.getCookie (cookieName);
			
			// Enable anti-aliasing by default on desktop devices, since they are likely to have sufficient power
			if (cookieValue == '') {
				if (!nptUi.isMobileDevice ()) {
					cookieValue = 'true';
					nptUi.setCookie (cookieName, cookieValue);
				}
			}
			
			// Set form value if required
			document.getElementById ('antialiascheckbox').checked = (cookieValue == 'true' ? 'checked' : '');
			
			// Force system reload on change
			document.getElementById ('antialiascheckbox').addEventListener ('click', function () {
				nptUi.setCookie (cookieName, (document.getElementById ('antialiascheckbox').checked ? 'true' : 'false'));
				location.reload ();
			});
		},
		
		
		// Determine whether the device is a mobile device
		isMobileDevice: function ()
		{
			return (typeof window.orientation !== 'undefined');
		},
		
		
		// Function to add the buildings layer
		addBuildings: function (map)
		{
			// When ready
			map.once ('idle', function () {
				
				// Add the source
				if (!map.getSource ('dasymetric')) {
					map.addSource ('dasymetric', {
						'type': 'vector',
						'url': _settings.buildingsTilesUrl.replace ('%tileserverUrl', _settings.tileserverUrl),
					});
				}
				
				// Initialise the layer
				if (!map.getLayer('dasymetric')) {
					map.addLayer({
						'id': 'dasymetric',
						'type': 'fill-extrusion',
						'source': 'dasymetric',
						'source-layer': 'dasymetric',
						'layout': {
							'visibility': 'none'
						},
						'paint': {
							'fill-extrusion-color': '#9c9898', // Default gray
							'fill-extrusion-height': [
								'interpolate',
								['linear'],
								['zoom'],
								12, 1,
								15, 8
							]
						}
					}, 'roads 0 Guided Busway Casing');
				}
			});
		},
		
		
		// Function to manage display of placenames
		placenames: function (map)
		{
			// Load the style definition
			// #!# The .json file is currently not a complete style definition, e.g. with version number etc.
			fetch ('/tiles/partial-style_oszoom_names.json')
				.then (function (response) {
					return response.json ();
				})
				.then (function (placenameLayers) {
					
					// Create a handle to the toggle handler; this is used to avoid compounding event listeners given that a @map/ready does not directly provide the ability to take down an existing handler, resulting in a dangling reference
					let placenamesVisibilityHandler = null;
					
					// Define load function
					const loadPlacenames = function ()
					{
						// Add the source, if not already present
						if (!map.getSource ('placenames')) {
							map.addSource ('placenames', {
								'type': 'vector',
								'url': _settings.placenamesTilesUrl.replace ('%tileserverUrl', _settings.tileserverUrl),
							});
						}
						
						// Add each placename layer, respecting the initial checkbox state
						const checkbox = document.getElementById ('placenamescheckbox');
						Object.entries (placenameLayers).forEach (([layerId, layer]) => {
							layer.layout.visibility = (checkbox.checked ? 'visible' : 'none');
							if (!map.getLayer (layerId)) {
								map.addLayer (layer);
							}
						});
						
						// If an existing event listener exists, remove it to avoid compounding listeners unnecessarily
						if (placenamesVisibilityHandler) {
							document.getElementById('placenamescheckbox').removeEventListener('click', placenamesVisibilityHandler);
						}
						
						// Set handler function to change placenames visibility
						placenamesVisibilityHandler = function () {
							const checkbox = document.getElementById('placenamescheckbox');
							Object.entries (placenameLayers).forEach (([layerId, layer]) => {
								map.setLayoutProperty(layerId, 'visibility', (checkbox.checked ? 'visible' : 'none'));
							});
						};
						
						// Listen for checkbox changes
						document.getElementById('placenamescheckbox').addEventListener('click', placenamesVisibilityHandler);
					};
					
					// Run initially and on style change
					loadPlacenames ();
					document.addEventListener ('@map/ready', function () {
						loadPlacenames ();
					});
				});
		},
		
		
		// Basemap UI
		basemapUi: function (map, position)
		{
			// Define the button
			class BasemapButton {
				onAdd(map) {
					const div = document.createElement('div');
					div.className = 'maplibregl-ctrl maplibregl-ctrl-group';
					div.innerHTML = '<button aria-label="Change basemap"><img src="/images/basemap.svg" class="basemap" title="Change basemap" /></button>';
					div.addEventListener('contextmenu', (e) => e.preventDefault());
					div.addEventListener('click', function () {
						const box = document.getElementById('basemapcontrol');
						box.style.display = (window.getComputedStyle(box).display == 'none' ? 'block' : 'none');
					});
					return div;
				}
			}
			
			// Add the button
			map.addControl (new BasemapButton (), position);
			
			// Change map and reload state on basemap change
			document.getElementById ('basemapform').addEventListener ('change', function () {
				const styleName = nptUi.getBasemapStyle ();
				const styleCurrent = map.getStyle().name;
				if (styleCurrent == styleName) {
					return;
				}
				console.log ('Restyling from ' + styleCurrent + ' to ' + styleName);
				map.setStyle ('tiles/style_' + styleName + '.json');
				
				// Fire map ready event when ready
				map.once ('idle', function () {
					document.dispatchEvent (new Event ('@map/ready', {
						'bubbles': true
					}));
				});
			});
		},
		
		
		// Function to get the currently-checked basemap style
		getBasemapStyle: function ()
		{
			return document.querySelector('#basemapform input:checked').value;
		},
		
		
		// Geocoding implementation
		addGeocoder: function (map, position)
		{
			// Define the UI options
			const geocoderOptions = {
				maplibregl: maplibregl,
				collapsed: true,
				showResultsWhileTyping: true,
				minLength: 3,
				debounceSearch: 400,
				showResultMarkers: false,
				marker: false
			};
			
			// Implement the data retrieval and assembly; see: https://maplibre.org/maplibre-gl-geocoder/types/MaplibreGeocoderApi.html
			const geocoderApi = {
				forwardGeocode: async (config) => {
					const features = [];
					try {
						let request = 'https://nominatim.openstreetmap.org/search?q=' + config.query + '&format=geojson&addressdetails=1&countrycodes=gb';
						if (_settings.geocoderViewbox) {
							request += '&viewbox=' + _settings.geocoderViewbox;
							if (_settings.geocoderBounded) {
								request += '&bounded=' + _settings.geocoderBounded;
							}
						}
						const response = await fetch(request);
						const geojson = await response.json();
						for (let feature of geojson.features) {
							// See: https://maplibre.org/maplibre-gl-geocoder/types/CarmenGeojsonFeature.html and https://web.archive.org/web/20210224184722/https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
							let point = {
								type: 'Feature',
								place_name: feature.properties.display_name,
								properties: feature.properties,
								text: feature.properties.display_name,
								place_type: ['place'],
								bbox: feature.bbox
							};
							features.push (point);
						}
					} catch (e) {
						console.error (`Failed to forwardGeocode with error: ${e}`);
					}
					
					return {
						features: features
					};
				}
			};
			
			// Assemble the geocoder instance
			const geocoder = new MaplibreGeocoder (geocoderApi, geocoderOptions);
			
			// Auto-close on select; see: https://github.com/maplibre/maplibre-gl-geocoder/issues/183
			geocoder.on ('result', function () {
				document.querySelector ('.maplibregl-ctrl-geocoder--button').click ();		// Click to remove the search value
				document.querySelector ('.maplibregl-ctrl-geocoder--input').blur ();		// Move away from the search box
			});
			
			// Add the control
			map.addControl (geocoder, position);
			
			// Add auto-focus to the widget; see: https://github.com/maplibre/maplibre-gl-geocoder/issues/181 and https://maplibre.org/maplibre-gl-geocoder/classes/default.html#on
			document.querySelector ('.maplibregl-ctrl-geocoder').addEventListener ('mouseenter', function () {
				document.querySelector ('.maplibregl-ctrl-geocoder--input').focus ();
			});
		},
		
		
		// Function to manage layers
		manageLayers: function ()
		{
			// Set checkboxes immediately
			Object.entries (_state.layers).forEach (function ([layerId, layer]) {
				if (layer.enabled) {
					document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').checked = true;
				}
			});
			
			// Add layers when the map is ready (including after a basemap change)
			document.addEventListener ('@map/ready', function () {
				
				// Initialise datasets (sources and layers)
				nptUi.initialiseDatasets ();
				
				// Implement initial visibility state for all layers
				Object.keys (_datasets.layers).forEach (layerId => {
					nptUi.toggleLayer (layerId);
				});
				
				// Handle layer change controls, each marked with .showlayer or .updatelayer
				document.querySelectorAll ('.showlayer, .updatelayer').forEach ((input) => {
					input.addEventListener ('change', function () {
						const layerId = input.dataset.layer;
						
						nptUi.toggleLayer(layerId);
						// #!# Workaround, pending adapting layerId to be a list of affected layers
						if (layerId == 'rnet') {
							nptUi.toggleLayer('rnet-simplified');
						}
					});
				});
			});
		},
		
		
		// Function to initialise datasets (sources and layers)
		initialiseDatasets: function ()
		{
			// console.log ('Initialising sources and layers');
			
			// Replace tileserver URL placeholder in layer definitions
			Object.entries(_datasets.layers).forEach(([layerId, layer]) => {
				let tileserverUrl = (_settings.tileserverTempLocalOverrides[layerId] ? _settings.tileserverTempLocalOverrides[layerId] : _settings.tileserverUrl);
				_datasets.layers[layerId].source.url = layer.source.url.replace ('%tileserverUrl', tileserverUrl)
				//console.log (`Setting source.url for layer ${layerId} to ${_datasets.layers[layerId].source.url}`);
			});
			
			// Expand any sublayer definitions where they have same styling for multiple layers, separated by comma
			Object.entries (_datasets.sublayers).forEach (([layerId, sublayers]) => {
				Object.entries (sublayers).forEach (function ([sublayerIdString, sublayer]) {
					if (sublayerIdString.includes (',')) {
						const sublayerIds = sublayerIdString.split (',');
						sublayerIds.forEach (function (sublayerId) {
							_datasets.sublayers[layerId][sublayerId] = sublayer;		// Expand
						});
						delete _datasets.sublayers[layerId][sublayerIdString];	// Remove original comma-separated list
					}
				});
			});
			
			// Add layers, and their sources, initially not visible when initialised
			Object.keys(_datasets.layers).forEach(layerId => {
				const beforeId = (layerId == 'data_zones' ? 'roads 0 Guided Busway Casing' : 'placeholder_name'); // #!# Needs to be moved to definitions
				_datasets.layers[layerId].layout = {
					visibility: 'none'
				};
				_map.addLayer(_datasets.layers[layerId], beforeId);
			});
		},
		
		
		toggleLayer: function (layerId)
		{
			//console.log ('Toggling layer ' + layerId);
			
			// Use static sublayer styling definitions, if present, on initial load and on sublayer change
			// #!# This is incrementally added each time toggle is done; should be moved up a level so there is only a single registration
			if (_datasets.sublayers[layerId]) {
				nptUi.setSublayerStyle (layerId);
				document.querySelector ('select.updatelayer[data-layer="' + layerId + '"]').addEventListener ('change', function () {
					nptUi.setSublayerStyle (layerId);
				});
				
			// Check for a dynamic styling callback and run it if present
			} else if (_datasets.layerStyling[layerId]) {
				_datasets.layerStyling[layerId] (layerId, _map, _settings, _datasets, nptUi.createLegend);
			} else {
				nptUi.createLegend (datasets.legends[layerId], layerId + 'legend');
			}
			
			// Set state of layer
			_state.layers[layerId].enabled = document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').checked;
			document.dispatchEvent (new Event ('@state/change', {'bubbles': true}));
			
			// Set the visibility of the layer, based on the checkbox value
			_map.setLayoutProperty (layerId, 'visibility', (_state.layers[layerId].enabled ? 'visible' : 'none'));
			
			// Set the visibility of the layer-specific controls, if present
			const layerToolsDiv = document.querySelector ('.layertools-' + layerId);
			if (layerToolsDiv) {
				
				// #!# Hacky workaround to deal with rnet/rnet-simplified; without this, the layer tools may not be shown, as one or the other is disabled
				let makeVisibleLayerTools = _state.layers[layerId].enabled;
				if (layerId == 'rnet' || layerId == 'rnet-simplified') {
					makeVisibleLayerTools = _state.layers['rnet'].enabled || _state.layers['rnet-simplified'].enabled;
				}
				
				// Eanble/disable the layer tools div
				(makeVisibleLayerTools ? layerToolsDiv.classList.add ('enabled') : layerToolsDiv.classList.remove ('enabled'));
			}
		},
		
		
		// Function to set style from a definition
		setSublayerStyle: function (layerId)
		{
			// Determine the field
			const fieldname = document.querySelector ('select.updatelayer[data-layer="' + layerId + '"]').value;
			const sublayer = _datasets.sublayers[layerId][fieldname];
			
			// Set each style (e.g. line-color)
			Object.entries (sublayer.styles).forEach (function ([style, styleValueLookups]) {
				
				// Parse the style value pairs
				let styleValues = nptUi.associativeToFlattenedArray (styleValueLookups);
				
				// Determine the mode
				let mode;
				switch (sublayer.type) {
					case 'match':
						mode = ['match'];
						break;
					case 'step':	// See: https://stackoverflow.com/a/53506912/
						mode = ['step'];
						styleValues.shift ();		// First should be base value without key
						break;
					case 'interpolate':
						mode = ['interpolate', ['linear']];
						break;
				}
				
				// Arrange the style definition
				const styleDefinition = [
					...mode,
					['get', fieldname],
					...styleValues,
				];
				
				// Set paint properties
				_map.setPaintProperty (layerId, style, styleDefinition);
			});
			
			// Set legend, using the first style if more than one
			const styleValueLookupsFirst = Object.values (sublayer.styles) [0];
			const legendColours = nptUi.associativeToPairs (styleValueLookupsFirst);
			const isRangeType = (sublayer.type == 'step' || sublayer.type == 'interpolate');
			nptUi.createLegend (legendColours, layerId + '-legend', isRangeType);
		},
		
		
		// Function to flatten key-value pairs of an object to a simple array
		associativeToFlattenedArray: function (object)
		{
			// Convert key-value pairs to list
			const array = [];
			Object.entries (object).forEach (function ([key, value]) {
				if (!isNaN (key)) {
					key = Number (key);
				}
				if (key != '_') {		// For a default (_), omit the key, so there is just the value
					array.push (key);
				}
				array.push (value);
			});
			return array;
		},
		
		
		// Function to convert key-value pairs of an object to pairs
		associativeToPairs: function (object)
		{
			// Convert key-value pairs to list
			const array = [];
			Object.entries (object).forEach (function ([key, value]) {
				if (key == '_') {return; /* i.e. continue */}		// Omit fallback value (_)
				array.push ([key, value]);
			});
			return array;
		},
		
		
		createLegend: function (legendColours, selector, isRangeType)
		{
			// Do nothing if no selector for where the legend will be added
			if (!document.getElementById(selector)) {return;}
			
			// Create the legend HTML
			// #!# Should be a list, not nested divs
			let legendHtml = '<div class="l_r">';
			legendColours.forEach (function ([value, colour]) {
				legendHtml += '<div class="lb">';
				legendHtml += `<span style="background-color: ${colour}">`;
				legendHtml += '</span>';
				if (isRangeType) {value = '≥' + value;}
				legendHtml += value;	// Label
				legendHtml += '</div>';
			});
			legendHtml += '</div>';
			
			// Set the legend
			document.getElementById (selector).innerHTML = legendHtml;
		},
		
		
		// Function to create popups
		createPopups: function ()
		{
			// Add to each layer
			Object.entries (_datasets.popups).forEach (([layerId, options]) => {
				nptUi.mapPopups (layerId, options);
			});
		},
		
		
		// Popup handler
		// Options are: {preprocessingCallback, smallValuesThreshold, literalFields}
		mapPopups: function (layerId, options)
		{
			// Enable cursor pointer
			layerPointer (layerId);
			
			// Register popup on click
			_map.on ('click', layerId, function (e) {
				
				// Get the clicked co-ordinates
				const coordinates = e.lngLat;
				
				// Obtain the clicked feature
				let feature = e.features[0];
				
				// Process any preprocessing callback
				if (options.preprocessingCallback) {
					feature = options.preprocessingCallback(feature);
				}
				
				// Number formatting
				Object.entries(feature.properties).forEach(([key, value]) => {
					if (options.literalFields && options.literalFields.includes(key)) {
						return; /* i.e. continue */
					}
					if (Number.isFinite(value)) { // Number check means strings/percentages/etc. get skipped
						
						// Suppress small numeric values
						if (value < options.smallValuesThreshold) {
							if (options.smallValuesThreshold) {
								feature.properties[key] = '<' + options.smallValuesThreshold;
								return; // i.e. continue
							}
						}
						
						// Thousands separator
						feature.properties[key] = value.toLocaleString('en-GB');
					}
				});
				
				// Make external links properties available to the template
				feature.properties = addExternalLinks(feature.properties, coordinates);
				
				// Create the popup HTML from the template in the HTML
				const popupHtml = processTemplate(options.templateId, feature.properties);
				
				// Create the popup
				new maplibregl.Popup ({
						className: 'layerpopup'
					})
					.setLngLat (coordinates)
					.setHTML (popupHtml)
					.addTo (_map);
					
				// #!# Need to close popup when layer visibility changed - currently a popup is left hanging if the layer is toggled on/off (e.g. due to simplification or field change)
			});
			
			
			// Function to handle pointer hover changes for a layer
			function layerPointer (layerId)
			{
				// Change the cursor to a pointer when the mouse is over the layer.
				_map.on('mouseenter', layerId, function () {
					_map.getCanvas().style.cursor = 'pointer';
				});
				
				// Change it back to a pointer when it leaves.
				_map.on('mouseleave', layerId, function () {
					_map.getCanvas().style.cursor = '';
				});
			}
			
			
			// Function to convert a template to HTML, substituting placeholders
			function processTemplate (templateId, properties)
			{
				// Get template for the popup (from the HTML page), which defines fields to be used from feature.properties
				const template = document.querySelector('template#' + templateId).innerHTML;

				// Substitute placeholders in template
				return template.replace(/{([^}]+)}/g, (placeholderString, field) => properties[field]); // See: https://stackoverflow.com/a/52036543/
			}
			
			
			// Function to add external links
			function addExternalLinks (properties, coordinates)
			{
				properties._streetViewUrl = 'https://maps.google.com/maps?q=&layer=c&cbll=' + coordinates.lat + ',' + coordinates.lng + '&cbp=11,0,0,0,0';
				properties._osmUrl = 'https://www.openstreetmap.org/#map=19/' + coordinates.lat + '/' + coordinates.lng;
				return properties;
			}
		},
		
		
		// Function to handle chart creation
		charts: function ()
		{
			// Handles to charts
			const chartHandles = {};
			
			// Function to create a chart modal
			const chartsModal = function (mapLayerId, chartDefinition) {
				
				// Initialise the HTML structure for this modal
				initialiseChartsModalHtml (mapLayerId);
				
				// Create the modal
				const location_modal = nptUi.newModal (mapLayerId + '-chartsmodal');
				
				// Initialise the HTML structure for the set of chart boxes, writing in the titles and descriptions, and setting the canvas ID
				initialiseChartBoxHtml(mapLayerId, chartDefinition.charts);
				
				// Open modal on clicking the supported map layer
				_map.on ('click', mapLayerId, function (e) {
					
					// Ensure the source matches
					let clickedFeatures = _map.queryRenderedFeatures(e.point);
					clickedFeatures = clickedFeatures.filter(function (el) {
						const layersToExclude = ['composite', 'dasymetric', 'placenames']; // #!# Hard-coded list - need to clarify purpose
						return !layersToExclude.includes(el.source);
						//return el.source != 'composite';
					});
					if (clickedFeatures[0].sourceLayer != mapLayerId) {
						return;
					}
					
					// Display the modal
					location_modal.show();
					
					// Assemble the JSON data file URL
					const featureProperties = e.features[0].properties;
					const locationId = featureProperties[chartDefinition.propertiesField];
					const dataUrl = chartDefinition.dataUrl.replace('%id', locationId);
					
					// Get the data
					fetch(dataUrl)
						.then(function (response) {
							return response.json();
						})
						.then(function (json) {
							const locationData = json[0];
							//console.log ('Retrieved data for location ' + locationId, locationData);
							
							//Hide Spinner
							//document.getElementById('loader').style.display = 'none';
							
							// Set the title
							const title = chartDefinition.titlePrefix + featureProperties[chartDefinition.titleField];
							document.querySelector(`#${mapLayerId}-chartsmodal .modal-title`).innerHTML = title;
							
							// Create the charts
							createCharts(chartDefinition, locationData);
						})
						.catch(function (error) {	// Any error, including within called code, not just retrieval failure
							alert ('Failed to get data for this location, or to process it correctly. Please try refreshing the page.');
							console.log (error);
						});
				});
			}
			
			
			// Function to initialise the modal HTML from the template
			function initialiseChartsModalHtml (mapLayerId)
			{
				const template = document.querySelector(`#chart-modal`);
				const chartModal = template.content.cloneNode(true);
				chartModal.querySelector('.modal').id = mapLayerId + '-chartsmodal';
				document.body.appendChild(chartModal);
			}
			
			
			// Function to initialise the chart box HTML from the template
			function initialiseChartBoxHtml (mapLayerId, charts)
			{
				const template = document.querySelector(`#${mapLayerId}-chartsmodal .chart-template`);
				charts.forEach((chart) => {
					const chartBox = template.content.cloneNode(true);
					chartBox.querySelector('.chart-wrapper').id = chart[0] + '-chartrow';
					chartBox.querySelector('.chart-title').innerText = chart[1];
					chartBox.querySelector('.chart-description').innerText = chart[2];
					chartBox.querySelector('.chart-container canvas').id = chart[0] + '-chart';
					document.querySelector(`#${mapLayerId}-chartsmodal .modal-body`).appendChild(chartBox);
				});
			}
			
			
			// Function to create all charts
			function createCharts (chartDefinition, locationData)
			{
				// Create each chart
				chartDefinition.charts.forEach((chart, i) => {
					
					// Clear existing if present
					if (chartHandles[i]) {
						chartHandles[i].destroy();
					}
					
					// Assemble the datasets to be shown
					const datasets = [];
					chartDefinition.modes.forEach(mode => {
						datasets.push({
							label: mode[0],
							data: chartDefinition.scenarios.map(scenario => locationData[chart[0] + '_' + mode[1] + scenario[0]]),
							backgroundColor: mode[2],
							borderColor: mode[3],
							borderWidth: 1
						});
					});
					
					// Check for empty chart, i.e. all-undefined datasets, and if so, skip this chart, hiding its whole display row also to avoid the description showing
					let valuesPresent = false;
					datasets.forEach (dataset => {
						dataset.data.forEach (value => {
							if (typeof value !== 'undefined') {
								valuesPresent = true;
							}
						});
					});
					document.getElementById (chart[0] + '-chartrow').style.display = (valuesPresent ? 'block' : 'none');
					if (!valuesPresent) {return;	/* i.e. continue */}
					
					// Bar labels
					const labels = chartDefinition.scenarios.map(scenario => scenario[1]);
					
					// Render the chart (and register it to a handle so it can be cleared in future)
					chartHandles[i] = renderChart(chart[0] + '-chart', chart[3], datasets, labels);
				});
			};
			
			
			// Function to render a chart
			function renderChart (divId, title, datasets, labels)
			{
				// Create and return the chart
				return new Chart(document.getElementById(divId).getContext('2d'), {
					type: 'bar',
					data: {
						labels: labels,
						datasets: datasets
					},
					options: {
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: title
								},
								ticks: {
									beginAtZero: true,
								}
							},
							x: {
								stacked: true
							},
						},
						responsive: true,
						maintainAspectRatio: false
					}
				});
			}
			
			// Create each set of charts
			Object.entries (_datasets.charts).forEach(([mapLayerId, chartDefinition]) => {
				chartsModal (mapLayerId, chartDefinition);
			});
		},
		
		
		// Click handler for manual help buttons
		handleHelpButtons: function ()
		{
			document.querySelectorAll ('.helpbutton').forEach (function (button) {
				if (button.dataset.help) { // E.g. data-help="scenario" refers to the scenario section
					button.addEventListener ('click', function () {
						nptUi.showHelp (button.dataset.help);
					});
				}
			});
		},
		
		
		// Function to handle (?) help tooltips, loading extracts from the manual
		showHelp: function (sectionId)
		{
			//console.log("Trigger help for sectionId: " + sectionId);
			fetch ('/manual/index.md')
				.then (response => response.text())
				.then (text => {
					
					// Extract the Markdown text between comments
					const regex = new RegExp (`<!-- #${sectionId} -->(.+)<!-- /#${sectionId} -->`, 's'); // s flag is for 'match newlines'
					const result = regex.exec (text);
					const extract = result[1];
					
					// Convert to HTML
					const html = nptUi.mdToHtml (extract);
					
					// Parse to HTML
					const parser = new DOMParser ();
					const otherPage = parser.parseFromString (html, 'text/html');
					const contentHtml = otherPage.querySelector ('body');
					//console.log(otherDiv.innerHTML);
					if (!contentHtml) {
						contentHtml = '<p><strong>Help missing!</strong></p>';
					}
					
					// Add the HTML
					document.getElementById ('helpcontent').innerHTML = contentHtml.innerHTML;
				});
			
			// Show in modal
			const helpModal = nptUi.newModal ('help-modal');
			helpModal.show();
		},
		
		
		// Function to convert the loaded Markdown file text to HTML
		// #!# Copied from manual.js
		mdToHtml: function (mdText)
		{
			const converter = new showdown.Converter();
			const html = converter.makeHtml(mdText);
			return html;
		},
		
		
		// Function to create the sliders
		createSliders: function ()
		{
			// Find each div to be converted to a slider
			document.querySelectorAll('div.slider-styled').forEach(div => {
				
				// Calculate the attributes based on an associated <datalist>
				const attributes = nptUi.sliderAttributes(div.id);
				
				// Create the slider
				noUiSlider.create(div, {
					start: [attributes.min, attributes.max],
					connect: true,
					range: attributes.range,
					pips: {
						mode: 'range',
						density: attributes.density,
						format: attributes.format
					}
				});
				
				// Define handler to proxy the result to hidden input fields, with value "<numStart>-<numFinish>"
				div.noUiSlider.on ('update', function () {
					const inputField = 'input.slider[data-layer="rnet"][name="' + div.dataset.name + '"]';
					document.querySelector (inputField).value = Number (div.noUiSlider.get()[0]) + '-' + Number (div.noUiSlider.get()[1]);
					document.querySelector (inputField).dispatchEvent (new Event('change'));
				});
			});
		},
		
		
		// Function to determine the slider attributes based on a datalist accompanying the slider element
		sliderAttributes: function (sliderId)
		{
			// Start an object to hold range, min, max, density, format
			const sliderAttributes = {};
			
			// Identify the datalist
			const datalistElement = document.querySelector ('datalist[list="' + sliderId + '"]');
			if (!datalistElement) {
				console.log ('ERROR in HTML: No <datalist> defined for slider ' + sliderId);
				return {};
			}
			
			// Loop through each datalist value, e.g. slider-cycle should be accompanied by <datalist id="slider-cycle-values">
			sliderAttributes.range = {};
			let increments;
			const sliderOptions = Array.from(datalistElement.options);
			sliderOptions.forEach((option, index) => {
				
				// Determine the increment to the next; last item has no increment; use defined or calculated for others
				if (index == (sliderOptions.length - 1)) { // Last
					increments = null;
				} else if (option.dataset.hasOwnProperty('increments')) { // Increments defined
					increments = parseInt(option.dataset.increments);
				} else { // Increments is difference from current to next, e.g. 1 then 10 => 9
					increments = parseInt(sliderOptions[index + 1].value - option.value);
				}
				
				// Register result, e.g. {"12.5%": [1, 9], ...}
				sliderAttributes.range[option.dataset.position] = [parseInt(option.value), increments]; // E.g. [1, 9]
			});
			
			// Add min/max
			sliderAttributes.min = parseInt(sliderOptions[0].value);
			sliderAttributes.max = parseInt(sliderOptions[sliderOptions.length - 1].value);
			
			// Add density
			sliderAttributes.density = parseInt(datalistElement.dataset.density);
			
			// Add format labels, if any
			const labels = {};
			sliderOptions.forEach((option, index) => {
				if (option.dataset.hasOwnProperty('label')) {
					labels[option.value] = option.dataset.label;
				}
			});
			if (Object.keys(labels).length) {
				sliderAttributes.format = {
					to: function (value) {
						return (labels.hasOwnProperty(value) ? labels[value] : value);
					}
				};
			} else {
				sliderAttributes.format = null;
			}
			
			// Return the result
			//console.log ('Slider values for id ' + sliderId + ':', sliderAttributes);
			return sliderAttributes;
		},
		
		
		// Function to add tooltips
		tooltips: function ()
		{
			// Run once the map is ready; seems that the geolocation button loads too late
			_map.once ('idle', function () {
				
				// Apply tooltips to the map control buttons and to help buttons, as these have no visible labelling; title is used else ARIA label
				tippy('.maplibregl-control-container [title], .maplibregl-control-container [aria-label], .helpbutton', {
					content (element) {
						const title = element.getAttribute ('title');
						if (title) {
							element.removeAttribute ('title');	// Avoid native browser tooltips also showing
						}
						const ariaLabel = element.getAttribute ('aria-label');
						return title || ariaLabel;
					},
				});
			});
		},
		
		
		// function to manage analytics cookie setting
		manageAnalyticsCookie: function ()
		{
			// Disable tracking if the opt-out cookie exists.
			const disableStr = 'ga-disable-' + _settings.gaProperty;
			if (document.cookie.indexOf(disableStr + '=true') > -1) {
				window[disableStr] = true;
			}
			
			// Define the cookie name
			const cookieName = 'analyticstrack';
			
			// Handle cookie warning buttons
			document.querySelectorAll('#cookiewarning button').forEach(function (button) {
				button.addEventListener('click', function (e) {
					cookieButton(button.value);
				});
			});
			
			// Show the cookie warning
			showCookieWarning();
			
			
			// Opt-out function
			function gaOptout ()
			{
				document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/; SameSite=None; Secure';
				window[disableStr] = true;
			}
			
			
			// Warning Control
			function cookieButton (accepted)
			{
				if (accepted) {
					nptUi.setCookie(cookieName, 'true');
				} else {
					//alert("Tracking Op-Out Disabled");
					gaOptout();
					nptUi.setCookie(cookieName, 'false');
				}
				
				const cookiewarning = document.getElementById ('cookiewarning');
				cookiewarning.style.display = 'none';
			}
			
			
			// Cookie warning
			function showCookieWarning ()
			{
				const cookiewarning = document.getElementById ('cookiewarning');
				const cookie = nptUi.getCookie (cookieName);
				//console.log ("Cookie status: '" + cookie + "'");
				cookiewarning.style.display = (cookie === '' ? 'block' : 'none');
			}
		},
		
		
		// Function to manage modal dialogs
		newModal: function (modalId)
		{
			// Identify the modal
			const modal = document.getElementById(modalId);
			
			// When the user clicks on <span> (x), close the modal
			const closeButton = document.querySelector('#' + modalId + ' .modal-close');
			closeButton.addEventListener('click', function () {
				hide();
			});
			
			// Treat clicking outside of the modal as implied close
			window.addEventListener('click', function (event) {
				if (event.target == modal || event.target.id == 'overlay') {
					hide();
				}
			});
			
			// Treat escape key as implied close
			window.addEventListener('keyup', function (event) {
				if (event.key == 'Escape') {
					if (window.getComputedStyle(modal).display == 'block') { // I.e. is displayed
						hide();
					}
				}
			});
			
			// Show
			const show = function ()
			{
				document.getElementById('overlay').style.display = 'block';
				modal.style.display = 'block';
			};
			
			// Hide
			const hide = function ()
			{
				modal.style.display = 'none';
				document.getElementById('overlay').style.display = 'none';
			};
			
			// Accessor functions
			return {
				show: show,
				hide: hide
			};
		},
		
		
		// Function to format a date
		formatAsUKDate: function (date)
		{
			const options = {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};
			return new Date(date).toLocaleDateString('en-GB', options);
		},
		
		
		// Generic cookie managment functions
		setCookie: function (name, value, days = 100)
		{
			const d = new Date();
			d.setTime(d.getTime() + (24 * 60 * 60 * days * 1000));	// setTime is in ms
			const expires = 'expires=' + d.toUTCString();
			document.cookie = name + '=' + value + ';' + expires + ';path=/';
		},
		
		
		getCookie: function (name)
		{
			name = name + '=';
			const ca = document.cookie.split(';');
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) === 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}
	};
	
} ());
