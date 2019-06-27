
// var flightResults = [];
var searchedflightResults = [];
var filterSortResults = [];
var weekDays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

/***
* This method should call when search flight form submits
*/
function searchFlight() {
	if(validateFromToLocation()) {
		var resultDiv = document.getElementById('results');
		resultDiv.innerHTML = '';
		$("#results").removeClass('animate-bottom');
		document.getElementById('filter-section').style.display = 'none';
		document.getElementById('message').innerHTML = '';
		document.getElementById("loader").style.display = "block";
		setTimeout(function() {
			var formLocation = document.getElementById('from-location').value.toUpperCase();
			var toLocation = document.getElementById('to-location').value.toUpperCase();
			var journyDate = document.getElementById('journy-date').value;
			var returnDate = document.getElementById('return-date').value;
			searchFor(formLocation, toLocation, journyDate);
			document.getElementById('loader').style.display = 'none';
			document.getElementById('results').className = 'animate-bottom';
		}, 3000);
	}
}

/***
* This method will confirm the from and to location should not the same and thrown and error in UI
*/
function validateFromToLocation() {
	var fromLocationValue = document.getElementById('from-location').value;
	var toLocationValue = document.getElementById('to-location').value;
	if (fromLocationValue && toLocationValue && fromLocationValue === toLocationValue) {
		document.getElementById('validationError').style.display = 'block';
		return false;
	} else {
		document.getElementById('validationError').style.display = 'none';
		return true;
	}
}

/***
* This method is used to search the flights
* @param 'from' is from location which user selected
* @param 'to' is to location which user selected
* @param 'journyDate' is journey date which user selected
*/
function searchFor(from, to, journyDate) {
	searchedflightResults = [];
	from = trimString(from); // trim string from location
	to = trimString(to); // trim string to location
	for(var i=0; i<flightInfo.length; i++) {
		if(flightInfo[i].location.fromLocation.toUpperCase().indexOf(from)!=-1 && flightInfo[i].location.toLocation.toUpperCase().indexOf(to)!=-1 && flightInfo[i].date.depatureDate.indexOf(journyDate)!=-1) {
			searchedflightResults.push(flightInfo[i]);
		}
	}
	frameTemplate(searchedflightResults);
	filterSortResults = searchedflightResults;
	if(document.getElementById('results').innerHTML === '') {
		document.getElementById('message').innerHTML  = '<div class="col-12 messages info">Sorry, there is no flights available for your search location..! Please try with some other location and date..!</div>';
		document.getElementById('filter-section').style.display = 'none';
	}
}

/***
* This method is used to trim the string
* @param 'value' to trim
*/
function trimString(value) {
	var l=0, r=value.length -1;
	while(l < value.length && value[l] == ' ') l++;
	while(r > l && value[r] == ' ') r-=1;
	return value.substring(l, r+1);
}

