var board,
    game = new Chess();

// Actions after any move
var onChange = function(oldPos, newPos) {
  // Alert if game is over
  if (game.game_over() === true) {
    alert('Game Over');
    console.log('Game Over');
  }

  // Log the current game position
  console.log(game.fen());
};

// Check before pick pieces that it is white and game is not over
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true || piece.search(/^b/) !== -1) {
    return false;
  }
};

// Check that move is legal, then allow black to move
var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';
  console.log(move)

  // make random legal move for black
  window.setTimeout(makeMove, 250);
};

// Update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onChange: onChange,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = ChessBoard('board', cfg);

// Wrapper function for computer moves
var makeMove = function(skill) {
  // exit if the game is over
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }

  // var move = calcRandomMove();
  // var move = calcBestMoveOne(game.turn());
  // var move = calcBestMoveN(3, game, true)[1];
  var move = calcBestMoveNAB(skill, game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true)[1];
  game.move(move);
  board.position(game.fen());
}

var playGame = function() {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }

  var skill;
  if (game.turn() === 'w') {
    skill = 3;
  } else {
    skill = 2;
  }
  makeMove(skill);
  window.setTimeout(playGame, 250);
};

// playGame();
