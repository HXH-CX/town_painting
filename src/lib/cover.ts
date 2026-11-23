export interface Box {
  w: number
  h: number
}

function dims(box: Box, aspect: number, contain: boolean) {
  if (contain) {
    const dispW = box.w
    const dispH = box.w / aspect
    return { dispW, dispH, ox: 0, oy: (box.h - dispH) / 2 }
  }
  const dispH = Math.max(box.h, box.w / aspect)
  const dispW = dispH * aspect
  return { dispW, dispH, ox: (box.w - dispW) / 2, oy: (box.h - dispH) / 2 }
}

export function coverPos(x: number, y: number, box: Box, aspect: number, contain = false) {
  if (box.w === 0 || box.h === 0) return { left: x * 100, top: y * 100 }
  const d = dims(box, aspect, contain)
  return { left: ((d.ox + x * d.dispW) / box.w) * 100, top: ((d.oy + y * d.dispH) / box.h) * 100 }
}

export function imagePos(leftPct: number, topPct: number, box: Box, aspect: number, contain = false) {
  const d = dims(box, aspect, contain)
  return {
    x: ((leftPct / 100) * box.w - d.ox) / d.dispW,
    y: ((topPct / 100) * box.h - d.oy) / d.dispH,
  }
}