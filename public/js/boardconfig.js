var board,
    game = new Chess();

// Actions after any move
var onMoveEnd = function(oldPos, newPos) {
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

// Configure board
var cfg = {
  draggable: true,
  position: 'start',
  // Handlers for user actions
  onMoveEnd: onMoveEnd,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = ChessBoard('board', cfg);
