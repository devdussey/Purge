param(
  [switch]$Print,               # Non-interactive, one-shot
  [string]$Task = "",           # Text for print mode
  [switch]$WithAgents,          # Add role agents
  [switch]$Continue             # Continue last session instead of new
)

# 0) Ensure we're at the repo root (where CLAUDE.md lives)
#    Adjust this if you keep scripts elsewhere.
$repoRoot = Split-Path -Parent $PSCommandPath
Set-Location $repoRoot

# 1) Kickoff message for interactive sessions (your context stays in CLAUDE.md)
$kickoff = @'
Please load project context from CLAUDE.md.
- Follow the cadences (20m history, 30m development plan).
- If tokens < 5% or nearing auto-compaction: update all key .md files, then propose git commit & push.
Also confirm the presence of: AI_DEVELOPMENT_PLAN.md, CONVERSATION_HISTORY.md, NEXT_STEPS.md, and PHASE*.md.
'@

# 2) Optional agents
$agentsJson = if ($WithAgents) {
@'
{
  "historian": {
    "description": "Maintains conversation and progress logs.",
    "prompt": "Every 20 minutes, update CONVERSATION_HISTORY.md with concise deltas, decisions, and open questions.",
    "tools": ["Read","Edit","Bash"]
  },
  "roadmap-steward": {
    "description": "Keeps AI_DEVELOPMENT_PLAN.md accurate and current.",
    "prompt": "Every 30 minutes, scan repo/commits and update AI_DEVELOPMENT_PLAN.md with big changes and next steps.",
    "tools": ["Read","Edit","Bash"]
  }
}
'@
} else { $null }

# 3) Run in print (non-interactive) mode if requested
if ($Print) {
  if ([string]::IsNullOrWhiteSpace($Task)) {
    Write-Error "Use -Task 'your request' with -Print."
    exit 1
  }

  if ($agentsJson) {
    claude -p $Task --append-system-prompt "Use CLAUDE.md as project memory. Respect cadences and token thresholds." --agents $agentsJson
  } else {
    claude -p $Task --append-system-prompt "Use CLAUDE.md as project memory. Respect cadences and token thresholds."
  }
  exit 0
}

# 4) Otherwise, start/continue an interactive session with a first message
if ($Continue) {
  if ($agentsJson) {
    claude -c $kickoff --agents $agentsJson
  } else {
    claude -c $kickoff
  }
} else {
  if ($agentsJson) {
    claude $kickoff --agents $agentsJson
  } else {
    claude $kickoff
  }
}
