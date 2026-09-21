import {
  Braces, Calculator, Code2, FileImage, FileText, Image, KeyRound, Languages, LockKeyhole, Percent, ScanText, Scale, ShieldCheck, Sparkles, TextCursorInput, Type, WandSparkles, Wifi,
} from 'lucide-react'
import type { ComponentType } from 'react'

export type Tool = {
  name: string
  slug: string
  category: string
  description: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  seoTitle: string
  seoDescription: string
  popular?: boolean
}

export const categories = [
  { name: 'PDF Tools', slug: 'pdf-tools', icon: FileText, count: 5, tone: 'coral' },
  { name: 'Image Tools', slug: 'image-tools', icon: Image, count: 6, tone: 'cyan' },
  { name: 'Text Tools', slug: 'text-tools', icon: Type, count: 6, tone: 'violet' },
  { name: 'Calculator Tools', slug: 'calculator-tools', icon: Calculator, count: 6, tone: 'lime' },
  { name: 'Developer Tools', slug: 'developer-tools', icon: Code2, count: 6, tone: 'blue' },
  { name: 'Pakistan Utilities', slug: 'pakistan', icon: Wifi, count: 32, tone: 'yellow' },
]

const tool = (name: string, slug: string, category: string, description: string, icon: Tool['icon'], popular = false): Tool => ({
  name, slug, category, description, icon, popular,
  seoTitle: `${name} - Free Online Tool | ToolNest | ${category}`,
  seoDescription: `${description} Use the ${name} tool online for free on ToolNest with no registration required. Fast, private, and optimized for everyday work.`,
})

export const tools: Tool[] = [
  tool('PDF Compressor', 'pdf-compressor', 'PDF Tools', 'Reduce PDF file size while keeping documents easy to share.', FileText, true),
  tool('PDF Merger', 'pdf-merger', 'PDF Tools', 'Combine multiple PDF files into one organized document.', FileText),
  tool('PDF Splitter', 'pdf-splitter', 'PDF Tools', 'Extract pages from a PDF with a simple browser workflow.', FileText),
  tool('PDF to JPG', 'pdf-to-jpg', 'PDF Tools', 'Turn PDF pages into shareable JPG images.', FileImage),
  tool('JPG to PDF', 'jpg-to-pdf', 'PDF Tools', 'Convert JPG images into a clean PDF document.', FileImage),
  tool('Image Compressor', 'image-compressor', 'Image Tools', 'Compress images for faster websites and smaller uploads.', Image, true),
  tool('Image Resizer', 'image-resizer', 'Image Tools', 'Resize images to exact dimensions in your browser.', ScanText),
  tool('JPG to PNG', 'jpg-to-png', 'Image Tools', 'Convert JPG images to transparent-friendly PNG files.', FileImage),
  tool('PNG to JPG', 'png-to-jpg', 'Image Tools', 'Convert PNG images into lightweight JPG files.', FileImage),
  tool('WebP Converter', 'webp-converter', 'Image Tools', 'Convert common images to modern WebP format.', WandSparkles),
  tool('Image Cropper', 'image-cropper', 'Image Tools', 'Crop images to the exact framing you need.', ScanText),
  tool('Word Counter', 'word-counter', 'Text Tools', 'Count words, characters, sentences, and reading time.', TextCursorInput, true),
  tool('Character Counter', 'character-counter', 'Text Tools', 'Count characters with and without spaces.', TextCursorInput),
  tool('Case Converter', 'case-converter', 'Text Tools', 'Switch text between uppercase, lowercase, title, and sentence case.', Languages),
  tool('Remove Duplicate Lines', 'remove-duplicate-lines', 'Text Tools', 'Clean repeated lines from lists and pasted text.', Sparkles),
  tool('Text Sorter', 'text-sorter', 'Text Tools', 'Sort lines alphabetically for cleaner lists.', Scale),
  tool('Lorem Ipsum Generator', 'lorem-ipsum-generator', 'Text Tools', 'Generate placeholder copy for designs and prototypes.', Type),
  tool('Percentage Calculator', 'percentage-calculator', 'Calculator Tools', 'Calculate percentages, increases, decreases, and differences.', Percent, true),
  tool('Age Calculator', 'age-calculator', 'Calculator Tools', 'Find an exact age from a date of birth.', Calculator),
  tool('BMI Calculator', 'bmi-calculator', 'Calculator Tools', 'Calculate body mass index from height and weight.', Calculator),
  tool('Discount Calculator', 'discount-calculator', 'Calculator Tools', 'Calculate sale prices and savings instantly.', Percent),
  tool('GST / Tax Calculator', 'gst-tax-calculator', 'Calculator Tools', 'Estimate tax-inclusive and tax-exclusive prices.', Calculator),
  tool('Loan Calculator', 'loan-calculator', 'Calculator Tools', 'Estimate monthly payments for a fixed-rate loan.', Calculator),
  tool('JSON Formatter', 'json-formatter', 'Developer Tools', 'Format and inspect JSON data with readable indentation.', Braces, true),
  tool('JSON Validator', 'json-validator', 'Developer Tools', 'Check JSON syntax and get clear validation feedback.', ShieldCheck),
  tool('Base64 Encoder / Decoder', 'base64-encoder-decoder', 'Developer Tools', 'Encode or decode Base64 text locally in your browser.', LockKeyhole),
  tool('URL Encoder / Decoder', 'url-encoder-decoder', 'Developer Tools', 'Encode or decode URLs safely for web development.', Code2),
  tool('UUID Generator', 'uuid-generator', 'Developer Tools', 'Generate random UUIDs for apps, APIs, and databases.', KeyRound),
  tool('Password Generator', 'password-generator', 'Developer Tools', 'Create strong random passwords with adjustable options.', ShieldCheck, true),
]

export const pakistanGuides = ['Balance check', 'Internet MB check', 'Number check', 'Package information', 'App guides', 'Codes', 'Internet settings', 'Customer support']
export const providers = ['Telenor', 'Jazz', 'Zong', 'Ufone']
