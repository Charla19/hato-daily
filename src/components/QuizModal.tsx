"use client";

import { useCallback, useEffect, useState } from "react";
import { MAX_OUTFIT_SLOTS, QUIZ_QUESTION_COUNT } from "@/lib/constants";
import { pickRandomQuestions, type QuizQuestion } from "@/lib/quiz-questions";
import type { OutfitSubmission } from "@/lib/types";

type QuizStep = "intro" | "quiz" | "failed" | "slots-full" | "upload" | "success";

type QuizModalProps = {
  open: boolean;
  slotsRemaining: number;
  defaultUsername?: string;
  onClose: () => void;
  onSubmitOutfit: (submission: OutfitSubmission) => Promise<boolean>;
};

export function QuizModal({
  open,
  slotsRemaining,
  defaultUsername = "",
  onClose,
  onSubmitOutfit,
}: QuizModalProps) {
  const [step, setStep] = useState<QuizStep>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [server, setServer] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  const resetModal = useCallback(() => {
    setStep("intro");
    setQuestions([]);
    setQuestionIndex(0);
    setSelectedOption(null);
    setUsername("");
    setServer("");
    setPlayerId("");
    setImagePreview(null);
    setUploadError("");
  }, []);

  useEffect(() => {
    if (!open) {
      resetModal();
    }
  }, [open, resetModal]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const currentQuestion = questions[questionIndex];
  const slotsFull = slotsRemaining <= 0;

  function handleStartQuiz() {
    if (slotsFull) {
      setStep("slots-full");
      return;
    }

    setQuestions(pickRandomQuestions(QUIZ_QUESTION_COUNT));
    setQuestionIndex(0);
    setSelectedOption(null);
    setStep("quiz");
  }

  function handleConfirmAnswer() {
    if (!currentQuestion || selectedOption === null) return;

    if (selectedOption !== currentQuestion.correctIndex) {
      setStep("failed");
      return;
    }

    if (questionIndex + 1 >= questions.length) {
      if (slotsRemaining <= 0) {
        setStep("slots-full");
        return;
      }
      setUsername(defaultUsername);
      setStep("upload");
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedOption(null);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }

    setUploadError("");
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleOutfitSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!username.trim() || !server.trim() || !playerId.trim()) {
      setUploadError("Username, server, and player ID are required.");
      return;
    }

    if (!imagePreview) {
      setUploadError("Please upload a screenshot of your outfit.");
      return;
    }

    const accepted = await onSubmitOutfit({
      username: username.trim(),
      server: server.trim(),
      playerId: playerId.trim(),
      imageUrl: imagePreview,
    });

    if (!accepted) {
      setStep("slots-full");
      return;
    }

    setStep("success");
  }

  return (
    <div
      className="quiz-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="quiz-modal max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-modal-title"
      >
        <div className="quiz-modal-header rounded-t-2xl px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 id="quiz-modal-title" className="site-title text-lg font-bold">
                ✨ Runway Quiz
              </h3>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {slotsFull
                  ? "All 50 slots are taken for today."
                  : `${slotsRemaining} of ${MAX_OUTFIT_SLOTS} upload slots left`}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-2 border-[#ffb8d4] bg-white/70 px-2 py-1 text-sm font-bold hover:bg-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-5">
          {step === "intro" && (
            <div className="text-center">
              <div className="mb-4 text-4xl">👗</div>
              <p className="mb-2 text-sm font-semibold text-[#4a5568]">
                Want on today&apos;s runway? Pass the quiz first.
              </p>
              <ul className="mb-5 space-y-2 text-left text-sm text-[var(--ink-soft)]">
                <li>• Answer {QUIZ_QUESTION_COUNT} Heartopia trivia questions</li>
                <li>• Get all {QUIZ_QUESTION_COUNT} right or you retry</li>
                <li>• First {MAX_OUTFIT_SLOTS} players to pass get an upload slot</li>
                <li>• Votes run 24h. Top look becomes tomorrow&apos;s Style Icon</li>
              </ul>
              <button
                type="button"
                onClick={handleStartQuiz}
                disabled={slotsFull}
                className="btn-quiz-primary w-full rounded-xl py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {slotsFull ? "Dressing Room Closed" : "Start Quiz"}
              </button>
            </div>
          )}

          {step === "quiz" && currentQuestion && (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs font-bold text-[#718096]">
                <span>
                  Question {questionIndex + 1} / {questions.length}
                </span>
                <span className="rounded-full bg-[#ebf8ff] px-2 py-0.5 text-[#2b6cb0]">
                  No mistakes allowed
                </span>
              </div>

              <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#edf2f7]">
                <div
                  className="h-full rounded-full bg-[#ff9a9e] transition-all"
                  style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <p className="mb-4 text-base font-bold text-[#2d3748]">
                {currentQuestion.question}
              </p>

              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedOption(index)}
                    className={`w-full rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      selectedOption === index
                        ? "quiz-option-selected"
                        : "border-[#d8e2ec] bg-[#f7fafc] text-[var(--ink)] hover:border-[#ffb8d4]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="btn-quiz-primary mt-5 w-full rounded-xl py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm Answer
              </button>
            </div>
          )}

          {step === "failed" && (
            <div className="text-center">
              <div className="mb-3 text-4xl">🌳</div>
              <p className="mb-2 text-base font-bold text-[#d53f8c]">
                Oak-Oak shut the dressing room door!
              </p>
              <p className="mb-5 text-sm text-[var(--ink-soft)]">
                Wrong answer. Brush up on Heartopia lore and try again.
              </p>
              <button
                type="button"
                onClick={handleStartQuiz}
                className="btn-quiz-primary mb-2 w-full rounded-xl py-3 text-sm font-bold text-white"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-[#e2e8f0] py-2.5 text-sm font-semibold text-[#718096]"
              >
                Maybe later
              </button>
            </div>
          )}

          {step === "slots-full" && (
            <div className="text-center">
              <div className="mb-3 text-4xl">🚪</div>
              <p className="mb-2 text-base font-bold text-[#2b6cb0]">
                The dressing room is full!
              </p>
              <p className="mb-5 text-sm text-[#718096]">
                All {MAX_OUTFIT_SLOTS} runway slots were claimed today. Come back after
                the next server reset and be quicker on the quiz!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-quiz-primary w-full rounded-xl py-3 text-sm font-bold text-white"
              >
                Got it
              </button>
            </div>
          )}

          {step === "upload" && (
            <form onSubmit={handleOutfitSubmit}>
              <div className="mb-4 rounded-xl border border-[#c6f6d5] bg-[#f0fff4] px-3 py-2 text-center text-sm font-bold text-[#276749]">
                🎉 Quiz passed! You earned an upload slot.
              </div>

              <div className="mb-3">
                <label htmlFor="outfit-username" className="mb-1 block text-xs font-bold text-[#4a5568]">
                  In-game username
                </label>
                <input
                  id="outfit-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="@YourName"
                  className="w-full rounded-lg border border-[#cbd5e0] px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="outfit-server" className="mb-1 block text-xs font-bold text-[#4a5568]">
                  Server
                </label>
                <input
                  id="outfit-server"
                  value={server}
                  onChange={(event) => setServer(event.target.value)}
                  placeholder="Global-1, Asia-2..."
                  className="w-full rounded-lg border border-[#cbd5e0] px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="outfit-id" className="mb-1 block text-xs font-bold text-[#4a5568]">
                  Player ID
                </label>
                <input
                  id="outfit-id"
                  value={playerId}
                  onChange={(event) => setPlayerId(event.target.value)}
                  placeholder="84920411"
                  className="w-full rounded-lg border border-[#cbd5e0] px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="outfit-image" className="mb-1 block text-xs font-bold text-[#4a5568]">
                  Outfit screenshot
                </label>
                <input
                  id="outfit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-[var(--ink-soft)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--coral)] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
                  required
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Outfit preview"
                    className="mt-3 h-40 w-full rounded-lg border border-[#edf2f7] object-cover"
                  />
                )}
              </div>

              {uploadError && (
                <p className="mb-3 text-sm font-semibold text-[#e53e3e]">{uploadError}</p>
              )}

              <button
                type="submit"
                className="btn-quiz-primary w-full rounded-xl py-3 text-sm font-bold text-white"
              >
                Submit to Today&apos;s Runway
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="mb-3 text-4xl">💖</div>
              <p className="mb-2 text-base font-bold text-[#d53f8c]">
                You&apos;re on the runway!
              </p>
              <p className="mb-5 text-sm text-[var(--ink-soft)]">
                Your outfit is live. Ask friends to vote. Top look gets featured tomorrow!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-quiz-primary w-full rounded-xl py-3 text-sm font-bold text-white"
              >
                Back to Runway
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