/***
* This method is used to build flight results in HTML template
* @param 'resultToBuildTemplate' is result JSON to make it as a HTML
*/
function frameTemplate(resultToBuildTemplate) {
	var result = [];
	for(var i=0; i<resultToBuildTemplate.length; i++) {
		var depDate = dateFormator(resultToBuildTemplate[i].date.depatureDate);
		var arrDate = dateFormator(resultToBuildTemplate[i].date.arrivalDate);
		var depTime = new Date(depDate + ' ' + resultToBuildTemplate[i].departureTime + ':00');
		var arrTime = new Date(arrDate + ' ' + resultToBuildTemplate[i].arrivalTime + ':00');
		result += "<div class='flight-info'>" + 
			"<div class='col-2'>" +
				"<div class='flight-icon'><img src='./assets/images/flight-icons/" + resultToBuildTemplate[i].flightIcon + ".png' /></div>" +
				"<div class='flight-name'>" + 
					"<p>" + resultToBuildTemplate[i].flightName + "</p>" +
					"<span class='flight-no'>" + resultToBuildTemplate[i].flightNo + "</span>" +
				"</div>" +					
			"</div>" +
			"<div class='col-2'>" +
				"<div class='flight-depature'>" + resultToBuildTemplate[i].departureTime + "</div>" +
				"<div class='flight-depature-location'>" + resultToBuildTemplate[i].location.fromLocation + "</div>" +
			"</div>" +
			"<div class='col-2'>" +
				"<div class='traveltime'>" + timeDifference(depTime, arrTime) + "</div>" +
				"<div class='flight-stop-type'>" + resultToBuildTemplate[i].stopType + "</div>" +
			"</div>" +
			"<div class='col-2'>" +
				"<div class='flight-arival-time'>" + resultToBuildTemplate[i].arrivalTime + "</div>" +
				"<div class='flight-to-location'>" + resultToBuildTemplate[i].location.toLocation + "</div>" +
			"</div>" +
			"<div class='col-2'>" +
				"<div class='flight-cost'>&#x20b9;" + resultToBuildTemplate[i].price + "</div>" +
			"</div>" +
			"<div class='col-2'>" +
				"<div class='book-now-btn'><button class='orange-small-btn btn-right'>Book Now</button></div>" +
			"</div>" +
		"</div>"
	}
	document.getElementById('results').innerHTML = result;
	document.getElementById('filter-section').style.display = 'block';
}

/***
* This method is used to format the given date as a MM/DD/YYYY 
* @param 'date' should format it
*/
function dateFormator(date) {
	date = new Date(date);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear();
	return month + '/' + day + '/' + year;
}

/***
* This method is used to identify the difference between two times to check the flight travelling time between source and designation.
* @param 'time1' is a departure time
* @param 'time2' is a arrival time
*/
function timeDifference(time1, time2) {
	date1 = new Date(time1);
	date2 = new Date(time2);
	var res = Math.abs(date1 - date2) / 1000;
	var days = Math.floor(res / 86400); // find days
	var hours = Math.floor(res / 3600) % 24; // find hours
	var minutes = Math.floor(res / 60) % 60; // find minutes
	var seconds = res % 60; // find seconds
	var timeDiff = '';
	console.log('Time Difference: ' + days + ' : ' + hours + ' : ' + minutes + ' : ' + seconds);
	if (days > 0) timeDiff += days + 'd ';
	if (hours > 0) timeDiff += hours + 'h ';
	if (minutes > 0) timeDiff += minutes + 'm ';
	if (seconds > 0) timeDiff += seconds + 's ';
	return timeDiff;
}

/***
* This method is used to disable/enable the return date filed when we select one way/round trip selection
* @param 'tripType' trip type Ex. One-way, Round Trip
*/
function tripTypeChange(tripType) {
	if (tripType.value === 'round') {
		$("#return-date").datepicker( "option", "disabled", false );
	} else {
		$("#return-date").datepicker( "option", "disabled", true );
		document.getElementById('return-date').value = '';
		document.getElementById('return-day').innerHTML = '';
	}		
}

/***
* This method is used to set the minimum date for journey date as current date
*/
function setJournyDate() {
	var today = new Date();
	var dateFormat = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
	$('#journy-date').datepicker( "option", "minDate", dateFormat);
	setReturnDateDisable();
}

