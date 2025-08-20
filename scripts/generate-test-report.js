#!/usr/bin/env node

/**
 * Script to run Playwright tests and generate a markdown report
 * Usage: node scripts/generate-test-report.js
 */

import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const reportPath = path.join(rootDir, "test_results.md");

// Timestamp for the report
const timestamp = new Date().toISOString();

// Counters for summary
let passed = 0;
let failed = 0;
let skipped = 0;
let testResults = [];
let failedTestLogs = [];

/**
 * Run the Playwright tests and capture output
 */
async function runTests() {
  console.log("Running tests...");

  return new Promise((resolve) => {
    // Use the project's test command: npx playwright test
    const testProcess = spawn(
      "npx",
      ["playwright", "test", "--reporter=list"],
      {
        cwd: rootDir,
        stdio: ["inherit", "pipe", "pipe"],
      }
    );

    let output = "";
    let errorOutput = "";

    testProcess.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      process.stdout.write(chunk); // Show output in real-time
    });

    testProcess.stderr.on("data", (data) => {
      const chunk = data.toString();
      errorOutput += chunk;
      process.stderr.write(chunk); // Show errors in real-time
    });

    testProcess.on("close", (code) => {
      console.log(`\nTests completed with exit code: ${code}`);
      resolve({ code, output, errorOutput });
    });
  });
}

/**
 * Parse test results from the Playwright output
 */
function parseTestResults(output) {
  // Reset counters
  passed = 0;
  failed = 0;
  skipped = 0;
  testResults = [];
  failedTestLogs = [];

  // Parse for test results
  const lines = output.split("\n");
  let currentTest = null;
  let currentError = "";
  let collectingError = false;

  lines.forEach((line) => {
    // Check for test status lines
    if (line.match(/^\s*\d+\)\s+\[(chromium|firefox|webkit)\]/)) {
      if (collectingError && currentTest) {
        failedTestLogs.push({
          title: currentTest.title,
          browser: currentTest.browser,
          error: currentError.trim(),
        });
        currentError = "";
      }

      collectingError = false;
      const match = line.match(
        /^\s*\d+\)\s+\[(chromium|firefox|webkit)\]\s+(.+?)(\s+\[(.+?)\])?$/
      );

      if (match) {
        const browser = match[1];
        const title = match[2].trim();
        const status = match[4] || "unknown";

        currentTest = { title, browser, status };
        testResults.push(currentTest);

        if (status === "pass") {
          passed++;
        } else if (status === "skip" || status === "skipped") {
          skipped++;
        } else {
          failed++;
          collectingError = true;
        }
      }
    } else if (collectingError) {
      // Collect error message lines
      currentError += line + "\n";
    }

    // Look for total counts
    if (
      line.includes("passed") ||
      line.includes("failed") ||
      line.includes("skipped")
    ) {
      const passCounts = line.match(/(\d+) passed/);
      const failCounts = line.match(/(\d+) failed/);
      const skipCounts = line.match(/(\d+) skipped/);

      if (passCounts && passCounts[1]) passed = parseInt(passCounts[1], 10);
      if (failCounts && failCounts[1]) failed = parseInt(failCounts[1], 10);
      if (skipCounts && skipCounts[1]) skipped = parseInt(skipCounts[1], 10);
    }
  });

  // Handle any remaining error
  if (collectingError && currentTest) {
    failedTestLogs.push({
      title: currentTest.title,
      browser: currentTest.browser,
      error: currentError.trim(),
    });
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport() {
  const totalTests = passed + failed + skipped;

  let markdownContent = `# Test Results\n\n`;
  markdownContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

  markdownContent += `## Test Summary\n\n`;
  markdownContent += `- **Total Tests:** ${totalTests}\n`;
  markdownContent += `- **Passed:** ${passed}\n`;
  markdownContent += `- **Failed:** ${failed}\n`;
  markdownContent += `- **Skipped:** ${skipped}\n`;
  markdownContent += `- **Success Rate:** ${
    totalTests > 0 ? Math.round((passed / totalTests) * 100) : 0
  }%\n\n`;

  markdownContent += `## Detailed Results\n\n`;
  markdownContent += `| Test | Browser | Status |\n`;
  markdownContent += `| ---- | ------- | ------ |\n`;

  // Group tests by title to avoid duplication across browsers
  const groupedTests = {};
  testResults.forEach((test) => {
    if (!groupedTests[test.title]) {
      groupedTests[test.title] = [];
    }
    groupedTests[test.title].push(test);
  });

  // Add tests to the table
  Object.keys(groupedTests).forEach((testTitle) => {
    const tests = groupedTests[testTitle];
    tests.forEach((test) => {
      const statusEmoji =
        test.status === "pass"
          ? "✅"
          : test.status === "skip" || test.status === "skipped"
          ? "⏭️"
          : "❌";
      markdownContent += `| ${test.title} | ${test.browser} | ${statusEmoji} ${test.status} |\n`;
    });
  });

  if (failedTestLogs.length > 0) {
    markdownContent += `\n## Failed Test Logs\n\n`;

    failedTestLogs.forEach((failedTest, index) => {
      markdownContent += `### ${index + 1}. ${failedTest.title} [${
        failedTest.browser
      }]\n\n`;
      markdownContent += "```\n" + failedTest.error + "\n```\n\n";
    });
  }

  return markdownContent;
}

/**
 * Main function to run tests and generate report
 */
async function main() {
  try {
    console.log("Starting test reporting workflow...");

    // Run the tests
    const { output, errorOutput, code } = await runTests();

    // Parse the results
    parseTestResults(output + "\n" + errorOutput);

    // Generate markdown report
    const reportContent = generateMarkdownReport();

    // Write report to file
    await fs.writeFile(reportPath, reportContent);

    console.log(`\nTest report generated at ${reportPath}`);

    // Exit with the same code as the test process
    process.exit(code === 0 ? 0 : 1);
  } catch (error) {
    console.error("Error in test reporting workflow:", error);
    process.exit(1);
  }
}

// Run the main function
main();
