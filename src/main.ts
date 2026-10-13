/* ========================================
  HERO SLIDER
======================================== */

const heroSlides =
  document.querySelectorAll<HTMLElement>('.hero__slide')

const heroProjects =
  document.querySelectorAll<HTMLElement>('.hero__project')

let currentIndex = 0

// 1枚の表示時間
const DISPLAY_TIME = 6000


function changeSlide() {

  if (!heroSlides.length || !heroProjects.length) return

  // 現在のスライドを非表示
  heroSlides[currentIndex].classList.remove('is-active')
  heroProjects[currentIndex].classList.remove('is-active')

  // 次の番号へ
  currentIndex++

  // 最後まで行ったら最初へ戻る
  if (currentIndex >= heroSlides.length) {
    currentIndex = 0
  }

  // 次のスライドを表示
  heroSlides[currentIndex].classList.add('is-active')
  heroProjects[currentIndex].classList.add('is-active')
}


if (heroSlides.length && heroProjects.length) {
  setInterval(changeSlide, DISPLAY_TIME)
}



/* ========================================
  MOBILE MENU
======================================== */

const menuButton =
  document.querySelector<HTMLButtonElement>('.mobile-menu-button')

const menu =
  document.querySelector<HTMLElement>('.mobile-menu')

const menuText =
  document.querySelector<HTMLElement>('.mobile-menu-button__text')


if (menuButton && menu && menuText) {

  menuButton.addEventListener('click', () => {

    const isOpen = menu.classList.toggle('is-open')

    menuButton.classList.toggle('is-open', isOpen)

    menuText.classList.add('is-changing')

    setTimeout(() => {

      menuText.textContent = isOpen ? 'close' : 'menu'

      menuText.classList.remove('is-changing')

    }, 200)

  })

}



/* ========================================
  HEADER INCLUDE
======================================== */

async function loadHeader() {

  const response = await fetch('/includes/header.html')
  const html = await response.text()

  const header =
    document.querySelector<HTMLElement>('#header')

  if (header) {
    header.innerHTML = html
  }

}

loadHeader()



/* ========================================
  FOOTER INCLUDE
======================================== */

async function loadFooter() {

  const response = await fetch('/includes/footer.html')
  const html = await response.text()

  const footer =
    document.querySelector<HTMLElement>('#footer')

  if (footer) {
    footer.innerHTML = html
  }

}

loadFooter()



/* ========================================
  CUSTOM CURSOR
======================================== */

const cursor =
  document.querySelector<HTMLElement>('.custom-cursor')


// 通常ページ内にあるiframeのみ対象
// ポップアップiframeはここには含めない
const iframes =
  document.querySelectorAll<HTMLIFrameElement>(
    '.iframe-wrapper iframe'
  )


if (cursor) {

  // カーソル位置
  window.addEventListener('mousemove', (e) => {

    cursor.style.left = `${e.clientX}px`
    cursor.style.top = `${e.clientY}px`

    cursor.classList.add('is-visible')

  })


  // リンクにホバー
  document.addEventListener('mouseover', (e) => {

    const target = e.target as HTMLElement

    if (target.closest('a')) {
      cursor.classList.add('is-hover')
    }

  })


  document.addEventListener('mouseout', (e) => {

    const target = e.target as HTMLElement

    if (target.closest('a')) {
      cursor.classList.remove('is-hover')
    }

  })


  // 通常iframeに入ったらカーソル非表示
  iframes.forEach((iframe) => {

    iframe.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hidden')
    })


    iframe.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hidden')
    })

  })

}



/* ========================================
  IFRAME RESIZE
======================================== */

const wrapper = document.querySelector<HTMLElement>('.iframe-wrapper')
const iframe = wrapper?.querySelector<HTMLIFrameElement>('iframe')

const PC_WIDTH = 1440
const PC_HEIGHT = 900
const SP_WIDTH = 390
const SP_HEIGHT = 844
const BREAKPOINT = 548

function resizeIframe() {
  if (!wrapper || !iframe) return

  const isMobile = window.innerWidth <= BREAKPOINT
  const baseWidth = isMobile ? SP_WIDTH : PC_WIDTH
  const baseHeight = isMobile ? SP_HEIGHT : PC_HEIGHT
  const scale = wrapper.clientWidth / baseWidth

  iframe.style.width = `${baseWidth}px`
  iframe.style.height = `${baseHeight}px`
  iframe.style.transform = `scale(${scale})`
  iframe.style.transformOrigin = 'top left'

  wrapper.style.height = `${baseHeight * scale}px`
}

