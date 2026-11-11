import { Menu, WebContents } from 'electron'
import each from 'licia/each'
import * as window from './window'

const contextMenu = function (
  x: number,
  y: number,
  template: any,
  sender?: WebContents
) {
  x = Math.round(x)
  y = Math.round(y)

  transTpl(template, sender)
  const menu = Menu.buildFromTemplate(template)
  menu.popup({
    x,
    y,
  })
}

export default contextMenu

function transTpl(template: any, sender?: WebContents) {
  each(template, (item: any) => {
    if (item.click) {
      const id: string = item.click
      item.click = function () {
        // Send back to the window that opened this menu; fall back to the
        // focused window only if that sender is gone.
        if (sender && !sender.isDestroyed()) {
          sender.send('clickContextMenu', id)
        } else {
          window.sendFocused('clickContextMenu', id)
        }
      }
    }
    if (item.type === 'submenu') {
      item.submenu = transTpl(item.submenu, sender)
    }
  })
}
