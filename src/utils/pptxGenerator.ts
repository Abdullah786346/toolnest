import JSZip from 'jszip'

export interface SlideData {
  title: string
  subtitle?: string
  bullets: string[]
  notes?: string
}

export interface PresentationOptions {
  title: string
  slides: SlideData[]
  theme?: 'teal' | 'navy' | 'light' | 'charcoal'
  ratio?: '16:9' | '4:3'
}

const THEME_COLORS: Record<string, { bg: string; text: string; accent: string; title: string }> = {
  teal: { bg: 'F7FBF9', text: '16201E', accent: '0B6950', title: '064E3B' },
  navy: { bg: 'F4F7FB', text: '111827', accent: '1D4ED8', title: '1E3A8A' },
  light: { bg: 'FFFFFF', text: '1F2937', accent: '4B5563', title: '111827' },
  charcoal: { bg: '1E293B', text: 'F1F5F9', accent: '38BDF8', title: 'FFFFFF' },
}

export async function generatePptxBlob(options: PresentationOptions): Promise<Blob> {
  const zip = new JSZip()
  const theme = THEME_COLORS[options.theme || 'teal'] || THEME_COLORS.teal
  const slides = options.slides.length > 0 ? options.slides : [
    { title: options.title || 'Converted Presentation', bullets: ['Generated with ToolNest PDF to PPT Converter'] }
  ]

  // Slide dimensions
  // 16:9 is 12192000 x 6858000 EMU (960 x 540 pt)
  // 4:3 is 9144000 x 6858000 EMU (720 x 540 pt)
  const is169 = options.ratio !== '4:3'
  const cx = is169 ? '12192000' : '9144000'
  const cy = '6858000'

  // [Content_Types].xml
  let contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>`

  slides.forEach((_, idx) => {
    contentTypes += `\n  <Override PartName="/ppt/slides/slide${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
  })
  contentTypes += `\n</Types>`
  zip.file('[Content_Types].xml', contentTypes)

  // _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
  )

  // ppt/_rels/presentation.xml.rels
  let presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
  slides.forEach((_, idx) => {
    presRels += `\n  <Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${idx + 1}.xml"/>`
  })
  presRels += `\n</Relationships>`
  zip.file('ppt/_rels/presentation.xml.rels', presRels)

  // ppt/presentation.xml
  let presXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>`
  slides.forEach((_, idx) => {
    presXml += `\n    <p:sldId id="${256 + idx}" r:id="rId${idx + 1}"/>`
  })
  presXml += `\n  </p:sldIdLst>
  <p:sldSz cx="${cx}" cy="${cy}"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`
  zip.file('ppt/presentation.xml', presXml)

  // Slides
  slides.forEach((slide, idx) => {
    const isFirstSlide = idx === 0
    let bulletsXml = ''
    slide.bullets.forEach((bullet) => {
      const cleanBullet = escapeXml(bullet)
      bulletsXml += `
            <a:p>
              <a:pPr lvl="0">
                <a:buFont typeface="Arial"/>
                <a:buChar char="•"/>
              </a:pPr>
              <a:r>
                <a:rPr lang="en-US" sz="2000" b="0">
                  <a:solidFill><a:srgbClr val="${theme.text}"/></a:solidFill>
                </a:rPr>
                <a:t>${cleanBullet}</a:t>
              </a:r>
            </a:p>`
    })

    const titleText = escapeXml(slide.title || `Slide ${idx + 1}`)
    const subtitleText = slide.subtitle ? escapeXml(slide.subtitle) : ''

    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg>
      <p:bgPr>
        <a:solidFill>
          <a:srgbClr val="${theme.bg}"/>
        </a:solidFill>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>

      <!-- Decorative Header Bar -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="AccentLine"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="720000" y="540000"/>
            <a:ext cx="500000" cy="72000"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:solidFill><a:srgbClr val="${theme.accent}"/></a:solidFill>
        </p:spPr>
      </p:sp>

      <!-- Slide Title Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Title"/>
          <p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="720000" y="${isFirstSlide ? '1600000' : '700000'}"/>
            <a:ext cx="${is169 ? '10752000' : '7704000'}" cy="1100000"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" sz="${isFirstSlide ? '4000' : '3200'}" b="1">
                <a:solidFill><a:srgbClr val="${theme.title}"/></a:solidFill>
              </a:rPr>
              <a:t>${titleText}</a:t>
            </a:r>
          </a:p>
          ${subtitleText ? `
          <a:p>
            <a:pPr><a:spcBfr><a:spcPts val="600"/></a:spcBfr></a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="2000" i="1">
                <a:solidFill><a:srgbClr val="${theme.accent}"/></a:solidFill>
              </a:rPr>
              <a:t>${subtitleText}</a:t>
            </a:r>
          </a:p>` : ''}
        </p:txBody>
      </p:sp>

      <!-- Slide Bullets / Body Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="Content"/>
          <p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="720000" y="${isFirstSlide ? '3200000' : '2000000'}"/>
            <a:ext cx="${is169 ? '10752000' : '7704000'}" cy="4200000"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0" anchor="top"/>
          <a:lstStyle/>
          ${bulletsXml}
        </p:txBody>
      </p:sp>

      <!-- Footer Brand -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="5" name="Footer"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="720000" y="6200000"/>
            <a:ext cx="8000000" cy="400000"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" sz="1100">
                <a:solidFill><a:srgbClr val="${theme.accent}"/></a:solidFill>
              </a:rPr>
              <a:t>Generated with ToolNest · onlinetoolnest.tech</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`

    zip.file(`ppt/slides/slide${idx + 1}.xml`, slideXml)

    // slide relationships
    zip.file(
      `ppt/slides/_rels/slide${idx + 1}.xml.rels`,
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`
    )
  })

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
