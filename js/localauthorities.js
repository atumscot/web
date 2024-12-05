// Load data
loadLocalAuthorities (settings);

// Top nav
topnav ();


// Load the Markdown file as text and place it into the content div
function loadLocalAuthorities (settings)
{
	// Fetch the data
	fetch (settings.boundariesUrl)
		.then (function (response) {
			return response.json ();
		})
		.then (function (boundaries) {
			
			// Add the table
			const div = document.createElement ('div');
			div.innerHTML = boundariesTable (boundaries);
			document.querySelector ('#content').appendChild (div);
		});
}


// Function to render the table
function boundariesTable (boundaries)
{
	// Build the table from each feature
	let html = '<table class="lines">';
	html += '<tr>';
	html += '<th>Type</th>';
	html += '<th>Area</th>';
	html += '<th>Scheme sketcher</th>';
	html += '</tr>';
	Object.entries (boundaries.features).forEach (function ([index, feature]) {
		const linkUrl = '/scheme-sketcher/sketch.html?boundary=' + encodeURIComponent (feature.properties.kind + '_' + feature.properties.name);
		html += '<tr>';
		html += '<td>' + feature.properties.kind + '</td>';
		html += '<td>' + feature.properties.name + '</td>';
		html += '<td>' + '<a href="' + linkUrl + '">Scheme sketcher</a></td>';
		html += '</tr>';
	});
	html += '</table>';
	
	// Return the HTML
	return html;
}



// Function to create table of contents
function createToc ()
{
  // Create new div and attach to body
  const tocDiv = document.createElement('div');
  tocDiv.classList.add ('table-of-contents');
  document.querySelector('body').appendChild (tocDiv);
  
  // Add UL to TOC
  const ul = document.createElement('ul');
  tocDiv.appendChild (ul);
  
  const toc = document.querySelector('.table-of-contents');
  const headings = document.querySelectorAll('h2, h3');

  let lastH2Item = null;

  headings.forEach((heading) => {
    const level = heading.tagName.toLowerCase();
    const title = heading.textContent;
    const anchor = heading.id;

    const link = document.createElement('a');
    link.textContent = title;
    link.setAttribute('href', `#${anchor}`);

    const item = document.createElement('li');
    item.appendChild(link);

    if (level === 'h2') {
      const sublist = document.createElement('ul');
      item.appendChild(sublist);
      toc.querySelector('ul').appendChild(item);
      lastH2Item = item;
    } else if (level === 'h3' && lastH2Item) {
      const sublist = document.createElement('ul');
      item.appendChild(sublist);
      lastH2Item.querySelector('ul').appendChild(item);
    }

    heading.addEventListener('click', () => {
      location.hash = anchor;
    });
  });
}


// Function to create an editing link
function createEditLink ()
{
  // Determine the page slug (e.g. /manual/ is 'manual')
  const matches = window.location.pathname.match (new RegExp ('^/([^/]+)/'));
  const slug = matches[1];
  
  // Assemble the link
  const link = settings.manualEditingUrl.replace ('%id', slug);
  
  // Create new div and attach to body
  document.querySelector('#editlink').href = link;
}


// Main menu responsive display
function topnav ()
{
  document.getElementById ('expandtopnav').addEventListener ('click', function (e) {
    var nav = document.querySelector ('nav');
    if (!nav.classList.contains ('responsive')) {
      nav.classList.add ('responsive');
    } else {
      nav.classList.remove ('responsive');
    }
    e.preventDefault ();
  });
}
