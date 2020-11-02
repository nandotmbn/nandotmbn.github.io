document.addEventListener('DOMContentLoaded', () => {
  function loadNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'nav.html', true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll('.topnav, .sidenav').forEach((elm) => {
          elm.innerHTML = xhttp.responseText;
        });

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll('.sidenav a, .topnav a').forEach((elm) => {
          elm.addEventListener('click', (event) => {
            // Tutup sidenav
            const sidenav = document.querySelector('.sidenav');
            M.Sidenav.getInstance(sidenav).close();

            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute('href').substr(1);
            loadPage(page);
          });
        });
      }
    };
  }
  function loadPage(page) {
    M.Toast.dismissAll();
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `/pages/${page}.html`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const content = document.querySelector('#body-content');
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          if (page == 'kompetisi') getLigas();
          else if (page == 'jadwal') getSchedule();
          else if (page == 'jadwaltersimpan') getSavedSchedule();
        } else if (this.status == 404) {
          content.innerHTML = '<p>Halaman tidak ditemukan.</p>';
        } else {
          content.innerHTML = '<p>Ups.. halaman tidak dapat diakses.</p>';
        }
      }
    };
  }
  // Activate sidebar nav
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
  loadNav();
  // Load page content
  let page = window.location.hash.substr(1);
  if (page == '') page = 'beranda';
  loadPage(page);
});
