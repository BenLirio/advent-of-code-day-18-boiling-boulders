import p5 from 'p5'
import { getLargestSize } from '../util/screenSize'

const setup = (p: p5) => {
  const { width, height } = getLargestSize(p)
  const canvas = p.createCanvas(width, height)
  canvas.style('display', 'block')
  canvas.style('border', '3px solid black')
}

export default setup
