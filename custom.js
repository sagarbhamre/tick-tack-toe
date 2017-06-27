function Board(startState) {
    this.board = (startState == null) ? [null, null, null,
        null, null, null,
        null, null, null
    ] : startState.slice(0);

    this.cell = function(row, col) {
        var rtn = this.board[row * 3 + col];
        return rtn;
    }
    this.setCell = function(row, col, value) {
        this.board[row * 3 + col] = value;
    }
    this.isCellEmpty = function(row, column) {
        return this.cell(row, column) == null;
    }
    this.oppIndex = function(index) {
        if (index == 0) {
            return 2;
        }
        if (index == 1) {
            return 1;
        }
        if (index == 2) {
            return 0;
        }
    }
    this.opposite = function(rowColumn) {
        var r = rowColumn[0];
        var c = rowColumn[1];
        return [this.oppIndex(r), this.oppIndex(c)];
    }
    this.compareMoves = function(rowColumnOne, rowColumnTwo) {
        if (!rowColumnOne instanceof Array) {
            throw "rowColumnOne must be an array";
        }
        if (!rowColumnTwo instanceof Array) {
            throw "rowColumnTwo must be an array";
        }
        if (rowColumnOne.length != rowColumnTwo.length) {
            throw "lengths must be the same: " + rowColumnOne.length +
                " versus " + rowColumnTwo.length;
        }
        for (var i = 0; i < rowColumnOne.length; i++) {
            if (rowColumnOne[i] != rowColumnTwo[i]) {
                return false;
            }
        }
        return true;
    }

    this.findMatchingMove = function(findRowColumn, listRowColumns) {
        if (!findRowColumn instanceof Array) {
            throw "findRowColumn must be an array";
        }
        if (!listRowColumns instanceof Array) {
            throw "listRowColumns must be an array";
        }
        for (var i = 0; i < listRowColumns.length; i++) {
            var target = listRowColumns[i];
            if (this.compareMoves(findRowColumn, target)) {
                return true;
            }
        }
        return false;
    }
    this.checkPlayerThrow = function(player) {
        if (!player) {
            throw "Must supply non-null 'player' argument";
        }
    }

    this.computeMoveWinFor = function(player) {
        this.checkPlayerThrow(player);
        var wins = this.computeListMoveWinsFor(player);
        if (wins) {
            return wins[0];
        } else {
            return null;
        }
    }

    this.computeListMoveWinsFor = function(player) {
        this.checkPlayerThrow(player);
        var rtn = [];
        var items = this.listEmpty();
        for (var i = 0; i < items.length; i++) {
            var move = items[i];
            if (this.doesMoveWinFor(player, move)) {
                rtn.push(move);
            }
        }
        return rtn;
    }

    this.doesMoveWinFor = function(player, moveRowColumn) {
        this.checkPlayerThrow(player);
        var testboard = new Board(this.board);
        testboard.setCell(moveRowColumn[0], moveRowColumn[1], player);
        var originalEmpty = this.listEmpty();
        var nowEmpty = testboard.listEmpty();
        var winner = testboard.winner();
        var rtn = winner == player;
        return rtn;
    }
    this.computeMoveForksFor = function(player) {
        this.checkPlayerThrow(player);
        var list = this.listMoveForksFor(player);
        if (list.length > 0) {
            return list[0];
        } else {
            return null;
        }
    }

    this.listMoveForksFor = function(player) {
        var rtn = [];
        var items = this.listEmpty();
        for (var i = 0; i < items.length; i++) {
            var moveRowColumn = items[i];
            var testboard = new Board(this.board);
            testboard.setCell(moveRowColumn[0], moveRowColumn[1], player);
            var winningMoves = testboard.computeListMoveWinsFor(player);
            if (winningMoves.length >= 2) {
                rtn.push(moveRowColumn);
            }
        }
        return rtn;
    }

    this.computeBlockForkMove = function(player, opponent) {
        this.checkPlayerThrow(player);
        var rtn = null;
        var listForkMoves = this.listMoveForksFor(player);
        if (listForkMoves.length > 0) {
            var items = this.listEmpty();
            for (var i = 0; i < items.length; i++) {
                var moveRowColumn = items[i];
                var testboard = new Board(this.board);
                testboard.setCell(moveRowColumn[0], moveRowColumn[1], opponent);
                var opponentWinningMoves = testboard.computeListMoveWinsFor(opponent);
                
                for (var m = 0; m < opponentWinningMoves.length; m++) {
                    var check = opponentWinningMoves[m];
                    if (this.findMatchingMove(check, listForkMoves)) {
                    } else {
                        if (!rtn) {
                            rtn = moveRowColumn;
                        }
                        break;
                    }
                }
            }
        } else {
        }
        return rtn;
    }

    this.corners = [
        [0, 0],
        [0, 2],
        [2, 0],
        [2, 2]
    ];

    this.findFirstEmptyCorner = function() {
        return this.findFirstEmpty(this.corners);
    }

    this.sides = [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 1]
    ];
    this.findFirstEmptySide = function() {
        return this.findFirstEmpty(this.sides);
    }

    this.findFirstEmpty = function(moves) {
        var rtn = null;

        for (var i = 0; i < moves.length; i++) {
            var move = moves[i];
            if ((rtn == null) && (this.isCellEmpty(move[0], move[1]))) {
                rtn = move;
            }
        }
        return rtn;
    }

    this.findOppositeCornerMove = function(player) {
        this.checkPlayerThrow(player);
        var rtn = null;

        for (var i = 0; i < this.corners.length; i++) {
            var move = this.corners[i];
            if (this.cell(move[0], move[1]) == player) {
                var opposite = this.opposite(move);
                if (this.isCellEmpty(opposite[0], opposite[1])) {
                    rtn = [opposite[0], opposite[1]];

                }
            }
        }
        return rtn;
    }

    this.listEmpty = function() {
        var rtn = [];
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (this.isCellEmpty(r, c)) {
                    rtn.push([r, c]);
                }
            }
        }
        return rtn;
    }

    this.countEmpty = function() {
            var count = 0;
            for (var r = 0; r < 3; r++) {
                for (var c = 0; c < 3; c++) {
                    if (this.isCellEmpty(r, c)) {
                        count++;
                    }
                }
            }
            return count;
        }
    this.winner = function() {
        var winner = null;
        for (var r = 0; r < 3; r++) {
            if (this.cell(r, 0) && this.cell(r, 0) == this.cell(r, 1) && this.cell(r, 1) == this.cell(r, 2)) {
                winner = this.cell(r, 0)
            }
            if (this.cell(0, r) && this.cell(0, r) == this.cell(1, r) && this.cell(1, r) == this.cell(2, r)) {
                winner = this.cell(0, r)
            }
        }

        // check board diagonally
        if (this.cell(0, 0) && this.cell(0, 0) == this.cell(1, 1) && this.cell(1, 1) == this.cell(2, 2)) {
            winner = this.cell(0, 0)
        }
        if (this.cell(0, 2) && this.cell(0, 2) == this.cell(1, 1) && this.cell(1, 1) == this.cell(2, 0)) {
            winner = this.cell(0, 2)
        }

        return winner;
    }

    this.strategylog = function(msg) {
        if (false) {
            console.log(msg);
        }
    }

    this.strategyPerfect = function(computerPlayer, humanPlayer) {
        var winComputer = this.computeMoveWinFor(computerPlayer);
        if (winComputer) {
            return winComputer;
        }
        this.strategylog("not wincomputer");

        var winPlayer = this.computeMoveWinFor(humanPlayer);
        if (winPlayer) {
            return winPlayer;
        }
        this.strategylog("not winplayer");

        var forkComputer = this.computeMoveForksFor(computerPlayer);
        if (forkComputer) {
            return forkComputer;
        }
        this.strategylog("not forkcomputer");

        var forkPlayer = this.computeBlockForkMove(humanPlayer, computerPlayer);
        if (forkPlayer) {
            return forkPlayer;
        }
        this.strategylog("not forkPlayer");

        var center = [1, 1];
        if (this.isCellEmpty(center[0], center[1])) {
            return center;
        }
        this.strategylog("not center");

        var oppositeCorner = this.findOppositeCornerMove(humanPlayer);
        if (oppositeCorner) {
            return oppositeCorner;
        }
        this.strategylog("not oppositecorner");

        var randomCorner = this.findFirstEmptyCorner();
        if (randomCorner) {
            return randomCorner;
        }
        this.strategylog("not randomcorner");

        var randomSide = this.findFirstEmptySide();
        if (randomSide) {
            return randomSide;
        }
        this.strategylog("not randomsize");

        console.log("Programmer error");
        return [-1, -1];
    }

}



