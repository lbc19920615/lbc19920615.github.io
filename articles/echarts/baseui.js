import { html, render } from 'https://unpkg.com/lit-html?module'

window.initBaseUI = function(data) {
  window.map = data.map

  let keys = [...map.keys()]

  function runCurAction(v) {
    if (map.has(v)) {
      map.get(v)(document)
    }
  }

  runCurAction(keys[0])

  const clickHandler = {
    // handleEvent method is required.
    handleEvent(e) {
      let funName = e.target.dataset.fun
      console.log('btnbtnbtnbtn', funName)
      runCurAction(funName)
    },
    // event listener objects can also define zero or more of the event
    // listener options: capture, passive, and once.
    capture: true,
  }

  const tabsTemplate = () => html`
    ${keys.map(
      (key) =>
        html`<xy-button class="btn" @click=${clickHandler} data-fun="${key}"
          >${key}</xy-button
        >`
    )}
  `

  return {
    renderTab(sel = '') {
      render(tabsTemplate(), document.querySelector(sel))
    },
  }
}
