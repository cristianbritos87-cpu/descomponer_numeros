"use client"

import { useState, useCallback, useEffect } from "react"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"

type PlaceValue = "miles" | "centenas" | "decenas" | "unidades"
type Digits = 2 | 3 | 4

interface Selection {
  miles: number | null
  centenas: number | null
  decenas: number | null
  unidades: number | null
}

function generateRandomNumber(digits: Digits): number {
  switch (digits) {
    case 2:
      return Math.floor(Math.random() * 90) + 10
    case 3:
      return Math.floor(Math.random() * 900) + 100
    case 4:
      return Math.floor(Math.random() * 9000) + 1000
  }
}

function getPlaceValues(num: number) {
  const miles = Math.floor(num / 1000) * 1000
  const centenas = Math.floor((num % 1000) / 100) * 100
  const decenas = Math.floor((num % 100) / 10) * 10
  const unidades = num % 10
  return { miles, centenas, decenas, unidades }
}

function getRequiredPlaces(num: number, digits: Digits): PlaceValue[] {
  const values = getPlaceValues(num)
  const places: PlaceValue[] = []
  
  if (digits === 4 && values.miles > 0) places.push("miles")
  if (digits >= 3 && values.centenas > 0) places.push("centenas")
  if (digits >= 2 && values.decenas > 0) places.push("decenas")
  if (values.unidades > 0) places.push("unidades")
  
  if (places.length === 0) {
    if (digits === 4) places.push("miles")
    else if (digits === 3) places.push("centenas")
    else places.push("decenas")
  }
  
  return places
}

