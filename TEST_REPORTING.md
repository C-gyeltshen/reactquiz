# Test Reporting

## Test Reporting Workflow

This project includes a test reporting workflow that automatically runs all tests and generates a comprehensive markdown report with test results.

## How to Run Tests and Generate Report

Run the following command to execute all tests and generate a markdown report:

```bash
npm run test:md-report
```

This will:

1. Run all Playwright tests across configured browsers (chromium, firefox, webkit)
2. Collect the test results including pass/fail status
3. Generate a markdown file called `test_results.md` at the root of the project with:
   - Test summary (total, passed, failed, skipped)
   - Detailed results for each test case
   - Error logs for any failed tests

## Report Structure

The generated `test_results.md` file includes:

- **Test Summary**: Overview of test results with counts and success rate
- **Detailed Results**: Table with each test case, browser, and status
- **Failed Test Logs**: Detailed error messages and stack traces for any failed tests

## Integration with CI/CD

You can add this script to your CI/CD pipeline by including the `test:md-report` command in your workflow.

## Current Test Report (August 19, 2025)

### Summary

**Total Tests:** 63  
**Passed:** 37  
**Failed:** 26  
**Pass Rate:** 58.7%

### Failed Test Categories

The test failures can be grouped into several categories:

#### 1. UI/Component Issues

- **CSS Class Expectation Failures**: Many tests are failing because they expect certain CSS classes that don't exist:
  - Missing `selected` or `bg-blue` classes on selected answer options
  - Missing `correct` class on answer options
  - Missing `green|success` classes on feedback elements
  - Missing `red|warning|danger` classes on timer elements

#### 2. Navigation/Visibility Issues

- **Element Visibility Problems**: Several tests expect elements to be visible that aren't appearing:
  - "Start Quiz" button not visible after restart
  - Feedback components not properly styled

#### 3. Timing/Asynchronous Issues

- **Timeout Failures**: Several tests are timing out while waiting for:
  - Button clicks to register (Multiple Button Clicks test)
  - Timer to expire and trigger game over state
  - Functions to complete within expected time

#### 4. External Connection Issues

- **Network Failures**: Example tests that connect to external sites are failing:
  - Connection timeouts to https://playwright.dev/

### Detailed Failure Analysis

#### UI/Component Issues

1. **Answer Selection CSS Classes**: Tests expecting `selected` or `bg-blue` classes on selected answers. The current implementation uses different classes:

   ```
   Received string: "w-full p-4 text-left border rounded-lg transition-all duration-300 hover:bg-gray-100"
   ```

   or

   ```
   Received string: "w-full p-4 text-left border rounded-lg transition-all duration-300 bg-green-100 border-green-500"
   ```

2. **Feedback Styling**: Tests expecting specific classes for success/error feedback:

   ```
   Received: <div data-testid="feedback" class="mt-4 text-center">...</div>
   ```

   But expecting class pattern: `/green|success/` or `/red|error/`

3. **Timer Styling**: Timer doesn't show warning state with expected classes:
   ```
   Received string: "flex items-center justify-center space-x-2 text-2xl font-bold text-gray-700 mb-8"
   ```
   Expecting class pattern: `/red|warning|danger/`

#### Navigation/Visibility Issues

1. **Start Quiz Button**: After completing a quiz and restarting, the "Start Quiz" button is not visible as expected:

   ```
   Received: <element(s) not found>
   ```

2. **Game Over State**: Tests waiting for game over state are timing out:
   ```
   Error: page.waitForFunction: Test timeout of 30000ms exceeded.
   ```

### Browser Compatibility

The failures are consistent across all three browser engines (Chromium, Firefox, WebKit), suggesting that these are implementation issues rather than browser-specific compatibility problems.

### Recommended Actions

1. **Update CSS Classes**:

   - Ad3d appropriate classes (`selected`, `bg-blue`, etc.) to selected answer options
   - Add correct feedback styling classes (`green|success`, `red|error`)
   - Add timer warning state classes (`red|warning|danger`)

2. **Fix Navigation Flow**:

   - Ensure "Start Quiz" button is visible after quiz completion
   - Fix restart quiz functionality to properly reset the game state

3. **Resolve Timing Issues**:

   - Ensure timer expiry correctly triggers game over state
   - Handle rapid button clicks appropriately
   - Review timeout durations in tests if necessary

4. **External Connection**:
   - Consider mocking external connections in example tests or increasing timeout for more reliable testing

### Most Critical Issues to Address

1. Answer selection highlighting (affects core quiz functionality)
2. Game restart flow (affects user experience)
3. Timer expiry handling (affects game rules)
4. Visual feedback styling (affects usability)

### Next Steps

1. Update the component implementations to match the expected CSS classes in tests
2. Fix the restart quiz functionality to properly reset the game state
3. Ensure timer expiry correctly triggers game over state
4. Run tests individually to isolate and debug specific issues
5. Consider updating tests if the current implementation intentionally uses different class names
