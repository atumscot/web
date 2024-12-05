# About NPT


## The Tool

The Network Planning Tool for Scotland (NPT) is a planning support system, research project, and web application to support strategic planning for active travel. The 2023 version is focused on cycle network planning and builds on the Department for Transport funded [Propensity to Cycle Tool](https://www.pct.bike/) for England and Wales.

The NPT uses data from the census and other reliable sources to estimate cycling uptake across Scotland if it delivers on the [vision](https://www.transport.gov.scot/media/33802/active_travel.pdf) for active travel to be the most popular choice for shorter everyday journeys.
It estimates what journeys would be taken by bike based on where people live, work, shop and socialise and the distances and hills between them.
Routing algorithms optimised for cycling assigns journeys to the existing road and path network, resulting cycling network flows for planning fast (direct), quiet (low traffic) and balanced (intermediate traffic) routes.
This evidence on estimated baseline and future potential cycling levels is provided at the network level, down to individual streets and cycleways nationwide across Scotland, allowing it to be used for planning and prioritising investment in joined up and cost-effective cycle networks.

It is designed to be used by local authorities, community groups and other organisations to help them plan for cycling but is open access and can be used by anyone to support more evidence-based and data-driven discussions about and decisions on cycling infrastructure and investment.

See the [manual](/manual) for more information on how to use the tool.

<p id="logos">
	<a href="https://environment.leeds.ac.uk/transport" target="_blank"><img src="/images/logos/leeds.png" alt="University of Leeds" /></a>
	<a href="https://www.sustrans.org.uk/about-us/our-work-in-scotland" target="_blank"><img src="/images/logos/sustrans.png" alt="Sustrans" /></a>
	<a href="https://www.transport.gov.scot/" target="_blank"><img src="/images/logos/transportscotland.svg" alt="Transport Scotland" /></a>
	<a href="https://www.cyclestreets.org/" target="_blank"><img src="/images/logos/cyclestreets.svg" alt="CycleStreets" /></a>
</p>

## The Team

<div>
	<div style="height: 260px">
		<img src="/images/robin.webp" alt="Robin Lovelace" style="width:200px; max-width:50%; float:right; box-shadow: 10px 10px 20px 0px #666;">
		<p>Dr Robin Lovelace, Associate Professor of Transport Data Science, University of Leeds.</p>
		<p>Robin is project lead.</p>
	</div>
	<div style="height:301px">
		<img src="/images/malcolm.webp" alt="Malcolm Morgan" style="width:200px; max-width:50%; float:right; box-shadow: 10px 10px 20px 0px #666;">
		<p>Dr Malcolm Morgan, Senior Research Fellow in and Spatial Analysis, University of Leeds.</p>
		<p>Malcolm is a specialist in GIS with an interest in low carbon transport and housing.</p>
	</div>

</div>


## Intellectual Property

The research and software underpinning the NPT tool is described in the following papers:

* The [Propensity to Cycle Tool (PCT)](https://www.pct.bike) for England and Wales (Lovelace [2016](https://eprints.whiterose.ac.uk/100080/); Lovelace et al. [2017](https://doi.org/10.5198/jtlu.2016.862); Goodman et al. [2019](https://doi.org/10.5198/jtlu.2016.862))
* The 'overline' method for generating and visualising route networks (Morgan and Lovelace [2020](https://doi.org/10.1177/2399808320942779))
* The 'jittering' method for disaggregating and adding geographic detail to origin-destination data (Lovelace et al. [2022](https://doi.org/10.1177/2399808320942779))

The NPT builds on the Propensity to Cycle Tool (PCT) for England and Wales which was funded by the Department for Transport, the development of which was led by Dr Robin Lovelace at the University of Leeds.

Non-transferable and non-exclusive rights to use background intellectual property are granted for the project's sole purpose. The arising intellectual property will be owned by the University of Leeds, Sustrans, or jointly, depending on who generated or developed it. The University of Leeds developed the code underlying the NPT tool as open source software licensed under the terms of the AGPLv3, as outlined below, to ensure public benefit arising from public investment in the tool and improvements to the underlying methods and software. The terms of any license agreement will be negotiated in good faith and will be fair and reasonable, taking into account the scientific and financial contributions of the University of Leeds and other parties.


## Open Source Policy

Like the PCT, the NPT tool is open source and licensed under the terms of the AGPLv3 to encourage community contributions and ensure public benefit arising from public investment in the tool, as outlined below.

The NPT Scotland project is open source, and the code is available on [GitHub](https://www.github.com/nptscot). The code is licensed under the Affero General Public License (AGPL) version 3.0 which enables anyone to use, modify and share the code for any purpose, subject to the conditions in the license, including the requirement that any modified versions of the code must be made available under the same license. See the full license in the project's open source repositories on GitHub in the bullet points below:

* Data processing and modelling code [license](https://github.com/nptscot/npt/blob/main/LICENSE)
* Web app code [license](https://github.com/nptscot/nptscot.github.io/blob/dev/LICENSE)

This means that you are free to copy and re-use the code but that if you use a version of the code, you must make the source code publicly available.


## Feedback and Contributions

We encourage feedback and contributions to the project:

* For general feedback please fill in our 5 minute [feedback survey](https://forms.office.com/Pages/ResponsePage.aspx?id=qO3qvR3IzkWGPlIypTW3ywVZfmO0bwdAhK0UztpneQtUM1pCRlJQQjY1V0M3MUhBV0g0VTJRS1ZQVi4u)
* Feature requests and bug reports can be made via the [issue tracker](https://github.com/nptscot/npt/issues).
* Code contributions can be made via Pull Requests to the [GitHub repository containing the web app](https://github.com/nptscot/nptscot.github.io/pulls).
* Questions and discussions are welcome in the [Discussions](https://github.com/nptscot/npt/discussions) section of the project's GitHub repo
* For general enquiries you can contact us on: [nptscotland@gmail.com](mailto:nptscotland@gmail.com)


## Privacy

Our [privacy policy](/privacy/) is available.


## References

* Lovelace, Robin. ‘Mapping out the Future of Cycling’. _Get Britain Cycling_, [2016](http://eprints.whiterose.ac.uk/100080/).
* Goodman, Anna, Ilan Fridman Rojas, James Woodcock, Rachel Aldred, Nikolai Berkoff, Malcolm Morgan, Ali Abbas, and Robin Lovelace. ‘Scenarios of Cycling to School in England, and Associated Health and Carbon Impacts: Application of the “Propensity to Cycle Tool”’. _Journal of Transport & Health_ 12 (1 March 2019): 263–78. [https://doi.org/10.1016/j.jth.2019.01.008](https://doi.org/10.1016/j.jth.2019.01.008).
* Lovelace, Robin, Anna Goodman, Rachel Aldred, Nikolai Berkoff, Ali Abbas, and James Woodcock. ‘The Propensity to Cycle Tool: An Open Source Online System for Sustainable Transport Planning’. _Journal of Transport and Land Use_ 10, no. 1 (1 January 2017). [https://doi.org/10.5198/jtlu.2016.862](https://doi.org/10.5198/jtlu.2016.862).
* Lovelace, Robin, Rosa Félix, and Dustin Carlino.. ‘Jittering: A Computationally Efficient Method for Generating Realistic Route Networks from Origin-Destination Data’. _Findings_, 8 April 2022, 33873. [https://doi.org/10.32866/001c.33873](https://doi.org/10.32866/001c.33873).
* Morgan, Malcolm, and Robin Lovelace. ‘Travel Flow Aggregation: Nationally Scalable Methods for Interactive and Online Visualisation of Transport Behaviour at the Road Network Level’. _Environment & Planning B: Planning & Design_, July 2020. [https://doi.org/10.1177/2399808320942779](https://doi.org/10.1177/2399808320942779).
