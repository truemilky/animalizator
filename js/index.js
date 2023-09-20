window.onload = function () {
    //Проверяем, есть ли в localStorage объект data из animal.json, если нет - то фетчим и записываем
    (function () {
        if (!localStorage.getItem('data')) {
            fetch('https://api.jsonbin.io/v3/b/650b5b3cadb5f56d8f188f38', {
                headers: {
                    "X-Master-Key": "$2a$10$AIsQb20pI4WHJRBqF7udDeZXtNkNFhaZBvfLo7zB6BuQqeyIny8j2"
                }
            }).then(
                data => data.json()
            ).then(
                res => localStorage.setItem('data', JSON.stringify(res.record))
            )
        }
    })();

    //Показываем/скрываем faq блок
    const faqButton = document.getElementById('faq-btn');
    const faqCloseButton = document.getElementById('faq-close-btn');
    const faqBlock = document.querySelector('.faq');

    const getAllPreviousSiblings = (element) => {
        var siblings = [];
        while (element.previousSibling) {
            siblings.push(element = element.previousSibling);
        }

        return siblings;
    }

    const siblings = getAllPreviousSiblings(faqBlock);

    faqButton.addEventListener('click', () => {
        siblings.forEach((elem) => {
            if (elem.nodeName !== '#text' && elem.nodeName !== 'HEADER') {
                elem.classList.add('hide');
                faqButton.disabled = true;
            }
        });

        faqBlock.classList.remove('hide');
    });

    faqCloseButton.addEventListener('click', () => {
        faqBlock.classList.add('hide');

        siblings.forEach((elem) => {
            if (elem.nodeName !== '#text' && elem.nodeName !== 'HEADER' && !elem.classList.contains('complete') && !elem.classList.contains('untouched')) {
                elem.classList.remove('hide');
                faqButton.disabled = false;
            }
        });
    });

    //Определяем картинку в .definition__image
    const animalsContainer = document.querySelector('.introduction__animals');
    const animals = document.querySelectorAll('.introduction__animal');
    const animalGroupImage = document.querySelector('.definition__image img');
    const introductionButton = document.querySelector('.introduction__button');

    animalsContainer.addEventListener('click', (elem) => {
        animals.forEach((elem) => elem.classList.remove('active'));
        elem.target.classList.add('active');

        if (elem.target.dataset.animal === 'bear') {
            localStorage.setItem('pet', 'bear');
            introductionButton.disabled = false;
            animalGroupImage.setAttribute('src', 'images/bear.svg');
        } else if (elem.target.dataset.animal === 'cat') {
            localStorage.setItem('pet', 'cat');
            introductionButton.disabled = false;
            animalGroupImage.setAttribute('src', 'images/cat.svg');
        } else if (elem.target.dataset.animal === 'dog') {
            localStorage.setItem('pet', 'dog');
            introductionButton.disabled = false;
            animalGroupImage.setAttribute('src', 'images/dog.svg');
        } else if (elem.target.dataset.animal === 'tiger') {
            localStorage.setItem('pet', 'tiger');
            introductionButton.disabled = false;
            animalGroupImage.setAttribute('src', 'images/tiger.svg');
        }
    });

    //Если выбранно животное - меняем на следующий блок
    const intoductionBlock = document.querySelector('.introduction');
    const definitionBlock = document.querySelector('.definition');

    introductionButton.addEventListener('click', () => {
        animals.forEach((elem) => {
            if (elem.classList.contains('active')) {
                intoductionBlock.classList.add('hide');
                intoductionBlock.classList.add('complete');
                definitionBlock.classList.remove('hide');
                definitionBlock.classList.remove('untouched');
            }
        })
    });

    //Валидируем инпуты
    const validateText = (evt) => {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[А-Яа-яA-Za-z\s]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    const numInpunts = document.querySelectorAll('input[type="number"]');
    const textInput = document.querySelector('input[type="text"]');

    numInpunts.forEach((elem) => {
        elem.onchange = function (e) {
            var value = parseInt(e.target.value);
            if (!value || value < 2 || value > 500) {
                if (value < 2) {
                    e.target.value = 2;
                } else {
                    e.target.value = 500;
                }
            }
        }
    });

    textInput.addEventListener('keypress', validateText);

    //Вычисляем животное
    const inputWeight = document.getElementById('weight');
    const inputHeight = document.getElementById('height');
    const calculateButton = document.querySelector('.definition__calculate');
    const definitionButton = document.querySelector('.definition__button');
    const resultMessage = document.querySelector('.definition__result');
    const resultTitle = document.querySelector('.result__title');
    const resultName = document.querySelector('.result__name');
    const resultBlock = document.querySelector('.result');
    const resultImage = document.querySelector('.result__image img');

    calculateButton.addEventListener('click', async () => {
        let resultBreed = '';
        let weightRange = '';
        let heightRange = '';

        const data = await JSON.parse(localStorage.getItem('data'));

        numInpunts.forEach((input) => {
            if (input.value.length && (textInput.value.length >= 2 && textInput.value.length < 500)) {

                data.pets.forEach((pet) => {
                    if (localStorage.getItem('pet') === pet.name) {
                        pet.breeds.forEach((i) => {
                            if ((+inputWeight.value >= +pet.range.min_weight && +inputWeight.value <= +pet.range.max_weight) && (+inputHeight.value >= +pet.range.min_height && +inputHeight.value <= +pet.range.max_height)) {
                                if ((+inputWeight.value >= +i.data.min_weight && +inputWeight.value <= +i.data.max_weight) && (+inputHeight.value >= +i.data.min_height && +inputHeight.value <= +i.data.max_height)) {
                                    resultBreed = i.name;
                                    resultImage.innerHTML = resultImage.setAttribute('src', `images/animals${i.src}`);
                                    weightRange = i.data.range_weight;
                                    heightRange = i.data.range_height;
                                    definitionButton.disabled = false;
                                }
                            } else {
                                resultBreed = pet.default_breed;
                                resultImage.innerHTML = resultImage.setAttribute('src', `images/animals${pet.default_src}`);
                                weightRange = '';
                                heightRange = '';
                                definitionButton.disabled = false;
                            }
                        });
                    }
                });

                weightRange ? resultMessage.innerHTML = `${resultBreed} с весом ${weightRange}кг, и ростом ${heightRange}см` : resultMessage.innerHTML = `${resultBreed}`;
                resultTitle.innerHTML = `Перед вами фотография “${resultBreed}”`;
                resultName.innerHTML = `${textInput.value}`;

                resultMessage.style.color = '#000';
                resultMessage.style.display = 'block';
            } else {
                definitionButton.disabled = true;
                resultMessage.innerHTML = 'Введите коректные данные согласно диапазонам';
                resultMessage.style.color = 'red';
                resultMessage.style.display = 'block';
            }
        })
    });

    //Переключаем на третий блок
    const loadingScreen = document.querySelector('.loader__wrapper');

    definitionButton.addEventListener('click', () => {
        loadingScreen.style.display = 'block';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            definitionBlock.classList.add('hide');
            definitionBlock.classList.add('complete');
            resultBlock.classList.remove('hide');
            resultBlock.classList.remove('untouched');
        }, 5000)
    });

    //Скачиваем картинку
    const downloadButton = document.getElementById('download-image');

    downloadButton.addEventListener('click', () => {
        let link = document.createElement('a');
        link.target = "_blank";
        link.download = `${resultImage.getAttribute('src').replace('images/animals/', '')}`;
        link.href = `${resultImage.getAttribute('src')}`;
        link.click();
    });

    //Перезагружаем приложение
    const headerLogo = document.querySelector('.header__logo');
    const reloadButton = document.getElementById('reload');

    const reloadApp = () => {
        animals.forEach((elem) => elem.classList.remove('active'));
        intoductionBlock.classList.remove('hide');
        intoductionBlock.classList.remove('complete');
        definitionBlock.classList.remove('complete');
        definitionBlock.classList.add('hide');
        definitionBlock.classList.add('untouched');
        resultBlock.classList.add('hide');
        resultBlock.classList.add('untouched');
        numInpunts.forEach((input) => input.value = '');
        textInput.value = '';
        resultMessage.style.display = 'none';
        definitionButton.disabled = true;
        introductionButton.disabled = true;
    }

    headerLogo.addEventListener('click', () => {
        reloadApp();
    });

    reloadButton.addEventListener('click', () => {
        reloadApp();
    });
}