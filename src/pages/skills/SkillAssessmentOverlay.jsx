import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Check, X, XCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import tenant from '@/config/tenant'

const SKILLS_PROFILE = tenant.pages.learn.skillsProfile

export default function SkillAssessmentOverlay({ skillId, skillLabel, onClose }) {
  const questions = SKILLS_PROFILE.assessmentQuestions?.[skillId] || []
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])

  const total = questions.length
  const q = questions[currentQuestion]
  const isCorrect = submitted && selectedOption === q?.correct
  const _isIncorrect = submitted && selectedOption !== null && selectedOption !== q?.correct

  if (!questions.length) return null

  function handleSubmit() {
    if (selectedOption === null) return
    setSubmitted(true)
    const correct = selectedOption === q.correct
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, { question: currentQuestion, selected: selectedOption, correct }])
  }

  function handleNext() {
    if (currentQuestion + 1 >= total) {
      setFinished(true)
    } else {
      setCurrentQuestion(c => c + 1)
      setSelectedOption(null)
      setSubmitted(false)
    }
  }

  function handlePrev() {
    if (currentQuestion > 0) {
      setCurrentQuestion(c => c - 1)
      const prevAnswer = answers[currentQuestion - 1]
      if (prevAnswer) {
        setSelectedOption(prevAnswer.selected)
        setSubmitted(true)
      } else {
        setSelectedOption(null)
        setSubmitted(false)
      }
    }
  }

  function getOptionStyle(index) {
    if (!submitted) {
      return selectedOption === index ? 'border-brand-700 bg-muted/50' : 'border-border hover:bg-muted/30'
    }
    if (selectedOption === index && index === q.correct) return 'border-emerald-600 bg-emerald-50'
    if (index === q.correct) return 'border-transparent bg-emerald-50'
    if (selectedOption === index) return 'border-red-800 bg-red-50'
    return 'border-border'
  }

  function getRadioStyle(index) {
    if (!submitted) {
      return selectedOption === index ? 'border-brand-800 bg-brand-800' : 'border-muted-foreground/40'
    }
    if (index === q.correct) return 'border-muted-foreground/40 opacity-50'
    return 'border-muted-foreground/40 opacity-50'
  }

  if (finished) {
    return createPortal(
      <div className="fixed inset-0 z-[60] bg-[#f9fafb] flex flex-col">
        <header className="flex items-center h-[80px] px-8 shrink-0">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-6" />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl border border-border w-full max-w-[700px] flex flex-col items-center justify-center py-16 px-20">
            <div className="flex flex-col items-center gap-7 w-full max-w-[535px]">
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="size-8 text-emerald-700" />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-normal text-foreground leading-9 tracking-[-0.75px]">Assessment Complete</h1>
                  <p className="text-base text-foreground font-normal leading-7">
                    You scored {score} out of {total} for <span className="font-medium">{skillLabel}</span>.
                    {score >= Math.ceil(total * 0.8)
                      ? ' Great result — you have a strong understanding of this area.'
                      : score >= Math.ceil(total * 0.6)
                      ? ' Good result. A quick review of the areas you missed is recommended.'
                      : ' We recommend reviewing the learning materials to strengthen your understanding.'}
                  </p>
                </div>
              </div>
              <div className="w-full space-y-2">
                <Button className="w-full" onClick={onClose}>
                  Return to Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-[#f9fafb] flex flex-col">
      <header className="flex items-center h-[80px] px-8 shrink-0">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-6" />
        </button>
      </header>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-border w-full max-w-[700px] flex flex-col overflow-hidden">
          <div className="px-6 pt-8 pb-6 space-y-6">
            <div className="space-y-2">
              <p className="text-base text-foreground font-normal">{skillLabel} Assessment</p>
              <h2 className="text-2xl font-normal text-foreground leading-8 tracking-[-0.6px]">{q.question}</h2>
            </div>
            <div className="space-y-2.5">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => !submitted && setSelectedOption(i)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-3 rounded-lg border h-[60px] px-3 text-left transition-all ${getOptionStyle(i)}`}
                >
                  <span className={`size-4 rounded-full border-[1.5px] shrink-0 flex items-center justify-center ${getRadioStyle(i)}`}>
                    {selectedOption === i && !submitted && <span className="size-1.5 rounded-full bg-white" />}
                    {submitted && i === q.correct && <Check className="size-2.5 text-white" strokeWidth={3} />}
                    {submitted && selectedOption === i && i !== q.correct && <X className="size-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`text-sm font-medium ${
                    submitted && selectedOption === i && i === q.correct ? 'text-foreground'
                    : submitted && i === q.correct ? 'text-brand-700'
                    : submitted && selectedOption === i ? 'text-foreground'
                    : submitted ? 'text-muted-foreground'
                    : 'text-foreground'
                  }`}>{option}</span>
                  {submitted && selectedOption === i && i === q.correct && <CheckCircle2 className="size-6 text-emerald-600 ml-auto shrink-0" />}
                  {submitted && selectedOption === i && i !== q.correct && <XCircle className="size-6 text-red-800 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
            {submitted && (
              <div className={`rounded-lg px-3 py-3 space-y-1 ${isCorrect ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium leading-6 ${isCorrect ? 'text-brand-700' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-sm text-foreground font-normal leading-6">{q.explanation}</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-6 py-5">
            <Button variant="secondary" className="w-[161px] h-10" onClick={handlePrev} disabled={currentQuestion === 0}>
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-base text-foreground font-normal">{currentQuestion + 1} of {total}</span>
            {!submitted ? (
              <Button className="w-[161px] h-10" onClick={handleSubmit} disabled={selectedOption === null}>Submit</Button>
            ) : (
              <Button className="w-[161px] h-10" onClick={handleNext}>
                {currentQuestion + 1 >= total ? 'Finish' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
