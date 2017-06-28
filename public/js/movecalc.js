var calcRandomMove = function() {
  var possibleMoves = game.moves();
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
