

window.onload = function () {
    var url = new URL(window.location.href);
    var page = url.searchParams.get("page");
    getCharactersData(page);

    var close = document.querySelector('button[data-close="modal"]');
    close.onclick = function (event) {   
        if (event.target === close) {
            document.getElementById(close.dataset.close).classList.remove('show');
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
    }
    
    var searchEl = document.getElementById('search');
    searchEl.onchange = function (e) {
        getCharactersData(0, this.value);
    }   
}

function getCharactersData (page, query) {
    var currPage = page ? parseInt(page) <= 0 ? 1 : parseInt(page) : 1;
    var filter = query ? 'filter[name]=' + query : '';
    var url = currPage ? 'https://kitsu.io/api/edge/characters?page[limit]=10&page[offset]=' + ((currPage - 1) * 10) + '&' + filter : 'https://kitsu.io/api/edge/characters' + '?' + filter;
    var loader = `<div class="loader"></div>`;
    var listElement = document.getElementById('charactersList');
    listElement.innerHTML = loader;
    fetch(url).then(function (response) {
        removeElementsByClassName('page');
        return response.json();
    }).then(function (json) {
        createPagination(currPage, 1000, filter);
        createCharacterListElement(json.data);        
    }).catch(function (err) {
        console.log(err);
    });
}

function createElementAddAttribute (tag, attr, value) {
    var el = document.createElement(tag);
    el.setAttribute(attr, value);
    return el;
}

function adaptImg (el) {
    el.style.backgroundImage = 'url(' + el.children[0].src + ')';;
}

function createCharacterListElement (charData) {
    var loader = `<div class="loader"></div>`;
    var listElement = document.getElementById('charactersList');
    listElement.innerHTML = loader;
    var childElem = ``;
    var emptyElem = `<h2 class="list-empty">Não foram encontrados personagens com esse nome.</h2>`;
    charData.forEach(function (item) {
        var elContent = {};
        elContent.id = item.id;
        elContent.name = item.attributes.name;
        elContent.description = item.attributes.description;
        elContent.image = item.attributes.image ? (item.attributes.image.original) : 'https://via.placeholder.com/150';
        childElem += `<div class="list-item" id="item${elContent.id}">
                        <a href="#" data-trigger="modal" data-target="modal" data-id="${elContent.id}" data-name="${elContent.name}" data-img-src="${elContent.image}">
                            <div class="row">
                                <div class="col-25">
                                    <div class="char-info">
                                        <div class="img-container" style="background-image: url('${elContent.image}');">
                                            <img src="${elContent.image}" alt="${elContent.name}">
                                        </div>
                                        <h4>${elContent.name}</h4>
                                    </div>
                                </div>
                                <div class="col-75">
                                    <div class="char-description">
                                        <p>${elContent.description.replace(/[<]br[^>]*[>]/gi," ")}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`;
    });
    listElement.innerHTML = charData.length ? childElem : emptyElem;
    

    var linkList = document.querySelectorAll('a[data-trigger="modal"]');
    linkList.forEach(function (item) {
        item.onclick = function (e) {
            e.preventDefault();
            var target = document.getElementById(item.dataset.target);
            target.classList.add('show');
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            
            target.querySelector('.char-name').children[0].innerText = item.dataset.name;
            target.querySelector('.char-img').children[0].src = item.dataset.imgSrc;
            adaptImg(target.querySelector('.char-img'));
            
            var charUrl = 'https://kitsu.io/api/edge/characters/' + item.dataset.id;

            
            target.querySelector('.char-description p').innerHTML = loader;
            fetch(charUrl).then(function (response) {
                return response.json();
            }).then(function (json) {
                var attr = json.data.attributes;
                target.querySelector('.char-description p').innerHTML = attr.description;
                var mediaUrl = json.data.relationships.mediaCharacters.links.related;
                var mediaList = target.querySelector('.char-media ul');
                var mediaItem = target.querySelector('.char-media ul li');
                
                mediaList.innerHTML = loader;
                fetch(mediaUrl).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    var arr = [];
                    json.data.forEach(function (item) {
                        arr.push(item.relationships.media.links.related);
                    })
                    return arr.slice(0, 3);
                }).then(function (arr) {
                    var newList = mediaList.cloneNode(false);
                    arr.forEach(function (url) {
                        var el = mediaItem.cloneNode(true);
                        fetch(url).then(function (resp) {
                            return resp.json();
                        }).then(function (json) {
                            el.querySelector('h5').innerText = json.data.attributes.canonicalTitle;
                            el.querySelector('img').src = json.data.attributes.posterImage.small;
                            adaptImg(el.querySelector('.media-img'));
                            newList.appendChild(el);
                        });
                    });
                    return newList;
                }).then(function (newEl) {
                    var parent = mediaList.parentNode;
                    parent.removeChild(mediaList);
                    parent.appendChild(newEl);
                }).catch(function (err) {
                    console.log(err);
                })
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
}

window.onclick = function(event) {
    var modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.classList.remove('show');
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
}

function createPagination (currPage, count, filter) {
    var numPages = Math.min(6, (count / 10));
    var totalPages =  Math.ceil((count / 10));
    var previousLink = document.getElementById('previousLink');
    var nextLink = document.getElementById('nextLink');
    var query = filter ? filter : ''
    if (currPage !== 1) {
        previousLink.children[0].setAttribute('href', window.location.pathname + '?page=' + (currPage - 1));
    } else {
        previousLink.children[0].setAttribute('href', '#');
        previousLink.children[0].setAttribute('class', 'disabled');
    }
    if (currPage < totalPages) {
        nextLink.children[0].setAttribute('href', window.location.pathname + '?page=' + (currPage + 1));
    } else {
        nextLink.children[0].setAttribute('href', '#');
        nextLink.children[0].setAttribute('class', 'disabled');
    }
    for (var i = currPage; i < Math.min(numPages + currPage, totalPages); i++) {
        // var hidePages = `hide-mobile`;
        var node = createElementAddAttribute('li', 'class', (currPage == i) ? 'active page' : 'page');
        var aLink = createElementAddAttribute('a', 'href', window.location.pathname + '?page=' + i);
        if (Math.floor(3 + currPage) <= i) {
            node.classList.add('hide-mobile');
        }
        node.classList.add()
        aLink.innerText = i;
        node.appendChild(aLink);
        previousLink.parentNode.insertBefore(node, nextLink);
    }
}

// function removeChildren (p) {
//     var parent = document.getElementById(p);
//     while (parent.firstChild) {
//         parent.firstChild.remove();
//     }
// }

function removeElementsByClassName (className) {
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// function openModal(modal) {
//     modal.classList.push('show');
// }