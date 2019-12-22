window.addEventListener('DOMContentLoaded', function() {

    "use strict";

    // cteate tabs

    let infoHeader = document.querySelector('.info-header'),
        tab = document.querySelectorAll('.info-header-tab'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for(let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if(tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }
    
    infoHeader.addEventListener('click', function(e) {
        if(e.target && e.target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if(e.target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // create a Timer

    let deadline = '2019-12-31';

    function getTimeRemaining(endtime) {
        let totalTime = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((totalTime / 1000) % 60),
            minutes = Math.floor((totalTime / 1000 / 60) % 60),
            hours = Math.floor((totalTime / (1000*60*60)));
        return {
            'totalTime': totalTime,
            'seconds': seconds,
            'minutes': minutes,
            'hours': hours,
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if(t.totalTime <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('timer', deadline);

    // create a modal window

    let btnMore = document.querySelector('.more');
    let overlay = document.querySelector('.overlay');
    let popupClose = document.querySelector('.popup-close');

    btnMore.addEventListener('click', function(e) {
        overlay.style.display = 'block';
        this.classList.add('.more-splash');
        document.body.style.overflow = 'hidden'; // forbid to scroll our page
    });

    popupClose.addEventListener('click', function(e) {
        overlay.style.display = 'none';
        btnMore.classList.remove('.more-splash');
        document.body.style.overflow = '';
    });

    // Form

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        let formData = new FormData(form); //unusual object

        let obj = {};
        formData.forEach(function(value, key) {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        request.send(json);

        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if(request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        form.reset();

    });

});