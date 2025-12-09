import { connectLogger, log } from '@reatom/core'
import 'antd/dist/reset.css'

if (import.meta.env.MODE === 'development') {
  connectLogger()
}

declare global {
    var LOG: typeof log
}

globalThis.LOG = log

export const setup = () => {
  if (import.meta.env.MODE === 'development') {
    connectLogger()
  }
}