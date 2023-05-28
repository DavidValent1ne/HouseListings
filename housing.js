var city;
var state;
var street;
var zip;
var url;
var options;
var marker;
var lineBreak;
var breaks = 0;
import {initMap, intiMapURL, getMarkerPosition}  from './map.js';
intiMapURL();
initMap(0,0);

function addWarningMessage(message) {
	const warningDiv = document.createElement("div");
	warningDiv.textContent = message;
	warningDiv.style.backgroundColor = "red";
	warningDiv.style.padding = "10px";
	warningDiv.style.fontWeight = "bold";
	
	document.body.prepend(warningDiv);
	
	return warningDiv;
}
  
function removeWarningMessage(warningDiv) {
	if (warningDiv && warningDiv.parentNode) {
		warningDiv.parentNode.removeChild(warningDiv);
	}
}

function addLineBreak() {
	lineBreak = document.createElement('br');
	document.body.appendChild(lineBreak);
}

function removeLineBreaks() {
	var brTags = document.querySelectorAll('br');

	for (var i = 0; i < brTags.length; i++) {
	brTags[i].parentNode.removeChild(brTags[i]);
	}
  }

function initURL() {
	url = `https://realty-mole-property-api.p.rapidapi.com/properties?address=${encodeURIComponent(street)},%20${encodeURIComponent(city)},%20${encodeURIComponent(state)},%20${encodeURIComponent(zip)}`;
	console.log(url)
	options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'a19dd38ad6msh3c3d9c52ced24d0p1bdc6ejsn35f05a29571c',
			'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
		}
	};

	fetchDataset().then(datasetPromise => {
		console.log(datasetPromise);
		
		if (datasetPromise && datasetPromise.length > 0) {
			var cordTag = document.getElementById('cords');
			var sizeTag = document.getElementById('size');
			var locationTag = document.getElementById('location');
			var valueTag = document.getElementById('value');
			// remove text that may exist from previous call
			if (cordTag) {
				cordTag.parentNode.removeChild(cordTag);
				removeLineBreaks();
			}
			if (sizeTag) {sizeTag.parentNode.removeChild(sizeTag);}
			if (locationTag) {locationTag.parentNode.removeChild(locationTag);}
			if (valueTag) {valueTag.parentNode.removeChild(valueTag);}
			var dataset = datasetPromise;
			
			var latitude = dataset[0].latitude;
			var longitude = dataset[0].longitude;
			var sqrfootage = dataset[0].squareFootage;
			var address = dataset[0].addressLine1;
			try{ // this data does not always exist within the dataset from 2022
				var price = dataset[0].taxAssessment[2022].value;
			}
			catch {
				try{ // this data does not always exist within the dataset
					price = dataset[0].taxAssessment[2021].value;
				}
				catch {
					price = 'N/A'
				}
			}
			var cordinates = document.createElement('p');
			var size = document.createElement('p');
			var location = document.createElement('p');
			var value = document.createElement('p');

			// Set the text content of the paragraph
			cordinates.textContent = `Longitude: ${longitude}	Latitude: ${latitude}`;
			size.textContent = `Square Footage: ${sqrfootage}`;
			location.textContent = `Address: ${address}`;
			value.textContent = `Price: ${price}`;

			cordinates.setAttribute('id', 'cords');
			cordinates.setAttribute('class', 'highlight');
			size.setAttribute('id', 'size');
			size.setAttribute('class', 'highlight');
			location.setAttribute('id', 'location');
			location.setAttribute('class', 'highlight');
			value.setAttribute('id', 'value');
			value.setAttribute('class', 'highlight');

			document.body.appendChild(cordinates);
			addLineBreak();
			document.body.appendChild(size);
			addLineBreak();
			document.body.appendChild(location);
			addLineBreak();
			document.body.appendChild(value);


			marker = initMap(latitude, longitude);


			console.log(latitude, longitude); 
		} else {
			const warningMessage = "Empty dataset or invalid data received. There may be some missing data for newer homes";
			const warningDiv = addWarningMessage(warningMessage);
			setTimeout(() => {
				removeWarningMessage(warningDiv);
			  }, 5000);
		}
		}).catch(error => {
		console.log("Error occurred while fetching dataset promise:", error);
		});
}

