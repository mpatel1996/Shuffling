async function handleEditCollection(event) {
  id = event.target.id.trim();
  console.log(id);
  await axios
    .get("allCollections/editCollection", { id: id })
    .then(console.log("Working!"))
    .catch(err => console.log(err));
}
