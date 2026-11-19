# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 21 | [The AppShell header at phone width](#21-the-appshell-header-at-phone-width) | ready to start |

Next number: **22**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 21. The AppShell header at phone width

At 375px the header's right side (`.hu-main__right`, which does not shrink)
holds the gear Button and a `UserMenu` showing the person icon, the name and
a badge, and takes most of the header; one more control (kwicky's search box)
squeezes `.hu-main__title` to nothing and runs off the right edge. Every app
has the gear and the UserMenu (found in kwicky TODO 7).

**Done when:** at phone width (the shell 600px wide or less) the UserMenu
button shows only the person icon, keeps the user's name as its accessible
name, and the open menu shows the name and badge at its top; the header's
right side may shrink and the title keeps some room, cut with an ellipsis.
With a test, the kitchen sink at phone width and STYLEGUIDE.md, released.