export function initURLWithCords(latitude, longitude) {
	url =`https://realty-mole-property-api.p.rapidapi.com/properties?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&radius=0.03&limit=1`
	console.log(url)
	options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'a19dd38ad6msh3c3d9c52ced24d0p1bdc6ejsn35f05a29571c',
			'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
		}
	};

	fetchDataset().then(datasetPromise => {
		console.log(datasetPromise);
		
		if (datasetPromise && datasetPromise.length > 0) {
			var cordTag = document.getElementById('cords');
			var sizeTag = document.getElementById('size');
			var locationTag = document.getElementById('location');
			var valueTag = document.getElementById('value');
			// remove text that may exist from previous call
			if (cordTag) {
				cordTag.parentNode.removeChild(cordTag);
				removeLineBreaks();
			}
			if (sizeTag) {sizeTag.parentNode.removeChild(sizeTag);}
			if (locationTag) {locationTag.parentNode.removeChild(locationTag);}
			if (valueTag) {valueTag.parentNode.removeChild(valueTag);}

			var dataset = datasetPromise;
			
			var latitude = dataset[0].latitude;
			var longitude = dataset[0].longitude;
			var sqrfootage = dataset[0].squareFootage;
			var address = dataset[0].addressLine1;
			try{ // this data does not always exist within the dataset from 2022
				var price = dataset[0].taxAssessment[2022].value;
			}
			catch {
				try{ // this data does not always exist within the dataset
					price = dataset[0].taxAssessment[2021].value;
				}
				catch {
					price = 'N/A'
				}
			}
			var cordinates = document.createElement('p');
			var size = document.createElement('p');
			var location = document.createElement('p');
			var value = document.createElement('p');

			// Set the text content of the paragraph
			cordinates.textContent = `Longitude: ${longitude}	Latitude: ${latitude}`;
			size.textContent = `Square Footage: ${sqrfootage}`;
			location.textContent = `Address: ${address}`;
			value.textContent = `Value: ${price}`;

			cordinates.setAttribute('id', 'cords');
			cordinates.setAttribute('class', 'highlight');
			size.setAttribute('id', 'size');
			size.setAttribute('class', 'highlight');
			location.setAttribute('id', 'location');
			location.setAttribute('class', 'highlight');
			value.setAttribute('id', 'value');
			value.setAttribute('class', 'highlight');

			document.body.appendChild(cordinates);
			addLineBreak();
			document.body.appendChild(size);
			addLineBreak();
			document.body.appendChild(location);
			addLineBreak();
			document.body.appendChild(value);


			marker = initMap(latitude, longitude);


			console.log(latitude, longitude); 
		} else {
			const warningMessage = "Empty dataset or invalid data received.There may be some missing data for newer homes";
			const warningDiv = addWarningMessage(warningMessage);
			setTimeout(() => {
				removeWarningMessage(warningDiv);
			  }, 5000);
		}
		}).catch(error => {
		console.log("Error occurred while fetching dataset promise:", error);
		});
}


function handleFormSubmission(event) {
    event.preventDefault();
    
    var formData = new FormData(event.target);
	city = formData.get('city');
    zip = formData.get('zip');
    street = formData.get('street');
	state = formData.get('zip');
  
    console.log(city, state, zip, street);

    event.target.reset();
	initURL();
}

document.querySelector('form').addEventListener('submit', handleFormSubmission);

var dataset;
async function fetchDataset() { 
	try {
		var response = await fetch(url, options);
		let datasetPromise = await response.json();
		return datasetPromise;
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
}

