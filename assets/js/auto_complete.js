function airportList(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + " airport-list");
      a.setAttribute("class", "airport-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].city_name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].city_name.substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].city_name.substr(val.length) + " - <span class='airport-name'> " + arr[i].airport_name + " (" + arr[i].IATA_code + ")" +"</span>";
          b.innerHTML += "<input type='hidden' value='" + arr[i].city_name + "'>";
          b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
			  inp.nextElementSibling.innerHTML = this.getElementsByClassName('airport-name')[0] ? this.getElementsByClassName('airport-name')[0].innerText : '';
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + " airport-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    $(x[currentFocus]).addClass("airport-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
	  $(x[i]).removeClass("airport-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("airport-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}