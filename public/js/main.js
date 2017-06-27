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
  // var move = calcRandomMove();
  // var move = calcBestMoveOne();
  // var move = calcBestMoveN(2, game, true)[1];
  var move = calcBestMoveNAB(2, game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true)[1];
  game.move(move);
  board.position(game.fen());
}

var calcRandomMove = function() {
  var possibleMoves = game.moves();

  // exit if the game is over
  if (game.game_over() === true ||
    game.in_draw() === true ||
    possibleMoves.length === 0) return;

  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

// Evaluates current chess board.
// Takes a 2D array represneting board, and the color of the player to evaluate.
var evaluateBoard = function(board, color) {
  // Sets the value for each piece
  var pieceValue = {
    'p': 100,
    'n': 300,
    'b': 300,
    'r': 500,
    'q': 900,
    'k': 9000
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

var calcBestMoveOne = function() {
  // List all possible moves
  var possibleMoves = game.moves();
  // Sort moves randomly, so the same move isn't always picked on ties
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

  // exit if the game is over
  if (game.game_over() === true || possibleMoves.length === 0) return;

  var bestMoveSoFar = null;
  var bestMoveValue = Number.NEGATIVE_INFINITY;

  possibleMoves.forEach(function(move) {
    game.move(move);
    var moveValue = evaluateBoard(game.board(), 'b');
    if (moveValue > bestMoveValue) {
      bestMoveSoFar = move;
      bestMoveValue = moveValue;
    }
    game.undo();
  });

  return bestMoveSoFar;
}

var calcBestMoveN = function(depth, game, isMaximizingPlayer) {
  // Base case: return current board position
  if (depth === 0) {
    value = evaluateBoard(game.board(), 'b');
    return [value, null]
  }

  var bestMove = null;
  var possibleMoves = game.moves();
  // Randomize possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  possibleMoves.forEach(function(move) {
    game.move(move);
    value = calcBestMoveN(depth-1, game, !isMaximizingPlayer)[0];
    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move,
                value, bestMove, bestMoveValue);
    // Assign best move if is appropriate for player position
    if ((isMaximizingPlayer && value > bestMoveValue)
        || (!isMaximizingPlayer && value < bestMoveValue)) {
      bestMoveValue = value;
      bestMove = move;
    }
    game.undo();
  });
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue);
  return [bestMoveValue, bestMove];
}

var calcBestMoveNAB = function(depth, game, alpha, beta, isMaximizingPlayer) {
  // Base case: return current board position
  if (depth === 0) {
    value = evaluateBoard(game.board(), 'b');
    return [value, null]
  }

  var bestMove = null;
  var possibleMoves = game.moves();
  // Randomize possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

  if (isMaximizingPlayer) {
    // Set a default best move value
    var bestMoveValue = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < possibleMoves.length; i++) {
      var move = possibleMoves[i];
      game.move(move);
      value = calcBestMoveNAB(depth-1, game, alpha, beta, !isMaximizingPlayer)[0];
      console.log('Max: ', depth, move, value, bestMove, bestMoveValue);
      // Assign best move if is appropriate for player position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
      game.undo();
      if (beta <= alpha) {
        console.log('Prune', alpha, beta);
        break;
      }
    }
  } else {
    var bestMoveValue = Number.POSITIVE_INFINITY;
    for (var i = 0; i < possibleMoves.length; i++) {
      var move = possibleMoves[i];
      game.move(move);
      value = calcBestMoveNAB(depth-1, game, alpha, beta, !isMaximizingPlayer)[0];
      console.log('Min: ', depth, move, value, bestMove, bestMoveValue);
      // Assign best move if is appropriate for player position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
      game.undo();
      if (beta <= alpha) {
        console.log('Prune', beta, alpha);
        break;
      }
    };
  }
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  return [bestMoveValue, bestMove];
}
