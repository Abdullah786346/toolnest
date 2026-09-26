import { PdfToPptTool } from './PdfToPptTool'
import { PdfCompressorTool, PdfMergerTool, PdfSplitterTool, JpgToPdfTool } from './PdfTools'
import { ImageCompressorTool, ImageResizerTool, FormatConverterTool } from './ImageTools'
import { PercentageCalculatorTool, AgeCalculatorTool, BmiCalculatorTool, DiscountCalculatorTool, GstCalculatorTool, LoanCalculatorTool } from './CalculatorTools'
import { JsonFormatterTool, JsonValidatorTool, PasswordGeneratorTool, UuidGeneratorTool, Base64Tool, UrlEncoderTool } from './DeveloperTools'
import { WordCounterTool, CaseConverterTool, RemoveDuplicatesTool, TextSorterTool, LoremIpsumTool } from './TextTools'
import { MarkdownTool } from './MarkdownTool'
import { ColorConverterTool } from './ColorTool'
import type { Tool } from '../../data'

export function ToolDispatcher({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'pdf-to-ppt':
      return <PdfToPptTool />
    case 'pdf-compressor':
      return <PdfCompressorTool />
    case 'pdf-merger':
      return <PdfMergerTool />
    case 'pdf-splitter':
      return <PdfSplitterTool />
    case 'jpg-to-pdf':
      return <JpgToPdfTool />
    case 'pdf-to-jpg':
      return <FormatConverterTool targetFormat="jpg" />
    case 'image-compressor':
      return <ImageCompressorTool />
    case 'image-resizer':
    case 'image-cropper':
      return <ImageResizerTool />
    case 'jpg-to-png':
      return <FormatConverterTool targetFormat="png" />
    case 'png-to-jpg':
      return <FormatConverterTool targetFormat="jpg" />
    case 'webp-converter':
      return <FormatConverterTool targetFormat="webp" />
    case 'word-counter':
    case 'character-counter':
      return <WordCounterTool />
    case 'case-converter':
      return <CaseConverterTool />
    case 'remove-duplicate-lines':
      return <RemoveDuplicatesTool />
    case 'text-sorter':
      return <TextSorterTool />
    case 'lorem-ipsum-generator':
      return <LoremIpsumTool />
    case 'markdown-editor':
      return <MarkdownTool />
    case 'percentage-calculator':
      return <PercentageCalculatorTool />
    case 'age-calculator':
      return <AgeCalculatorTool />
    case 'bmi-calculator':
      return <BmiCalculatorTool />
    case 'discount-calculator':
      return <DiscountCalculatorTool />
    case 'gst-tax-calculator':
      return <GstCalculatorTool />
    case 'loan-calculator':
      return <LoanCalculatorTool />
    case 'json-formatter':
      return <JsonFormatterTool />
    case 'json-validator':
      return <JsonValidatorTool />
    case 'password-generator':
      return <PasswordGeneratorTool />
    case 'uuid-generator':
      return <UuidGeneratorTool />
    case 'base64-encoder-decoder':
      return <Base64Tool />
    case 'url-encoder-decoder':
      return <UrlEncoderTool />
    case 'color-converter':
      return <ColorConverterTool />
    default:
      return null
  }
}
