import configConventional, {
  type CommitlintPluginConfig,
} from '@commitlint/config-conventional'
import { exec } from 'child_process'
import { danger, fail, markdown, warn } from 'danger'
import commitlint from 'danger-plugin-conventional-commitlint'
import fs from 'fs'

const typescriptOnly = (file: string) =>
  file.includes('.ts') || file.includes('.tsx')
const filesOnly = (file: string) =>
  fs.existsSync(file) && fs.lstatSync(file).isFile()

const modified = danger.git.modified_files.map((file) => `'${file}'`)
const created = danger.git.created_files.map((file) => `'${file}'`)
const createOrModified = created.concat(modified)

const modifiedAppFiles = modified
  .filter((p: string) => p.includes('src') || p.includes('__tests__'))
  .filter((p: string) => filesOnly(p) && typescriptOnly(p))

/**
 * Rule: Ensure the PR title contains a rules from @commitlint/config-conventional.
 * Reason: When looking at the list of PRs, contains a rules from commitlint in the PR
 *         title makes it very efficient to know what to look at.
 */
const prTitle = danger.github.pr.title
exec(`echo "${prTitle}" | ./node_modules/.bin/commitlint`, (error: any) => {
  if (error) {
    fail(
      `Follow the naming of the pull request title, match to the rules of @commitlint/config-conventional 🙏.`,
    )
  }
})

/**
 * Rule: Check eslint on modified files.
 * Reason: Check eslint on modified files before merge.
 */
const filesToLint = createOrModified.filter(
  (p) =>
    p.endsWith('js') ||
    p.endsWith('jsx') ||
    p.endsWith('ts') ||
    p.endsWith('tsx'),
)
exec(`./node_modules/.bin/eslint ${filesToLint.join(' ')}`, (error: any) => {
  if (error) {
    fail(
      `Find error eslint on dangerjs, please run "pnpm lint" in your local environment 🙏.`,
    )
  }
})

/**
 * Rules: Encourage to user to use standardize commit message based on commitlint rules
 */
;(async function dangerReport() {
  const commitlintConfig: CommitlintPluginConfig = {
    severity: 'fail',
  }
  await commitlint(configConventional.rules, commitlintConfig)
})()

/**
 * Rules: Encourage to write unit test
 * Reason: To increase code coverage
 */

const hasAppChanges = modifiedAppFiles.length > 0
const testChanges = modifiedAppFiles.filter((filepath) =>
  filepath.includes('test'),
)
const hasTestChanges = testChanges.length > 0

// Warn if there are library changes, but not tests
if (hasAppChanges && !hasTestChanges) {
  warn(
    "There are library changes, but not tests. That's OK as long as you're refactoring existing code",
  )
}

/**
 * Rules: Encourage smaller PR
 */
let errorCount = 0
const bigPRThreshold = 600
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR (' + ++errorCount + ')')
  markdown(
    '> (' +
      errorCount +
      ') : Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.',
  )
}
