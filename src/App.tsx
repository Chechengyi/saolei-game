import React from 'react';
import './App.css';
import Grid from './Grid'
import { 
  getColRowNums, getMaps,
   shuffle, updateMaps, 
   Map, GameStatus, computedGame 
} from './utils'

type SelectMap = {
  [name: string]: true
}

function App() {

  const [level, setLevel] = React.useState('0')
  const [maps, setMaps] = React.useState<Map>([]);
  const [gameStatus, setGameStatus] = React.useState<GameStatus>('going') // end  suc
  const [selectMap, setSelectMap] = React.useState<SelectMap>({});

  const radioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(e.target.value)
  }

  const [rows, cols, rayNums] = getColRowNums(level);

  React.useEffect(() => {
    initGame()
  }, [rows, cols, rayNums])
  
  const initGame = React.useCallback(()=>{
    let maps = getMaps(rows, cols, rayNums)
    setMaps(maps)
    shuffle(maps)
    setGameStatus('going')
    setSelectMap({})
  }, [rows, cols, rayNums])

  const handClick = (row: number, col: number)=> {
    if (gameStatus!=='going') return
    if ( maps[row][col] === 'M' ) {
      setGameStatus('end')
    }
    const currentMaps = updateMaps(maps, [row, col])
    setMaps(currentMaps.slice(0))
  }

  const selectRay = (row: number, col: number)=> {
    if (gameStatus!=='going') return
    let map = {...selectMap}
    let str = row + '-' + col
    if ( map[str] === true) {
      delete map[str]
    } else {
      // 如果当前标记的雷已经大于或者等于地雷个数， 则不能在标记
      if (Object.keys(map).length >= rayNums) {
        console.log('标记大于地雷数！')
        return
      }
      map[str] = true
    }
    setSelectMap(map)
    if ( Object.keys(map).length >= rayNums ) {
      // 如果当前选择地雷的个数大于或等于地雷数目 则验证游戏是否已经成功了
      let gameResule = computedGame(maps, map)
      if (gameResule){
        setGameStatus('suc')
      }
    }
  }



  // 每次地图操作之后 如果标记地雷的方块被打开了 则从selectMap中需要清理掉
  React.useEffect(()=>{
    let map = {...selectMap}
    const keys = Object.keys(selectMap)
    if ( keys.length === 0 ) return
    keys.forEach( key=> {
      const row: number = Number( key.split('-')[0])
      const col: number = Number( key.split('-')[1])
      let value = maps[row][col]
      if ( value === 'B' || (parseInt(value) >=1 && parseInt(value) <=9) ) {
        delete map[`${row}-${col}`]
      }
    })
    setSelectMap(map)
  }, [maps])

  const renderRow = React.useMemo(() => {
    return maps.map((row, rowIndex) => {
      return (
        <div className="row" key={rowIndex}>
          {row.map((gridValue, colIndex) => {
            return (
              <Grid
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                value={gridValue}
                handClick={handClick}
                gameStatus={gameStatus}
                selectRay={selectRay}
                selectMap={selectMap}
              />
            )
          })}
        </div>
      )
    })
  }, [maps, selectMap])

  const reStart = ()=> {
    initGame()
  }

  return (
    <div className="App">
      <div className="header-box">
        <div>
          <span>游戏难度：</span>
          <label><input onChange={radioChange} checked={'0' === level} name="level" type="radio" value="0" />简单 </label>
          <label><input onChange={radioChange} checked={'1' === level} name="level" type="radio" value="1" />中等 </label>
          <label><input onChange={radioChange} checked={'2' === level} name="level" type="radio" value="2" />困难 </label>
        </div>
        <button className="start-btn" onClick={reStart}>重新开始</button>
      </div>
      <div className="game-info">
        <div className="ray-nums">剩余地雷个数：{rayNums - Object.keys(selectMap).length }</div>
        {gameStatus==='end' && <div className="end">游戏失败！</div>}
        {gameStatus==='suc' && <div className="suc">恭喜你，获得了胜利</div>}
      </div>
      <div className="content">
        {renderRow}
      </div>
    </div>
  );
}

export default App;
