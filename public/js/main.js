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
var makeMove = function() {
  // makeRandomMove();
  makeBestMoveOne();
}

var makeRandomMove = function() {
  var possibleMoves = game.moves();

  // exit if the game is over
  if (game.game_over() === true ||
    game.in_draw() === true ||
    possibleMoves.length === 0) return;

  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());
};

// Evaluates current chess board.
// Takes a 2D array represneting board, and the color of the player to evaluate.
var evaluateBoard = function(board, color) {
  // Sets the value for each piece
  var pieceValue = {
    'p': 10,
    'n': 30,
    'b': 30,
    'r': 50,
    'q': 90,
    'k': 900
  };

  var value = 0;
  // Loop through all pieces on the board and sum up total
  board.forEach(function(row) {
    row.forEach(function(piece) {
      if (piece) {
        value += pieceValue[piece['type']]
                 * (piece['color'] === color ? 1 : -1);
      }
    });
  });
  return value;
};

var makeBestMoveOne = function() {
  // List all possible moves
  var possibleMoves = game.moves();
  // Sort moves randomly, so the same move isn't always picked on ties
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

  // exit if the game is over
  if (game.game_over() === true || possibleMoves.length === 0) return;

  var bestMoveSoFar = null;
  var bestMoveValue = -9999;

  possibleMoves.forEach(function(move) {
    game.move(move);
    var moveValue = evaluateBoard(game.board(), 'b');
    if (moveValue > bestMoveValue) {
      bestMoveSoFar = move;
      bestMoveValue = moveValue;
    }
    game.undo();
  });

  game.move(bestMoveSoFar);
  board.position(game.fen());
}
