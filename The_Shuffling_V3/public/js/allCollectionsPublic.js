async function handleEditCollection(event) {
  id = event.target.id.trim();
  console.log(id);
  await axios
    .get("allCollections/editCollection", { id: id })
    .then(console.log("Working!"))
    .catch(err => console.log(err));
}

async function handleAddCollection() {
  await axios
    .get("allCollections/editCollection/addNewCollection/new")
    .then(() => {
      console.log("Add group");
    })
    .catch(err => console.log(err));
}