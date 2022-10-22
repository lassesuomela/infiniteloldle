import React from 'react'

export default function Footer() {
  return (
    <div id="footer" className="text-center fixed-bottom">
      <div className="mb-3">
        <span>About</span>
      </div>
      <p>{new Date().getFullYear()} infiniteloldle.com</p>
    </div>
  )
}
