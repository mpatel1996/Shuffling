async function handleAdd(event) {
  let id = event.target.id.trim();
  await axios
    .post("addCards/", { id: id })
    .then(response => {
      let card = response.data.card;
      // add element to DOM
      let tr = $("<tr></tr>")
        .addClass("card-in-list bg-secondary")
        .addClass(card.id);
      $("<td></td>")
        .append(card.name)
        .appendTo(tr);
      $("<td></td>")
        .append(card.convertedManaCost)
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
      $("#collection").append(tr);
    })
    .catch(err => console.log(err));
}

async function handleDelete(event) {
  let id = event.target.id.trim();
  // remove element from DOM
  $("." + event.target.id.trim()).remove();
  // remove from server array
  axios
    .post("removeCards/", { id: id })
    .then(() => {
      console.log("remove successful");
    })
    .catch(err => console.log(err));
}

async function handleReset() {
  await axios
    .post("reset/")
    .then(() => {
      if ("<%$(collection.cards).length  == 0%>") {
        console.log("Reset Successfull");
        location.reload();
      }
    })
    .catch(err => console.log(err));
}

async function handleAcceptChanges() {
  await axios
    .post("addCardsToCollection/")
    .then(console.log("New collection saved."))
    .catch(err => console.log(err));
  location.reload();
}

function showHideLoader() {
  $(".loader").addClass("show");
}

$(document).ready(() => {
  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
});
