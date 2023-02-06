import p5 from 'p5'
import { getLargestSize } from '../util/screenSize'

export let chunkSizeSlider: p5.Element
export let bufferSlider: p5.Element

const setup = (p: p5) => {
  const { width, height } = getLargestSize(p)
  const canvas = p.createCanvas(width, height, p.WEBGL)
  p.frameRate(30)
  canvas.style('display', 'block')
  canvas.style('border', '3px solid black')
  const helperText = p.createP('(Pan to rotate, scroll to zoom)')
  helperText.style('width', '100%')
  helperText.style('text-align', 'center')
  const chunkSizeText = p.createP('Chunk Size')
  chunkSizeText.style('width', '100%')
  chunkSizeText.style('text-align', 'center')
  chunkSizeSlider = p.createSlider(1, 400, 200, 1)
  chunkSizeSlider.style('width', '100%')
  const bufferSizeText = p.createP('Buffer Size')
  bufferSizeText.style('width', '100%')
  bufferSizeText.style('text-align', 'center')
  bufferSlider = p.createSlider(1, 15, 4, 1)
  bufferSlider.style('width', '100%')
}

export default setup
