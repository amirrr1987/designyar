/**
 * Enforces manual-commands-only: agent must never execute shell.
 * Input: JSON on stdin (beforeShellExecution). Output: permission JSON on stdout.
 */
import { readFileSync } from 'node:fs'

let raw = ''
try {
  raw = readFileSync(0, 'utf8')
} catch {
  raw = ''
}

let command = ''
try {
  const parsed = JSON.parse(raw || '{}')
  command = typeof parsed.command === 'string' ? parsed.command : ''
} catch {
  command = ''
}

const preview = command.trim().slice(0, 200) || '(empty)'

const payload = {
  permission: 'deny',
  user_message:
    'Agent shell is blocked for this project. Copy the command from the agent reply and run it yourself in the terminal.',
  agent_message: [
    'Shell execution denied by project hook (manual-commands-only).',
    'Do not retry Shell. Show the exact command in a copyable block, explain one line, and wait for user confirmation (✅ / انجام دادم).',
    `Blocked command: ${preview}`,
  ].join(' '),
}

process.stdout.write(`${JSON.stringify(payload)}\n`)
process.exit(0)