var ttt = angular.module('mytictactoe', []);

ttt
    .controller("mytictactoeCtrl", function($scope, $timeout) {
        $scope.currentPlayer = 'O';
        $scope.player = 'O';
        // $scope.computerSkill = 'First';
        $scope.winner = null;
        $scope.board = new Board(null);

        $scope.timesAvailable = [
            { time: 2000 }
        ];
        $scope.computerThinkTimeMillis = $scope.timesAvailable[0];

        $scope.message = null;

        var timeoutPromise = null;

        $scope.cellClass = function(row, column) {
            var value = $scope.board.cell(row, column);
            var rtn = 'cell cell-' + value;
            if (((row * 3 + column) % 2) == 0) {
                rtn = rtn + ' cellHilightBg';
            }
            return rtn;
        };

        $scope.cellText = function(row, column) {
            var value = $scope.board.cell(row, column);
            return value ? value : '';
        };

        $scope.messageSet = function(msg) {
            $scope.message = msg;
        }
        $scope.messageClear = function() {
            $scope.messageSet(null);
        }

        $scope.cellClick = function(row, column) {
            if ($scope.winner) {
                $scope.messageSet('Game Over. Press New Game.');
                return;
            }
            if ($scope.player != $scope.currentPlayer) {
                $scope.messageSet('Not your turn.');
                return;
            }
            if (!$scope.board.isCellEmpty(row, column)) {
                $scope.messageSet('Already taken.  Try another.');
                return;
            }

            $scope.playerMakesMove(row, column, $scope.currentPlayer);
        }

        $scope.playerMakesMove = function(row, column, thePlayer) {
            clearTimeoutIfSet();
            $scope.messageClear();
            $scope.board.setCell(row, column, thePlayer);
            checkBoard();
            if (!$scope.winner) {
                $scope.switchPlayer();
            }
        }
        $scope.switchPlayer = function() {
            $scope.currentPlayer = nextPlayer($scope.currentPlayer);
            doTimeoutManagement();
        }


        $scope.isComputerTurn = function() {
            return $scope.player != $scope.currentPlayer;
        }

        $scope.newGame = function() {
            // clear TIMEOUT
            clearTimeoutIfSet();
            // clear "error message on wrong move"
            $scope.messageClear();

            for (var r = 0; r < 3; r++) {
                for (var c = 0; c < 3; c++) {
                    $scope.board.setCell(r, c, null);
                }
            }
            $scope.currentPlayer = 'O';
            $scope.player = 'O';
            $scope.winner = null;
        }

        function doTimeoutManagement() {
            clearTimeoutIfSet();
            addTimeoutIfComputerTurn();
        }

        function clearTimeoutIfSet() {
            if ($scope.timeoutPromise) {
                // console.log("Clear timeout: yes");
                $timeout.cancel($scope.timeoutPromise);
                $scope.timeoutPromise = null;
            } else {
                // console.log("Clear timeout: nope");
            }
        }

        function addTimeoutIfComputerTurn() {
            if ($scope.isComputerTurn()) {
                var delay = $scope.computerThinkTimeMillis.time;
                $scope.timeoutPromise = $timeout(computerTurn, delay);
                //console.log("Add timeout: yes " + $scope.timeoutPromise);
            } else {
                //console.log("Add timeout: no");
            }
        }

        function computerPlayer() {
            return nextPlayer($scope.player);
        }

        function humanPlayer() {
            return $scope.player;
        }

        function nextPlayer(player) {
            return {
                O: 'X',
                X: 'O'
            }[player]
        }


        function checkBoard() {
            var winner = $scope.board.winner();
            var count = $scope.board.countEmpty();
            var anyEmpty = count > 0;

            if (!winner && !anyEmpty) {
                $scope.winner = 'NONE';
            } else if (winner) {
                $scope.winner = winner;
            }
        }
        var playerChanged = function() {
            if (!$scope.winner) {
                doTimeoutManagement();
            }
        };

        var computerTurn = function() {

            $scope.playerMakesMove(movePerfectEmpty()[0], movePerfectEmpty()[1], $scope.currentPlayer);
        };

        function movePerfectEmpty() {
            var rtn = $scope.board.strategyPerfect(computerPlayer(), humanPlayer());
            return rtn;
        }

        $scope.$watch('player', playerChanged);

    });
