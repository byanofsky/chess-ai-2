# Chess AI
A chess AI, with with different algorithms of increasing intelligence.

Play live version here: https://bay-chess-ai.herokuapp.com/

See my blog post about implementation here: https://byanofsky.com/2017/07/06/building-a-simple-chess-ai/

Based on [Lauri Hartikka's tutorial](https://medium.freecodecamp.org/simple-chess-ai-step-by-step-1d55a9266977)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development. See Deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need to have Node.js and npm installed. For instructions on installing Node, please visit [NPM's documentation on installing Node.js](https://docs.npmjs.com/getting-started/installing-node).

### Installing

You can run npm's initialization to install dependencies from `package.json`.

```
npm init
```

### How to Play

When playing, I recommend having your browser's console open to issue commands and view the computer player's 'thinking' through each move.

#### Play Against Computer

To play against the computer, simply make a move. You will play as the white side. The computer will then make a move.

The computer is currently set to look 3 moves ahead using minimax with alpha beta pruning.

#### Computer vs Computer

If you'd like to have the computer play the computer, you can do so with this command in your browser's console, setting the algorithm you'd like to use, and each computer player's 'skill' level.

```
playGame(algo=4, skillW=2, skillB=2)
// algo=
// 1 - random
// 2 - Best move, one move ahead
// 3 - Best move, n moves ahead, minimax
// 4 - Best move, n moves ahead, minimax with alpha beta pruning (Faster)
// skillW and skillB are how many moves ahead to look
```

`skillW` and `skillB` only work with alogs 3 & 4. The skill level is what sets how many moves ahead each player will look.

Algo 3 does not use alpha beta pruning, so setting skill levels greater than 2 will make move times very long.

Algo 4 uses alpha beta pruning, so you can set skill level up to 3, maybe even 4. But beyond that, move times will be very long.

## Deployment

You can run this locally with Node.js, and visiting http://localhost:5000.

```
node app.js
```

You can also easily deploy this to a server. It is ready to be deployed to Heroku, with a Procfile included. [Instructions from Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)


## Built With

* [Express](https://expressjs.com) - The web framework used
* [chess.js](https://github.com/jhlywa/chess.js) - Chess library
* [chessboard.js](https://github.com/oakmac/chessboardjs) - Chess board visualization

## Authors

* **Brandon Yanofsky** - *Initial work* - [byanofsky](https://github.com/byanofsky)

## Acknowledgments

* Inspired by [Lauri Hartikka's tutorial](https://medium.freecodecamp.org/simple-chess-ai-step-by-step-1d55a9266977)

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details. Some files have their own licenses, as described in 3rd Party Software below.

## 3rd Party Software

See [LICENSE-3RD-PARTY](LICENSE-3RD-PARTY) file for full licenses

* [chess.js](https://github.com/jhlywa/chess.js)
Copyright (c) 2017, Jeff Hlywa (jhlywa@gmail.com)
* [chessboard.js](https://github.com/oakmac/chessboardjs)
Copyright 2013 Chris Oakman
* [jQuery](https://github.com/jquery/jquery) Copyright JS Foundation and other contributors, https://js.foundation/

## Todo

* Implement Negamax
* Implement sorting function for possible moves to optimize alpha beta pruning
* Better implementation of Express
* Add an element of machine learning
* Improve interface
* Refactor code
