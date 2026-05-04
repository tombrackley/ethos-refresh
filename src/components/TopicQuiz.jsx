import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, ArrowLeft, Check, XCircle, CheckCircle2 } from 'lucide-react'

// ─── Quiz Data ───────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    question: 'What is the primary obligation of a director under the duty of care and diligence?',
    options: [
      'To maximise shareholder returns at all costs',
      'To perform their role carefully and attentively, taking appropriate steps to understand key issues',
      'To delegate all responsibilities to management',
      'To follow instructions from the majority shareholder',
    ],
    correct: 1,
    explanation: 'The duty of care and diligence requires directors to perform their role carefully and attentively, with a degree of care and diligence — taking appropriate steps and asking questions to understand key issues and risks.',
  },
  {
    question: 'When must a director disclose a material personal interest in a matter?',
    options: [
      'Only when asked by the board chair',
      'At the next annual general meeting',
      'As soon as practicable after becoming aware of the interest',
      'Only if the interest exceeds $10,000 in value',
    ],
    correct: 2,
    explanation: 'Directors must disclose material personal interests as soon as practicable after becoming aware of them. This is a fundamental requirement under the Corporations Act 2001.',
  },
  {
    question: 'What does the business judgment rule (section 180(2)) protect?',
    options: [
      'All business decisions regardless of process',
      'Decisions made in good faith, for a proper purpose, without material personal interest, after reasonable inquiry',
      'Only decisions that result in profit',
      'Decisions approved by external legal counsel',
    ],
    correct: 1,
    explanation: 'The business judgment rule provides a safe harbour for directors who make decisions in good faith, for a proper purpose, without material personal interest, after making reasonable inquiry, and who believe the decision is in the company\'s best interests.',
  },
  {
    question: 'Which of the following best describes the duty to act in good faith?',
    options: [
      'Acting honestly and for the benefit of the company as a whole',
      'Always agreeing with the majority of the board',
      'Prioritising the interests of the largest shareholder',
      'Following industry trends without question',
    ],
    correct: 0,
    explanation: 'The duty to act in good faith requires directors to act honestly and in the best interests of the company as a whole, not for any individual shareholder or personal benefit.',
  },
  {
    question: 'What constitutes misuse of position under director duties?',
    options: [
      'Attending board meetings remotely',
      'Asking too many questions at meetings',
      'Using your role to gain a personal benefit or cause harm to the company',
      'Disagreeing with management recommendations',
    ],
    correct: 2,
    explanation: 'Misuse of position occurs when a director uses their position to gain a benefit (directly or indirectly) or cause harm to the company, including using confidential information gained through the role.',
  },
  {
    question: 'Under the Corporations Act, who can be considered an officer of a company?',
    options: [
      'Only the CEO and CFO',
      'Directors, secretaries, and those who make decisions affecting the whole or substantial part of the business',
      'Only those listed on the company register',
      'Any employee with a management title',
    ],
    correct: 1,
    explanation: 'The Corporations Act defines officers broadly to include directors, secretaries, and persons who make or participate in making decisions that affect the whole or a substantial part of the business.',
  },
  {
    question: 'What is the consequence of breaching the duty not to trade while insolvent?',
    options: [
      'A written warning from ASIC',
      'Automatic disqualification for 1 year',
      'Personal liability for debts incurred while insolvent',
      'Loss of voting rights at board meetings',
    ],
    correct: 2,
    explanation: 'Directors can be held personally liable for debts incurred by the company when it trades while insolvent. This is one of the most significant personal risks for directors.',
  },
  {
    question: 'How often should directors review and update their understanding of duties?',
    options: [
      'Only when legislation changes',
      'Once every five years',
      'Continuously, as duties evolve with legislation, case law, and best practice',
      'Only when joining a new board',
    ],
    correct: 2,
    explanation: 'Director duties are not static — they evolve with new legislation, court decisions, regulatory guidance, and governance best practice. Continuous review ensures compliance and best practice.',
  },
  {
    question: 'What is a director\'s obligation regarding confidential company information?',
    options: [
      'They may share it with close family members',
      'They must not use it to advantage themselves or others, causing detriment to the company',
      'They can use it freely after leaving the board',
      'It only applies during board meetings',
    ],
    correct: 1,
    explanation: 'Directors must not misuse information obtained through their role. Any information gained because of the position should not be used to advantage the director or others, or cause detriment to the company.',
  },
  {
    question: 'Which body is primarily responsible for enforcing director duties in Australia?',
    options: [
      'The Australian Taxation Office (ATO)',
      'The Australian Securities and Investments Commission (ASIC)',
      'The Reserve Bank of Australia',
      'The Australian Competition and Consumer Commission (ACCC)',
    ],
    correct: 1,
    explanation: 'ASIC is the primary regulator responsible for enforcing director duties under the Corporations Act 2001. They can bring civil and criminal proceedings against directors who breach their duties.',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function TopicQuiz({ onClose, onBackToHandbook }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])

  const total = QUESTIONS.length
  const q = QUESTIONS[currentQuestion]
  const isCorrect = submitted && selectedOption === q?.correct
  const isIncorrect = submitted && selectedOption !== null && selectedOption !== q?.correct

  function handleSubmit() {
    if (selectedOption === null) return
    setSubmitted(true)
    const correct = selectedOption === q.correct
    if (correct) setScore((s) => s + 1)
    setAnswers((a) => [...a, { question: currentQuestion, selected: selectedOption, correct }])
  }

  function handleNext() {
    if (currentQuestion + 1 >= total) {
      setFinished(true)
    } else {
      setCurrentQuestion((c) => c + 1)
      setSelectedOption(null)
      setSubmitted(false)
    }
  }

  function handlePrev() {
    if (currentQuestion > 0) {
      setCurrentQuestion((c) => c - 1)
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

  function handleRetake() {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setSubmitted(false)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  function getOptionStyle(index) {
    if (!submitted) {
      if (selectedOption === index) {
        return 'border-brand-700 bg-muted/50'
      }
      return 'border-border hover:bg-muted/30'
    }

    // Submitted states
    if (selectedOption === index && index === q.correct) {
      return 'border-emerald-600 bg-emerald-50'
    }
    if (index === q.correct) {
      return 'border-transparent bg-emerald-50'
    }
    if (selectedOption === index && index !== q.correct) {
      return 'border-red-800 bg-red-50'
    }
    return 'border-border'
  }

  function getRadioStyle(index) {
    if (!submitted) {
      if (selectedOption === index) {
        return 'border-brand-800 bg-brand-800'
      }
      return 'border-muted-foreground/40'
    }
    if (index === q.correct) {
      return 'border-muted-foreground/40 opacity-50'
    }
    if (selectedOption === index && index !== q.correct) {
      return 'border-muted-foreground/40 opacity-50'
    }
    return 'border-muted-foreground/40 opacity-50'
  }

  // ── Quiz Complete screen ──
  if (finished) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#f9fafb] flex flex-col">
        <header className="flex items-center h-[80px] px-8 shrink-0">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-6" />
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl border border-border w-full max-w-[700px] flex flex-col items-center justify-center py-16 px-20">
            <div className="flex flex-col items-center gap-7 w-full max-w-[535px]">
              {/* Check icon */}
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="size-8 text-emerald-700" />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-normal text-foreground leading-9" style={{ letterSpacing: '-0.75px' }}>Quiz Complete</h1>
                  <p className="text-base text-foreground font-normal leading-7">
                    You scored {score} out of {total} for this quiz on your Core Statutory Duties.
                    {score >= 8
                      ? ' Great result. You have a strong understanding of your duties.'
                      : score >= 6
                      ? ' Good result. A quick review of the areas you missed is recommended.'
                      : ' We recommend reviewing the duties handbook to strengthen your understanding.'}
                  </p>
                </div>
              </div>

              <div className="w-full space-y-2">
                <Button className="w-full" onClick={handleRetake}>
                  Take Quiz Again
                </Button>
                <Button variant="outline" className="w-full" onClick={onBackToHandbook || onClose}>
                  Back to Duties Handbook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Question screen ──
  return (
    <div className="fixed inset-0 z-[60] bg-[#f9fafb] flex flex-col">
      <header className="flex items-center h-[80px] px-8 shrink-0">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-6" />
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-border w-full max-w-[700px] flex flex-col overflow-hidden">
          <div className="px-6 pt-8 pb-6 space-y-6">
            {/* Label + Question */}
            <div className="space-y-2">
              <p className="text-base text-foreground font-normal">Topic Quiz</p>
              <h2 className="text-2xl font-normal text-foreground leading-8" style={{ letterSpacing: '-0.6px' }}>{q.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => !submitted && setSelectedOption(i)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-3 rounded-lg border h-[60px] px-3 text-left transition-all ${getOptionStyle(i)}`}
                >
                  {/* Radio */}
                  <span className={`size-4 rounded-full border-[1.5px] shrink-0 flex items-center justify-center ${getRadioStyle(i)}`}>
                    {selectedOption === i && !submitted && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                    {submitted && i === q.correct && (
                      <Check className="size-2.5 text-white" strokeWidth={3} />
                    )}
                    {submitted && selectedOption === i && i !== q.correct && (
                      <X className="size-2.5 text-white" strokeWidth={3} />
                    )}
                  </span>

                  <span className={`text-sm font-medium ${
                    submitted && selectedOption === i && i === q.correct
                      ? 'text-foreground'
                      : submitted && i === q.correct
                      ? 'text-brand-700'
                      : submitted && selectedOption === i && i !== q.correct
                      ? 'text-foreground'
                      : submitted
                      ? 'text-muted-foreground'
                      : 'text-foreground'
                  }`}>
                    {option}
                  </span>

                  {/* Right icon for submitted */}
                  {submitted && selectedOption === i && i === q.correct && (
                    <CheckCircle2 className="size-6 text-emerald-600 ml-auto shrink-0" />
                  )}
                  {submitted && selectedOption === i && i !== q.correct && (
                    <XCircle className="size-6 text-red-800 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {submitted && (
              <div className={`rounded-lg px-3 py-3 space-y-1 ${
                isCorrect ? 'bg-emerald-50' : 'bg-red-50'
              }`}>
                <p className={`text-sm font-medium leading-6 ${isCorrect ? 'text-brand-700' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-sm text-foreground font-normal leading-6">{q.explanation}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-5">
            <Button
              variant="secondary"
              className="w-[161px] h-10"
              onClick={handlePrev}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="size-4" />
            </Button>

            <span className="text-base text-foreground font-normal">
              {currentQuestion + 1} of {total}
            </span>

            {!submitted ? (
              <Button
                className="w-[161px] h-10"
                onClick={handleSubmit}
                disabled={selectedOption === null}
              >
                Submit
              </Button>
            ) : (
              <Button className="w-[161px] h-10" onClick={handleNext}>
                {currentQuestion + 1 >= total ? 'Finish' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
