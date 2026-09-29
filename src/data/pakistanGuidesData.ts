export interface GuideDetail {
  provider: string
  providerSlug: string
  guideType: string
  guideSlug: string
  title: string
  seoTitle: string
  seoDescription: string
  ussdCode: string
  smsCode?: string
  helpline: string
  officialApp: string
  quickSteps: string[]
  tableData: { option: string; code: string; details: string }[]
  summary: string
  faqs: { question: string; answer: string }[]
}

export const PROVIDERS = [
  { name: 'Telenor', slug: 'telenor', color: '#00a3e0', helpline: '345', app: 'My Telenor App' },
  { name: 'Jazz', slug: 'jazz', color: '#e30613', helpline: '111', app: 'Jazz World' },
  { name: 'Zong', slug: 'zong', color: '#82bc23', helpline: '310', app: 'My Zong App' },
  { name: 'Ufone', slug: 'ufone', color: '#f37021', helpline: '333', app: 'My Ufone App' },
]

export const GUIDE_TYPES = [
  { name: 'Balance check', slug: 'balance-check', icon: 'Wallet' },
  { name: 'Internet MB check', slug: 'internet-mb-check', icon: 'Wifi' },
  { name: 'Number check', slug: 'number-check', icon: 'Phone' },
  { name: 'Package information', slug: 'package-information', icon: 'Package' },
  { name: 'App guides', slug: 'app-guides', icon: 'Smartphone' },
  { name: 'Codes', slug: 'codes', icon: 'Hash' },
  { name: 'Internet settings', slug: 'internet-settings', icon: 'Sliders' },
  { name: 'Customer support', slug: 'customer-support', icon: 'Headphones' },
]

