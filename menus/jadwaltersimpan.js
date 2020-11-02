// eslint-disable-next-line no-unused-vars
function getSavedSchedule() {
  M.Toast.dismissAll();
  getAll().then((matches) => {
    const savedContainer = document.querySelector('.saved-match-container');
    let matchResult = '';
    matches.forEach((match) => {
      const homeTeam = match.homeTeam.name;
      const awayTeam = match.awayTeam.name;
      const kickOff = match.utcDate;
      const { status } = match;
      const awayHalfTime = match.score.halfTime.awayTeam;
      const homeHalfTime = match.score.halfTime.homeTeam;
      const awayFullTime = match.score.fullTime.awayTeam;
      const homeFullTime = match.score.fullTime.homeTeam;
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
      matchResult += `
            <div class="col s12 m4">
                <div class="card blue-grey darken-1">
                <div class="card-content dark-text">
                    <ul class="collection">
                    <li class="collection-header" style="padding-left: 20px;">
                        <div style="text-align: center; font-size: 20px; background-color: whitesmoke;" class="title"><strong>${homeTeam}</strong></div>
                        <div style="text-align: center; font-size: 20px; background-color: whitesmoke;" class="title"><strong>VS</strong></div>
                        <div style="text-align: center; font-size: 20px; background-color: whitesmoke;" class="title"><strong>${awayTeam}</strong></div>
                    </li>
                    <li><div class="collection-item"><strong>Kick-Off</strong> : ${time}</div></li>
                    <li><div class="collection-item"><strong>Status</strong> : ${status}</div></li>
                    <li><div class="collection-item"><strong>Half-time</strong> : ${homeHalfTime}-${awayHalfTime}</div></li>
                    <li><div class="collection-item"><strong>Full-time</strong> : ${homeFullTime}-${awayFullTime}</div></li>
                    </ul>
                </div>
                <div class="card-action">
                <a href="#" class="delete-button" key="${match.id}">Delete</a>
                </div>
                </div>
            </div>
            `;
    });
    savedContainer.innerHTML = matchResult;
    deleteSavedMatch();
  });
}

function deleteSavedMatch() {
  const deleteButton = document.querySelectorAll('.delete-button');
  deleteButton.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const idDelete = btn.getAttribute('key');
      deletingSavedMatch(idDelete);
    });
  });
}
