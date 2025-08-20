# TEST PLAN

This document outlines the comprehensive test plan for the React Quiz Application, covering all business logic and user flows.

## 1. Quiz Flow Tests

- **Start Quiz**: Verify the quiz starts from the initial screen, timer initializes to 30 seconds, and the first question is displayed.
- **Answer Selection**: Ensure selecting an answer highlights it, provides feedback, and auto-advances after 1.5 seconds.
- **Correct Answer Scoring**: Confirm that selecting the correct answer increases the score and shows positive feedback.
- **Incorrect Answer Handling**: Confirm that selecting an incorrect answer does not increase the score, highlights the correct answer, and shows negative feedback.
- **Complete Quiz**: Ensure the quiz ends after the last question, and the final score is displayed.

## 2. Timer Tests

- **Timer Countdown**: Validate the timer counts down from 30 to 0 in 1-second intervals during the quiz.
- **Timer Expiry**: Confirm the quiz ends automatically when the timer reaches 0, and the final score is shown.
- **Timer Visual Feedback**: Check for visual warning (e.g., color change) when timer is low (≤10 seconds).

## 3. Game State Tests

- **Restart Quiz**: Verify that clicking the restart button resets the quiz to the start state, with score and question index reset.
- **Question Navigation**: Ensure the question counter advances correctly and new questions are displayed as answers are selected.

## 4. UI/UX Tests

- **Responsive Design**: Test layout adaptation on various screen sizes (mobile, tablet, desktop).
- **Visual Feedback**: Confirm selected answers and feedback (correct/incorrect) are visually distinct.

## 5. Edge Case Tests

- **Rapid Answer Selection**: Ensure only the first answer is registered if multiple options are clicked quickly.
- **Multiple Start Clicks**: Confirm that rapid clicking of the start button does not start multiple games or timers.
- **Browser Refresh**: Verify that refreshing the browser during a quiz resets the game to the start state (no persistence).

## 6. Data Validation Tests

- **Question Data Integrity**: Ensure all questions have 4 options and valid correct answer indices.
- **Score Calculation**: Validate that the final score matches the number of correct answers selected.
- **Timer Data Validation**: Confirm the timer starts at 30, is numeric, and decrements by 1 each second.

## 7. Data Integrity and Cleanup

- **State Reset**: After each test, ensure the application state is reset (score, timer, question index).
- **Test Isolation**: Each test should not affect the outcome of others.

---

This plan ensures all business logic, user interactions, and edge cases are covered for a robust and reliable quiz experience.
