import type { Frequency } from '@/lib/types'

export interface SeedBehavior {
  name: string
  frequency: Frequency
  interval: number
  info_text: string | null
}

export interface SeedCategory {
  name: string
  behaviors: SeedBehavior[]
}

export interface SeedTemplate {
  name: string
  categories: SeedCategory[]
}

// ─── Handbook-based templates (General Handbook Ch. 6) ───

export const SEED_TEMPLATES: SeedTemplate[] = [
  {
    name: 'Stake President',
    categories: [
      {
        name: 'Meetings',
        behaviors: [
          {
            name: 'Stake presidency meeting',
            frequency: 'weekly',
            interval: 2,
            info_text: 'Usually held weekly or twice monthly. Agenda includes progress of God\'s work, strengthening individuals and families, ward and quorum needs, bishop recommendations, callings, missionary recommendations, budget, and assignment reports. (Handbook 6.2.1.1)',
          },
          {
            name: 'High council meeting',
            frequency: 'monthly',
            interval: 1,
            info_text: 'Held twice monthly if feasible. Includes doctrinal instruction, strengthening individuals and families, assignment reporting, sustaining ordination and calling decisions, and planning stake priesthood leadership meetings. (Handbook 6.2.1.2; D&C 102:1)',
          },
        ],
      },
      {
        name: 'Stewardship',
        behaviors: [
          {
            name: 'Read patriarchal blessings',
            frequency: 'monthly',
            interval: 1,
            info_text: 'The stake president meets with the stake patriarch at least twice yearly to discuss feelings about his work, family welfare, and review blessings given. Ensure all blessings are submitted to headquarters and extra copies destroyed. This responsibility cannot be delegated to a counselor. (Handbook 6.6)',
          },
          {
            name: 'Observe one ward MCM meeting',
            frequency: 'monthly',
            interval: 1,
            info_text: 'Attend a ward council or coordination meeting to observe, support, and minister to ward leaders. Provides firsthand understanding of ward needs and leadership effectiveness. (Handbook 6.2.1.3)',
          },
        ],
      },
      {
        name: 'Interviews',
        behaviors: [
          {
            name: 'Interview HC (W1, Mission)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with the high councilor assigned to Ward 1 and stake missionary work. Discuss quorum needs, ministering, missionary work, and temple/family history efforts. (Handbook 6.5)',
          },
          {
            name: 'Interview Stake RS President',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Meet regularly with the stake Relief Society presidency. Instruct on missionary work, temple and family history work, and caring for those in need. The stake president personally calls and sets apart the stake RS president. (Handbook 6.2.1.3; 9.3.1)',
          },
          {
            name: 'Interview Stake YW President',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Meet regularly with the stake Young Women presidency. Counsel on strengthening youth, planning service and activities, and supporting Children and Youth and FSY programs. (Handbook 6.2.1.3; 11.3.1)',
          },
          {
            name: 'Interview Stake YM President',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Meet regularly with the stake Young Men president (a high councilor). Counsel on Aaronic Priesthood quorum support, youth activities, and stake youth leadership committee work. (Handbook 6.7.2; 10.3.1)',
          },
          {
            name: 'Interview HC (Seminary)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with the high councilor assigned to seminary and institute. Discuss enrollment, participation, teacher needs, and coordination with S&I. (Handbook 6.2.1.6; 15.2)',
          },
        ],
      },
      {
        name: 'Ward Engagement',
        behaviors: [
          {
            name: 'Attend ward council meeting to observe',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Attend a ward council meeting to observe, support, and minister to ward leaders. Helps the stake presidency stay connected to the needs and work happening at the ward level. (Handbook 6.2.1.3; 29.2.5)',
          },
        ],
      },
    ],
  },
  {
    name: 'First Counselor',
    categories: [
      {
        name: 'Meetings',
        behaviors: [
          {
            name: 'Stake presidency meeting',
            frequency: 'weekly',
            interval: 2,
            info_text: 'Usually held weekly or twice monthly. Agenda includes progress of God\'s work, strengthening individuals and families, ward and quorum needs, bishop recommendations, callings, missionary recommendations, budget, and assignment reports. (Handbook 6.2.1.1)',
          },
          {
            name: 'High council meeting',
            frequency: 'monthly',
            interval: 1,
            info_text: 'Held twice monthly if feasible. Includes doctrinal instruction, strengthening individuals and families, assignment reporting, sustaining ordination and calling decisions, and planning stake priesthood leadership meetings. (Handbook 6.2.1.2; D&C 102:1)',
          },
        ],
      },
      {
        name: 'Interviews',
        behaviors: [
          {
            name: 'Interview HC (HP1)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (HP2)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (HP3)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (C2)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (MW, Buildings)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with the high councilor assigned to member welfare and buildings. Discuss welfare needs, building maintenance, JustServe, and self-reliance efforts. (Handbook 6.5; 22.9.1)',
          },
        ],
      },
      {
        name: 'Ward Engagement',
        behaviors: [
          {
            name: 'Attend ward council meeting to observe',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Attend a ward council meeting to observe, support, and minister to ward leaders. Helps the stake presidency stay connected to the needs and work happening at the ward level. (Handbook 6.2.1.3; 29.2.5)',
          },
        ],
      },
    ],
  },
  {
    name: 'Second Counselor',
    categories: [
      {
        name: 'Meetings',
        behaviors: [
          {
            name: 'Stake presidency meeting',
            frequency: 'weekly',
            interval: 2,
            info_text: 'Usually held weekly or twice monthly. Agenda includes progress of God\'s work, strengthening individuals and families, ward and quorum needs, bishop recommendations, callings, missionary recommendations, budget, and assignment reports. (Handbook 6.2.1.1)',
          },
          {
            name: 'High council meeting',
            frequency: 'monthly',
            interval: 1,
            info_text: 'Held twice monthly if feasible. Includes doctrinal instruction, strengthening individuals and families, assignment reporting, sustaining ordination and calling decisions, and planning stake priesthood leadership meetings. (Handbook 6.2.1.2; D&C 102:1)',
          },
        ],
      },
      {
        name: 'Interviews',
        behaviors: [
          {
            name: 'Interview HC (YM 1st C)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (YM 2nd C)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (W2)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (MV)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
          {
            name: 'Interview HC (BI)',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Quarterly stewardship interview with assigned high councilor. Discuss ward and quorum needs, ministering, missionary work, temple/family history efforts, and any concerns. (Handbook 6.5)',
          },
        ],
      },
      {
        name: 'Ward Engagement',
        behaviors: [
          {
            name: 'Attend ward council meeting to observe',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Attend a ward council meeting to observe, support, and minister to ward leaders. Helps the stake presidency stay connected to the needs and work happening at the ward level. (Handbook 6.2.1.3; 29.2.5)',
          },
        ],
      },
    ],
  },
  {
    name: 'High Councilor',
    categories: [
      {
        name: 'Meetings',
        behaviors: [
          {
            name: 'High council meeting',
            frequency: 'monthly',
            interval: 1,
            info_text: 'Held twice monthly if feasible. Includes doctrinal instruction, strengthening individuals and families, assignment reporting, sustaining ordination and calling decisions, and planning stake priesthood leadership meetings. (Handbook 6.2.1.2; D&C 102:1)',
          },
          {
            name: 'Meet with assigned elders quorum presidency',
            frequency: 'monthly',
            interval: 1,
            info_text: 'Meet regularly with assigned elders quorum presidencies to learn quorum needs, offer support, teach responsibilities regarding missionary work and temple/family history work, and communicate stake presidency information. (Handbook 6.5)',
          },
        ],
      },
      {
        name: 'Ward Engagement',
        behaviors: [
          {
            name: 'Attend elders quorum meeting',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Attend elders quorum meetings as needed to support and instruct. Occasionally accompany quorum presidency members in ministering visits. (Handbook 6.5)',
          },
          {
            name: 'Attend ward council',
            frequency: 'quarterly',
            interval: 1,
            info_text: 'Attend bishopric and ward council meetings when invited to stay connected with ward-level needs and coordinate stake support. (Handbook 6.5)',
          },
        ],
      },
    ],
  },
]
