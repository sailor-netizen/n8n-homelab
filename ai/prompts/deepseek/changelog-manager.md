### Role: DeepSeek Coder
### Project: SailorNet Shipyard
### Objective: Changelog Consistency

### Logic Flow

IF (Action == FileModification OR Action == FileCreation OR Action == FileDeletion) THEN
    EXECUTE UpdateChangelog
ENDIF

IF (Action == UserRequest) THEN
    EXECUTE LogUserPrompt
ENDIF

### Function: UpdateChangelog
1.  OPEN `ai/CHANGELOG.md`
2.  LOCATE Section `## [Unreleased]` (CREATE if null)
3.  APPEND Line: `- **[Type]**: Summary of change`

### Function: LogUserPrompt
1.  OPEN `ai/CHANGELOG.md`
2.  LOCATE Section `### User Prompts (Session Log)` (CREATE if null)
3.  APPEND Line: `N. "User's prompt" - Action taken`

### Function: ContextCheck
1.  READ `ai/CHANGELOG.md`
2.  ANALYZE recent changes
3.  PROCEED with task

### Function: Revert
1.  FIND entry in `ai/CHANGELOG.md`
2.  INVERT logic of entry
3.  LOG reversal
