// ui elements
let leadCardsContainer = document.getElementById('lead-cards')
let leadMoneyUi = document.getElementById('lead-money')
let leadStatus = document.getElementById('lead-status')

let playerCardsContainer = document.getElementById('player-cards')
let playerMoneyUi = document.getElementById('player-money')
let playerStatus = document.getElementById('player-status')

let buttonStay = document.getElementById('button-stay')
let buttonNewCard = document.getElementById('button-card')
let buttonNextRound = document.getElementById('button-next')

// global state
let playerCards = []
let leadCards = []
let gameEnded = false
let roundEnded = false
let playerMoney = 40
let leadMoney = 40

// card set
let cardNames = [
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'jack',
	'queen',
	'king',
	'ace'
]
let cardSuits = ['hearts', 'diamonds', 'spades', 'clubs']

let cardsSet = {
	hearts: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
	diamonds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
	spades: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
	clubs: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]
}

const getRandomIntInclusive = (min, max) => {
	//The maximum is inclusive and the minimum is inclusive
	return Math.floor(Math.random() * (max - min + 1) + min)
}

const getRandomCard = () => {
	let randomNum = getRandomIntInclusive(0, 3)
	const suitName = cardSuits[randomNum]
	const suitSet = cardsSet[cardSuits[randomNum]]
	// console.log('suit:', suitName)

	randomNum = getRandomIntInclusive(0, 12)
	const cardName = cardNames[randomNum]
	const cardValue = suitSet[randomNum]
	// console.log('value:', cardValue)

	return {
		suit: suitName,
		name: cardName,
		value: cardValue
	}
}

const getAnotherCard = () => {
	let newCard = getRandomCard()
	return newCard
}

const generateLeadCard = (isHidden) => {
	const lead = getRandomCard()
	const backSRC = `./svg_playing_cards/backs/abstract.svg`
	const frontSRC = `./svg_playing_cards/fronts/${lead.suit}_${lead.name}.svg`
	leadCards.push(lead)

	let leadCard = document.createElement('img')
	leadCard.src = isHidden ? backSRC : frontSRC
	leadCardsContainer.appendChild(leadCard)

	return lead
}

const generatePlayerCard = (isHidden) => {
	const player = getRandomCard()
	const backSRC = `./svg_playing_cards/backs/abstract.svg`
	const frontSRC = `./svg_playing_cards/fronts/${player.suit}_${player.name}.svg`
	playerCards.push(player)

	let playerCard1 = document.createElement('img')
	playerCard1.src = isHidden ? backSRC : frontSRC
	playerCardsContainer.appendChild(playerCard1)
}

const getPlayerTotal = () => {
	let playerTotal = () => {
		return playerCards
			.map((el) => el.value)
			.reduce((prev, curr) => {
				return prev + curr
			})
	}

	let ace = playerCards.find((el) => el.name === 'ace')
	if (playerTotal() > 21 && typeof ace !== 'undefined') ace.value = 1

	return playerTotal()
}

const getLeadTotal = () => {
	let leadTotal = () => {
		return leadCards
			.map((el) => el.value)
			.reduce((prev, curr) => {
				return prev + curr
			})
	}

	let ace = leadCards.find((el) => el.name === 'ace')
	if (leadTotal() > 21 && typeof ace !== 'undefined') ace.value = 1

	return leadTotal()
}

const winMessage = (who, roundOrMatch) => {
	if (who === 'player' && roundOrMatch === 'round') {
		return 'Player wins round'
	}
	if (who === 'player' && roundOrMatch === 'match') {
		return 'Player takes the money'
	}
	if (who === 'player' && roundOrMatch === 'round-blackjack') {
		return "Player's blackjack"
	}

	if (who === 'cpu' && roundOrMatch === 'round') {
		return 'CPU wins round'
	}
	if (who === 'cpu' && roundOrMatch === 'match') {
		return 'CPU takes the money'
	}
	if (who === 'cpu' && roundOrMatch === 'round-blackjack') {
		return "Dealer's blackjack"
	}

	if (who === 'draw' && roundOrMatch === 'round') {
		return 'this is DRAW'
	}
}
const loseMessage = (who, roundOrMatch) => {
	// gets the one who won

	if (who === 'player' && roundOrMatch === 'round') {
		return 'CPU loses round'
	}
	if (who === 'player' && roundOrMatch === 'match') {
		return 'CPU loses the money'
	}
	if (who === 'player' && roundOrMatch === 'round-blackjack') {
		return "Player's blackjack, Dealer loses round"
	}
	if (who === 'cpu' && roundOrMatch === 'round') {
		return 'Player loses round'
	}
	if (who === 'cpu' && roundOrMatch === 'round-blackjack') {
		return "Dealer's blackjack, Player loses round"
	}
	if (who === 'cpu' && roundOrMatch === 'match') {
		return 'CPU takes the money'
	}
}

