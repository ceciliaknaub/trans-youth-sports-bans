    const map = L.map('map').setView([37.8, -96], 4);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	// control that shows state info on hover
	const info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		const contents = props ? `<b>${props.name}</b><br />${props.bills} ban(s)` : 'Hover over a state';
		this._div.innerHTML = `<h4>Trans Youth Sports Bans</h4>${contents}`;
	};

	info.addTo(map);


	// get color depending on number of bans
	function getColor(d) {
		return d >= 3 ? '#e34a33' :
			d >= 2  ? '#fdbb84' :
			d >= 1  ? '#fee8c8' : '#fafafa';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.bills)
		};
	}

	function highlightFeature(e) {
		const layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		layer.bringToFront();

		info.update(layer.feature.properties);
	}

	/* global statesData */
	const geojson = L.geoJson(statesData, {
		style,
		onEachFeature
	}).addTo(map);

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	map.attributionControl.addAttribution('Legislative data &copy; <a href="https://www.lgbtmap.org/equality-maps/youth/sports_participation_bans">US Census Bureau</a>');

    //add marker for boise
    const marker = L.marker([43.6150,-115.2023]).addTo(map).bindPopup('In 2020, Idaho was the first state to pass a ban.').openPopup();

    //ad legends
	const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 1, 2, 3],
                labels = [];
                
                //creates a labels each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                    '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                    grades[i] + '<br>';
                }
                return div;
            };

	legend.addTo(map);
