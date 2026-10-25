import {
  Braces, FileImage, FileText, Image, KeyRound, ScanText, Scale, ShieldCheck, Sparkles, TextCursorInput, Type, Wifi, Palette, FileCode,
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
  { name: 'PDF Tools', slug: 'pdf-tools', icon: FileText, count: 3, tone: 'coral' },
  { name: 'Image Tools', slug: 'image-tools', icon: Image, count: 2, tone: 'cyan' },
  { name: 'Text Tools', slug: 'text-tools', icon: Type, count: 5, tone: 'violet' },
  { name: 'Developer Tools', slug: 'developer-tools', icon: Braces, count: 4, tone: 'blue' },
  { name: 'Pakistan Utilities', slug: 'pakistan', icon: Wifi, count: 32, tone: 'yellow' },
]

const tool = (name: string, slug: string, category: string, description: string, icon: Tool['icon'], popular = false, customSeoTitle?: string, customSeoDesc?: string): Tool => ({
  name, slug, category, description, icon, popular,
  seoTitle: customSeoTitle || `${name} - Free Online Tool | ToolNest | ${category}`,
  seoDescription: customSeoDesc || `${description} Use the ${name} tool online for free on ToolNest with no registration required. Fast, private, and optimized for everyday work.`,
})

export const tools: Tool[] = [
  tool('Image to Text Converter', 'image-to-text', 'Image Tools', 'Extract text from images online for free. Convert JPG, PNG, and photos into editable text with client-side OCR.', ScanText, true, 'Image to Text Converter Online Free - Extract Text from Image | ToolNest', 'Convert image to text online for free with ToolNest. Extract text from JPG, PNG, and photos instantly in your browser. 100% free OCR tool with no signup required.'),
  tool('PDF Compressor', 'pdf-compressor', 'PDF Tools', 'Reduce PDF file size while keeping documents easy to share.', FileText, true),
  tool('PDF Merger', 'pdf-merger', 'PDF Tools', 'Combine multiple PDF files into one organized document.', FileText),
  tool('JPG to PDF', 'jpg-to-pdf', 'PDF Tools', 'Convert JPG images into a clean PDF document.', FileImage),
  tool('Image Compressor', 'image-compressor', 'Image Tools', 'Compress images for faster websites and smaller uploads.', Image, true),
  tool('Word Counter', 'word-counter', 'Text Tools', 'Count words, characters, sentences, and reading time.', TextCursorInput, true),
  tool('Remove Duplicate Lines', 'remove-duplicate-lines', 'Text Tools', 'Clean repeated lines from lists and pasted text.', Sparkles),
  tool('Text Sorter', 'text-sorter', 'Text Tools', 'Sort lines alphabetically for cleaner lists.', Scale),
  tool('Lorem Ipsum Generator', 'lorem-ipsum-generator', 'Text Tools', 'Generate placeholder copy for designs and prototypes.', Type),
  tool('Markdown Editor & Preview', 'markdown-editor', 'Text Tools', 'Live Markdown editor with HTML preview and download options.', FileCode, true),
  tool('JSON Formatter', 'json-formatter', 'Developer Tools', 'Format and inspect JSON data with readable indentation.', Braces, true),
  tool('JSON Validator', 'json-validator', 'Developer Tools', 'Check JSON syntax and get clear validation feedback.', ShieldCheck),
  tool('UUID Generator', 'uuid-generator', 'Developer Tools', 'Generate random UUIDs for apps, APIs, and databases.', KeyRound),
  tool('Color Code Converter', 'color-converter', 'Developer Tools', 'Convert colors between HEX, RGB, HSL, and CSS formats.', Palette),
]

export const pakistanGuides = ['Balance check', 'Internet MB check', 'Number check', 'Package information', 'App guides', 'Codes', 'Internet settings', 'Customer support']
export const providers = ['Telenor', 'Jazz', 'Zong', 'Ufone']