function getOptions(place: PlaceValue): number[] {
  switch (place) {
    case "miles":
      return [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000]
    case "centenas":
      return [100, 200, 300, 400, 500, 600, 700, 800, 900]
    case "decenas":
      return [10, 20, 30, 40, 50, 60, 70, 80, 90]
    case "unidades":
      return [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
}

const placeConfig = {
  miles: {
    label: "Miles",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-400",
    selectedColor: "ring-4 ring-blue-500 bg-blue-100",
    textColor: "text-blue-600",
    bgLight: "bg-blue-100",
  },
  centenas: {
    label: "Cienes",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-400",
    selectedColor: "ring-4 ring-green-500 bg-green-100",
    textColor: "text-green-600",
    bgLight: "bg-green-100",
  },
  decenas: {
    label: "Dieces",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-400",
    selectedColor: "ring-4 ring-orange-500 bg-orange-100",
    textColor: "text-orange-600",
    bgLight: "bg-orange-100",
  },
  unidades: {
    label: "Unos",
    color: "bg-pink-500",
    hoverColor: "hover:bg-pink-400",
    selectedColor: "ring-4 ring-pink-500 bg-pink-100",
    textColor: "text-pink-600",
    bgLight: "bg-pink-100",
  },
}

const digitColors = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
]

function getDigitColor(index: number, totalDigits: number) {
  const offset = 4 - totalDigits
  return digitColors[index + offset] || digitColors[0]
}

export function NumberDecomposer() {
  const [digits, setDigits] = useState<Digits>(4)
  const [targetNumber, setTargetNumber] = useState<number>(1234)
  const [selection, setSelection] = useState<Selection>({
    miles: null,
    centenas: null,
    decenas: null,
    unidades: null,
  })
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const requiredPlaces = getRequiredPlaces(targetNumber, digits)

  useEffect(() => {
    setTargetNumber(generateRandomNumber(digits))
  }, [digits])

  const handleSelect = (place: PlaceValue, value: number) => {
    setSelection((prev) => ({ ...prev, [place]: value }))
    setShowResult(false)
  }

  const fireConfetti = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#3b82f6", "#22c55e", "#f97316", "#ec4899", "#fbbf24"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#3b82f6", "#22c55e", "#f97316", "#ec4899", "#fbbf24"],
      })
    }, 250)
  }, [])

  const checkAnswer = () => {
    const correctValues = getPlaceValues(targetNumber)
    
    let isAllCorrect = true
    for (const place of requiredPlaces) {
      if (selection[place] !== correctValues[place]) {
        isAllCorrect = false
        break
      }
    }

    setShowResult(true)
    setIsCorrect(isAllCorrect)
    setAttempts((prev) => prev + 1)

    if (isAllCorrect) {
      setScore((prev) => prev + 1)
      fireConfetti()
    }
  }

  const nextNumber = () => {
    setTargetNumber(generateRandomNumber(digits))
    setSelection({
      miles: null,
      centenas: null,
      decenas: null,
      unidades: null,
    })
    setShowResult(false)
  }

  const resetGame = () => {
    setScore(0)
    setAttempts(0)
    nextNumber()
  }

  const changeDigits = (newDigits: Digits) => {
    setDigits(newDigits)
    setSelection({
      miles: null,
      centenas: null,
      decenas: null,
      unidades: null,
    })
    setShowResult(false)
  }

  const isComplete = requiredPlaces.every((place) => selection[place] !== null)

  const correctValues = getPlaceValues(targetNumber)
  
  const formatDecomposition = (values: typeof correctValues) => {
    const parts: string[] = []
    if (requiredPlaces.includes("miles")) parts.push(String(values.miles))
    if (requiredPlaces.includes("centenas")) parts.push(String(values.centenas))
    if (requiredPlaces.includes("decenas")) parts.push(String(values.decenas))
    if (requiredPlaces.includes("unidades")) parts.push(String(values.unidades))
    return parts.join(" + ")
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Descomponer Numeros
          </h1>
          <p className="text-lg text-gray-600">
            Selecciona las tarjetas correctas para descomponer el numero
          </p>
          <div className="mt-4 flex justify-center gap-4 text-lg font-semibold">
            <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
              Aciertos: {score}
            </span>
            <span className="rounded-full bg-gray-200 px-4 py-2 text-gray-700">
              Intentos: {attempts}
            </span>
          </div>
        </div>

        {/* Digit Selector */}
        <div className="mb-6 flex flex-col items-center">
          <p className="mb-3 text-lg font-medium text-gray-600">
            Cantidad de cifras:
          </p>
          <div className="flex gap-3">
            {([2, 3, 4] as Digits[]).map((d) => (
              <button
                key={d}
                onClick={() => changeDigits(d)}
                className={cn(
                  "rounded-xl px-6 py-3 text-xl font-bold transition-all transform hover:scale-105 active:scale-95",
                  digits === d
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                )}
              >
                {d} cifras
              </button>
            ))}
          </div>
        </div>

        {/* Target Number */}
        <div className="mb-8 flex flex-col items-center">
          <p className="mb-2 text-lg text-gray-600">
            Descompone este numero:
          </p>
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <span className="text-5xl font-bold tracking-wider md:text-7xl">
              {targetNumber.toString().split("").map((digit, i) => {
                const colors = getDigitColor(i, targetNumber.toString().length)
                return (
                  <span
                    key={i}
                    className={cn(
                      "inline-block px-2 py-1 mx-1 rounded-lg",
                      colors.bg,
                      colors.text
                    )}
                  >
                    {digit}
                  </span>
                )
              })}
            </span>
          </div>
        </div>

        {/* Selection Display */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold md:text-3xl">
          {requiredPlaces.map((place, index) => (
            <div key={place} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-800">+</span>}
              <span
                className={cn(
                  "rounded-lg px-3 py-2 transition-all",
                  selection[place] !== null
                    ? cn(placeConfig[place].bgLight, placeConfig[place].textColor)
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {selection[place] ?? (
                  place === "miles" ? "____" :
                  place === "centenas" ? "___" :
                  place === "decenas" ? "__" : "_"
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Card Sections - Grid layout for mobile */}
        <div className={cn(
          "mb-8 grid gap-2 md:gap-4",
          requiredPlaces.length === 2 && "grid-cols-2",
          requiredPlaces.length === 3 && "grid-cols-3",
          requiredPlaces.length === 4 && "grid-cols-4"
        )}>
          {requiredPlaces.map((place) => (
            <div key={place} className="rounded-xl bg-white p-2 md:p-4 shadow-lg">
              <h3
                className={cn(
                  "mb-1 md:mb-3 text-center text-sm md:text-xl font-bold",
                  placeConfig[place].textColor
                )}
              >
                {placeConfig[place].label}
              </h3>
              <div className="flex flex-col gap-1 md:gap-2">
                {getOptions(place).map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSelect(place, value)}
                    className={cn(
                      "w-full rounded-lg py-1 md:py-2 text-xs md:text-lg font-bold transition-all transform hover:scale-105 active:scale-95",
                      selection[place] === value
                        ? cn("text-gray-800", placeConfig[place].selectedColor)
                        : cn("text-white", placeConfig[place].color, placeConfig[place].hoverColor)
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={checkAnswer}
            disabled={!isComplete}
            className={cn(
              "rounded-2xl px-8 py-4 text-xl font-bold transition-all transform hover:scale-105 active:scale-95",
              isComplete
                ? "bg-green-500 text-white shadow-lg hover:bg-green-600"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            )}
          >
            Comprobar
          </button>
          <button
            onClick={nextNumber}
            className="rounded-2xl bg-yellow-400 px-8 py-4 text-xl font-bold text-yellow-900 shadow-lg transition-all transform hover:scale-105 hover:bg-yellow-500 active:scale-95"
          >
            Nuevo Numero
          </button>
          <button
            onClick={resetGame}
            className="rounded-2xl bg-gray-200 px-8 py-4 text-xl font-bold text-gray-700 shadow-lg transition-all transform hover:scale-105 hover:bg-gray-300 active:scale-95"
          >
            Reiniciar
          </button>
        </div>

        {/* Result Modal */}
        {showResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
              className={cn(
                "w-full max-w-md rounded-3xl p-8 text-center shadow-2xl",
                isCorrect ? "bg-green-500" : "bg-orange-100"
              )}
            >
              {isCorrect ? (
                <>
                  <div className="mb-4 text-6xl">🎉</div>
                  <h2 className="mb-2 text-4xl font-bold text-white">
                    LO LOGRASTE!
                  </h2>
                  <p className="mb-4 text-2xl font-semibold text-white/90">
                    GENIAL!
                  </p>
                  <p className="mb-6 text-lg text-white/80">
                    {targetNumber} = {formatDecomposition(correctValues)}
                  </p>
                  <button
                    onClick={nextNumber}
                    className="rounded-2xl bg-white px-8 py-4 text-xl font-bold text-green-600 shadow-lg transition-all transform hover:scale-105 active:scale-95"
                  >
                    Siguiente!
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 text-6xl">🤔</div>
                  <h2 className="mb-2 text-3xl font-bold text-orange-800">
                    Casi lo tienes!
                  </h2>
                  <p className="mb-4 text-lg text-orange-700">
                    La respuesta correcta es:
                  </p>
                  <p className="mb-6 text-xl font-bold text-orange-900">
                    {targetNumber} = {formatDecomposition(correctValues)}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setShowResult(false)}
                      className="rounded-2xl bg-orange-500 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                      Intentar de nuevo
                    </button>
                    <button
                      onClick={nextNumber}
                      className="rounded-2xl bg-orange-200 px-6 py-3 text-lg font-bold text-orange-800 shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                      Nuevo numero
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
