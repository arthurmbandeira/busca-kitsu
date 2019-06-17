window.onload = function () {
    var url = new URL(window.location.href);
    var page = url.searchParams.get("page");
    getCharactersData(page);
    
    
}
// window.onchange = function () {
//     var url = new URL(window.location.href);
//     var page = url.searchParams.get("page");
//     getCharactersData(page);
// }

var getCharactersData = function (page) {
    var currPage = page ? parseInt(page) : 0; 
    var url = currPage ? 'https://kitsu.io/api/edge/characters?page[limit]=10&page[offset]=' + ((currPage - 1) * 10) : 'https://kitsu.io/api/edge/characters';
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        
        var charactersData = json.data;
        var numPages = Math.min(((window.innerWidth > 894) ? 6 : 3), (json.meta.count / 10));
        // var pagination = document.getElementById('pagination');
        var previousLink = document.getElementById('previousLink');
        var nextLink = document.getElementById('nextLink');
        if (currPage) {
            previousLink.children[0].setAttribute('href', window.location.pathname + '?page=' + (currPage - 1));
        } else {
            previousLink.children[0].setAttribute('disabled', 'disabled')
        }
        nextLink.children[0].setAttribute('href', window.location.pathname + '?page=' + (currPage + 1));
        
        for (var i = numPages + (currPage) ; i > currPage; i--) {
            var node = createElementAddAttribute('li', 'class', (currPage == (i - 1) ? 'active' : ''));
            var aLink = createElementAddAttribute('a', 'href', window.location.pathname + '?page=' + i);
            aLink.innerText = i;
            node.appendChild(aLink);
            previousLink.parentNode.insertBefore(node, previousLink.nextSibling);
        }

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