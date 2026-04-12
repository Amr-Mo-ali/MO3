import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      include: { works: true }
    })
    
    return NextResponse.json({
      totalSections: sections.length,
      sections: sections.map(s => ({
        id: s.id,
        title: s.title,
        isVisible: s.isVisible,
        totalWorks: s.works.length,
        visibleWorks: s.works.filter(w => w.isVisible).length,
        works: s.works.map(w => ({
          id: w.id,
          title: w.title,
          isVisible: w.isVisible,
          hasThumbnail: !!w.thumbnail,
          hasVideo: !!w.videoUrl,
        }))
      }))
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch debug info', details: String(error) },
      { status: 500 }
    )
  }
}
