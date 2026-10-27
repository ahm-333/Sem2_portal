# Course workspace and quiz refinements

Scope: follow-up to merged PR #24 (`64393ec`). The requested boundaries remain the actual browser interface, student-visible saved state, and packaged navigation. Scientific correctness is outside this review; original question text and answer keys must be preserved.

## Reproduced problems

- The simulator renderer and stylesheet use different class names for lecture selection, configuration fields, question navigation and the running-exam toolbar. The missing styles make selection and the primary action hard to identify, as shown in the reported screenshot.
- Lesson quizzes present source choices in their original order. Source answer-position patterns therefore remain visible to students; changing presentation must preserve original answer identity, feedback, and any position-dependent wording.
- The lecture number marker creates a dashed `::after` connector and moves on row hover. The requested change removes this connector across source families.
- Expanding the course information changes the Atlas hero's layout and greatly increases its height, separating source navigation from the course heading.
- The course selector needs a clearer name/code hierarchy and visible keyboard behavior consistent with the course workspace.

## Intended presentation

Keep the existing indigo course surface, Alexandria type and Studio light/dark/reading tokens. Put practice-exam entry beside course study actions with an explicit purpose; keep the study timer independently discoverable in the header. Within the exam, selection state, available question count, duration and Start must form a clear reading sequence. Course details should open in a contained reading surface without stretching the source map.

Choice ordering is a presentation concern. New attempts may vary, but navigation, answering and restoring an existing attempt must keep its order stable. Questions whose choices depend on letters or positions (for example, “both A and B” or “all of the above”) retain their authored order. Static worked-answer cards are teaching material and remain unchanged.

## Implemented changes

- One shared choice-presentation runtime supports the internal reader, DS/DB/Architecture native button quizzes, OS keyed radio questions and the simulator. Original answer identities remain attached to native handlers; cloned simulator/reader questions remap the answer index. Explicit reset starts a fresh presentation; saved simulator attempts retain their presented choices. Feedback letter references use the same mapping.
- Simulator setup, live question navigation, selected/flagged/result states and primary actions now have matching styles. A compact practice-exam entry sits with course actions; the header timer and notification bell open their own focused views. Only the interactive-reading journey retains reading/exam tabs. Visible tabs retain keyboard navigation and focused single views have a visible region label.
- Original About, staff, group and timetable nodes move into a contained disclosure surface below the hero. Desktop details use three real columns; opening either disclosure keeps the hero height fixed. The course popup shows six bilingual names and separate codes, focuses the current course, supports arrows/Home/End/Escape and preserves the current source kind on navigation.
- Numbered source markers remain, with their dashed connectors and hover wobble removed from all source families. Keyboard focus indicators remain.
- Further review corrected the primary action's hover contrast, dark disclosure profile actions, separated answer-letter badges, and isolated numeric question progress from the surrounding RTL text.

## Verification record

Complete verification uses `npm run verify`: build, syntax/data/lint, 71 unit tests, 23 functional-browser cases, the A1 matrix, study/storage tests, all OS checks and actual packaged-route checks. The seven quiz-choice scenarios and five course-refinement scenarios are registered in A1; the power-tool suite now has 25 scenarios including the six viewport/theme combinations. The attached PR's latest checks are the authoritative integrated result.

RED/GREEN evidence includes the fixed authored answer positions, fresh-attempt and reset scoring, saved shuffled exams after reload, unstyled scope/navigation controls, source connector removal, expanding hero height, and visible menu keyboard navigation. Independent review additionally reproduced dark profile-action contrast and the RTL-reversed numeric progress; their focused checks pass with unchanged thresholds. The old full-quiz smoke now chooses the authored correct text rather than its former screen position, retaining the complete `20 / 20`, `100%`, reset and wrong-answer assertions.

Original teaching-body hashes remain pinned. Six actual quiz pages add only the exact shared runtime tag; the preservation guard normalizes that tag without replacing any baseline hash. DS2 static worked answers and original scientific question data remain unchanged. Session storage refusal keeps choices stable within the current page; reload stability requires available session storage.

The first final verification passed all 121 A1 cases, 14 study/storage cases, five OS stages and 85 packaged boundaries. Independent review then identified the OS final-review questions as a separate sibling container from inline questions. A further RED/GREEN case now covers that container's varied positions, native keyed feedback and explicit reset. Both OS question areas use the same presentation adapter; the final A1 matrix contains 122 cases.

Reported captures: [unclear exam setup](evidence/reported-exam-setup.png), [expanded hero](evidence/reported-course-details.png). Reviewed after captures: [actual bilingual menu](evidence/course-menu-desktop.png), [compact dark details](evidence/course-details-dark.png), [phone course actions](evidence/course-phone.png), [focused phone exam setup](evidence/exam-setup-phone-dark.png). Detailed local reports and additional light/dark/reading captures live in ignored `test-results/`; CI publishes its bounded evidence artifact.
