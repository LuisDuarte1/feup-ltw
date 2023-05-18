document.querySelectorAll(".ticket-card").forEach((ticketCard) => {
    ticketCard.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        window.location.href = '/ticket?id=' + id;
    });
});

async function makeUserAssignModal(usertype) {
    if (usertype != "agent" && usertype != "admin") {
        return snackbar("Only agents can assign users to tickets", "warning");
    }

    const body = document.querySelector("body");
    body.style.overflow = "hidden";

    const modalElement = document.createElement("div");
    modalElement.classList.add("modal");
    modalElement.onclick = (event) => {
        if (event.target === modalElement) closeModal();
    }

    const modalContentElement = document.createElement("div");
    modalContentElement.classList.add("modal-content");

    modalElement.appendChild(modalContentElement);
    body.appendChild(modalElement);

    //TODO: get csrf token

    modalContentElement.innerHTML = `
        <h2>Assign User</h2>

        <div class="main-edit-content">
            

            <div class="modal-buttons">
                <input type="button" class="cancel-button" onclick="closeModal()" value="Cancel">
            </div>
        </div>
        `;

    const searchField = document.createElement("input");
    searchField.type = "text";
    searchField.placeholder = "Search user...";

    mainContent = modalContentElement.querySelector(".main-edit-content");
    mainContent.parentNode.insertBefore(searchField, mainContent);

    searchField.addEventListener("input", async (e) => {
        const searchValue = searchField.value;

        const res = await fetch(`/api/clients?sort=agent&q=${searchValue}`, { method: "GET" });

        if (res.status !== 200) {
            snackbar("Failed to get data", "error");
            console.log(`failed to get data... with status ${res.status}`);
            return;
        }

        const resJson = await res.json();
        console.log(resJson);
    });

    modalElement.style.display = "block";
    modalElement.style.opacity = 0;
    modalElement.animate([
        { opacity: 0 },
        { opacity: 1, visbility: "visible" },
    ], { duration: 200, iterations: 1 }).onfinish = (event) => {
        modalElement.style.opacity = 1;
    }
}

async function makeLabelsModal(usertype) {
    if (usertype != "agent" && usertype != "admin") {
        return snackbar("Only agents can add labels", "warning");
    }

    const body = document.querySelector("body");
    body.style.overflow = "hidden";

    //const res = await fetch(`/api/clients`, { method: "GET" });

    const modalElement = document.createElement("div");
    modalElement.classList.add("modal");
    modalElement.onclick = (event) => {
        if (event.target === modalElement) closeModal();
    }

    const modalContentElement = document.createElement("div");
    modalContentElement.classList.add("modal-content");

    modalElement.appendChild(modalContentElement);
    body.appendChild(modalElement);

    //TODO: get csrf token

    modalContentElement.innerHTML = `
        <h2>Adding a label</h2>

        <div class="main-edit-content">
            

            <div class="modal-buttons">
                <input type="button" class="cancel-button" onclick="closeModal()" value="Cancel">
            </div>
        </div>
        `;

    const searchField = document.createElement("input");
    searchField.type = "text";
    searchField.placeholder = "Search label...";

    mainContent = modalContentElement.querySelector(".main-edit-content");
    mainContent.parentNode.insertBefore(searchField, mainContent);

    searchField.addEventListener("input", async (e) => {
        const search = searchField.value;

        //TODO: 

        const res = await fetch(`/api/labels?q=${search}`, { method: "GET" });

        if (res.status !== 200) {
            console.log(`failed to get data... with status ${res.status}`);
            return;
        }

        const resJson = await res.json();
    });

    modalElement.style.display = "block";
    modalElement.style.opacity = 0;
    modalElement.animate([
        { opacity: 0 },
        { opacity: 1, visbility: "visible" },
    ], { duration: 200, iterations: 1 }).onfinish = (event) => {
        modalElement.style.opacity = 1;
    }
}

async function closeTicketModal(usertype, ticketId) {
    if (usertype != "agent" && usertype != "admin") {
        return snackbar("Only agents can close the ticket", "warning");
    }

    const body = document.querySelector("body");
    body.style.overflow = "hidden";

    const modalElement = document.createElement("div");
    modalElement.classList.add("modal");
    modalElement.onclick = (event) => {
        if (event.target === modalElement) closeModal();
    }

    const modalContentElement = document.createElement("div");
    modalContentElement.classList.add("modal-content");

    modalElement.appendChild(modalContentElement);
    body.appendChild(modalElement);

    //TODO: get csrf token

    modalContentElement.innerHTML = `
        <h2>Are you sure you want to close this ticket?</h2>

        <div class="main-edit-content">
            

            <div class="modal-buttons">
                <input type="button" class="cancel-button" onclick="closeModal()" value="Cancel">
                <input type="button" class="" onclick="" value="Yes, close">
            </div>
        </div>
        `;

    modalElement.style.display = "block";
    modalElement.style.opacity = 0;
    modalElement.animate([
        { opacity: 0 },
        { opacity: 1, visbility: "visible" },
    ], { duration: 200, iterations: 1 }).onfinish = (event) => {
        modalElement.style.opacity = 1;
    }
}

window.addEventListener("load", async () => {
    const departmentSelect = document.querySelector("#departmentSelect");
    departmentSelect.addEventListener("change", (e) => {
        const newDepartment = e.target.value;
        const ticketId = document.querySelector("#ticketId").value;
        let formData = new FormData();
        formData.append('action', 'changeDepartment');
        formData.append('department', newDepartment);
        formData.append('ticketId', ticketId);

        fetch(`/ticket?id=${ticketId}`, {
            method: "POST",
            body: formData
        }).then(async (res) => {
            if (res.status === 200) {
                return snackbar("Department changed", "success");
            }

            const errorMessage = await res.text() ?? "Failed to change department";
            snackbar(errorMessage, "error");
        });
    });
});