/***
* This method is used to set minimum date of return date to validate the return date should not previous date of journey date.
*/
function setReturnDateDisable() {
	var journyDate = new Date(document.getElementById('journy-date').value);
	document.getElementById('journy-day').innerHTML = document.getElementById('journy-date').value ? weekDays[journyDate.getDay()] : '';
	var maxReturnDate = journyDate.getFullYear() + '-' + ('0' + (journyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + journyDate.getDate()).slice(-2);
	$('#return-date').datepicker( "option", "minDate", maxReturnDate);
	setReturnDate();
}

/***
* This method is used to identify the day when we select return date
*/
function setReturnDate() {
	var returnDate = new Date(document.getElementById('return-date').value);
	document.getElementById('return-day').innerHTML = document.getElementById('return-date').value ? weekDays[returnDate.getDay()] : '';
}

/***
* This method is used to add the travellers count when click on '+'
* @param 'max' maximum limit to add the travellers '10 members'
* @param 'ele' is get the input box to print the value
*/
function up(max, ele) {
	var inputBoxId = ele.previousElementSibling.id;
	document.getElementById(inputBoxId).value = parseInt(document.getElementById(inputBoxId).value) + 1;
	if (document.getElementById(inputBoxId).value >= parseInt(max)) {
		document.getElementById(inputBoxId).value = max;
	}
	travellersCount();
}

/***
* This method is used to remove the travellers count when click on '-'
* @param 'min' minimum limit to add the travellers '0 members'
* @param 'ele' is get the input box to print the value
*/
function down(min, ele) {
	var inputBoxId = ele.nextElementSibling.id;
	document.getElementById(inputBoxId).value = parseInt(document.getElementById(inputBoxId).value) - 1;
	if (document.getElementById(inputBoxId).value <= parseInt(min)) {
		document.getElementById(inputBoxId).value = min;
	}
	travellersCount();
}

/***
* This method is used to print the travellers count when we add or remove it.
*/
function travellersCount() {
	var totalCount = parseInt(document.getElementById('adultCount').value) + parseInt(document.getElementById('childCount').value) + parseInt(document.getElementById('infantCount').value);
	document.getElementById('total-traveller-count').textContent = totalCount + ' Traveller(s)';
}

/***
* This method should call when click on the Travellers and Economy button to toggle the tool bar to fill information
* @param 'ele' is a element to toggle the tool bar
*/
function showHideToolWindow(ele) {
	$('#'+ele).toggle('slow');
}

/***
* This method to check element has the corresponding class or not
* @param 'element' which element to check
* @param 'cls' which class to check
*/
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

/***
* This method used to select the class type and print the selected class name
* @param 'ele' is a element to get the value
*/
function classTypeChange(ele) {
	document.getElementById('class-type').textContent = ele.value;
}

/***
* This method is used to filter the flight results based on the filter type. Ex. Stop type, Airline name
* @param 'ele' is element value to filter it
* @param 'filterType' is a key name to filter
*/
function filterSelection(ele, filterType) {
	document.getElementById('results').innerHTML = '';
	document.getElementById('message').innerHTML = '';
	var i, flightResults = [];
	filterSortResults = [];
	var filterValue = ele.value;
	for(i=0; i<searchedflightResults.length; i++) {
		if(searchedflightResults[i][filterType] && searchedflightResults[i][filterType].toUpperCase().indexOf(filterValue.toUpperCase())!=-1) {
			filterSortResults.push(searchedflightResults[i]);
		} 
		else if(searchedflightResults[i] && filterValue === 'any') {
			filterSortResults.push(searchedflightResults[i]);
		}
	}
	frameTemplate(filterSortResults);
	if(document.getElementById('results').innerHTML === '') {
		document.getElementById('message').innerHTML  = '<div class="col-12 messages info">Sorry, there is not flights available for your filter values..! Please try with some other options..!</div>';
	}
}

/***
* This method is used to sort the flight informations. Ex, Price, Flight name, Departure time, Arrival time
* @param 'sortBy' is a asc/desc order
* @param 'key' is key name to sort it
*/
function sortByAscDesc(sortBy, key) {
	document.getElementById('results').innerHTML = '';
	var sortBy = sortBy.value;
	var i, flightResults = [];
	filterSortResults.sort(function(a, b) {
		if(sortBy === 'asc') {
			return (a[key] > b[key]) ? 1 : ((a[key] < b[key]) ? -1 : 0);
		} else if(sortBy === 'desc') {
			return (b[key] > a[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0);
		}
	});
	for(i=0; i<filterSortResults.length; i++) {
		flightResults.push(filterSortResults[i]);
	}
	frameTemplate(flightResults);
}