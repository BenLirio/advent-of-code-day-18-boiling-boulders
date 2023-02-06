import p5 from 'p5'
import { getLargestSize } from '../util/screenSize'

const windowResized = (p: p5) => {
  const {width, height} = getLargestSize(p)
  p.resizeCanvas(width, height)
}
export default windowResized