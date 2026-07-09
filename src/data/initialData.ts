import { FeedbackItem } from '../types';

export const initialFeedbacks: FeedbackItem[] = [
  {
    id: 'fb-1',
    date: '2026-07-01',
    name: 'Sarah Jenkins',
    isAnonymous: false,
    category: 'Suggestion',
    subject: 'Flexible Summer Workspace Hours',
    description: 'With temperatures rising during July and August, it would be wonderful to offer a flexible summer hour schedule where employees can start and end their workday 1 hour earlier (e.g., 8:00 AM - 4:00 PM instead of 9:00 AM - 5:00 PM). This would help with work-life balance and allow team members to enjoy the sunny evenings.',
    status: 'Solved',
    office: 'Main',
    solution: {
      content: 'The Summer Hour policy has been approved by executive management! Employees can now coordinate with their direct managers to opt-in to the 8:00 AM - 4:00 PM schedule for July and August, provided team operational coverage is maintained.',
      updatedAt: '2026-07-05 10:30',
      updatedBy: 'HR Department'
    },
    suggestions: [
      {
        id: 'sug-1-1',
        content: 'I highly support this! Perhaps we should clarify that client-facing teams need to ensure core-hours overlap.',
        createdAt: '2026-07-02 09:15',
        createdBy: 'Marcus Brody'
      },
      {
        id: 'sug-1-2',
        content: 'This will be amazing for working parents who need to sync with school-break activities.',
        createdAt: '2026-07-03 14:22',
        createdBy: 'Clara Oswald'
      }
    ],
    history: [
      {
        id: 'h-1-1',
        action: 'Submission created',
        timestamp: '2026-07-01 08:30',
        user: 'Sarah Jenkins'
      },
      {
        id: 'h-1-2',
        action: 'Added comment suggestion',
        timestamp: '2026-07-02 09:15',
        user: 'Marcus Brody'
      },
      {
        id: 'h-1-3',
        action: 'Added comment suggestion',
        timestamp: '2026-07-03 14:22',
        user: 'Clara Oswald'
      },
      {
        id: 'h-1-4',
        action: 'Status updated to Solved with solution',
        timestamp: '2026-07-05 10:30',
        user: 'HR Department'
      }
    ]
  },
  {
    id: 'fb-2',
    date: '2026-07-05',
    name: 'Anonymous',
    isAnonymous: true,
    category: 'Issue',
    subject: 'Main Coffee Machine Leaking Water',
    description: 'The premium espresso and coffee machine in the 3rd-floor breakroom has a slow but steady water leak near the water reservoir. It creates a slippery puddle on the counter and floor. We should get it serviced before it damages the wooden cabinetry or causes a slip-and-fall accident.',
    status: 'In Progress',
    office: 'Malasakit',
    solution: null,
    suggestions: [
      {
        id: 'sug-2-1',
        content: 'I placed a cautionary sign and a tray underneath for now so the puddle doesn\'t spread.',
        createdAt: '2026-07-05 11:45',
        createdBy: 'David Vance'
      },
      {
        id: 'sug-2-2',
        content: 'Service technician has been contacted; their estimated arrival is tomorrow morning.',
        createdAt: '2026-07-06 09:00',
        createdBy: 'Office Admin (Jessica)'
      }
    ],
    history: [
      {
        id: 'h-2-1',
        action: 'Submission created anonymously',
        timestamp: '2026-07-05 10:12',
        user: 'System'
      },
      {
        id: 'h-2-2',
        action: 'Status updated to In Progress',
        timestamp: '2026-07-05 11:00',
        user: 'Office Admin (Jessica)'
      },
      {
        id: 'h-2-3',
        action: 'Added comment suggestion',
        timestamp: '2026-07-05 11:45',
        user: 'David Vance'
      },
      {
        id: 'h-2-4',
        action: 'Added comment suggestion',
        timestamp: '2026-07-06 09:00',
        user: 'Office Admin (Jessica)'
      }
    ]
  },
  {
    id: 'fb-3',
    date: '2026-07-07',
    name: 'Alan Turing',
    isAnonymous: false,
    category: 'Concern',
    subject: 'Underutilized Project Documentation Wiki',
    description: 'Our team knowledge base wiki is becoming highly disorganized. Outdated pages are kept alongside active specs, leading to confusion and duplicate efforts. We need a standardized template, archiving protocol, and designated captains to periodically prune outdated materials.',
    status: 'Pending',
    office: 'ER',
    solution: null,
    suggestions: [],
    history: [
      {
        id: 'h-3-1',
        action: 'Submission created',
        timestamp: '2026-07-07 15:40',
        user: 'Alan Turing'
      }
    ]
  },
  {
    id: 'fb-4',
    date: '2026-07-08',
    name: 'Eleanor Vance',
    isAnonymous: false,
    category: 'Suggestion',
    subject: 'Bicycle Rack Canopy Installation',
    description: 'Our office currently has outdoor bicycle racks, which is wonderful. However, during rainy or heavy-sun days, bicycles are left completely exposed to weather. Installing a simple, low-cost metal canopy or shelter over the bicycle rack would encourage more green commuters to bike to work.',
    status: 'Pending',
    office: 'Main',
    solution: null,
    suggestions: [
      {
        id: 'sug-4-1',
        content: 'We can look into attaching a polycarbonate corrugated sheet canopy. It looks professional and is quite cost-effective.',
        createdAt: '2026-07-08 17:02',
        createdBy: 'Facilities (Arthur)'
      }
    ],
    history: [
      {
        id: 'h-4-1',
        action: 'Submission created',
        timestamp: '2026-07-08 11:20',
        user: 'Eleanor Vance'
      },
      {
        id: 'h-4-2',
        action: 'Added comment suggestion',
        timestamp: '2026-07-08 17:02',
        user: 'Facilities (Arthur)'
      }
    ]
  },
  {
    id: 'fb-5',
    date: '2026-07-09',
    name: 'Anonymous',
    isAnonymous: true,
    category: 'Issue',
    subject: 'Unstable Office Wi-Fi on West Wing',
    description: 'The Wi-Fi signal in the West Wing collaborative lounge frequently drops connection, especially during Zoom or Teams meetings. It seems to happen when more than 10 people gather there. We likely need an additional wireless access point or router optimization to handle the concurrent density.',
    status: 'In Progress',
    office: 'Malasakit',
    solution: {
      content: 'IT Infrastructure completed a site survey. They scheduled the mounting of an additional enterprise-grade Cisco access point on Monday July 13th, which will triple the client capacity of the West Wing lounge.',
      updatedAt: '2026-07-09 11:30',
      updatedBy: 'IT Helpdesk'
    },
    suggestions: [],
    history: [
      {
        id: 'h-5-1',
        action: 'Submission created anonymously',
        timestamp: '2026-07-09 09:15',
        user: 'System'
      },
      {
        id: 'h-5-2',
        action: 'Status updated to In Progress with interim solution detail',
        timestamp: '2026-07-09 11:30',
        user: 'IT Helpdesk'
      }
    ]
  }
];
