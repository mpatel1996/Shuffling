
function handleAdd(card) {
	//add cards to current card selection container
	addedCards.push(card);
	console.log(addedCards);
	// add element to DOM
      let tr = $("<tr></tr>")
        .addClass("card-in-list bg-secondary")
        .addClass(card.id);
      $("<td></td>")
        .append(card.name)
        .appendTo(tr);
      $("<td></td>")
        .append(card.manaCost)
        .appendTo(tr);
      $("<td></td>")
        .append(card.rarity)
        .appendTo(tr);
      let btn = $("<button></button>")
        .addClass("fas fa-minus-circle btn btn-sm btn-outline-danger")
        .attr("id", card.id)
        .attr("onclick", "handleDelete(event)");
      $("<td></td>")
        .append(btn)
        .appendTo(tr);
      $("#subgroup").append(tr);
	
	//disable submit button if needed
	if(addedCards.length > 0 ){
		$("#searchButton").attr('disabled', true);
		$("#updateButton").attr('disabled', false);
	} else {
		$("#searchButton").attr('disabled', false);
		$("#updateButton").attr('disabled', true);
	}
}

async function handleDelete(event) {
  let id = event.target.id.trim();
  // remove element from DOM
  $("." + id).remove();
  // remove from server array
	addedCards = addedCards.filter(card => card.id.localeCompare(id) !== 0);
	console.log(addedCards);
	//enable search button if needed
	if(addedCards.length > 0 ){
		$("#searchButton").attr('disabled', true);
		$("#updateButton").attr('disabled', false);
	} else {
		$("#searchButton").attr('disabled', false);
		$("#updateButton").attr('disabled', true);
	}
}

async function handleAcceptChanges() {
	console.log(addedCards);
	await axios
		.post("add/", {addedCards:addedCards})
		.then(console.log("done!"))
		.catch(err => console.log(err))
  	location.reload();
}

async function handleNewSubgroup() {
	console.log(addedCards);
	await axios
		.post("edit/", {addedCards:addedCards})
		.then(console.log("Update request sent!"))
		.catch(err => console.log(err))
  	location.reload();
}

// function to find where a card is located and how many
function searchCardByName(cardName) {
	let results = [];
	let tempForCounting = [];
	myCollections.map((subgroup) => {
		subgroup.cards.map((card) => {
			let tempCardName = card.name.toLowerCase();
			cardName = cardName.toLowerCase();
			console.log(tempCardName +" : " + cardName);
			let found = tempCardName.match(cardName);
			if(found) {
				if(!results.includes(subgroup.name)) {
					tempForCounting.push(subgroup.name);
				}
			}
		})
		if(tempForCounting.length !== 0){
			results.push({subgroupName:subgroup.name, count:tempForCounting.length});
		}
		//reset counter
		tempForCounting = [];
	})
	console.log(results);
	$("#currentSearchResults").remove();
	if(results.length > 0) {
		//create elements
		let div = $("<div id='currentSearchResults'></div>");
		let ul = $("<ul class='list-group'></ul>");
		$(div).append(ul);
		$("#currentSearchResults").append(div);
		results.forEach(res => {
			let li = "<li class='list-group-item list-group-item-light h6'>Container " + res.subgroupName + " has " + res.count+ " card(s) </li>";
			$(ul).append(li)
		})
		$("#searchResultsContainer").append(div);
	} else {
		$("#searchResultsContainer").append("<h5 id='currentSearchResults'>No cards found.<h5>");
	}
}

function showHideLoader() {
  $(".loader").addClass("show");
}

$(document).ready(() => {
  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
});