const evaluateGame = () => {
	if (leadMoney > 0 && playerMoney > 0 && !gameEnded) {
		if (getLeadTotal() > 21) {
			playerStatus.innerText = winMessage('player', 'round')
			leadStatus.innerText = loseMessage('player', 'round')
			leadMoney -= 20
			playerMoney += 20
		} else if (getPlayerTotal() > 21) {
			leadStatus.innerText = winMessage('cpu', 'round')
			playerStatus.innerText = loseMessage('cpu', 'round')
			leadMoney += 20
			playerMoney -= 20
		}

		if (getLeadTotal() === 21) {
			playerStatus.innerText = winMessage('cpu', 'round-blackjack')
			leadStatus.innerText = loseMessage('cpu', 'round-blackjack')

			leadMoney += 20
			playerMoney -= 20
		} else if (getPlayerTotal() === 21) {
			playerStatus.innerText = winMessage('player', 'round-blackjack')
			leadStatus.innerText = loseMessage('player', 'round-blackjack')

			leadMoney -= 20
			playerMoney += 20
		}

		if (getPlayerTotal() > getLeadTotal() && getPlayerTotal() < 21) {
			// if player wins
			// console.log('player wins')
			playerStatus.innerText = winMessage('player', 'round')
			leadStatus.innerText = loseMessage('player', 'round')

			leadMoney -= 20
			playerMoney += 20
		} else if (getLeadTotal() > getPlayerTotal() && getLeadTotal() < 21) {
			// if cpu wins
			leadStatus.innerText = winMessage('cpu', 'round')
			playerStatus.innerText = loseMessage('cpu', 'round')
			leadMoney += 20
			playerMoney -= 20
		} else if (getLeadTotal() === getPlayerTotal()) {
			// if player and cpu get 21
			playerStatus.innerText = winMessage('draw', 'round')
			leadStatus.innerText = winMessage('draw', 'round')
		}
		updateMoneyUi()
		roundEnded = true
	}

	if (leadMoney === 0) {
		// if lead runs out of money
		playerStatus.innerText = winMessage('player', 'match')
		leadStatus.innerText = loseMessage('player', 'match')

		return (gameEnded = true)
	}
	if (playerMoney === 0) {
		// if player runs out of money
		playerStatus.innerText = winMessage('cpu', 'match')
		leadStatus.innerText = loseMessage('cpu', 'match')

		return (gameEnded = true)
	}
}

// event listeners
buttonNewCard.addEventListener('click', () => {
	if (getPlayerTotal() < 21 && !roundEnded && !gameEnded) {
		generatePlayerCard()
		console.log(getPlayerTotal())
	}
})

const drawAndEvaluate = () => {
	const dealerTotal = getLeadTotal()
	const playerTotal = getPlayerTotal()
	if (dealerTotal < 17 && dealerTotal <= playerTotal) {
		setTimeout(() => {
			generateLeadCard()
			if (dealerTotal < 17 && dealerTotal <= playerTotal) {
				drawAndEvaluate()
			} else {
				evaluateGame()
			}
		}, 1000)
	} else {
		evaluateGame()
	}
}

buttonStay.addEventListener('click', () => {
	if (!roundEnded && !gameEnded) {
		let containerChildren = leadCardsContainer.children

		containerChildren[0].src = `./svg_playing_cards/fronts/${leadCards[0].suit}_${leadCards[0].name}.svg`

		drawAndEvaluate()
	}
})

buttonNextRound.addEventListener('click', () => {
	if (roundEnded && !gameEnded) {
		initialCardsHand()
	}
})

const initialCardsHand = () => {
	playerCards.length = 0
	leadCards.length = 0
	leadCardsContainer.innerHTML = ''
	playerCardsContainer.innerHTML = ''
	playerStatus.innerText = 'Make your move'
	leadStatus.innerText = '...'

	generateLeadCard(true)
	generateLeadCard(false)

	generatePlayerCard(false)
	generatePlayerCard(false)

	roundEnded = false
}

const updateMoneyUi = () => {
	leadMoneyUi.innerText = leadMoney
	playerMoneyUi.innerText = playerMoney
}

;(function () {
	updateMoneyUi()
	initialCardsHand()
})()
