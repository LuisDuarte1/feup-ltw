const currentSearchParams = new URLSearchParams((location.href.split("?")[1] ?? ''));
var offset = currentSearchParams.get("offset") ?? 0;
var end = false;
var fetchingUsers = false;
const limit = 4;

function isOnScreen(element) {
    const rect = element.getBoundingClientRect();
    return window.innerHeight > rect.top && rect.top >= 0;

}

function drawNewTicketCard(jsonObject) {
    const element = document.querySelector(".tabSelector");
    const card = document.createElement("div");
    card.classList.add("ticket-card");
    card.setAttribute("data-id", jsonObject['id']);
    card.innerHTML += `
        <h3>#${jsonObject['id']} - ${jsonObject['title']}</h3>
        <h5>${jsonObject['timeAgo']}</h5>
        <p>${jsonObject['description']}</p>
        <footer>
            <tags>  
                <span class="tag">${jsonObject['status']}</span>
                ${jsonObject['hashtags'].split(',').map(hashtag => `<span class="tag">${hashtag}</span>`).join('')}
            </tags>
        </footer>

        <script src="js/ticket-card.js"></script>
        <link rel="stylesheet" href="css/ticket-card.css">
    `;

    element.appendChild(card);


}

const getMoreTicketsData = async (ev) => {
    if (ev.deltaY < 0) return;
    if (end) return;
    const element = document.querySelector(".tabSelector")
    if (element === null) return;
    if (element.lastElementChild === null) return;
    var fetchingTickets = false;
    if (isOnScreen(element.lastElementChild) && !fetchingTickets) {
        fetchingTickets = true;
        console.log("fetching new ticket data...");
        const res = await fetch(`/api/tickets?limit=10&offset=${offset + element.children.length}`,
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
        resJson.forEach(drawNewTicketCard);
        fetchingTickets = false;

    }
};
document.addEventListener("scroll", getMoreTicketsData);


function handleSortOptionChange(value) {
    var sortOrder = value === 'lastCreated' ? 'DESC' : 'ASC';
    var url = new URL(location.href);
    url.searchParams.set("sortOrder", sortOrder);
    window.location.href = url.toString();
}

function handleSearchEvent() {
    var searchText = document.getElementById('search').value;
    var url = new URL(location.href);
  
    url.searchParams.set("text", searchText);
    url.searchParams.set("offset", "0");
    url.searchParams.set("limit", "10");
  
    window.location.href = url.toString();
}
  
//   function handleSearchInput() {
//     var searchText = document.getElementById('search').value;
//     var url = new URL(location.href);
  
//     url.searchParams.set("text", searchText);
//     url.searchParams.set("offset", "0");
  
//     var xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === XMLHttpRequest.DONE) {
//         if (xhr.status === 200) {
//           var responseHTML = xhr.responseText;
//           var ticketListStart = responseHTML.indexOf('<div class="ticket-list">');
//           var ticketListEnd = responseHTML.indexOf('</div>', ticketListStart);
//           var ticketListHTML = responseHTML.slice(ticketListStart, ticketListEnd + 6);
  
//           var ticketList = document.querySelector('.ticket-list');
//           ticketList.innerHTML = ticketListHTML;
//         } else {
//           console.error('Error: ' + xhr.status);
//         }
//       }
//     };
  
//     xhr.open('GET', url.toString(), true);
//     xhr.send();
//   }
  
//   document.getElementById('search').addEventListener('input', handleSearchInput);

  

function handleKeyDown(event) {
    if (event.key === "Enter") {
        handleSearchInput();
        event.preventDefault();
    }
}

function handleSearchInput() {
    var searchText = document.getElementById('search').value;
    var url = new URL(location.href);

    url.searchParams.set('text', searchText);
    url.searchParams.set('offset', '0');

    window.location.href = url.toString();
}