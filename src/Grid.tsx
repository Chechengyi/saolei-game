import React from 'react'
import "./Grid.css"
import { Label, GridStatus, GameStatus } from './utils'

interface GridProps {
  row: number;
  col: number;
  value: GridStatus;
  handClick: (col: number, row: number) => void;
  selectRay: (col: number, row: number) => void;
  gameStatus: GameStatus;
  selectMap: {[name: string]: true};
}

type NumMapCol = Record<Label, string>
const numMapCol: NumMapCol = {
  '1': '#515f9a',
  '2': '#267833',
  '3': '#983043',
  '4': '#161b69',
  '5': '#55201c',
  '6': '#666',
  '7': '#666',
  '8': '#666',
  '9': '#666',
}

const Grid: React.FC<GridProps> = (props)=> {
  const { row, col, value, handClick, gameStatus, selectRay, selectMap } = props;

  const rayimgVisible = React.useMemo(()=>{
    return  gameStatus === 'end' && (value === 'M'|| value === 'X')
  }, [value, gameStatus])

  const flagVisible = React.useMemo(()=>{
    return selectMap[`${row}-${col}`] === true && gameStatus !== 'end'
  }, [props])

  const onmousedown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
    e.preventDefault()
    e.stopPropagation()
    if (e.button===2){
      selectRay(row, col)
    } else {
      if ( selectMap[`${row}-${col}`] ) return
      handClick(row, col)
    }
  }

  return (
    <div 
      className="grid" 
      style={{
        border: value==='X' ? '1px solid red' : ''
      }}
      onMouseDown={onmousedown}
    >
      {
        !numMapCol[value as Label] && !rayimgVisible && value !== 'B' &&
        <img className="ray-img" src="bg.png" />
      }
      {numMapCol[value as Label] && <span className="grid-txt" style={{color: numMapCol[value as Label]}}>{value}</span>}
      {
       rayimgVisible &&
        <img className="ray-img" src="saolei.jpg" />
      }
      {
        flagVisible &&
        <img className="flag-img" src="/qizi.png" />
      }
    </div>
  )
}

export default Grid