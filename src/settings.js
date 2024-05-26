
// Settings for this installation
const settings = {
	
	// Map position
	initialPosition: {
		center: [-3.1382, 55.9533],	// Lon,lat
		zoom: 8,
	},
	maxZoom: 19,
	minZoom: 6,
	
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
		//cohesivenetwork: 'cohesivenetwork/',
	},
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/dasymetric-2023-12-17.pmtiles',
	placenamesTilesUrl: 'pmtiles://%tileserverUrl/oszoom_names.pmtiles',
	
	// Manual
	manualEditingUrl: 'https://github.com/nptscot/nptscot.github.io/edit/dev/%id/index.md',
	
	// OSM data date
	osmDate: '6 December 2023',
	
	// Analytics
	gaProperty: 'G-QZMHV92YXJ',
	
	// UI callback
	uiCallback: rnetCheckboxProxying,	// Defined below
};


// Function to handle bi-directional rnet checkbox proxying - the combination of the enabled and simplified checkboxes set the 'real' layer checkboxes
function rnetCheckboxProxying ()
{
	// Create handles to the real checkbox values and the enabled/simplified boxes
	const rnetCheckboxProxy = document.getElementById ('rnetcheckboxproxy');
	const rnetsimplifiedCheckboxProxy = document.getElementById ('rnet-simplifiedcheckboxproxy');
	const rnetCheckbox = document.querySelector ('input.showlayer[data-layer="rnet"]');
	const rnetsimplifiedCheckbox = document.querySelector ('input.showlayer[data-layer="rnet-simplified"]');
	
	// Define a function to calculate the real checkbox values based on the enabled/simplified boxes
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
	
	// Set initial state
	setRnetCheckboxes ();
	
	// Change state when the visible UI checkboxes change
	document.querySelectorAll ('.rnetproxy').forEach ((input) => {
		input.addEventListener ('change', function (e) {
			setRnetCheckboxes ();
		});
	});
	
	// Ensure the visible enabled/simplified boxes are set to match the real checkbox values on initial load due to URL state
	document.addEventListener ('@map/initiallayersset', function (event) {
		const layerProxyEnabled = (rnetCheckbox.checked || rnetsimplifiedCheckbox.checked);
		const simplifiedModeProxyEnabled = rnetsimplifiedCheckbox.checked;
		rnetCheckboxProxy.checked = (layerProxyEnabled);
		rnetsimplifiedCheckboxProxy.checked = (layerProxyEnabled && simplifiedModeProxyEnabled);
		// Events are not dispatched, to avoid event loop
	});
}

		
