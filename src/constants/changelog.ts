export const APP_VERSION = '2.3.0'

export interface ChangelogEntry {
  version: string
  date: string
  enhancements: string[]
  bugFixes: string[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '2.3.0',
    date: '2026-04-02',
    enhancements: [
      'Suggested templates — one-click creation of Handbook Ch. 6 templates for Stake President, First Counselor, Second Counselor, and High Councilor',
      'Info buttons — tap the (i) icon on any behavior to see handbook references, scriptures, and guidance',
      'Templates now support interval (e.g., every 2 weeks) and info text fields',
    ],
    bugFixes: [],
  },
  {
    version: '2.2.0',
    date: '2026-04-02',
    enhancements: [
      'Add to Calendar — tap the calendar icon on any task row to add it to Google Calendar, Outlook, or download an .ics file',
    ],
    bugFixes: [],
  },
  {
    version: '2.1.0',
    date: '2026-03-31',
    enhancements: [
      'Complete UI redesign: three-section checklist (This Week / This Month / This Quarter)',
      'Large tap targets — no more accidental marking when scrolling',
      'Behaviors grouped by category within each time period',
      'Completion counter (done/total) per section with period navigation',
      'Completed items show strikethrough, N/A items dimmed',
      'Inline compliance %, comment indicator, and edit buttons per row',
    ],
    bugFixes: [
      'Fixed accidental cell marking when scrolling on mobile',
    ],
  },
  {
    version: '2.0.0',
    date: '2026-03-31',
    enhancements: [
      'Renamed app from "Leader Standard Work" to "Steward"',
      'All database tables renamed from lsw_ to steward_ prefix',
      'Updated all UI text, page titles, guide, and login screen',
      'Save as Template from the main Work tab (admin only)',
      'Simplified admin panel — templates created from main page, admin manages groups and assignments',
    ],
    bugFixes: [
      'Fixed admin page redirect loop',
      'Fixed quarterly/monthly scroll jumping too far',
    ],
  },
  {
    version: '1.9.0',
    date: '2026-03-30',
    enhancements: [
      'N/A cell status — tap through Y → N → NA → empty to mark a cell as not applicable (e.g., holiday, skip week)',
      'N/A cells shown in gray and excluded from compliance % denominator',
      'N/A option available in the cell detail modal (long-press/right-click)',
    ],
    bugFixes: [],
  },
  {
    version: '1.8.0',
    date: '2026-03-30',
    enhancements: [
      'Every N weeks scheduling — set a task to repeat every 2, 3, 4+ weeks with a start date anchor',
      'Frequency label shows interval (e.g., "Every 2 wks")',
      'Responsive desktop layout — wider columns, larger cells, more visible occurrences on bigger screens',
    ],
    bugFixes: [],
  },
  {
    version: '1.7.0',
    date: '2026-03-30',
    enhancements: [
      'Simplified frequency: just Weekly, Monthly, or Quarterly',
      'Weekly shows next 4 Sundays as cells, Monthly shows 12 months, Quarterly shows 4 quarters',
      'Per-row scroll arrows to navigate forward/backward through occurrences',
      'Compliance % based on last 12 occurrences (12% column)',
      'Reorder mode stays open until toggled off — move items multiple positions without re-clicking',
      'Removed NEW badge, complex recurrence settings, and frequency display widget',
    ],
    bugFixes: [],
  },
  {
    version: '1.6.0',
    date: '2026-03-30',
    enhancements: [
      'Next-4-occurrences grid — each behavior row shows its own next 4 applicable dates with day letter + date headers, adapting to frequency',
      'Behavior reorder — tap the reorder icon on a category header to enable up/down arrows for rearranging behaviors',
      'Removed fixed 7-day weekly grid — the grid is now frequency-aware per row',
    ],
    bugFixes: [],
  },
  {
    version: '1.5.0',
    date: '2026-03-30',
    enhancements: [
      'Google Tasks-style frequency picker: "Repeats every [N] days/weeks/months" with day-of-week and monthly pattern options',
      'Redesigned grid layout: Edit | Task (wrapping text) | Frequency | 4-week compliance % | Day cells',
      '4-week rolling compliance percentage per behavior',
      'Frequency displayed inline in compact format (e.g., "MTW", "1st Sun", "Every 2 wks")',
      'Simplified to single weekly view — removed daily/monthly view toggle',
    ],
    bugFixes: [
      'Fixed admin page loading race condition',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-03-30',
    enhancements: [
      'Templates — admins can create reusable sets of categories and behaviors, then share them with user groups',
      'User Groups — create named groups and add users by email for template distribution',
      'Template Assignments — assign templates to groups; they auto-populate into each member\'s Work tab on login',
      'Admin panel accessible from the header menu (admin users only)',
      'Admin designation via steward_admins table',
    ],
    bugFixes: [],
  },
  {
    version: '1.3.0',
    date: '2026-03-30',
    enhancements: [
      'Cell comments now work on desktop — hold click for 500ms or right-click to open the comment dialog',
    ],
    bugFixes: [
      'Fixed long-press not working with mouse/keyboard (only worked on touchscreens)',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-03-30',
    enhancements: [
      'Daily view — single-day focus with large Y/N toggles and comment previews, ideal for heavy days like Sunday',
      'Monthly view — compact heat-map grid showing the entire month at a glance with color-coded cells',
      'View switcher (Day/Week/Month) at top of navigation — dates sync when switching between views',
      'Updated user guide with new view mode documentation',
    ],
    bugFixes: [],
  },
  {
    version: '1.1.0',
    date: '2026-03-30',
    enhancements: [
      'Recurring schedule support: set specific days of week, monthly patterns (1st Wednesday, day 15, etc.), and quarterly recurrence',
      'Frequency-based completion percentages — only applicable days count in the denominator',
      'Non-applicable days shown as dimmed cells in the grid',
      'Reflection Log tab — all cell comments grouped by category and behavior for easy review',
      'Edit and delete categories',
      'Edit, delete, and archive behaviors with schedule options',
      'Show/hide archived behaviors per category',
      'Seamless week navigation — arrows cross month boundaries automatically',
      'Unlimited backward/forward navigation through weeks',
      'Release notes page (accessible from menu)',
      'User guide (accessible from menu)',
      'Header menu with settings, guide, and release notes',
    ],
    bugFixes: [
      'Removed K (kind of) value — cells now cycle Y/N/empty only',
      'Fixed month navigation not going past current month',
      'Fixed week and month navigation not being linked',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-30',
    enhancements: [
      'Initial release of Steward app',
      'User authentication (email/password)',
      'Category and behavior management',
      '7-day weekly tracking grid with y/n values',
      'Week navigation with period view',
      'Cell-level comments via long-press',
      'Notes tab with auto-save',
      'Mobile-optimized responsive design',
    ],
    bugFixes: [],
  },
]