resizeIframe()
window.addEventListener('resize', resizeIframe)



/* ========================================
  PAGE POPUP
======================================== */

const popup =
  document.querySelector<HTMLElement>('#pagePopup')

const popupIframe =
  document.querySelector<HTMLIFrameElement>('#pagePopupIframe')

const popupTriggers =
  document.querySelectorAll<HTMLElement>('.js-page-popup')

const popupClose =
  document.querySelector<HTMLButtonElement>('.page-popup__close')



/* ========================================
  POPUP OPEN
======================================== */

popupTriggers.forEach((trigger) => {

  trigger.addEventListener('click', () => {

    const page = trigger.dataset.page

    if (!page || !popup || !popupIframe) return

    popupIframe.src = page

    popup.classList.add('is-open')

    // 親ページのカーソルを非表示
    cursor?.classList.add('is-hidden')

    document.body.style.overflow = 'hidden'

  })

})



/* ========================================
  POPUP CLOSE
======================================== */

const closePopup = () => {

  if (!popup || !popupIframe) return

  popup.classList.remove('is-open')

  // 親ページのカーソルを戻す
  cursor?.classList.remove('is-hidden')

  document.body.style.overflow = ''

  setTimeout(() => {
    popupIframe.src = ''
  }, 500)

}

/* ========================================
  IFRAME CLOSE BUTTON
======================================== */

popupClose?.addEventListener('click', () => {

  window.parent.postMessage(
    'close-work-popup',
    window.location.origin
  )

})

/* ========================================
  RECEIVE POPUP CLOSE
======================================== */

window.addEventListener('message', (e: MessageEvent) => {

  if (e.origin !== window.location.origin) return

  if (e.data === 'close-work-popup') {
    closePopup()
  }

})

/* ========================================
  BACKDROP CLOSE
======================================== */

popup?.addEventListener('click', (e) => {

  if (e.target === popup) {
    closePopup()
  }

})

/* ========================================
  ESC CLOSE
======================================== */

document.addEventListener('keydown', (e) => {

  if (
    e.key === 'Escape' &&
    popup?.classList.contains('is-open')
  ) {
    closePopup()
  }

})




/* ========================================
  CLOSE BUTTON × IFRAME CURSOR
======================================== */

// closeボタンにホバー
// ↓
// iframe内のカーソルを非表示

popupClose?.addEventListener('mouseenter', () => {

  popupIframe?.contentWindow?.postMessage(
    'hide-cursor',
    window.location.origin
  )

})


// closeボタンから離れる
// ↓
// iframe内のカーソルを再表示

popupClose?.addEventListener('mouseleave', () => {

  popupIframe?.contentWindow?.postMessage(
    'show-cursor',
    window.location.origin
  )

})



/* ========================================
  RECEIVE CURSOR MESSAGE
======================================== */

// iframeとして表示されているページ側で
// 親ページからのメッセージを受け取る

window.addEventListener(
  'message',
  (e: MessageEvent) => {

    // 同じサイトからの通信だけ許可
    if (e.origin !== window.location.origin) return


    // closeにホバー
    if (e.data === 'hide-cursor') {

      cursor?.classList.add('is-hidden')

    }


    // closeから離れた
    if (e.data === 'show-cursor') {

      cursor?.classList.remove('is-hidden')

    }

  }
)



/* ========================================
  MOVIE PLAY BUTTON
======================================== */

document.querySelectorAll<HTMLElement>('.movie-grid__popup .work-card__image--movie').forEach((wrapper) => {

  const video = wrapper.querySelector<HTMLVideoElement>('video')
  const button = wrapper.querySelector<HTMLButtonElement>('.video-play')

  if (!video || !button) return

  // 再生ボタンをクリック
  button.addEventListener('click', async () => {
    try {
      await video.play()
    } catch (error) {
      console.error('動画の再生に失敗しました', error)
    }
  })

  // 再生中はボタンを非表示
  video.addEventListener('play', () => {
    button.classList.add('is-hidden')
  })

  // 一時停止でボタンを再表示
  video.addEventListener('pause', () => {
    button.classList.remove('is-hidden')
  })

  // 動画終了時
  video.addEventListener('ended', () => {
    video.currentTime = 0
    button.classList.remove('is-hidden')
  })

  // 動画をクリックすると一時停止
  video.addEventListener('click', () => {
    if (!video.paused) {
      video.pause()
    }
  })

})

import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.4,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  easing: (t) => 1 - Math.pow(1 - t, 4),
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)