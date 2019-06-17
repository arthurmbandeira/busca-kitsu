window.onload = function () {
    getCharactersData();
}

var getCharactersData = function () {
    var url = 'https://kitsu.io/api/edge/characters';
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        var charactersData = data.data;
        // console.log(charactersData);
        var listElement = document.getElementById('charactersList');
        charactersData.forEach(function (item) {
            var listItem = createElementAddAttribute('div', 'class', 'list-item');
            var a = createElementAddAttribute('a', 'href', '#');
            a.setAttribute('data-media', 'open');
            var row = createElementAddAttribute('div', 'class', 'row');
            var charInfoContainer = createElementAddAttribute('div', 'class', 'col-25');
            var charInfo = createElementAddAttribute('div', 'class', 'char-info');
            var charDescriptionContainer = createElementAddAttribute('div', 'class', 'col-75');
            var charDescription = createElementAddAttribute('div', 'class', 'char-description');
            var description = document.createElement('p');
            description.innerHTML = item.attributes.description.replace(/[<]br[^>]*[>]/gi," ");
            var charImgContainer = createElementAddAttribute('div', 'class', 'img-container');
            var charImg = createElementAddAttribute('img', 'src', item.attributes.image.original);
            var charName = document.createElement('h4');
            charName.innerText = item.attributes.name;
            charImgContainer.appendChild(charImg);
            adaptImg(charImgContainer);
            charInfo.appendChild(charImgContainer);
            charInfo.appendChild(charName);
            row.appendChild(charInfoContainer);
            row.appendChild(charDescriptionContainer);
            charInfoContainer.appendChild(charInfo);
            charDescription.appendChild(description);
            charDescriptionContainer.appendChild(charDescription);
            a.appendChild(row);
            listItem.appendChild(a);
            listElement.append(listItem);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function createElementAddAttribute(tag, attr, value) {
    var el = document.createElement(tag);
    el.setAttribute(attr, value);
    return el;
}

function adaptImg (el) {
    el.style.backgroundImage = 'url(' + el.children[0].src + ')';;
}