/**
 * Fetch API
 */
async function loadUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await res.json();
  console.log(data.name);
}
loadUsers();
