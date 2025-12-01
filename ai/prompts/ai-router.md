# AI Router Prompt

**Objective**: Identify the active AI model and direct it to its specialized instructions.

## Instructions for the User
Copy the section below that matches your current AI assistant and paste it into the chat.

---

### For Claude
> "Please load your specialized system prompt from: `ai/prompts/claude/codebase-expert.claude.md`"

### For ChatGPT / OpenAI
> "Please load your specialized system prompt from: `ai/prompts/gpt/codebase-expert.md`"

### For Grok
> "Please load your specialized system prompt from: `ai/prompts/grok/codebase-expert.md`"

### For Mistral
> "Please load your specialized system prompt from: `ai/prompts/mistral/codebase-expert.md`"

### For DeepSeek
> "Please load your specialized system prompt from: `ai/prompts/deepseek/codebase-expert.md`"

---

## Instructions for AI Agents (with file access)
If you are an AI agent with file access capabilities:
1.  Identify your model type (e.g., are you Claude? GPT?).
2.  Read the corresponding file listed above.
3.  Adopt the persona and rules defined in that file.
4.  If your model is unknown, default to: `ai/prompts/general-codebase-expert.md`.
