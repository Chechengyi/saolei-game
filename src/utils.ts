// 根据游戏难度获得 行列数以及 雷的数量
function getColRowNums(level: string): [number, number, number] {
  switch (level) {
    case "0":
      return [10, 10, 10]
    case "1":
      return [16, 16, 40]
    case "2":
      return [16, 30, 99]
    default:
      return [10, 10, 10]
  }
}

export type GameStatus = 'going' | 'end' | 'suc'
export type Label = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
export type GridStatus = 'M' | 'E' | 'B' | 'X' | Label
export type Map = Array<Array<GridStatus>>

function getMaps(row: number, col: number, rayNums: number): Map {
  let maps: Map = []
  let currentRayNums = 0;
  // 发现洗牌算法初始雷靠上最后随机的雷分布靠上，所以这里初始雷也做一个随机
  let isUp = Math.random() > 0.5 ? false : true
  if ( isUp ) {
    for (let i =0; i < row; i++) {
      maps[i] = []
      for (let j = 0; j < col; j++) {
        if (currentRayNums < rayNums) {
          maps[i].push('M')
          currentRayNums++
        } else {
          maps[i].push('E')
        }
      }
    }
  } else {
    for (let i = row-1; i >=0; i--) {
      maps[i] = []
      for (let j = 0; j < col; j++) {
        if (currentRayNums < rayNums) {
          maps[i].push('M')
          currentRayNums++
        } else {
          maps[i].push('E')
        }
      }
    }
  }
  return maps
}

// 洗牌算法重新布雷
function shuffle(maps: Map): Map{
  let row = maps.length
  let col = maps[0].length
  let currentRow = row
  let currentCol = col
  while( currentRow>1 || currentCol>1 ){
    let randomRow = Math.floor( Math.random() * currentRow )
    let randomCol = Math.floor( Math.random() * currentCol )
    currentCol--
    swap([randomRow, randomCol], [currentRow-1, currentCol], maps)
    if (currentCol<1){
      currentCol = col
      currentRow--
    }
  }

  return maps
}

// 单次操作，雷被点击 返回此时的
function updateMaps(board:Map, click: number[]) {
  function backTrack(x: number, y: number, type: string){
    if ( x < 0 || x===board.length ) return
    if (y < 0 || y===board[0].length) return
    if ( board[x][y] === 'M' ) {
      if ( type === 'click' ){
        board[x][y] = 'X'
      }
      return
    }
    if ( board[x][y] !== 'E' ) return

    let ret = computedNum(x, y)
    if (ret===0){
      board[x][y] = 'B'
    } else {
      board[x][y] = String(ret) as Label
    }
    if (board[x][y] !== 'B') return

    let startX = x-1
    let startY = y-1
    let endX = x+1
    let endY = y+1

    for ( var i=startX; i<=endX; i++ ) {
      for ( var j=startY; j<=endY; j++ ) {
        if ( i===x && j===y ) continue
        
        backTrack(i, j, 'check')
      }
    }
  }

  function computedNum(x: number, y: number){
    let startX = x-1
    let startY = y-1
    let endX = x+1
    let endY = y+1
    let ret = 0
    for ( var i=startX; i<=endX; i++ ) {
      for ( var j=startY; j<=endY; j++ ) {
        if ( i===x && j===y ) continue
        if ( i < 0 || i===board.length ) continue
        if (j < 0 || j===board[0].length) continue
        if ( board[i][j] === 'M' ) ret++
      }
    }
    return ret
  }

  backTrack(click[0], click[1], 'click')
  return board
};

// 根据当前map 和 selectMap 计算游戏是否成功
function computedGame(
  maps: Map, 
  selectMap: {[name: string]: boolean}
):boolean {
  let selectKeys = Object.keys(selectMap)
  for ( let i=0; i<selectKeys.length; i++ ) {
    let row = Number(selectKeys[i].split('-')[0])
    let col = Number(selectKeys[i].split('-')[1])
    if ( maps[row][col] !== 'M' ) return false
  }
  return true
}

function swap(
  point1: [number, number], 
  point2: [number, number], 
  maps: Map
): Map{
  let mid = maps[point1[0]][point1[1]]
  maps[point1[0]][point1[1]] = maps[point2[0]][point2[1]]
  maps[point2[0]][point2[1]] = mid
  return maps
}

export {
  getColRowNums,
  getMaps,
  shuffle,
  updateMaps,
  computedGame
}