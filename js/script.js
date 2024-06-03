var state = {
  currentNumbers: [],
  savedGames: [],
  numbers: [],
  maxNumbers: 5
};

function start() {
  readLocalStorage();
  createNumbers();
  newGame();
  document.querySelector('#number-amount').addEventListener('change', handleNumberAmountChange);
}

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGames = window.localStorage.getItem('saved-games-quina');

  if (savedGames) {
    state.savedGames = JSON.parse(savedGames);
  }
}

function writeLocalStorage() {
  window.localStorage.setItem('saved-games-quina', JSON.stringify(state.savedGames));
}

function createNumbers() {
  state.numbers = [];

  for (var i = 1; i <= 80; i++) {
    state.numbers.push(i);
  }
}

function newGame() {
  state.currentNumbers = [];
  render();
}

function render() {
  renderNumbers();
  renderButtons();
  renderSavedGames();
}

function renderNumbers() {
  var divNumbers = document.querySelector('#quina-numbers');
  divNumbers.innerHTML = '';
  
  var ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  for (var i = 0; i < state.numbers.length; i++) {
    var number = state.numbers[i];

    var liNumber = document.createElement('li');
    liNumber.textContent = number.toString().padStart(2, '0');
    liNumber.classList.add('number');

    liNumber.addEventListener('click', handleNumberClick);

    if (state.currentNumbers.includes(number)) {
      liNumber.classList.add('selected-number');
    }

    ulNumbers.appendChild(liNumber);
  }

  divNumbers.appendChild(ulNumbers);
}

function handleNumberClick(event) {
  var element = event.currentTarget;
  var number = parseInt(element.textContent);

  if (state.currentNumbers.includes(number)) {
    state.currentNumbers = state.currentNumbers.filter(num => num !== number);
  } else {
    if (state.currentNumbers.length < state.maxNumbers) {
      state.currentNumbers.push(number);
    }
  }

  renderNumbers();
  renderButtons();
}

function handleNumberAmountChange(event) {
  state.maxNumbers = parseInt(event.target.value);
  newGame();
}

function renderButtons() {
  var divButtons = document.querySelector('#quina-buttons');
  divButtons.innerHTML = '';

  var ulButtons = document.createElement('ul');
  ulButtons.classList.add('buttons');

  var liNewGameButton = renderNewGameButton();
  var liRandomGameButton = renderRandomGameButton();
  var liSaveGameButton = renderSaveGameButton();
  var liClearSavedGamesButton = renderClearSavedGamesButton();

  ulButtons.appendChild(liNewGameButton);
  ulButtons.appendChild(liRandomGameButton);
  ulButtons.appendChild(liSaveGameButton);
  ulButtons.appendChild(liClearSavedGamesButton);

  divButtons.appendChild(ulButtons);
}

function renderNewGameButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Novo jogo';
  button.addEventListener('click', newGame);

  li.appendChild(button);

  return li;
}

function renderRandomGameButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Jogo aleatório';
  button.addEventListener('click', generateRandomGame);

  li.appendChild(button);

  return li;
}

function renderSaveGameButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Salvar jogo';
  button.disabled = state.currentNumbers.length !== state.maxNumbers;
  button.addEventListener('click', saveGame);

  li.appendChild(button);

  return li;
}

function renderClearSavedGamesButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Limpar jogos salvos';
  button.addEventListener('click', clearSavedGames);

  li.appendChild(button);

  return li;
}

function generateRandomGame() {
  state.currentNumbers = [];

  while (state.currentNumbers.length < state.maxNumbers) {
    var randomNum = Math.floor(Math.random() * 80) + 1;
    if (!state.currentNumbers.includes(randomNum)) {
      state.currentNumbers.push(randomNum);
    }
  }

  render();
}

function saveGame() {
  var game = [...state.currentNumbers];
  game.sort((a, b) => a - b);
  state.savedGames.push(game);
  writeLocalStorage();
  newGame();
}

function clearSavedGames() {
  state.savedGames = [];
  writeLocalStorage();
  render();
}

function renderSavedGames() {
  var divSavedGames = document.querySelector('#quina-saved-games');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo gravado até o momento.</p>';
  } else {
    var h2 = document.createElement('h2');
    h2.textContent = 'Jogos salvos';

    var ul = document.createElement('ul');
    ul.classList.add('saved-games');

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      var li = document.createElement('li');
      var numbers = currentGame.map(number => number.toString().padStart(2, '0')).join(' ');

      li.textContent = numbers;

      ul.appendChild(li);
    }

    divSavedGames.appendChild(h2);
    divSavedGames.appendChild(ul);
  }
}

start();
