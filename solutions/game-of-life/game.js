var gameOfLife = {
  width: 12,
  height: 12,
  stepInterval: null,

  createAndShowBoard: function () {
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /* 
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */

    var cells = document.getElementsByTagName('td');
    // Array prototype call solution
    Array.prototype.forEach.call(cells, iteratorFunc);
    // // for loop solution
    // for (var i = 0; i < cells.length; i++) {
    //   iteratorFunc(cells[i]);
    // }
  },
  
  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y" 
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "on-click" events that allow a user to click on 
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"
    
    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white
    
    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board
    
    var onCellClick = function (e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?
      
      // how to set the style of the cell when it's clicked
      if (this.getAttribute('data-status') == 'dead') {
        this.className = "alive";
        this.setAttribute('data-status', 'alive');
      } else {
        this.className = "dead";
        this.setAttribute('data-status', 'dead');
      }
    };

    this.forEachCell(function (cell) {
      // var cell00 = document.getElementById('0-0');
      cell.onclick = onCellClick;
    });

    this.enableAutoPlay();

    var self = this;
    document.getElementById('step_btn').onclick = function () {
      self.step();
    };
    
  },

  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game. 
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    
    // // DOESNT WORK - UPDATES TOO EARLY
    // this.forEachCell(function (cell) {
    //   var numLiveNeighbors = countLiveNeighbors(cell);
    //   if (status(cell) == 'dead') {
    //     if (numLiveNeighbors === 3) {
    //       toggle(cell);
    //     }
    //   } else {
    //     if (numLiveNeighbors > 3 || numLiveNeighbors < 2) {
    //       toggle(cell);
    //     }
    //   }
    // });

    // double rainbow approach
    // make a first pass to store the number of live neighbors
    // next pass update them

    // doppleganger
    // make a clone of the board to read from
    // don't update the clone

    // lazy
    // do it later
    var toToggle = [];

    this.forEachCell(function (cell) {
      var numLiveNeighbors = countLiveNeighbors(cell);
      if (status(cell) == 'dead') {
        if (numLiveNeighbors === 3) {
          toToggle.push(cell);
        }
      } else {
        if (numLiveNeighbors > 3 || numLiveNeighbors < 2) {
          toToggle.push(cell);
        }
      }
    });
    toToggle.forEach(function (cell) {
      toggle(cell);
    });
  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    var playButton = document.getElementById('play_btn');

    var self = this;
    playButton.onclick = function () {
      self.step();
    };
  }
};

function status (cell) {
  return cell.getAttribute('data-status');
}

function getNeighbors (cell) {
  var neighbors = [];
  var pos = cell.id.split('-').map(Number);
  for (var xOffset = -1; xOffset < 2; xOffset++) {
    for (var yOffset = -1; yOffset < 2; yOffset++) {
      var x = pos[0] + xOffset,
          y = pos[1] + yOffset;
      if (xOffset == 0 && yOffset == 0) {
        continue;
      }
      var neighbor = document.getElementById(x + '-' + y);
      if (neighbor) {
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
}

function countLiveNeighbors (cell) {
  return getNeighbors(cell).reduce(function (sum, neighbor) {
    var toAdd;
    if (status(neighbor) == 'dead') {
      toAdd = 0;
    } else {
      toAdd = 1;
    }
    return sum + toAdd;
  }, 0);
}

function toggle (cell) {
  if (cell.getAttribute('data-status') == 'dead') {
    cell.className = "alive";
    cell.setAttribute('data-status', 'alive');
  } else {
    cell.className = "dead";
    cell.setAttribute('data-status', 'dead');
  }
}

  gameOfLife.createAndShowBoard();