const RAW_GUIDE_DATA: Record<string, Record<string, Partial<GuideDetail>>> = {
  telenor: {
    'balance-check': {
      ussdCode: '*444#',
      smsCode: 'Not required (dial *444#)',
      quickSteps: [
        'Open your mobile phone dialer application.',
        'Dial *444# from your active Telenor SIM card.',
        'Wait 2 seconds for the USSD pop-up notification.',
        'Your remaining Telenor prepaid balance and expiry date will appear on screen.',
      ],
      tableData: [
        { option: 'Telenor Main Balance Check', code: '*444#', details: 'Charges ~ Rs 0.24 incl. tax per request' },
        { option: 'Telenor Emergency Advance (Emergency Load)', code: '*0#', details: 'Gets Rs. 30 advance balance (Rs. 7 fee on next recharge)' },
        { option: 'Check Balance via My Telenor App', code: 'App Download', details: 'Free balance check with full bundle usage breakdown' },
      ],
      summary: 'Checking your Telenor mobile balance is quick and can be done instantly by dialing *444# on your phone or logging into the My Telenor App.',
      faqs: [
        { question: 'What is the Telenor balance check code?', answer: 'The official code to check Telenor balance is *444#. Dialing this code displays your remaining credit balance.' },
        { question: 'What are the charges for dialing *444#?', answer: 'Telenor charges a small fee of approximately Rs 0.24 (plus tax) per balance check request.' },
        { question: 'How can I check Telenor balance for free?', answer: 'You can check your balance completely free by opening the My Telenor app on your smartphone while connected to the internet.' },
      ],
    },
    'internet-mb-check': {
      ussdCode: '*999#',
      smsCode: 'SMS "INFO" to 4600',
      quickSteps: [
        'Open your phone dialer.',
        'Dial *999# from your Telenor SIM card.',
        'You will receive an instant flash notification or SMS showing remaining MBs, volume type (4G/Social/Night), and package validity.',
      ],
      tableData: [
        { option: 'Telenor Data MB Check Code', code: '*999#', details: 'Displays remaining 3G/4G MBs for active bundles' },
        { option: 'Check via My Telenor App', code: 'App Home Screen', details: 'Displays separate meters for Social MBs, Data MBs, and Night MBs' },
      ],
      summary: 'Track your remaining Telenor internet volume and data package validity easily by dialing *999# or using the My Telenor Mobile App.',
      faqs: [
        { question: 'How to check remaining internet MBs in Telenor?', answer: 'Dial *999# from your Telenor number to get an instant summary of remaining internet data volume.' },
        { question: 'Does *999# work for all Telenor internet packages?', answer: 'Yes, *999# checks remaining MBs for daily, weekly, and monthly Telenor data bundles.' },
      ],
    },
    'number-check': {
      ussdCode: '*888#',
      smsCode: 'SMS to 7421',
      quickSteps: [
        'Open phone dialer or SMS app.',
        'Dial *888# directly, or send a blank SMS to 7421.',
        'Your 11-digit Telenor mobile number will be displayed on screen or received via reply SMS.',
      ],
      tableData: [
        { option: 'Telenor Number Check Code', code: '*888#', details: 'Displays own SIM number on screen' },
        { option: 'SMS Number Check', code: 'Send blank SMS to 7421', details: 'Receive SMS containing your mobile number and SIM details' },
      ],
      summary: 'Forgot your Telenor number? Easily find your SIM number by dialing *888# or sending an SMS to 7421 without needing active balance.',
      faqs: [
        { question: 'How can I check my own Telenor SIM number without balance?', answer: 'You can dial *888# or send a blank SMS to 7421. These methods work even if you have zero balance.' },
      ],
    },
    'package-information': {
      ussdCode: '*345#',
      quickSteps: [
        'Dial *345# from your Telenor SIM.',
        'Navigate the interactive menu to choose between Weekly EasyCard, Monthly Super Card, or Data Bundles.',
        'Select your preferred offer and confirm subscription.',
      ],
      tableData: [
        { option: 'Telenor EasyCard Weekly', code: '*963#', details: '1500 Telenor Mins, 80 Other Network Mins, 3GB Internet' },
        { option: 'Telenor EasyCard Monthly', code: '*550#', details: '3000 Telenor Mins, 150 Other Mins, 12GB Data' },
        { option: 'Telenor Weekly Ultra', code: '*336#', details: '10GB Data + 10GB (12am-12pm), Unlimited Telenor Mins' },
      ],
      summary: 'Explore and subscribe to Telenor call, SMS, and 4G internet packages, including EasyCard weekly and monthly offers.',
      faqs: [
        { question: 'What is the code for Telenor Weekly EasyCard?', answer: 'Dial *963# to subscribe to Telenor Weekly EasyCard.' },
      ],
    },
  },
  jazz: {
    'balance-check': {
      ussdCode: '*111#',
      smsCode: 'Not required',
      quickSteps: [
        'Open your smartphone phone dialer.',
        'Dial *111# from your Jazz SIM card.',
        'A pop-up message will show your current Jazz balance and account expiration date.',
      ],
      tableData: [
        { option: 'Jazz Main Balance Check Code', code: '*111#', details: 'Standard fee ~ Rs 0.24 incl. tax' },
        { option: 'Jazz Emergency Advance Balance', code: '*112#', details: 'Get Rs. 30 advance balance' },
        { option: 'Check Balance via Jazz World App', code: 'Jazz World App', details: 'Free live balance and active package details' },
      ],
      summary: 'Check your Jazz mobile balance in seconds by dialing *111# or logging into the Jazz World mobile app.',
      faqs: [
        { question: 'What is the Jazz balance check code?', answer: 'Dial *111# from your Jazz SIM card to check your remaining balance.' },
        { question: 'How do I get an advance loan on Jazz?', answer: 'Dial *112# to receive Jazz Emergency Advance load when your balance is low.' },
      ],
    },
    'internet-mb-check': {
      ussdCode: '*111*2#',
      quickSteps: [
        'Dial *111*2# from your active Jazz SIM card.',
        'Alternatively, dial your package string followed by *2# (e.g. *443*2# for general 4G data).',
        'Your remaining MBs and offer expiry time will be displayed.',
      ],
      tableData: [
        { option: 'Jazz General Data Status Code', code: '*111*2#', details: 'Displays remaining data MBs' },
        { option: 'Jazz 4G MB Check Code', code: '*443*2#', details: 'Checks 4G data volume details' },
        { option: 'Jazz World App', code: 'App Home Screen', details: 'Free detailed MB breakdown' },
      ],
      summary: 'Keep track of your Jazz 4G internet MBs, WhatsApp data, and night offers using *111*2# or the official Jazz World App.',
      faqs: [
        { question: 'What is the Jazz MB check code?', answer: 'Dial *111*2# or *443*2# to view your remaining Jazz internet MBs.' },
      ],
    },
    'number-check': {
      ussdCode: '*99#',
      quickSteps: [
        'Open phone dialer.',
        'Dial *99# from your Jazz SIM card.',
        'Your phone number will immediately appear on the phone screen.',
      ],
      tableData: [
        { option: 'Jazz Number Check Code', code: '*99#', details: 'Instant display of own Jazz mobile number' },
      ],
      summary: 'Check your own Jazz mobile phone number instantly for free by dialing *99# from your phone.',
      faqs: [
        { question: 'How to check own Jazz number?', answer: 'Dial *99# from your Jazz SIM to instantly view your phone number.' },
      ],
    },
    'package-information': {
      ussdCode: '*443#',
      quickSteps: [
        'Dial *443# on your Jazz line to access the main prepaid menu.',
        'Browse Weekly Super Duper, Monthly Hybrid, and Work-from-Home bundles.',
        'Select and activate your desired package.',
      ],
      tableData: [
        { option: 'Jazz Weekly Super Duper', code: '*700#', details: '30GB Data, 3000 Jazz Mins, 150 Other Mins, 3000 SMS' },
        { option: 'Jazz Monthly Super Duper', code: '*706#', details: '10GB Data, 3000 Jazz Mins, 300 Other Mins, 3000 SMS' },
      ],
      summary: 'Discover the latest Jazz daily, weekly, and monthly prepaid hybrid packages for calls, SMS, and 4G internet.',
      faqs: [
        { question: 'What is the subscription code for Jazz Weekly Super Duper?', answer: 'Dial *700# to subscribe to Jazz Weekly Super Duper.' },
      ],
    },
  },
  zong: {
    'balance-check': {
      ussdCode: '*222#',
      quickSteps: [
        'Open phone dialer.',
        'Dial *222# from your Zong 4G SIM.',
        'Your Zong balance and validity date will pop up on your display screen.',
      ],
      tableData: [
        { option: 'Zong Balance Check Code', code: '*222#', details: 'Charges ~ Rs 0.20 + tax per inquiry' },
        { option: 'Zong Advance Loan', code: '*911#', details: 'Get Rs. 25-50 emergency balance load' },
        { option: 'My Zong App', code: 'App Home Screen', details: 'Free balance & bundle tracking' },
      ],
      summary: 'Find out your remaining Zong prepaid credit balance by dialing *222# or checking the My Zong App.',
      faqs: [
        { question: 'How to check Zong balance?', answer: 'Dial *222# from your Zong SIM to check your current account balance.' },
      ],
    },
    'internet-mb-check': {
      ussdCode: '*102#',
      quickSteps: [
        'Dial *102# from your Zong number.',
        'Select option 4 from the menu to check remaining data MBs.',
        'You will receive a detailed summary SMS with your exact remaining 4G data volume.',
      ],
      tableData: [
        { option: 'Zong Data MB Check Code', code: '*102#', details: 'Charges 10 paisa per request' },
        { option: 'Zong Free MB Check via App', code: 'My Zong App', details: 'Live meter for WhatsApp, Youtube, and Data MBs' },
      ],
      summary: 'Check Zong internet MBs and remaining package volume by dialing *102# or inspecting the My Zong App dashboard.',
      faqs: [
        { question: 'What is the Zong MB check code?', answer: 'Dial *102# and choose option 4, or check directly on My Zong App.' },
      ],
    },
    'number-check': {
      ussdCode: '*8#',
      quickSteps: [
        'Open phone dialer.',
        'Dial *8# or *310# from your Zong SIM.',
        'Your 11-digit Zong mobile number will display on screen.',
      ],
      tableData: [
        { option: 'Zong Number Check Code', code: '*8#', details: 'Displays your SIM number on screen' },
        { option: 'Zong Number via SMS', code: 'SMS "MNP" to 667', details: 'Check owner name and SIM registration info' },
      ],
      summary: 'Easily check your Zong mobile SIM number by dialing *8# or dialing *310# on your phone.',
      faqs: [
        { question: 'What is the Zong number check code?', answer: 'Dial *8# to view your Zong mobile number instantly.' },
      ],
    },
    'package-information': {
      ussdCode: '*310#',
      quickSteps: [
        'Dial *310# from your Zong mobile number.',
        'Select package offers to browse Weekly Super Weekly Max, Monthly Pro, and All-In-One bundles.',
        'Subscribe with one click.',
      ],
      tableData: [
        { option: 'Zong Super Weekly Max', code: '*220#', details: '30GB Data (15GB 1am-9am), 500 Zong Mins, 100 Other Mins' },
        { option: 'Zong Monthly Digital Max', code: '*7088#', details: '100GB Data, 10000 Zong Mins, 1000 Other Mins' },
      ],
      summary: 'Explore top Zong 4G data bundles, hybrid call packages, and special location-based offers.',
      faqs: [
        { question: 'What is the subscription code for Zong Super Weekly Max?', answer: 'Dial *220# to activate Zong Super Weekly Max.' },
      ],
    },
  },
  ufone: {
    'balance-check': {
      ussdCode: '*124#',
      quickSteps: [
        'Open your phone dialer app.',
        'Dial *124# from your Ufone SIM card.',
        'View your main Ufone account balance and expiry date on screen.',
      ],
      tableData: [
        { option: 'Ufone Balance Check Code', code: '*124#', details: 'Charges ~ Rs 0.20 + tax' },
        { option: 'Ufone Advance Loan', code: '*456#', details: 'Get Rs. 30 Ufone Advance' },
        { option: 'My Ufone App', code: 'App Home Screen', details: 'Free balance inspection' },
      ],
      summary: 'Check your Ufone mobile phone balance quickly by dialing *124# or using the My Ufone App.',
      faqs: [
        { question: 'How to check Ufone balance?', answer: 'Dial *124# from your Ufone SIM to view your current balance.' },
      ],
    },
    'internet-mb-check': {
      ussdCode: '*706#',
      quickSteps: [
        'Dial *706# from your Ufone line.',
        'Your remaining 4G internet MBs, Super Card volume, and offer validity will display on screen or arrive via SMS.',
      ],
      tableData: [
        { option: 'Ufone MB Check Code', code: '*706#', details: 'Checks Super Card and data MBs' },
        { option: 'My Ufone App', code: 'App Home Screen', details: 'Free live internet MB widget' },
      ],
      summary: 'Stay updated on remaining Ufone internet MBs, WhatsApp data, and Super Card volume using *706#.',
      faqs: [
        { question: 'What is the Ufone MB check code?', answer: 'Dial *706# from your Ufone number to check remaining internet volume.' },
      ],
    },
    'number-check': {
      ussdCode: '*1#',
      quickSteps: [
        'Open phone dialer.',
        'Dial *1# or *780*3# from your Ufone SIM.',
        'Your 11-digit Ufone phone number will be displayed on screen.',
      ],
      tableData: [
        { option: 'Ufone Number Check Code', code: '*1#', details: 'Free instant number lookup' },
      ],
      summary: 'Retrieve your Ufone SIM mobile number easily without balance by dialing *1#.',
      faqs: [
        { question: 'How to check own Ufone number?', answer: 'Dial *1# from your Ufone SIM card to display your mobile number.' },
      ],
    },
    'package-information': {
      ussdCode: '*3#',
      quickSteps: [
        'Dial *3# from your Ufone prepaid connection.',
        'Explore famous Super Card offers (Super Card Max, Super Card Gold) and internet packages.',
      ],
      tableData: [
        { option: 'Ufone Super Card Max', code: '*290#', details: '10GB Data, 3000 Ufone/PTCL Mins, 350 Other Mins, 3000 SMS' },
        { option: 'Ufone Weekly Heavy', code: '*220#', details: '10GB Data, 1000 Ufone Mins, 100 Other Mins' },
      ],
      summary: 'Browse and subscribe to Ufone Super Cards, hybrid bundles, and high-speed 4G data offers.',
      faqs: [
        { question: 'What is the code for Ufone Super Card Max?', answer: 'Dial *290# or buy directly from My Ufone App.' },
      ],
    },
  },
}

