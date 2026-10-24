# Study Hub

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Arabic-speaking AI students at Zagazig University using phones and computers to find semester-two course resources and study explanations.

## Product Purpose

Choose a course, find the appropriate lecture or section resource, read an internal explanation, practise with a quiz, and consult the university timetable for the selected group and section.

## Operating Context

Six real courses. Groups B1–B3 and sections 1–12. Arabic interface with English academic terminology. Existing local profile, theme, progress, reader and quiz behavior must continue to work.

## Capabilities and Constraints

Static HTML, local CSS/fonts, vanilla JavaScript and Lucide. Preserve course data, scientific content, source URLs, stable content keys and timetable uncertainty notices. External content availability is outside local verification. The automation directory is outside this redesign's scope.

## Brand Commitments

Study Hub name, existing original blue portal mark, Egyptian Arabic voice and creator attribution. The user explicitly delegated a complete experimental redesign on 24 October 2026, including the choice of visual direction and implementation.

## Evidence on Hand

index.html, subject.html, js/courses-data.js, js/shared/study-state.js, docs/STUDY-HUB-REVIEW.md, existing browser regression tests, education-preview/os/.

## Product Principles

- Real course content and working source actions take priority.
- A student's group controls the relevant timetable and section resources.
- Reading and quiz controls remain accessible on narrow screens.
- Never fabricate learning progress, timetable entries or resource availability.
