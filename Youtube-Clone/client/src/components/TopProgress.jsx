import React from 'react'

export default function TopProgress({
  loading,
  easing = 'cubic-bezier(.17,.67,.29,1)',
  successColor = '#16A34A',
  finishDelay = 500,
  showPercentage = true,
  playSound = false,
  showToast = false,
  successMessage = 'Done',
  slowThreshold = 2000,
}) {
  const [visible, setVisible] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [bg, setBg] = React.useState(null)
  const [indeterminate, setIndeterminate] = React.useState(false)
  const [toastVisible, setToastVisible] = React.useState(false)
  const timerRef = React.useRef(null)
  const startRef = React.useRef(0)

  React.useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  React.useEffect(() => {
    if (loading) {
      setBg(null)
      setIndeterminate(false)
      setToastVisible(false)
      setVisible(true)
      startRef.current = Date.now()
      setProgress((p) => (p > 12 ? p : 12))
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setProgress((cur) => {
          // set indeterminate if slow
          const elapsed = Date.now() - startRef.current
          if (elapsed > slowThreshold && cur < 70) setIndeterminate(true)
          if (cur >= 92) return cur
          const inc = 2 + Math.random() * 4
          return Math.min(92, cur + inc)
        })
      }, 160)
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
      setIndeterminate(false)
      setProgress(100)
      setBg(successColor)
      if (playSound) playBeep()
      if (showToast) setToastVisible(true)
      const t = setTimeout(() => {
        setVisible(false)
        const reset = setTimeout(() => { setProgress(0); setBg(null); setToastVisible(false) }, 300)
        return () => clearTimeout(reset)
      }, finishDelay)
      return () => clearTimeout(t)
    }
  }, [loading, successColor, finishDelay, playSound, showToast, slowThreshold])

  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 880
      g.gain.value = 0.05
      o.connect(g); g.connect(ctx.destination)
      o.start()
      setTimeout(() => { o.stop(); ctx.close().catch(()=>{}) }, 120)
    } catch (err) {
      // ignore audio errors
    }
  }

  const style = indeterminate ? {} : { width: `${progress}%`, transition: `width 360ms ${easing}, background-color 200ms linear` }
  if (bg) style.background = bg

  return (
    <>
      <div className={visible ? 'top-progress visible' : 'top-progress hidden'} style={{pointerEvents:'none'}}>
        <div className={`bar ${indeterminate ? 'indeterminate' : ''}`} style={style} />
        {showPercentage && !indeterminate && visible && (
          <div className="top-progress-label" aria-hidden>{Math.round(progress)}%</div>
        )}
      </div>
      {showToast && toastVisible && (
        <div className="top-toast">{successMessage}</div>
      )}
    </>
  )
}
