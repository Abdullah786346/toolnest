import { categories, tools } from './data'
import { getGuideDetail } from './data/pakistanGuidesData'

const toolBySlug = (slug: string) => tools.find((item) => item.slug === slug)

export function getPageMetadata(route: string, searchQueryParam = '') {
  const parts = route.split('/').filter(Boolean)
  const currentTool = parts[0] === 'tools' ? toolBySlug(parts[1]) : null
  const category = parts[0] === 'category' ? categories.find((item) => item.slug === parts[1]) : null
  const isPakistanSpecificGuide = (parts[0] === 'pakistan' && parts[1] && parts[1] !== 'telenor') ||
    (parts[1] === 'telenor' && parts[2] !== 'quiz-today' && parts.length === 3)
  const isTelenorQuiz = route === '/pakistan/telenor/quiz-today'
  const isPdfToPpt = currentTool?.slug === 'pdf-to-ppt'
  const isImageToText = currentTool?.slug === 'image-to-text'
  const isSearchRoute = route === '/search' || Boolean(searchQueryParam)

  let title = 'ToolNest | Free Online Tools, PDF to PPT & Utility Guides'
  let description = 'Free online tools for PDF to PPT converter, image to text converter, image compressor, word counter, percentage calculator, and developer tasks, plus Pakistan utility guides.'
  let keywords = 'image to text, image to text converter, pdf to ppt, free online tools, pdf tools, image compressor, word counter, json formatter, percentage calculator'

  if (isSearchRoute) {
    title = `Search Results for "${searchQueryParam}" | ToolNest`
    description = `Find free online tools, converters, calculators, and Pakistan utility guides matching "${searchQueryParam}" on ToolNest.`
  } else if (isPdfToPpt) {
    title = 'PDF to PPT Converter - Free Online PDF to PowerPoint | ToolNest'
    description = 'Convert PDF to PPT online for free with ToolNest. Turn PDF documents into editable Microsoft PowerPoint (PPT/PPTX) presentations instantly in your browser.'
    keywords = 'pdf to ppt, pdf to ppt converter, convert pdf to ppt, pdf to powerpoint, pdf to pptx, free pdf to ppt converter'
  } else if (isImageToText) {
    title = 'Image to Text Converter Online Free - Extract Text from Image | ToolNest'
    description = 'Convert image to text online for free with ToolNest. Extract text from JPG, PNG, WebP, and photos instantly in your browser. 100% free OCR tool with no signup required.'
    keywords = 'image to text, image to text converter, image to text converter online free, extract text from image, ocr online, picture to text, photo to text'
  } else if (currentTool) {
    title = currentTool.seoTitle
    description = currentTool.seoDescription
  } else if (category) {
    title = `${category.name} | Free Online Tools | ToolNest`
    description = `Browse free ${category.name.toLowerCase()} for fast, practical work online. Private, browser-based tools with no registration required.`
  } else if (isTelenorQuiz) {
    title = 'My Telenor App Question Today: Quiz Answers | ToolNest'
    description = 'Looking for the My Telenor app question today? See reported quiz answers, access steps, and reward guidance.'
  } else if (isPakistanSpecificGuide) {
    const guideObj = getGuideDetail(parts[1], parts[2] || 'balance-check')
    title = guideObj.seoTitle
    description = guideObj.seoDescription
  } else if (parts[0] === 'pakistan') {
    const providerName = parts[1] ? parts[1].toUpperCase() : 'Pakistan'
    title = `${providerName} Telecom Utility Guides | ToolNest`
    description = `Useful telecom guides for ${providerName} balance checks, internet MBs, SIM ownership, and USSD codes.`
  } else if (route === '/popular') {
    title = 'Popular Free Online Tools | ToolNest'
    description = 'Use ToolNest popular free online tools for PDF to PPT, text, image, calculator, and developer tasks.'
  } else if (route === '/about') {
    title = 'About ToolNest - Fast, Private Online Utilities'
    description = 'ToolNest is an independent digital toolbox providing high-performance browser utilities and verified Pakistan telecom guides.'
  } else if (route === '/contact') {
    title = 'Contact ToolNest - Support & Feedback'
    description = 'Contact ToolNest team for feedback, feature suggestions, bug reports, or partnership inquiries.'
  } else if (route === '/privacy') {
    title = 'Privacy Policy | ToolNest'
    description = 'ToolNest Privacy Policy. Learn about our browser local storage privacy model and Google AdSense cookie guidelines.'
  } else if (route === '/terms') {
    title = 'Terms of Service | ToolNest'
    description = 'Terms of Service governing the use of ToolNest free online tools and utility guides.'
  } else if (route === '/disclaimer') {
    title = 'Legal & Telecom Disclaimer | ToolNest'
    description = 'ToolNest legal disclaimer regarding telecom guides and browser-based utility tools.'
  } else if (route === '/sitemap') {
    title = 'HTML Sitemap | ToolNest'
    description = 'Complete directory of all 70+ online tools, categories, and Pakistan utility guides on ToolNest.'
  }

  return { title, description, keywords, currentTool, isPdfToPpt, isTelenorQuiz }
}
