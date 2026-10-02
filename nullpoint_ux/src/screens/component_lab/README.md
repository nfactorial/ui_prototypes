# Component lab (test bench)

Not a game screen: a bench for the dynamic UI elements, over the flight view so they're judged in
context. Trigger every toast kind (and a burst, to see queueing), and hover each tooltip form.
Add new dynamic components here as they're built (e.g. progress/hold prompts, radial menus).

The components themselves are global services, not screens:
- **Toasts:** `src/core/notify.js` (kinds, presentations, motion), styled in `styles/feedback.css`
- **Tooltips:** `src/core/tooltip.js` (declared with `data-tip*` attributes), same stylesheet
