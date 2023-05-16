
const currentSearchParams = new URLSearchParams((location.href.split("?")[1] ?? ''));
var offset = currentSearchParams.get("offset") ?? 0;
var end = false;
var fetchingUsers = false;
const limit = 10;

function isOnScreen(element) {
    const rect = element.getBoundingClientRect();
    return window.innerHeight > rect.top && rect.top >= 0;

}


function drawNewRow(jsonObject) {
    const element = document.querySelector(".user-table-body");
    const tr = document.createElement("tr");
    const date = new Date(jsonObject["createdAt"] * 1000);
    tr.classList.add("user-entry");
    tr.innerHTML = `                  
    <td>
        <input type="checkbox">
    </td>
    <td class="user-info">
        <img class="user-photo" src="assets/images/person.png" alt="user">
        <div class="user-name">
            <p>${jsonObject["displayName"]}</p>
            <p>${jsonObject["username"]}</p>
        </div>
    </td>
    <td>
        <a href="mailto:${jsonObject["email"]}" >${jsonObject["email"]}</a>
    </td>
    <td>
        <p class="role ${jsonObject["type"]}">${jsonObject["type"].charAt(0).toUpperCase() + jsonObject["type"].slice(1)}</p>
    </td>
    <td>
        <p>${date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + " " + date.getDate().toString().padStart(2, "0") + "/" + (date.getMonth() + 1).toString().padStart(2, "0") + "/" + date.getFullYear().toString().padStart(2, "0")}</p>
    </td>
    <td>
        <i class="ri-edit-line icon"></i>
    </td>
    <td>
        <i class="ri-delete-bin-line icon" style="color: var(--delete-color)" onclick="makeDeleteModal(${jsonObject["username"]})"></i>
    </td>`
    element.appendChild(tr);


}

const getNewTableData = async (ev) => {
    if (ev.deltaY < 0) return;
    if (end) return;
    const element = document.querySelector(".user-table-body")
    if (element === null) return;
    if (element.lastElementChild === null) return;
    if (isOnScreen(element.lastElementChild) && !fetchingUsers) {
        fetchingUsers = true;
        console.log("fetching new user data...");
        //fetch
        const sortBy = currentSearchParams.get("sort");
        const res = await fetch(`/api/clients.php?limit=10&offset=${offset + element.children.length}${sortBy !== null ? "&sort=" + sortBy : ''}`,
            { method: "GET" });

        if (res.status !== 200) {
            console.log(`Users list request failed with status ${res.status}`);
        }
        const resJson = await res.json();
        console.log(resJson);
        if (resJson.length === 0) {
            end = true;
            return;
        }
        //draw
        resJson.forEach(drawNewRow);
        fetchingUsers = false;

    }
};
document.addEventListener("scroll", getNewTableData);

function closeModal() {
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    const modalElement = document.querySelector(".modal");
    if (modalElement === null) return;
    modalElement.animate([
        { opacity: 1 },
        { opacity: 0, visbility: "hidden" },
    ], { duration: 200, iterations: 1 }).onfinish = (event) => {
        modalElement.style.display = "none";
        const modalContentElement = document.querySelector(".modal-content");
        modalContentElement.classList = ["modal-content"] //reset classes
        if (modalContentElement === null) return;
        modalContentElement.innerHTML = '';
    };

}


function makeDeleteModal(username) {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";

    const modalElement = document.querySelector(".modal");
    if (modalElement === null) return;

    const modalContentElement = document.querySelector(".modal-content");
    modalContentElement.classList.toggle("delete-user-modal");
    if (modalContentElement === null) return;

    //TODO: inject CSRF token
    modalContentElement.innerHTML = `
    <h1>Delete User</h1>
    <p>Are you sure that you want to delete user <b>${username}</b>? This action is irreversible...</p>
    <div class="delete-modal-buttons">
        <button class="cancel-button" onclick="closeModal()"><p>Cancel</p></button>
        <form method="post" action="admin">
            <input type="hidden" name="action" value="deleteUser">
            <input type="hidden" name="username" value="${username}">
            <input type="hidden" name="lastHref" value="${location.href}">


            <input type="submit" class="delete-button" onclick="deleteUser('${username}')" value="Delete">
        </form>
        </div>`;
    modalElement.style.display = "block";
    modalElement.style.opacity = 0;
    modalElement.animate([
        { opacity: 0 },
        { opacity: 1, visbility: "visible" },
    ], { duration: 200, iterations: 1 }).onfinish = (event) => {
        modalElement.style.opacity = 1;
    }



}