export function getGuideDetail(providerSlug: string, guideSlug: string): GuideDetail {
  const providerObj = PROVIDERS.find((p) => p.slug === providerSlug) || PROVIDERS[0]
  const guideTypeObj = GUIDE_TYPES.find((g) => g.slug === guideSlug) || GUIDE_TYPES[0]

  const providerName = providerObj.name
  const guideTypeName = guideTypeObj.name

  const overrideData = RAW_GUIDE_DATA[providerSlug]?.[guideSlug] || {}

  const title = `${providerName} ${guideTypeName}: Codes, Steps & Details`
  const seoTitle = `${providerName} ${guideTypeName} Code - Updated Guide | ToolNest`
  const seoDescription = `How to perform ${providerName} ${guideTypeName.toLowerCase()} in Pakistan. Check official USSD codes, SMS methods, app instructions, and FAQs.`

  const ussdCode = overrideData.ussdCode || (providerSlug === 'telenor' ? '*444#' : providerSlug === 'jazz' ? '*111#' : providerSlug === 'zong' ? '*222#' : '*124#')
  const smsCode = overrideData.smsCode || 'Check via official telecom app or SMS string'
  const helpline = providerObj.helpline
  const officialApp = providerObj.app

  const quickSteps = overrideData.quickSteps || [
    `Open your mobile dialer app on your ${providerName} smartphone.`,
    `Dial ${ussdCode} from your active ${providerName} SIM card.`,
    `Follow the on-screen USSD menu instructions or wait for the SMS response.`,
    `View your account details, status, or confirmation message instantly.`,
  ]

  const tableData = overrideData.tableData || [
    { option: `${providerName} ${guideTypeName} USSD Code`, code: ussdCode, details: 'Instant browser display' },
    { option: `${providerName} Official Helpline`, code: helpline, details: 'Speak with customer service representative' },
    { option: `${providerName} Official App`, code: officialApp, details: 'Free bundle & account management' },
  ]

  const summary = overrideData.summary || `Get accurate and up-to-date instructions for ${providerName} ${guideTypeName.toLowerCase()} using official USSD codes and mobile app methods.`

  const faqs = overrideData.faqs || [
    { question: `What is the ${providerName} ${guideTypeName.toLowerCase()} code?`, answer: `The primary official USSD code is ${ussdCode}. Dial this from your ${providerName} SIM.` },
    { question: `Can I check ${providerName} ${guideTypeName.toLowerCase()} online?`, answer: `Yes, install and open the official ${officialApp} from Google Play Store or Apple App Store for real-time account info.` },
    { question: `Is there a fee for checking ${providerName} ${guideTypeName.toLowerCase()}?`, answer: `USSD codes may incur small nominal charges (approx Rs 0.20 + tax), whereas checking via ${officialApp} over Wi-Fi/data is free.` },
  ]

  return {
    provider: providerName,
    providerSlug,
    guideType: guideTypeName,
    guideSlug,
    title,
    seoTitle,
    seoDescription,
    ussdCode,
    smsCode,
    helpline,
    officialApp,
    quickSteps,
    tableData,
    summary,
    faqs,
  }
}
