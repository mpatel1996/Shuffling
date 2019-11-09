async function handleAdd(event) {
  let id = event.target.id.trim();
  let card;
  await axios
    .post("addCards/", { id: id })
    .then(response => {
      card = response.data.card;
      console.log(card);
      // add element to DOM
      let tr = $("<tr></tr>")
        .addClass("card-in-list")
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
        .addClass("btn btn-sm btn-round btn-outline-danger")
        .attr("id", card.id)
        .attr("onclick", "handleDelete(event)")
        .append("-");
      $("<td></td>")
        .append(btn)
        .appendTo(tr);
      $("#added-cards").append(tr);
    })
    .catch(err => console.log(err));
}

async function handleDelete(event) {
  let id = event.target.id.trim();
  // remove element from DOM
  $("." + event.target.id.trim()).remove();

  await axios
    .post("removeCards/", { id: id })
    .then(() => {
      console.log("remove successful");
    })
    .catch(err => console.log(err));
}

async function handleAddCollection() {
  await axios
    .post("addNewCollection/")
    .then(() => {
      console.log("Add group");
    })
    .catch(err => console.log(err));
}


