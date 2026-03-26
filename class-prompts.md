We're building a simple task tracker - users can add tasks, mark them complete and filter by status.  You are a product owner helping a dev team. 

Based on this description of a simple Task Tracker app, generate 6 user stories in standard format 
("As a [role], I want [feature], so that [value].") and for each, list 3–5 acceptance criteria with edge cases.

Prioritize the stories as S (small), M (medium), or L (large).


---

As a user, I want to see all my tasks in a list, so that I can quickly review what needs to be done.

Acceptance Criteria:

- All tasks display with title, description, status, and creation date
- Tasks are sorted by creation date (newest first)
- Empty list shows "No tasks yet" message
- Long titles truncate with ellipsis after 50 chars
- Tasks display appropriate status indicators/colors

In this codebase, propose a step-by-step implementation plan:
- Which files to modify or create (front-end and back-end)?
- What data structures / API changes are needed?
