import p5 from 'p5'
import { boulders } from '../data/input'
import { bufferSlider, chunkSizeSlider } from './setup'
const SCALE = 15

interface State {
  checkingQueue: number[][]
  checkingQueueBacklog: number[][]
}

// const boulders = [
//   [ 2,2,2 ],
//   [ 1,2,2 ],
//   [ 3,2,2 ],
//   [ 2,1,2 ],
//   [ 2,3,2 ],
//   [ 2,2,1 ],
//   [ 2,2,3 ],
//   [ 2,2,4 ],
//   [ 2,2,6 ],
//   [ 1,2,5 ],
//   [ 3,2,5 ],
//   [ 2,1,5 ],
//   [ 2,3,5 ]]

const initialState: State = {
  checkingQueue: [[0, 0, 0]],
  checkingQueueBacklog: []
}
let state: State = {
  checkingQueue: [...initialState.checkingQueue],
  checkingQueueBacklog: []
}

const boundryBase = boulders.reduce((acc, [x,y,z]) => {
  return {
    max: {
      x: Math.max(acc.max.x, x),
      y: Math.max(acc.max.y, y),
      z: Math.max(acc.max.z, z),
    },
    min: {
      x: Math.min(acc.min.x, x),
      y: Math.min(acc.min.y, y),
      z: Math.min(acc.min.z, z),
    },
  }
}, { max: { x: 0, y: 0, z: 0 }, min: { x: 0, y: 0, z: 0 } })
const buffer = 3
const boundry = {
  max: {
    x: boundryBase.max.x + buffer,
    y: boundryBase.max.y + buffer,
    z: boundryBase.max.z + buffer,
  },
  min: {
    x: boundryBase.min.x - buffer,
    y: boundryBase.min.y - buffer,
    z: boundryBase.min.z - buffer,
  },
}

const inBounds = ([x,y,z]: number[]): boolean =>
  x >= boundry.min.x && x <= boundry.max.x &&
  y >= boundry.min.y && y <= boundry.max.y &&
  z >= boundry.min.z && z <= boundry.max.z

const neighbors = ([x,y,z]: number[]): number[][] => {
  return [
    [x+1,y,z],
    [x-1,y,z],
    [x,y+1,z],
    [x,y-1,z],
    [x,y,z+1],
    [x,y,z-1],
  ]
}


const posToStr = ([x,y,z]: number[]): string => `${x},${y},${z}`
const seen: Set<string> = new Set(state.checkingQueue.map(posToStr))
const isBoulder: Set<string> = new Set(boulders.map(posToStr))
const inBolder = (pos: number[]): boolean => isBoulder.has(posToStr(pos))
const inAir = (pos: number[]): boolean => !inBolder(pos)
const boulderTouched: Set<string> = new Set()
const unique = (arr: number[][]): number[][] => {
  const seen: Set<string> = new Set()
  return arr.filter(pos => {
    const str = posToStr(pos)
    if (seen.has(str)) {
      return false
    }
    seen.add(str)
    return true
  })
}

const update = (state: State, chunkSize: number): State => {
  if (state.checkingQueue.length === 0) {
    seen.clear()
    boulderTouched.clear()
    return {
      checkingQueue: [...initialState.checkingQueue],
      checkingQueueBacklog: [...initialState.checkingQueueBacklog],
    }
  }
  const queue = unique([...state.checkingQueue, ...state.checkingQueueBacklog])
  const checkingQueueChunk = queue.slice(0, chunkSize)
  checkingQueueChunk.forEach(pos => seen.add(posToStr(pos)))

  const next = checkingQueueChunk.map(neighbors).flat()
    .filter(pos => !seen.has(posToStr(pos)))
    .filter(inBounds)
    .map(pos => {
      if (inBolder(pos)) {
        boulderTouched.add(posToStr(pos))
      }
      return pos
    })
    .filter(inAir)


  return {
    checkingQueue: [...next],
    checkingQueueBacklog: [...queue.slice(chunkSize)],
  }
}

const draw = (p: p5) => {
  const chunkSizeVal = chunkSizeSlider.value()
  const chunkSize = typeof chunkSizeVal === 'number' ? chunkSizeVal : parseInt(chunkSizeVal, 10)
  const bufferSizeVal = bufferSlider.value()
  const bufferSize = typeof bufferSizeVal === 'number' ? bufferSizeVal : parseInt(bufferSizeVal, 10)
  boundry.max.x = boundryBase.max.x + bufferSize
  boundry.max.y = boundryBase.max.y + bufferSize
  boundry.max.z = boundryBase.max.z + bufferSize
  boundry.min.x = boundryBase.min.x - bufferSize
  boundry.min.y = boundryBase.min.y - bufferSize
  boundry.min.z = boundryBase.min.z - bufferSize

  p.background(20)
  p.orbitControl(3)
  p.scale(SCALE)
  p.translate(-boundry.max.x/2, -boundry.max.y/2, -boundry.max.z/2)

  boulders.forEach(([x,y,z]) => {
    p.push()
    p.fill('gray')
    if (boulderTouched.has(posToStr([x,y,z]))) {
      p.fill('orange')
    }
    p.translate(x, y, z)
    p.box(1, 1, 1)
    p.fill('red')
    p.pop()
  })
  state.checkingQueue.forEach(([x,y,z]) => {
    p.push()
    p.fill('lightblue')
    p.translate(x, y, z)
    p.box(1, 1, 1)
    p.pop()
  })
  p.push()
  p.fill(p.color(255, 255, 255, 20))
  p.translate(
    (boundry.max.x + boundry.min.x)/2,
    (boundry.max.y + boundry.min.y)/2,
    (boundry.max.z + boundry.min.z)/2,
  )
  p.box(
    boundry.max.x - boundry.min.x+1,
    boundry.max.y - boundry.min.y+1,
    boundry.max.z - boundry.min.z+1,
  )
  p.pop()
  state = update(state, chunkSize)
}

export default draw