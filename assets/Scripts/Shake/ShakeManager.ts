import { Component, game, _decorator } from 'cc'
import { EVENT_ENUM, SHAKE_TYPE_ENUM } from '../../Enum'
import EventManager from '../../Runtime/EventManager'
const { ccclass } = _decorator

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking: boolean
  private shakeType: SHAKE_TYPE_ENUM
  private oldTime: number
  private oldPos: { x: number; y: number } = { x: 0, y: 0 }
  //振幅
  private shakeAmount = 1.6
  //持续时间
  private duration = 200
  //频率
  private frequency = 12
  //当前振动进度
  private percent = 1

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
  }

  stop() {
    if(this.percent > 0){
      this.isShaking = false
      this.percent = 0
      this.node.setPosition(this.oldPos.x, this.oldPos.y)
    }
  }

  onShake(type: SHAKE_TYPE_ENUM) {
    if (this.isShaking) {
      return
    }
    this.isShaking = true
    this.percent = 0
    this.shakeType = type
    this.oldTime = game.totalTime
    this.oldPos.x = this.node.position.x
    this.oldPos.y = this.node.position.y
  }

  update() {
    this.onShakeUpdate()
  }

  /***
   * 正弦震动
   * y= A * sin *(wx + f)
   */
  onShakeUpdate() {
    if (this.isShaking) {
      //当前时间
      const percent = (game.totalTime - this.oldTime) / this.duration

      const offset = Math.abs(this.shakeAmount * Math.sin(this.frequency * Math.PI * percent))
      if (this.shakeType === SHAKE_TYPE_ENUM.TOP) {
        this.node.setPosition(this.oldPos.x, this.oldPos.y + offset)
      } else if (this.shakeType === SHAKE_TYPE_ENUM.BOTTOM) {
        this.node.setPosition(this.oldPos.x, this.oldPos.y - offset)
      } else if (this.shakeType === SHAKE_TYPE_ENUM.LEFT) {
        this.node.setPosition(this.oldPos.x - offset, this.oldPos.y)
      } else if (this.shakeType === SHAKE_TYPE_ENUM.RIGHT) {
        this.node.setPosition(this.oldPos.x + offset, this.oldPos.y)
      }
      if (percent > 1) {
        this.isShaking = false
        this.percent = 0
        this.node.setPosition(this.oldPos.x, this.oldPos.y)
      }
    }
  }
}
