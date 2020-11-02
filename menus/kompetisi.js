const preloader = `
<div class="preloader">
  <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue">
    <div class="circle-clipper left">
        <div class="circle"></div>
    </div><div class="gap-patch">
        <div class="circle"></div>
    </div><div class="circle-clipper right">
        <div class="circle"></div>
    </div>
    </div>

    <div class="spinner-layer spinner-red">
    <div class="circle-clipper left">
        <div class="circle"></div>
    </div><div class="gap-patch">
        <div class="circle"></div>
    </div><div class="circle-clipper right">
        <div class="circle"></div>
    </div>
    </div>

    <div class="spinner-layer spinner-yellow">
    <div class="circle-clipper left">
        <div class="circle"></div>
    </div><div class="gap-patch">
        <div class="circle"></div>
    </div><div class="circle-clipper right">
        <div class="circle"></div>
    </div>
    </div>

    <div class="spinner-layer spinner-green">
    <div class="circle-clipper left">
        <div class="circle"></div>
    </div><div class="gap-patch">
        <div class="circle"></div>
    </div><div class="circle-clipper right">
        <div class="circle"></div>
    </div>
    </div>
</div>
</div>
`;

class ClassWatcher1 {

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

function instanceCarousel1() {
  const elems = document.querySelector('.carousel');
  M.Carousel.init(elems);
}

function printStandingsHeader(ligas) {
  const ligaName = ligas.competition.name;
  const tableHead = `
    <h5 id="ligaName">Standing of ${ligaName}</h5>
    <table class="striped">
        <thead>
        <tr>
            <th>#</th>
            <th>Club Name</th>
            <th>P</th>
            <th>W</th>
            <th>L</th>
            <th>D</th>
            <th>GD</th>
            <th>GA</th>
            <th>GF</th>
            <th>Pts</th>
        </tr>
        </thead>

        <tbody id="tableBodyRank"></tbody>
    </table>`;
  const rankContainer = document.querySelector('#liga-content');
  rankContainer.innerHTML = tableHead;
}

function printStandingsBody(ligas) {
  const rankRows = ligas.standings[0].table;
  const tableRank = document.getElementById('tableBodyRank');
  let rows = '';
  rankRows.forEach((rankRow) => {
    rows += `
        <tr>
            <td>${rankRow.position}</td>
            <td>${rankRow.team.name}</td>
            <td>${rankRow.playedGames}</td>
            <td>${rankRow.won}</td>
            <td>${rankRow.lost}</td>
            <td>${rankRow.draw}</td>
            <td>${rankRow.goalDifference}</td>
            <td>${rankRow.goalsAgainst}</td>
            <td>${rankRow.goalsFor}</td>
            <td>${rankRow.points}</td>
        </tr>
        `;
  });
  tableRank.innerHTML = rows;
}

function printStandings(ligas) {
  printStandingsHeader(ligas);
  printStandingsBody(ligas);
}

function getFirstOpen1() {
  const standingContainer = document.querySelector('#liga-content');
  standingContainer.innerHTML = preloader;
  if ('caches' in window) {
    const getCache = 'https://api.football-data.org/v2/competitions/2021/standings';
    caches.match(getCache)
      .then((response) => response.json()).then((response) => {
        printStandings(response);
      });
  }
  $.ajax({
    headers: { 'X-Auth-Token': '6fab6042705647ee8a62e14b4414c94e' },
    url: 'https://api.football-data.org/v2/competitions/2021/standings',
    dataType: 'json',
    type: 'GET',
  }).done((response) => {
    printStandings(response);
  });
}

function getContinuousStandings() {
  const base_url = 'https://api.football-data.org/v2/competitions';
  const ligaStanding = document.querySelectorAll('.liga-object');
  const standingContainer = document.querySelector('#liga-content');
  ligaStanding.forEach((liga) => {
    function workOnClassAdd() {
      standingContainer.innerHTML = preloader;
      const numID = liga.getAttribute('numid');
      if ('caches' in window) {
        const getCache = `${base_url}/${numID}/standings`;
        caches.match(getCache)
          .then((response) => response.json()).then((response) => {
            printStandings(response);
          });
      }
      $.ajax({
        headers: { 'X-Auth-Token': '6fab6042705647ee8a62e14b4414c94e' },
        url: `https://api.football-data.org/v2/competitions/${numID}/standings`,
        dataType: 'json',
        type: 'GET',
      }).done((response) => {
        printStandings(response);
      });
    }
    function workOnClassRemoval() { }
    new ClassWatcher1(liga, 'active', workOnClassAdd, workOnClassRemoval);
  });
}

function getLigas() {
  M.Toast.dismissAll();
  instanceCarousel1();
  getFirstOpen1();
  getContinuousStandings();
}
