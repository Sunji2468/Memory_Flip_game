document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('gameGrid');
    const movesDisplay = document.getElementById('moves');
    const matchesDisplay = document.getElementById('matches');
    const timerDisplay = document.getElementById('timer');
    const newGameBtn = document.getElementById('newGameBtn');
    const resetBtn = document.getElementById('resetBtn');
    const winMessage = document.getElementById('winMessage');
    const finalTime = document.getElementById('finalTime');
    const finalMoves = document.getElementById('finalMoves');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matches = 0;
    let timer = null;
    let seconds = 0;
    let isPlaying = false;

    const cardImages = [
        'https://media.craiyon.com/2025-04-18/TpP41FBwTG2_tRXDwT3Jyw.webp',
        'https://media.craiyon.com/2025-04-18/TpP41FBwTG2_tRXDwT3Jyw.webp',
        'https://images.unsplash.com/photo-1703248187251-c897f32fe4ec?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuZGElMjBiZWFyfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1703248187251-c897f32fe4ec?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuZGElMjBiZWFyfGVufDB8fDB8fHww',
        'https://w0.peakpx.com/wallpaper/899/489/HD-wallpaper-po-impressed-hall-of-warriors-kung-fu-panda.jpg',
        'https://w0.peakpx.com/wallpaper/899/489/HD-wallpaper-po-impressed-hall-of-warriors-kung-fu-panda.jpg',
        'https://media.istockphoto.com/id/1221133425/photo/giant-panda-bear-eating-bamboo.jpg?s=612x612&w=0&k=20&c=0stdf5jkOYOvbe4wmfLHLmG02cip-gDAOipSmdW-fg0=',
        'https://media.istockphoto.com/id/1221133425/photo/giant-panda-bear-eating-bamboo.jpg?s=612x612&w=0&k=20&c=0stdf5jkOYOvbe4wmfLHLmG02cip-gDAOipSmdW-fg0=',
        'https://illustcute.com/photo/707.png?20240818'
    ];

    function initGame() {
        moves = 0;
        matches = 0;
        seconds = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        isPlaying = false;
        
        gameGrid.innerHTML = '';
        cards = [];
        movesDisplay.textContent = moves;
        matchesDisplay.textContent = matches;
        timerDisplay.textContent = '0:00';
        winMessage.classList.add('hidden');
        
        if (timer) {
            clearInterval(timer);
            tier = null;
        }

        createCards();
    }
    function createCards() {
        const shuffledImages = shuffleArray([...cardImages]);
        
        shuffledImages.forEach(imageUrl => {
            const card = document.createElement('div');
            card.classList.add('card');
            
            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Card image';
            img.style.width = '80%';
            img.style.height = '80%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '5px';

            img.onerror = function() {
                this.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTttUcYzU3Rti_MV7yybUlUx_g8wdIFW5_1A&s';
            };
            
            cardFront.appendChild(img);
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            card.addEventListener('click', flipCard);
            
            gameGrid.appendChild(card);
            cards.push(card);
        });
    }

    function flipCard() {
        if (!isPlaying) {
            startTimer();
            isPlaying = true;
        }
        
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.querySelector('.card-front img').src === 
                       secondCard.querySelector('.card-front img').src;
        
        if (isMatch) {
            disableCards();
            matches++;
            matchesDisplay.textContent = matches;

            if (matches === Math.floor(cardImages.length / 2)) {
                endGame();
            }
        } else {
            unflipCards();
        }
        
        moves++;
        movesDisplay.textContent = moves;
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function endGame() {
        stopTimer();
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        finalTime.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        finalMoves.textContent = moves;
        
        winMessage.classList.remove('hidden');
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    newGameBtn.addEventListener('click', () => {
        initGame();
    });

    resetBtn.addEventListener('click', () => {
        initGame();
    });
    initGame();
});