
import React from 'react'

const SolanaLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 30 30"
    >
      <path fill="url(#pattern0_2344_416)" d="M0 0H30V30H0z"></path>
      <defs>
        <pattern
          id="pattern0_2344_416"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00333)" xlinkHref="#image0_2344_416"></use>
        </pattern>
        <image
          id="image0_2344_416"
          width="300"
          height="300"
          xlinkHref="data:image/png;base64,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"
        ></image>
      </defs>
    </svg>
  )
}

export default SolanaLogo