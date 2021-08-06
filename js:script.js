function pagination(p) {
    // clear all results content
        content.innerHTML = '';
        // loop to display results
        for (let i = p * perPage; i < Math.min(p * perPage + perPage, memes.length); i++) {
        // card creation
            const card = document.createElement('div');
            card.classList.add('card');
            // add the name of the meme
            const title = document.createElement('div');
            title.classList.add('title');
            title.textContent = memes[i].name;
            // like button
            const like = document.createElement('div');
            like.id = memes[i].id;
            like.classList.add('title');
            let heartClass = 'like';
            if (memes[i].liked) {
                heartClass = 'liked';
            }
            like.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" class="${heartClass}" x="0px" y="0px" viewBox="0 0 512 512"  xml:space="preserve">
            <path d="M378.667,21.333c-56.792,0-103.698,52.75-122.667,77.646    c-18.969-24.896-65.875-77.646-122.667-77.646C59.813,21.333,0,88.927,0,172c0,45.323,17.99,87.563,49.479,116.469    c0.458,0.792,1.021,1.521,1.677,2.177l197.313,196.906c2.083,2.073,4.802,3.115,7.531,3.115s5.458-1.042,7.542-3.125    L467.417,283.74l2.104-2.042c1.667-1.573,3.313-3.167,5.156-5.208c0.771-0.76,1.406-1.615,1.896-2.542    C499.438,245.948,512,209.833,512,172C512,88.927,452.188,21.333,378.667,21.333z"/>
    </svg>
            `;
                    // Like button event listener
            like.addEventListener('click', function () {
                let liked = false;
                // if not liked (switch class name => like to liked)
                if (!this.querySelector('svg').classList.contains('liked')) {
                    this.querySelector('svg').classList.remove('like');
                    this.querySelector('svg').classList.add('liked');
                    liked = true;
                  // if liked (switch class name => liked to like)
                } else {
                    this.querySelector('svg').classList.remove('liked');
                    this.querySelector('svg').classList.add('like');
                    liked = false;
                }
                            // update memes array with corresponding liked value
                for (var i = 0; i < memes.length; i++) {
                    if (memes[i].id === this.id) {
                        memes[i].liked = liked;
                        break;
                    }
                }
            })
            
            // create a div with the meme URL in background
            const img = document.createElement('div');
            img.classList.add('img');
            img.dataset.src = memes[i].url;
            img.style.backgroundImage = `url(${memes[i].url})`;
            
            // on image click send the image in overlay element and display it
            img.addEventListener('click', function () {
                overlay.innerHTML = `<img src="${this.dataset.src}">`;
                overlay.style.display = 'flex';
            });
            // add the card to the content element
            card.appendChild(title);
            card.appendChild(like);
            card.appendChild(img);
            content.appendChild(card);
        }
    }
    
    // VARIABLES
    let original_memes = {}, memes = {}, perPage = 20, page = 0;
    const query = document.querySelector('#query');
    const content = document.querySelector('#content');
    const previous = document.querySelector('#previous');
    const next = document.querySelector('#next');
    const overlay = document.querySelector('#overlay');
    
    // when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // make the request to the memes API
        fetch('https://api.imgflip.com/get_memes')
            // Parse the response to a JSON object
            .then(response => response.json())
            // Once the response is parsed, run code below
            .then(data => {
                original_memes = memes = data.data.memes;
                // display page
                pagination(page);
            })
    })
    
    // next and previous buttons event listener
    document.querySelectorAll('.btn').forEach(item => {
        item.addEventListener('click', function () {
                // if the button is enabled (orange)
            if (!this.classList.contains('disable')) {
                    // increment or decrement page number (+1 for next button , -1 for previous button)
                page += parseInt(this.dataset.value);
                // limit page number between 0 and number of results / cards per page - 1
                page = Math.min(Math.max(0, page), Math.round(memes.length / perPage - 1));
                // display the page number
                txt.textContent = page + 1;
                // enable or disable next and previous buttons
                page > 0 ? previous.classList.remove('disable') : previous.classList.add('disable');
                page < Math.round(memes.length / perPage - 1) ? next.classList.remove('disable') : next.classList.add('disable');
                // display page
                pagination(page);
            }
        });
    });
    
    // overlay event listener on click the element is hidden
    overlay.addEventListener('click', function () {
        this.style.display = 'none';
    });
    
    // text box input event listener 
    query.addEventListener('keyup', function () {
            // regex
        const pattern = this.value;
        const regex = new RegExp(pattern, "gi");
        // return an array with results that match with the query
        memes = original_memes.filter(meme => {
            return meme.name.match(regex)
        });
        // if results length are lower than perPage value, nextbutton is disabled
        memes.length <= perPage ? next.classList.add('disable') : next.classList.remove('disable');
        page = 0;
        pagination(page);
    });