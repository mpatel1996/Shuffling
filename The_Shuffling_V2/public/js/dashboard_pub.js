
async function handleAdd(event) {
    let id = event.target.id.trim();
    let card;
    await axios
        .post("editCollection/addCards", { id: id })
        .then((response) => {
            card = response.data.card;
            console.log(card);
            // add element to DOM
            let tr = $("<tr></tr>").addClass("card-in-list").addClass(card.id);
            $("<td></td>").append(card.name).appendTo(tr);
            $("<td></td>").append(card.manaCost).appendTo(tr);
            $("<td></td>").append(card.rarity).appendTo(tr);
            let btn = $("<button></button>")
                .addClass("btn btn-outline-danger")
                .attr("id", card.id)
                .attr("onclick", "handleDelete(event)")
                .append("-");
            $("<td></td>").append(btn).appendTo(tr);
            $('#added-cards').append(tr);
        })
        .catch(err => console.log(err));
}

async function handleDelete(event) {
let id = event.target.id.trim();
// remove element from DOM
$("." + event.target.id.trim()).remove();

await axios
    .post("editCollection/removeCards", { id: id })
    .then( () => { 
        console.log("remove successful");
    } )
    .catch(err => console.log(err));
}

async function handleAddGroup() {
    await axios
        .post("editCollection/addGroup")
        .then( () => { 
            console.log("Add group");
        } )
        .catch(err => console.log(err));
}