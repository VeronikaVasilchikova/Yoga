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
        // document.body.style.overflow = 'hidden'; // forbid to scroll our page
    });

    popupClose.addEventListener('click', function(e) {
        overlay.style.display = 'none';
        btnMore.classList.remove('.more-splash');
        // document.body.style.overflow = '';
    });

    
    // Form

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div'),
        formBottom = document.getElementById('form'),
        inputEmail = formBottom.elements["email"],
        inputTel = formBottom.elements["tel"];

        statusMessage.classList.add('status');

    function sendForm(elem) {
        elem.addEventListener('submit', function(event) {
            event.preventDefault();
            elem.appendChild(statusMessage);
            let formData = new FormData(elem); 

            function postData(data) {
                return new Promise(function(resolve, reject) {
                    let request = new XMLHttpRequest();
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    
                    request.addEventListener('readystatechange', function() {
                        if (request.readyState < 4) {
                            resolve();
                        } else if(request.readyState === 4) {
                            if(request.status == 200 && request.status < 203) {
                                resolve();
                            } else {
                                reject();
                            }
                        }
                    });
                    request.send(data);
                });
            }

            postData(formData)
                .then(() => statusMessage.innerHTML = message.loading)
                .then(() => {
                    statusMessage.innerHTML = message.success;
                })
                .catch(() => statusMessage.innerHTML = message.failure)
                .then(elem.reset())
        });
    }

    sendForm(form);
    sendForm(formBottom);
    
    
});