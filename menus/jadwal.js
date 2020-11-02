class ClassWatcher2 {

    constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
        this.targetNode = targetNode
        this.classToWatch = classToWatch
        this.classAddedCallback = classAddedCallback
        this.classRemovedCallback = classRemovedCallback
        this.observer = null
        this.lastClassState = targetNode.classList.contains(this.classToWatch)

        this.init()
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer.observe(this.targetNode, { attributes: true })
    }

    disconnect() {
        this.observer.disconnect()
    }

    mutationCallback = mutationsList => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClassState = mutation.target.classList.contains(this.classToWatch)
                if(this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState
                    if(currentClassState) {
                        this.classAddedCallback()
                    }
                    else {
                        this.classRemovedCallback()
                    }
                }
            }
        }
    }
}

function instanceCarousel2() {
  const elems = document.querySelector('.carousel');
  M.Carousel.init(elems);
}

function setScheduleCard(response) {
  const scheduleCard = document.getElementById('schedule-card');
  const leagueName = response.competition.name;
  const { matchday } = response.filters;
  scheduleCard.innerHTML = `
    <div class="card blue-grey darken-1" >
        <div class="card-content white-text">
            <h5>Schedule of ${leagueName}</h5>
            <p>Matchday-${matchday}</p>
            <table>
                <thead id="schedule-header">
                <tr>
                    <th>Kick-Off</th>
                    <th>Home Team</th>
                    <th>Away Team</th>
                    <th></th>
                </tr>
                </thead>            
                <tbody id="schedule-list">
                </tbody>
            </table>
        </div>
    </div>
    `;
}

function setScheduleList(response) {
  const { matches } = response;
  let list = '';
  const scheduleList = document.getElementById('schedule-list');
  matches.forEach((match) => {
    const kickOff = match.utcDate;
    const matchId = match.id;
    const { status } = match;
    const buttonActive = '';
    // if (status == "SCHEDULED") {
    //     buttonActive = "";
    // }else{
    //     buttonActive = "disabled";
    // }
    const year = kickOff.substr(0, 4);
    const month = kickOff.substr(5, 2);
    const date = kickOff.substr(8, 2);
    const hour = kickOff.substr(11, 2);
    const minute = kickOff.substr(14, 2);
    const second = kickOff.substr(17, 2);
    const times = `${month}/${date}/${year} ${hour}:${minute}:${second} UTC`;
    const getTime = new Date(times);
    getTime.toString();
    const time = getTime.toString().substring(0, 25);
    const awayTeam = match.awayTeam.name;
    const homeTeam = match.homeTeam.name;
    list += `
        <tr>
            <td>${time}</td>
            <td>${homeTeam}</td>
            <td>${awayTeam}</td>
            <td><a onclick="M.toast({html: 'Pertandingan berhasil dtambahkan'})" class="btn-small save-btn" ${buttonActive} id="save-button" match-id="${matchId}">+</a></td>
        </tr>`;
  });
  scheduleList.innerHTML = list;
  readButton(matches);
}

function printSchedule(response) {
  setScheduleCard(response);
  setScheduleList(response);
}

async function getFirstOpenFromCache() {
  const getFirstCache = 'https://api.football-data.org/v2/competitions/2021';
  let matchdayFirstCache;
  await caches.match(getFirstCache)
    .then((response) => response.json()).then((response) => {
      matchdayFirstCache = response.currentSeason.currentMatchday;
    });
  const getDataFirstCache = `https://api.football-data.org/v2/competitions/2021/matches?matchday=${matchdayFirstCache}`;
  await caches.match(getDataFirstCache)
    .then((response) => response.json()).then((response) => {
      printSchedule(response);
    });
}

async function getFirstOpen2() {
  const scheduleCard = document.getElementById('schedule-card');
  scheduleCard.innerHTML = preloader;
  if ('caches' in window) {
    getFirstOpenFromCache();
  }
  let currentMatchday;
  await $.ajax({
    headers: { 'X-Auth-Token': '6fab6042705647ee8a62e14b4414c94e' },
    url: 'https://api.football-data.org/v2/competitions/2021',
    dataType: 'json',
    type: 'GET',
  }).done((response) => {
    currentMatchday = response.currentSeason.currentMatchday;
  });

  await $.ajax({
    headers: { 'X-Auth-Token': '6fab6042705647ee8a62e14b4414c94e' },
    url: `https://api.football-data.org/v2/competitions/2021/matches?matchday=${currentMatchday}`,
    dataType: 'json',
    type: 'GET',
  }).done((response) => {
    printSchedule(response);
  });
}

async function getContinuousFromCache(id) {
  let currentMatchday;
  await caches.match(`https://api.football-data.org/v2/competitions/${id}`)
    .then((response) => response.json()).then((response) => {
      currentMatchday = response.currentSeason.currentMatchday;
    });
  await caches.match(`https://api.football-data.org/v2/competitions/${id}/matches?matchday=${currentMatchday}`)
    .then((response) => response.json()).then((response) => {
      printSchedule(response);
    });
}

function getContinuousSchedule() {
  const scheduleItem = document.querySelectorAll('.schedule-object');
  const scheduleCard = document.getElementById('schedule-card');
  scheduleItem.forEach((items) => {
    async function workOnClassAdd() {
      scheduleCard.innerHTML = preloader;
      const numID = items.getAttribute('numid');
      getContinuousFromCache(numID);
      let currentMatchday;
      await $.ajax({
        headers: { 'X-Auth-Token': '6fab6042705647ee8a62e14b4414c94e' },
        url: `https://api.football-data.org/v2/competitions/${numID}`,
        dataType: 'json',
        type: 'GET',
      }).done((response) => {
        // do something with the response, e.g. isolate the id of a linked resource
        currentMatchday = response.currentSeason.currentMatchday;
      });
      await $.ajax({
        headers: { 'X-Auth-Token': '6fab6042705647ee8a62e14b4414c94e' },
        url: `https://api.football-data.org/v2/competitions/${numID}/matches?matchday=${currentMatchday}`,
        dataType: 'json',
        type: 'GET',
      }).done((response) => {
        // do something with the response, e.g. isolate the id of a linked resource
        printSchedule(response);
      });
    }
    async function workOnClassRemoval() {
    }
    new ClassWatcher2(items, 'active', workOnClassAdd, workOnClassRemoval);
  });
}

function getSchedule() {
  M.Toast.dismissAll();
  instanceCarousel2();
  getFirstOpen2();
  getContinuousSchedule();
}

function readButton(matches) {
  const saveButtons = document.querySelectorAll('.save-btn');
  saveButtons.forEach((saveButton) => {
    saveButton.addEventListener('click', () => {
      const idMatch = saveButton.getAttribute('match-id');
      matches.forEach((match) => {
        const matchIdFromData = match.id;
        if (matchIdFromData == idMatch) {
          saveForLater(match);
        }
      });
    });
  });
}
