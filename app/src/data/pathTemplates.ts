import type { Category, ContentItem, Direction, Milestone } from '../types'
import { makeId } from '../lib/id'

interface MilestoneSeed {
  title: string
  blurb: string
  tasks: { title: string; minutes: number; xp: number }[]
}

interface TemplateSeed {
  match: RegExp
  category: Category
  displayGoal?: (input: string) => string
  milestones: MilestoneSeed[]
  content: ContentItem[]
  nextSuggestions: string[]
  numericTarget?: (input: string) => { label: string; unit: string; current: number; target: number } | undefined
}

function xp(minutes: number): number {
  if (minutes <= 5) return 10
  if (minutes <= 15) return 15
  if (minutes <= 30) return 25
  return 35
}

function t(title: string, minutes: number): { title: string; minutes: number; xp: number } {
  return { title, minutes, xp: xp(minutes) }
}

const CREATIVE_DIRECTOR: TemplateSeed = {
  match: /creative director|art director|design director/i,
  category: 'career',
  milestones: [
    {
      title: 'Explore the Role',
      blurb: 'Understand what the job really looks like day to day.',
      tasks: [
        t('Watch a 10-minute interview with a Creative Director', 10),
        t('Write down 3 things that excite you about the role', 10),
        t('Read one job description and note the skills it asks for', 10),
      ],
    },
    {
      title: 'Learn the Basics',
      blurb: 'Build a foundation in the craft and the language of the industry.',
      tasks: [
        t('Follow three people working in the industry', 10),
        t('Read one article on modern creative direction', 15),
        t('Save 5 campaigns or projects you admire', 15),
      ],
    },
    {
      title: 'Develop Skills',
      blurb: 'Sharpen the specific skills the role demands.',
      tasks: [
        t('Create a small concept project', 45),
        t('Practice presenting an idea out loud for 5 minutes', 15),
        t('Study how one great ad campaign was built', 20),
      ],
    },
    {
      title: 'Build Experience',
      blurb: 'Turn learning into real, tangible work.',
      tasks: [
        t('Offer to help with a friend’s creative project', 30),
        t('Pitch one original concept, even unprompted', 30),
        t('Take on a small freelance or volunteer brief', 45),
      ],
    },
    {
      title: 'Build a Portfolio',
      blurb: 'Show your thinking, not just your output.',
      tasks: [
        t('Choose your 3 strongest projects to feature', 20),
        t('Write the story behind one project', 20),
        t('Ask someone for feedback on your portfolio', 15),
      ],
    },
    {
      title: 'Grow Your Network',
      blurb: 'Relationships open doors that applications don’t.',
      tasks: [
        t('Reach out to someone working in your dream role', 10),
        t('Comment thoughtfully on 3 industry posts', 10),
        t('Attend or watch one industry talk or event', 30),
      ],
    },
    {
      title: 'Land the Role',
      blurb: 'Put yourself in front of the right opportunities.',
      tasks: [
        t('Apply for one relevant opportunity', 30),
        t('Tailor your CV or portfolio to a specific role', 30),
        t('Practice answering “walk me through your work”', 15),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'video', title: 'A day in the life of a Creative Director', meta: '9 min watch' },
    { id: makeId('c'), kind: 'article', title: 'How great Creative Directors present ideas', meta: '6 min read' },
    { id: makeId('c'), kind: 'template', title: '5 portfolios worth studying', meta: 'Curated list' },
    { id: makeId('c'), kind: 'challenge', title: 'Try this 15-minute creativity exercise', meta: 'Daily challenge' },
    { id: makeId('c'), kind: 'people', title: 'Creative directors worth following', meta: '6 people' },
  ],
  nextSuggestions: [
    'Master your first 90 days',
    'Become a stronger leader',
    'Build your industry reputation',
    'Increase your salary',
    'Speak at an event',
    'Start your own studio',
  ],
}

const PROMOTION_GROWTH: TemplateSeed = {
  match: /get promoted|promotion|move up at work|senior (role|position)/i,
  category: 'career',
  milestones: [
    {
      title: 'First 90 Days',
      blurb: 'Settle in, make an impact, build momentum.',
      tasks: [
        t('Write down what success looks like in 90 days', 15),
        t('Have a 1:1 to clarify expectations with your manager', 20),
        t('Identify one quick win you can deliver this week', 15),
      ],
    },
    {
      title: 'Build Influence',
      blurb: 'Share ideas, build relationships, become a trusted voice.',
      tasks: [
        t('Share one idea in a meeting this week', 10),
        t('Book a coffee chat with a colleague outside your team', 20),
        t('Volunteer for a visible project', 15),
      ],
    },
    {
      title: 'Lead a Team',
      blurb: 'Develop your leadership skills and mentor others.',
      tasks: [
        t('Give someone specific, useful feedback', 10),
        t('Mentor a junior colleague for 20 minutes', 20),
        t('Run one meeting instead of just attending it', 30),
      ],
    },
    {
      title: 'Create Bigger Impact',
      blurb: 'Take on larger projects and shape what’s next.',
      tasks: [
        t('Propose one improvement to how your team works', 20),
        t('Ask your manager what’s blocking your next step', 15),
        t('Document a recent win for your case for promotion', 20),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'How to make your case for promotion', meta: '5 min read' },
    { id: makeId('c'), kind: 'video', title: 'What separates senior from junior thinking', meta: '8 min watch' },
    { id: makeId('c'), kind: 'template', title: 'A simple promotion-case template', meta: 'Template' },
  ],
  nextSuggestions: ['Become a stronger leader', 'Increase your salary', 'Build your industry reputation'],
}

const START_A_BUSINESS: TemplateSeed = {
  match: /start (a |my )?business|start a startup|become an entrepreneur|launch a company/i,
  category: 'career',
  milestones: [
    {
      title: 'Validate the Idea',
      blurb: 'Make sure people actually want this before you build it.',
      tasks: [
        t('Write your idea in one sentence', 10),
        t('Talk to 3 potential customers about the problem', 30),
        t('Research 2 competitors or alternatives', 20),
      ],
    },
    {
      title: 'Learn the Fundamentals',
      blurb: 'Understand the basics of running a business.',
      tasks: [
        t('Read one article on your business model', 15),
        t('Follow 3 founders in your space', 10),
        t('Watch a talk on early-stage startups', 20),
      ],
    },
    {
      title: 'Build a Plan',
      blurb: 'Turn the idea into something concrete.',
      tasks: [
        t('Sketch a simple one-page business plan', 30),
        t('Set a rough budget for your first 3 months', 20),
        t('Decide your first offer or product', 20),
      ],
    },
    {
      title: 'Build an MVP',
      blurb: 'Create the smallest version that delivers value.',
      tasks: [
        t('Build the simplest version of your product', 60),
        t('Create a one-page landing page', 30),
        t('Ask 3 people to try it and give feedback', 20),
      ],
    },
    {
      title: 'Get First Customers',
      blurb: 'Prove someone will pay or commit.',
      tasks: [
        t('Reach out to 5 potential customers', 30),
        t('Ask for your first sale or sign-up', 15),
        t('Share your business publicly for the first time', 15),
      ],
    },
    {
      title: 'Grow & Systemise',
      blurb: 'Make it repeatable, not just a one-off.',
      tasks: [
        t('Set up a simple way to track sales', 20),
        t('Write down your repeatable sales process', 20),
        t('Ask a happy customer for a referral', 10),
      ],
    },
    {
      title: 'Launch Properly',
      blurb: 'Put it in front of the world with confidence.',
      tasks: [
        t('Plan your launch day', 30),
        t('Tell your network the business is live', 15),
        t('Set your first month’s goal', 15),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'How to validate an idea before building it', meta: '7 min read' },
    { id: makeId('c'), kind: 'course', title: 'Zero to first customer', meta: 'Mini course' },
    { id: makeId('c'), kind: 'people', title: 'Founders worth following', meta: '8 people' },
  ],
  nextSuggestions: ['Get your first 10 customers', 'Build a repeatable sales process', 'Hire your first team member'],
}

const SAVE_MONEY: TemplateSeed = {
  match: /save\s?£?\$?\s?(\d[\d,\.]*)\s?(k|thousand)?|savings? goal|build (an )?emergency fund/i,
  category: 'money',
  displayGoal: (input) => {
    const m = input.match(/£\s?\d[\d,\.]*\s?k?|\$\s?\d[\d,\.]*\s?k?/i)
    return m ? `Save ${m[0].replace(/\s/g, '')}` : input
  },
  milestones: [
    {
      title: 'Set Your Target',
      blurb: 'Know exactly what you’re saving for and why.',
      tasks: [
        t('Write down why this money matters to you', 10),
        t('Check your current balance and starting point', 5),
        t('Set a monthly savings target', 10),
      ],
    },
    {
      title: 'Build a Budget',
      blurb: 'See where your money actually goes.',
      tasks: [
        t('Review your monthly spending', 20),
        t('Find one subscription to cancel', 5),
        t('Set up a simple budget for next month', 20),
      ],
    },
    {
      title: 'Automate Savings',
      blurb: 'Make saving the default, not a decision.',
      tasks: [
        t('Set up a dedicated savings pot', 10),
        t('Transfer £20 to savings today', 1),
        t('Set up an automatic monthly transfer', 10),
      ],
    },
    {
      title: 'Cut Costs & Boost Income',
      blurb: 'Widen the gap between what you earn and spend.',
      tasks: [
        t('Find one recurring cost to reduce', 15),
        t('Sell one thing you no longer use', 20),
        t('Explore one way to earn a little extra', 20),
      ],
    },
    {
      title: 'Build Momentum',
      blurb: 'Small consistent transfers add up fast.',
      tasks: [
        t('Transfer £20 to savings today', 1),
        t('Review progress against your target', 10),
        t('Celebrate hitting 25% of your goal', 5),
      ],
    },
    {
      title: 'Hit Your Target',
      blurb: 'The final stretch.',
      tasks: [
        t('Do a final budget check-in', 15),
        t('Transfer any remaining top-up', 5),
        t('Decide what the money will now do for you', 10),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'A simple system for saving without thinking', meta: '5 min read' },
    { id: makeId('c'), kind: 'template', title: 'Monthly budget template', meta: 'Template' },
    { id: makeId('c'), kind: 'challenge', title: 'No-spend weekend challenge', meta: 'Weekend challenge' },
  ],
  nextSuggestions: ['Build an emergency fund', 'Invest your first £10k', 'Save for a home'],
  numericTarget: (input) => {
    const m = input.match(/£\s?(\d[\d,\.]*)\s?(k)?/i) || input.match(/\$\s?(\d[\d,\.]*)\s?(k)?/i)
    if (!m) return { label: 'Saved', unit: '£', current: 0, target: 20000 }
    let num = parseFloat(m[1].replace(/,/g, ''))
    if (m[2]) num *= 1000
    return { label: 'Saved', unit: '£', current: 0, target: num }
  },
}

const MOVE_CITY: TemplateSeed = {
  match: /move to|relocate to|emigrate/i,
  category: 'life',
  milestones: [
    {
      title: 'Plan & Research',
      blurb: 'Explore visas, costs and neighbourhoods.',
      tasks: [
        t('Research the cost of living in your new city', 20),
        t('List 3 neighbourhoods worth considering', 20),
        t('Talk to someone who has already made the move', 30),
      ],
    },
    {
      title: 'Build Financial Plan',
      blurb: 'Save and set a realistic budget.',
      tasks: [
        t('Set your moving budget', 20),
        t('Transfer money into a dedicated moving fund', 10),
        t('Estimate your first 3 months of costs', 20),
      ],
    },
    {
      title: 'Sort Visa & Documents',
      blurb: 'Prepare your application.',
      tasks: [
        t('Check the visa requirements that apply to you', 20),
        t('Gather the documents you’ll need', 30),
        t('Book or start your visa application', 30),
      ],
    },
    {
      title: 'Find a Place to Live',
      blurb: 'Choose a neighbourhood and secure accommodation.',
      tasks: [
        t('Shortlist 5 places to live', 20),
        t('Join a local housing or expat group', 10),
        t('Arrange temporary accommodation for arrival', 20),
      ],
    },
    {
      title: 'Make the Move',
      blurb: 'Handle logistics and plan your arrival.',
      tasks: [
        t('Book your flights or travel', 20),
        t('Plan what to ship, sell or store', 30),
        t('Sort out ending things at your current home', 20),
      ],
    },
    {
      title: 'Settle In',
      blurb: 'Build your new routine and community.',
      tasks: [
        t('Find one local community or group to join', 15),
        t('Set up your new home essentials', 30),
        t('Explore your new neighbourhood on foot', 30),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'What nobody tells you about moving abroad', meta: '8 min read' },
    { id: makeId('c'), kind: 'template', title: 'Relocation budget planner', meta: 'Template' },
    { id: makeId('c'), kind: 'people', title: 'People who’ve made the same move', meta: '5 people' },
  ],
  nextSuggestions: ['Build your new social circle', 'Learn the local language', 'Find your next home upgrade'],
}

const RUN_RACE: TemplateSeed = {
  match: /run a (5k|10k|10km|half marathon|marathon)|start running/i,
  category: 'health',
  milestones: [
    {
      title: 'Build a Base',
      blurb: 'Get your body used to regular running.',
      tasks: [
        t('Run for 20 minutes', 20),
        t('Go for a 30-minute walk', 30),
        t('Stretch for 10 minutes after your run', 10),
      ],
    },
    {
      title: 'Increase Distance',
      blurb: 'Build endurance gradually and safely.',
      tasks: [
        t('Run your longest distance yet', 30),
        t('Add one extra run to your week', 25),
        t('Track how your pace is improving', 5),
      ],
    },
    {
      title: 'Add Speed Work',
      blurb: 'Get faster, not just further.',
      tasks: [
        t('Try a short interval training session', 25),
        t('Run a comfortable pace for 25 minutes', 25),
        t('Rest and recover for a full day', 5),
      ],
    },
    {
      title: 'Practice Race Pace',
      blurb: 'Learn what your target pace feels like.',
      tasks: [
        t('Run at your target race pace for 15 minutes', 20),
        t('Test your race-day breakfast', 15),
        t('Plan your race-day route or route practice', 20),
      ],
    },
    {
      title: 'Taper & Prepare',
      blurb: 'Rest up and get race-ready.',
      tasks: [
        t('Do a light, easy shakeout run', 15),
        t('Lay out your race-day kit', 10),
        t('Get an early night before race day', 5),
      ],
    },
    {
      title: 'Race Day',
      blurb: 'Show up and enjoy it.',
      tasks: [
        t('Warm up for 10 minutes before the race', 10),
        t('Run your race', 60),
        t('Celebrate crossing the finish line', 5),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'A beginner-friendly training plan', meta: '6 min read' },
    { id: makeId('c'), kind: 'video', title: 'Running form basics', meta: '7 min watch' },
    { id: makeId('c'), kind: 'challenge', title: 'This week’s 3-run challenge', meta: 'Weekly challenge' },
  ],
  nextSuggestions: ['Run a half marathon', 'Improve your race time', 'Build a sustainable fitness routine'],
}

const CONFIDENCE: TemplateSeed = {
  match: /build confidence|be more confident|self[- ]confidence|self esteem/i,
  category: 'relationships',
  milestones: [
    {
      title: 'Understand Your Patterns',
      blurb: 'Notice where confidence dips and why.',
      tasks: [
        t('Write down one moment you felt confident recently', 10),
        t('Notice one thought that holds you back', 10),
        t('List 3 things you’re quietly proud of', 10),
      ],
    },
    {
      title: 'Challenge Small Fears',
      blurb: 'Build proof through small, safe actions.',
      tasks: [
        t('Say one honest opinion in conversation today', 5),
        t('Make eye contact and hold a short conversation', 10),
        t('Do one thing you’ve been putting off', 20),
      ],
    },
    {
      title: 'Practice Being Seen',
      blurb: 'Get comfortable taking up space.',
      tasks: [
        t('Share an idea in a group setting', 10),
        t('Post or share something you made', 15),
        t('Wear or do something that makes you feel good', 10),
      ],
    },
    {
      title: 'Speak Up More',
      blurb: 'Practice voicing what you think and need.',
      tasks: [
        t('Ask for something you want or need', 10),
        t('Disagree respectfully with someone', 10),
        t('Give a compliment to a stranger', 5),
      ],
    },
    {
      title: 'Own Your Space',
      blurb: 'Carry confidence into bigger moments.',
      tasks: [
        t('Lead a conversation or a small meeting', 20),
        t('Introduce yourself to someone new', 10),
        t('Reflect on how far you’ve come', 10),
      ],
    },
    {
      title: 'Live Confidently',
      blurb: 'Make confident action your default.',
      tasks: [
        t('Take on something slightly outside your comfort zone', 20),
        t('Mentor or encourage someone else', 15),
        t('Write your own definition of confidence now', 10),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'Confidence is a skill, not a trait', meta: '4 min read' },
    { id: makeId('c'), kind: 'challenge', title: 'The 1% braver challenge', meta: 'Daily challenge' },
    { id: makeId('c'), kind: 'video', title: 'How body language shapes confidence', meta: '6 min watch' },
  ],
  nextSuggestions: ['Learn to speak publicly', 'Deepen your relationships', 'Become a stronger leader'],
}

const PUBLIC_SPEAKING: TemplateSeed = {
  match: /public speak|speak publicly|speak on stage|become a better speaker/i,
  category: 'career',
  milestones: [
    {
      title: 'Face the Fear',
      blurb: 'Understand what actually makes speaking hard.',
      tasks: [
        t('Write down what scares you about speaking', 10),
        t('Watch a talk by a speaker you admire', 15),
        t('Record yourself talking for 1 minute', 5),
      ],
    },
    {
      title: 'Learn the Fundamentals',
      blurb: 'Structure, pacing and presence.',
      tasks: [
        t('Learn a simple 3-part talk structure', 15),
        t('Practice slowing your pace for 2 minutes', 10),
        t('Study one great short speech', 15),
      ],
    },
    {
      title: 'Practice Small',
      blurb: 'Build reps in low-stakes settings.',
      tasks: [
        t('Speak up once in a meeting today', 5),
        t('Practice your talk out loud alone', 15),
        t('Explain something you know well to a friend', 15),
      ],
    },
    {
      title: 'Get Feedback',
      blurb: 'Learn from real reactions.',
      tasks: [
        t('Ask someone to watch you practice', 20),
        t('Record and review your own delivery', 15),
        t('Note one thing to improve next time', 5),
      ],
    },
    {
      title: 'Speak to Bigger Audiences',
      blurb: 'Raise the stakes gradually.',
      tasks: [
        t('Volunteer to present at your next meeting', 20),
        t('Sign up for a speaking opportunity', 15),
        t('Rehearse your talk fully, start to finish', 20),
      ],
    },
    {
      title: 'Own the Stage',
      blurb: 'Deliver with presence and confidence.',
      tasks: [
        t('Give your talk', 30),
        t('Ask for feedback afterwards', 10),
        t('Reflect on what went well', 10),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'video', title: 'Why the best speakers pause more', meta: '5 min watch' },
    { id: makeId('c'), kind: 'challenge', title: 'The 60-second story challenge', meta: 'Daily challenge' },
  ],
  nextSuggestions: ['Build your industry reputation', 'Speak at an event', 'Become a stronger leader'],
}

const CHANGE_CAREER: TemplateSeed = {
  match: /change career|switch career|new career|career change/i,
  category: 'career',
  milestones: [
    {
      title: 'Explore Options',
      blurb: 'Open up the possibility space before narrowing down.',
      tasks: [
        t('List 3 careers you’re curious about', 15),
        t('Talk to someone working in a field you’re curious about', 30),
        t('Write down what you want more and less of', 15),
      ],
    },
    {
      title: 'Identify Transferable Skills',
      blurb: 'You’re not starting from zero.',
      tasks: [
        t('List 5 skills from your current role that transfer', 15),
        t('Read a job description in your target field', 10),
        t('Compare your skills against the gaps', 15),
      ],
    },
    {
      title: 'Fill the Gaps',
      blurb: 'Learn what’s genuinely missing.',
      tasks: [
        t('Start one course or resource in the new field', 30),
        t('Follow 3 people already working in it', 10),
        t('Complete one small practice project', 45),
      ],
    },
    {
      title: 'Test the Waters',
      blurb: 'Get real exposure before committing fully.',
      tasks: [
        t('Shadow, freelance or volunteer in the new field', 45),
        t('Attend one event or community meetup', 30),
        t('Reflect on whether it still excites you', 10),
      ],
    },
    {
      title: 'Build New Network',
      blurb: 'Relationships accelerate transitions.',
      tasks: [
        t('Reach out to someone for an informational chat', 15),
        t('Join one community in your new field', 10),
        t('Ask someone for advice on breaking in', 15),
      ],
    },
    {
      title: 'Make the Leap',
      blurb: 'Take the concrete step.',
      tasks: [
        t('Update your CV for the new direction', 30),
        t('Apply for your first role in the new field', 30),
        t('Set a target date to make the switch', 10),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'How to change careers without starting over', meta: '6 min read' },
    { id: makeId('c'), kind: 'people', title: 'People who successfully switched careers', meta: '6 people' },
  ],
  nextSuggestions: ['Land your first role in the new field', 'Build your reputation from scratch', 'Get promoted'],
}

const RELATIONSHIPS: TemplateSeed = {
  match: /improve (my )?relationships?|better relationships?|closer to my (partner|family|friends)/i,
  category: 'relationships',
  milestones: [
    {
      title: 'Reflect & Understand',
      blurb: 'See your relationships clearly first.',
      tasks: [
        t('Write down who matters most to you right now', 10),
        t('Notice one pattern that holds relationships back', 10),
        t('Think of one relationship you want to invest in', 5),
      ],
    },
    {
      title: 'Improve Communication',
      blurb: 'Say what you mean, and listen better.',
      tasks: [
        t('Have one fully phone-free conversation', 20),
        t('Ask someone a question and really listen', 15),
        t('Share something honest you usually hold back', 10),
      ],
    },
    {
      title: 'Show Up Consistently',
      blurb: 'Small, regular effort beats grand gestures.',
      tasks: [
        t('Check in with someone you haven’t spoken to in a while', 10),
        t('Book a coffee with a colleague', 20),
        t('Send a message just to say you’re thinking of them', 5),
      ],
    },
    {
      title: 'Deepen Connection',
      blurb: 'Move past small talk.',
      tasks: [
        t('Ask a deeper question than usual', 10),
        t('Plan quality time with someone important', 30),
        t('Tell someone specifically what you appreciate about them', 5),
      ],
    },
    {
      title: 'Resolve Old Tension',
      blurb: 'Clear the air where it’s needed.',
      tasks: [
        t('Reflect on one unresolved tension', 15),
        t('Have one honest, kind conversation', 30),
        t('Apologise or forgive where it’s due', 15),
      ],
    },
    {
      title: 'Build Lasting Bonds',
      blurb: 'Make connection part of your routine.',
      tasks: [
        t('Set a regular rhythm to stay in touch', 10),
        t('Plan something to look forward to together', 20),
        t('Reflect on how your relationships have changed', 10),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'article', title: 'The questions that build real closeness', meta: '5 min read' },
    { id: makeId('c'), kind: 'challenge', title: 'One honest conversation a week', meta: 'Weekly challenge' },
  ],
  nextSuggestions: ['Build confidence', 'Strengthen your family bonds', 'Become a better listener'],
}

const LEARN_SKILL: TemplateSeed = {
  match: /learn (a |to )?(new )?(skill|language|instrument|code|coding|programming|design|drawing|paint|cook|guitar|piano)/i,
  category: 'career',
  milestones: [
    {
      title: 'Explore the Basics',
      blurb: 'Get oriented before going deep.',
      tasks: [
        t('Watch a beginner overview', 15),
        t('Write down why you want to learn this', 10),
        t('Set a realistic weekly practice goal', 10),
      ],
    },
    {
      title: 'Learn Core Fundamentals',
      blurb: 'Build the foundation everything else sits on.',
      tasks: [
        t('Complete one beginner lesson', 30),
        t('Practice the basics for 20 minutes', 20),
        t('Note down the 3 hardest parts so far', 10),
      ],
    },
    {
      title: 'Practice Deliberately',
      blurb: 'Repetition with feedback builds real skill.',
      tasks: [
        t('Practice for 20 minutes', 20),
        t('Redo something you found difficult', 20),
        t('Track your progress this week', 10),
      ],
    },
    {
      title: 'Build Something Real',
      blurb: 'Apply the skill to a real, small project.',
      tasks: [
        t('Start one small real project', 45),
        t('Finish a first rough version', 45),
        t('Share it with someone for the first time', 10),
      ],
    },
    {
      title: 'Get Feedback',
      blurb: 'See yourself through someone else’s eyes.',
      tasks: [
        t('Ask someone experienced for feedback', 20),
        t('Compare your work to someone you admire', 15),
        t('Adjust based on what you learned', 20),
      ],
    },
    {
      title: 'Master It',
      blurb: 'Move from good to genuinely skilled.',
      tasks: [
        t('Take on a harder challenge than before', 30),
        t('Teach someone else the basics', 20),
        t('Reflect on how far you’ve come', 10),
      ],
    },
  ],
  content: [
    { id: makeId('c'), kind: 'course', title: 'A structured beginner path', meta: 'Mini course' },
    { id: makeId('c'), kind: 'challenge', title: '20 minutes a day challenge', meta: 'Daily challenge' },
  ],
  nextSuggestions: ['Take it to an advanced level', 'Teach it to someone else', 'Turn it into an income stream'],
}

const TEMPLATES: TemplateSeed[] = [
  CREATIVE_DIRECTOR,
  PROMOTION_GROWTH,
  START_A_BUSINESS,
  SAVE_MONEY,
  MOVE_CITY,
  RUN_RACE,
  CONFIDENCE,
  PUBLIC_SPEAKING,
  CHANGE_CAREER,
  RELATIONSHIPS,
  LEARN_SKILL,
]

const CATEGORY_KEYWORDS: { category: Category; words: RegExp }[] = [
  { category: 'money', words: /save|invest|debt|budget|income|salary|financ/i },
  { category: 'health', words: /run|fit|gym|weight|sleep|health|marathon|yoga|meditat/i },
  { category: 'relationships', words: /relationship|confidence|friend|family|partner|social|connect/i },
  { category: 'life', words: /move|travel|relocate|home|city|country|live/i },
  { category: 'career', words: /career|job|work|business|promot|skill|role|company|professional/i },
]

function classify(input: string): Category {
  for (const c of CATEGORY_KEYWORDS) {
    if (c.words.test(input)) return c.category
  }
  return 'career'
}

function genericTemplate(input: string): Omit<TemplateSeed, 'match'> {
  const goal = input.trim()
  const category = classify(goal)
  return {
    category,
    milestones: [
      {
        title: 'Explore the Goal',
        blurb: `Get clear on what "${goal}" really means for you.`,
        tasks: [
          t(`Write down why "${goal}" matters to you`, 10),
          t('Find one person who has done something similar', 20),
          t('Research the first step others usually take', 15),
        ],
      },
      {
        title: 'Learn the Basics',
        blurb: 'Build a foundation before diving in.',
        tasks: [
          t('Read or watch one beginner-friendly overview', 15),
          t('List the 3 biggest unknowns right now', 10),
          t('Set a realistic first milestone', 10),
        ],
      },
      {
        title: 'Develop the Skills',
        blurb: 'Practice the parts that matter most.',
        tasks: [
          t('Spend 20 minutes practising the core skill', 20),
          t('Break the goal into 3 smaller steps', 15),
          t('Do the smallest useful version of the next step', 20),
        ],
      },
      {
        title: 'Build Real Experience',
        blurb: 'Turn learning into action.',
        tasks: [
          t('Take one concrete action towards the goal', 30),
          t('Ask someone for advice or feedback', 15),
          t('Reflect on what’s working so far', 10),
        ],
      },
      {
        title: 'Create Proof of Progress',
        blurb: 'Make your progress visible, even to yourself.',
        tasks: [
          t('Document how far you’ve come', 15),
          t('Share your progress with someone', 10),
          t('Refine your approach based on results', 15),
        ],
      },
      {
        title: 'Grow Your Support',
        blurb: 'Few goals are reached entirely alone.',
        tasks: [
          t('Connect with someone pursuing something similar', 15),
          t('Join a community related to your goal', 15),
          t('Ask for help with the hardest part', 10),
        ],
      },
      {
        title: `Achieve "${goal}"`,
        blurb: 'The final push.',
        tasks: [
          t('Review everything you’ve learned so far', 15),
          t('Take the final concrete step', 30),
          t('Celebrate reaching your goal', 5),
        ],
      },
    ],
    content: [
      { id: makeId('c'), kind: 'article', title: `Getting started: ${goal}`, meta: '5 min read' },
      { id: makeId('c'), kind: 'challenge', title: 'This week’s momentum challenge', meta: 'Weekly challenge' },
    ],
    nextSuggestions: ['Go deeper on this goal', 'Take on a bigger version of it', 'Help someone else do the same'],
  }
}

function buildMilestones(seeds: MilestoneSeed[]): Milestone[] {
  return seeds.map((m) => ({
    id: makeId('m'),
    title: m.title,
    blurb: m.blurb,
    tasks: m.tasks.map((task) => ({
      id: makeId('t'),
      title: task.title,
      minutes: task.minutes,
      xp: task.xp,
      done: false,
    })),
  }))
}

export function generateDirection(input: string): Direction {
  const goal = input.trim()
  const template = TEMPLATES.find((tpl) => tpl.match.test(goal))
  const seed = template ?? genericTemplate(goal)
  const displayGoal = template?.displayGoal ? template.displayGoal(goal) : capitalise(goal)

  return {
    id: makeId('dir'),
    goal: displayGoal,
    category: seed.category,
    createdAt: new Date().toISOString(),
    milestones: buildMilestones(seed.milestones),
    completed: false,
    content: seed.content,
    nextSuggestions: seed.nextSuggestions,
    numericTarget: seed.numericTarget ? seed.numericTarget(goal) : undefined,
  }
}

function capitalise(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const GOAL_SUGGESTIONS = [
  'Become a Creative Director',
  'Start a business',
  'Save £20,000',
  'Move to New York',
  'Run a 10K',
  'Build confidence',
  'Learn to speak publicly',
  'Get promoted',
  'Change career',
  'Improve my relationships',
  'Learn a new skill',
]
