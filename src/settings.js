
// Settings for this installation
const settings = {
	
	// Map position
	initialPosition: {
		center: [-3.1382, 55.9533],	// Lon,lat
		zoom: 8,
	},
	maxZoom: 19,
	minZoom: 6,
	
	// Geocoder
	geocoderViewbox: '-7.957465,54.576074,-0.150894,61.147476',	// Prefer results to this area; this is Scotland
	geocoderBounded: 1,	// Whether to force results to be within the viewbox
	
	// Basemap styles
	basemapStyleDefault: 'greyscale_nobuild',
	basemapStyles: {
		'greyscale_nobuild': {
			title: 'OS greyscale',
			buildingColour: '#d1cfcf'
		},
		'satellite': {
			title: 'Satellite',
			buildingColour: false   // No buildings
		},
		'opencyclemap': {
			title: 'OpenCycleMap',
			buildingColour: false   // No buildings
		},
		'google_nobuild': {
			title: 'Outdoors',
			buildingColour: '#f0eded'
		},
		'dark_nobuild': {
			title: 'Dark',
			buildingColour: '#000000'
		},
	},
	
	// Tileserver for data layers
	tileserverUrl: 'https://nptscot.blob.core.windows.net/pmtiles',		// Not slash-terminated
	// Local tileserver in tiles/ folder:
	// tileserverUrl: 'http://127.0.0.1:4321/tiles',
	tileserverTempLocalOverrides: {		// Temporarily define any local folder paths where particular layers should come from
		//rnet: 'utilitytrips/',
		//coherentnetwork: 'coherentnetwork/',
	},
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/dasymetric-2023-12-17.pmtiles',
	placenamesTilesUrl: 'pmtiles://%tileserverUrl/oszoom_names.pmtiles',
	
	// Manual
	manualEditingUrl: 'https://github.com/nptscot/nptscot.github.io/edit/dev/%id/index.md',
	
	// Boundaries
	boundariesUrl: 'https://nptscot.github.io/scheme-sketcher/assets/boundaries-3d573d2e.geojson',
	
	// OSM data date
    osmDate: null,  // Will be loaded from settings.json
	
	// Analytics
	gaProperty: 'G-QZMHV92YXJ',
	
	// UI callback
	uiCallback: rnetCheckboxProxying,	// Defined below
	
	// Initial layers enabled
	initialLayersEnabled: ['rnet'],
};

// Load osmDate from settings.json
fetch('src/settings.json')
    .then(response => response.json())
    .then(data => {
        settings.osmDate = data.osmDataDate;
        // Make settings globally available after loading
        window._settings = settings;
    })
    .catch(error => {
        console.error('Error loading settings.json:', error);
        settings.osmDate = '2025-01-01';  // Fallback value
        // Make settings globally available even if loading fails
        window._settings = settings;
    });

// Function to handle bi-directional rnet checkbox proxying - the combination of the enabled and simplified checkboxes set the 'real' layer checkboxes
function rnetCheckboxProxying ()
{
	// Create handles to the real checkbox values and the enabled/simplified boxes
	const rnetCheckboxProxy = document.getElementById ('rnetcheckboxproxy');
	const rnetsimplifiedCheckboxProxy = document.getElementById ('rnet-simplifiedcheckboxproxy');
	const rnetCheckbox = document.querySelector ('input.showlayer[data-layer="rnet"]');
	const rnetsimplifiedCheckbox = document.querySelector ('input.showlayer[data-layer="rnet-simplified"]');
	
	// On initial display, set the proxy checkboxes to reflect the underlying real ticked layer boxes (which will have been set in manageLayers)
	if (rnetCheckbox.checked || rnetsimplifiedCheckbox.checked) {rnetCheckboxProxy.checked = true; /* but do not trigger change, to avoid loop */}
	if (rnetsimplifiedCheckbox.checked) {rnetsimplifiedCheckboxProxy.checked = true; /* but do not trigger change, to avoid loop */}
	
	// Define a function to calculate the real layer checkboxes (rnet/rnet-simplified) values based on the visible (enabled/simplified) boxes which act in combination to determine the visible layer
	function setRnetCheckboxes ()
	{
		// Calculate the real checkbox values based on the enabled/simplified boxes
		const layerEnabled = rnetCheckboxProxy.checked;
		const simplifiedMode = rnetsimplifiedCheckboxProxy.checked;
		rnetCheckbox.checked = (layerEnabled && !simplifiedMode);
		rnetCheckbox.dispatchEvent (new CustomEvent ('change'));
		rnetsimplifiedCheckbox.checked = (layerEnabled && simplifiedMode);
		rnetsimplifiedCheckbox.dispatchEvent (new CustomEvent ('change'));
	}
	
	// Change state when the visible UI checkboxes (enabled/simplified) change
	document.querySelectorAll ('.rnetproxy').forEach ((input) => {
		input.addEventListener ('change', function (e) {
			setRnetCheckboxes ();
		});
	});
}
