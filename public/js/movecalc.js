// Pick a random move to make
var randomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

// Evaluates current chess board relative to player color ('w' or 'b')
var evaluateBoard = function(board, color) {
  // Sets the value for each piece using standard piece value
  var pieceValue = {
    'p': 100,
    'n': 350,
    'b': 350,
    'r': 525,
    'q': 1000,
    'k': 10000
  };

  // Loop through all pieces on the board and sum up total
  var value = 0;
  board.forEach(function(row) {
    row.forEach(function(piece) {
      if (piece) {
        // Subtract piece value if it is opponent's piece
        value += pieceValue[piece['type']]
                 * (piece['color'] === color ? 1 : -1);
      }
    });
  });

  return value;
};

var calcBestMoveOne = function(playerColor) {
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
    var moveValue = evaluateBoard(game.board(), playerColor);
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
    value = evaluateBoard(game.board(), game.turn());
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

// Calculate the best move using Minimax with Alpha Beta Pruning.
// Provide depth and game as params.
var calcBestMove = function(depth, game, playerColor, alpha=Number.NEGATIVE_INFINITY,
                               beta=Number.POSITIVE_INFINITY,
                               isMaximizingPlayer=true) {
  // Base case: return current board position
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null]
  }

  var bestMove = null;
  var possibleMoves = game.moves();
  // Randomize possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    game.move(move);
    value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];

    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
                bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      // Assign best move if is appropriate for player position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Assign best move if is appropriate for player position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }

    game.undo();
    if (beta <= alpha) {
      console.log('Prune', alpha, beta);
      break;
    }
  }

  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  return [bestMoveValue, bestMove || possibleMoves[0]];
}
